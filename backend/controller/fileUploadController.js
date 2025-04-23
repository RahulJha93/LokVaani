const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const path = require("path");
const fs = require("fs");
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

// Configure Cloudinary (add to your existing requires)
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ,
  api_key: process.env.CLOUDINARY_API_KEY ,
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: folder.includes('video') ? 'video' : 'auto',
      folder: `regional ai/${folder}`,
      use_filename: true,
      unique_filename: true
    });
    console.log(`Uploaded to Cloudinary folder: ${folder}, URL: ${result.secure_url}`);
    return result;
  } catch (error) {
    console.error(`Error uploading to Cloudinary folder ${folder}:`, error);
    throw error;
  }
};

const transcribeAudio = require("../utils/transcribe.js");
const generateTranslatedScript = require("../utils/gemini.js");
const generateVoice = require("../utils/tts.js");

console.log("FFmpeg path:", ffmpegPath);
console.log("FFprobe path:", ffprobePath);
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const languageMap = {
  Hindi: "hi-IN",
  Marathi: "mr-IN",
  Tamil: "ta-IN",
  Gujarati: "gu-IN",
  Maithili: null, // fallback
};

// Ensure outputs directory exists
const ensureOutputsDir = () => {
  const outputsDir = path.resolve("outputs");
  if (!fs.existsSync(outputsDir)) {
    console.log(`Creating outputs directory: ${outputsDir}`);
    fs.mkdirSync(outputsDir, { recursive: true });
  }
  return outputsDir;
};

exports.handleUpload = async (req, res) => {
  console.log("Upload handler started");
  console.log("Request file:", req.file);
  console.log("Request body:", req.body);

  try {
    // Ensure outputs directory exists
    const outputsDir = ensureOutputsDir();

    const videoPath = req.file.path;
    const audioOutputPath = path.resolve(path.join(outputsDir, `${Date.now()}.mp3`));
    const finalVideoPath = path.resolve(path.join(outputsDir, `${Date.now()}_final.mp4`)); // Final video output path

    console.log("Video path:", videoPath);
    console.log("Audio output path:", audioOutputPath);

    // Upload original video to Cloudinary
    const originalVideoUpload = await uploadToCloudinary(videoPath, 'original-video');
    console.log("Original video uploaded:", originalVideoUpload.secure_url);

    let originalAudioDuration = null;

    ffmpeg(videoPath)
      .output(audioOutputPath)
      .on("start", (commandLine) => {
        console.log("FFmpeg process started:", commandLine);
      })
      .on("progress", (progress) => {
        console.log("FFmpeg progress:", progress.percent, "% done");
      })
      .on("end", async () => {
        console.log("Audio extraction completed");

        // Upload original audio to Cloudinary
        const originalAudioUpload = await uploadToCloudinary(audioOutputPath, 'original-audio');
        console.log("Original audio uploaded:", originalAudioUpload.secure_url);

        // Get the duration of the original audio
        ffmpeg.ffprobe(audioOutputPath, (err, metadata) => {
          if (err) {
            console.error("Error getting audio duration:", err);
            originalAudioDuration = null;
            return processAudio();
          }

          try {
            originalAudioDuration = metadata.format.duration;
            console.log("Original audio duration:", originalAudioDuration, "seconds");
          } catch (e) {
            console.error("Error extracting duration from metadata:", e);
            originalAudioDuration = null;
          }
          processAudio();
        });

        async function processAudio() {
          console.log("Starting transcription...");
          const transcript = await transcribeAudio(audioOutputPath);
          console.log("Transcription result:", transcript);

          const language = req.body.language;
          const langCode = languageMap[language];
          console.log("Target language:", language, "Language code:", langCode);

          console.log("Generating translated script...");
          const translatedScript = await generateTranslatedScript(transcript, language, "script");
          console.log("Translation result:", translatedScript);

          console.log("Generating caption...");
          const caption = await generateTranslatedScript(transcript, language, "caption");
          console.log("Caption result:", caption);

          let voicePath = null;
          let convertedAudioUpload = null; // Initialize this variable

          if (langCode) {
            let voiceText = caption;

            if (voiceText.includes("#")) {
              voiceText = voiceText.split("#")[0].trim();
            }

            voiceText = voiceText.replace(/\b[a-zA-Z0-9]+\b/g, '');
            voiceText = voiceText.replace(/\*\*([^*]+)\*\*/g, '$1');

            voicePath = path.resolve(path.join(outputsDir, `${Date.now()}_voice.mp3`));
            console.log("Generating voice at:", voicePath);
            console.log("Using cleaned text for voice generation:", voiceText);

            await generateVoice(voiceText, langCode, voicePath, audioOutputPath, originalAudioDuration);
            console.log("Voice generation completed");
            
            // Upload converted audio to Cloudinary
            convertedAudioUpload = await uploadToCloudinary(voicePath, 'converted-audio');
            console.log("Converted audio uploaded:", convertedAudioUpload.secure_url);
          } else {
            console.log("Skipping voice generation - no language code available");
          }

          // Merge the translated audio back into the video
          console.log("Merging translated audio into video...");
          console.log("Video path:", videoPath);
          console.log("Audio path:", voicePath);

          // Verify files exist before processing
          if (!fs.existsSync(videoPath)) {
            console.error("Video file not found:", videoPath);
            return res.status(500).json({ success: false, error: "Video file not found" });
          }
          if (!fs.existsSync(voicePath)) {
            console.error("Audio file not found:", voicePath);
            return res.status(500).json({ success: false, error: "Audio file not found" });
          }

          // Alternative approach with duration matching
          ffmpeg()
            .input(videoPath)
            .input(voicePath)
            .outputOptions([
              "-map 0:v:0",
              "-map 1:a:0",
              "-c:v libx264",  // Encode video instead of copying
              "-preset fast",
              "-crf 23",
              "-c:a aac",
              "-shortest",
              "-filter_complex", 
              "[0:v]setpts=N/FRAME_RATE/TB[v];[1:a]asetpts=N/SR/TB[a]",
              "-map", "[v]",
              "-map", "[a]"
            ])
            .save(finalVideoPath)
            .on("start", (commandLine) => {
              console.log("FFmpeg command:", commandLine);
            })
            .on("progress", (progress) => {
              console.log(`Merging progress: ${progress.percent}%`);
            })
            // Modify the merge completion handler
            .on("end", async () => {
              console.log("Merging completed. Final video path:", finalVideoPath);
              
              try {
                // Upload to Cloudinary
                const finalVideoUpload = await uploadToCloudinary(finalVideoPath, 'final-video');
  
                // Clean up local files
                [videoPath, audioOutputPath, voicePath, finalVideoPath].forEach(file => {
                  if (file && fs.existsSync(file)) {
                    fs.unlinkSync(file);
                  }
                });
  
                res.json({
                  success: true,
                  transcript,
                  translatedScript,
                  caption,
                  // originalVideo: originalVideoUpload.secure_url,
                  // originalAudio: originalAudioUpload.secure_url,
                  // convertedAudio: convertedAudioUpload ? convertedAudioUpload.secure_url : null,
                  finalVideoUrl: finalVideoUpload.secure_url,
                  cloudinaryPublicId: finalVideoUpload.public_id
                });
              } catch (uploadErr) {
                console.error("Cloudinary upload error:", uploadErr);
                res.status(500).json({ 
                  success: false, 
                  error: "Failed to upload video to cloud storage" 
                });
              }
            })
            .on("error", (mergeErr) => {
              console.error("Error merging audio and video:", mergeErr.message);
              res.status(500).json({ success: false, error: "Failed to merge audio and video." });
            });
        }
      })
      .on("error", (err) => {
        console.error("FFmpeg error:", err.message);
        console.error("FFmpeg error details:", err);
        res.status(500).json({ success: false, error: "Failed to extract audio." });
      })
      .run();
  } catch (error) {
    console.error("Upload controller error:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
