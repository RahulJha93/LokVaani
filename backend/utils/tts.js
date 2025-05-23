require('dotenv').config();
const axios = require("axios");
const fs = require("fs");
const util = require("util");
const path = require('path');
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;

// Set ffmpeg and ffprobe paths
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);
console.log("TTS module - FFmpeg path:", ffmpegPath);
console.log("TTS module - FFprobe path:", ffprobePath);
  
// Sarvam AI API configuration
const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const SARVAM_TTS_ENDPOINT = process.env.SARVAM_TTS_ENDPOINT;

// Language mapping for Sarvam AI
const languageModelMap = {
  "hi-IN": "hi-IN", //hindi
  "mr-IN": "mr-IN", //marathi
  "ta-IN": "ta-IN", //tamil
  "gu-IN": "gu-IN", //gujarati
  "bn-IN": "bn-IN", //bengali
  "te-IN": "te-IN", //telugu
  "ml-IN": "ml-IN", //malayalam
  "kn-IN": "kn-IN", //kannada
  "or-IN": "or-IN", //odia
  "pa-IN": "pa-IN", //punjabi
  "ml-IN": "ml-IN", //malayalam
};

const generateVoice = async (text, languageCode = "hi-IN", outputPath, originalAudioPath = null, originalDuration = null, speaker = "meera") => {
  try {
    console.log(`Generating voice for language: ${languageCode}`);
    
    // Ensure the output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      console.log(`Creating output directory: ${outputDir}`);
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Ensure outputPath is absolute
    const absoluteOutputPath = path.isAbsolute(outputPath) ? outputPath : path.resolve(outputPath);
    console.log(`Absolute output path: ${absoluteOutputPath}`);
    
    // Parse the input if it's a JSON string
    let jsonData;
    if (typeof text === 'string' && (text.trim().startsWith('{') || text.trim().startsWith('['))) {
      try {
        jsonData = JSON.parse(text);
      } catch (e) {
        console.log("Input is not valid JSON, using as plain text");
        jsonData = { transcript: text };
      }
    } else if (typeof text === 'object') {
      jsonData = text;
    } else {
      jsonData = { transcript: text };
    }
    
    // Use caption instead of translatedScript
    let processedText = jsonData.caption || jsonData.transcript || text;
    console.log("Using caption for TTS generation");
    
    // More thorough cleaning of text to remove hashtags, English text, and translation notes
    // Remove hashtags and all content after them (including all hashtag sections)
    if (processedText.includes("#")) {
      processedText = processedText.split("#")[0].trim();
    }
    
    // Remove content in parentheses
    processedText = processedText.replace(/\([^)]*\)/g, '');
    
    // Remove English words and numbers (more comprehensive pattern)
    processedText = processedText.replace(/\b[a-zA-Z0-9]+\b/g, '');
    
    // Remove translation notes section if present
    if (processedText.includes("**Translation Notes:**")) {
      processedText = processedText.split("**Translation Notes:**")[0];
    }
    
    // Remove any remaining markdown formatting
    processedText = processedText.replace(/\*\*([^*]+)\*\*/g, '$1');
    
    // Remove multiple newlines and extra spaces
    processedText = processedText.replace(/\n{2,}/g, '\n');
    processedText = processedText.replace(/\s+/g, ' ').trim();
    
    console.log("Processed text for TTS:", processedText);
    
    // Get the appropriate language code for Sarvam AI
    const targetLanguageCode = languageModelMap[languageCode] || "hi-IN";
    
    // Split text into chunks of 500 characters or less
    const MAX_CHUNK_SIZE = 450; // Slightly less than 500 to be safe
    const textChunks = [];
    
    // Simple sentence splitting and chunking
    const sentences = processedText.split(/(?<=[।.!?])\s+/);
    let currentChunk = "";
    
    for (const sentence of sentences) {
      // If adding this sentence would exceed the limit, start a new chunk
      if (currentChunk.length + sentence.length > MAX_CHUNK_SIZE) {
        if (currentChunk.length > 0) {
          textChunks.push(currentChunk);
        }
        // If a single sentence is too long, split it further
        if (sentence.length > MAX_CHUNK_SIZE) {
          let remainingSentence = sentence;
          while (remainingSentence.length > 0) {
            const chunk = remainingSentence.substring(0, MAX_CHUNK_SIZE);
            textChunks.push(chunk);
            remainingSentence = remainingSentence.substring(MAX_CHUNK_SIZE);
          }
        } else {
          currentChunk = sentence;
        }
      } else {
        currentChunk += (currentChunk ? " " : "") + sentence;
      }
    }
    
    // Add the last chunk if it's not empty
    if (currentChunk.length > 0) {
      textChunks.push(currentChunk);
    }
    
    console.log(`Split text into ${textChunks.length} chunks`);
    
    // Generate audio for each chunk
    const tempFilePaths = [];
    const fileListPath = path.resolve(`${absoluteOutputPath}_list.txt`);
    let fileListContent = "";
    
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      const tempFilePath = path.resolve(`${absoluteOutputPath}_part${i}.mp3`);
      
      console.log(`Generating audio for chunk ${i+1}/${textChunks.length}`);
      
      // Prepare the request to Sarvam AI
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': SARVAM_API_KEY
        },
        data: {
          speaker: speaker,
          pitch: 0,
          pace: 1,
          loudness: 1,
          speech_sample_rate: 22050,
          enable_preprocessing: false,
          target_language_code: targetLanguageCode,
          model: "bulbul:v1",
          inputs: [chunk]
        }
      };
      
      try {
        console.log(`Sending request to Sarvam AI for chunk ${i+1}`);
        const response = await axios(SARVAM_TTS_ENDPOINT, options);
        
        if (response.data && response.data.audios && response.data.audios.length > 0) {
          // Process base64 audio data
          const audioBuffer = Buffer.from(response.data.audios[0], 'base64');
          fs.writeFileSync(tempFilePath, audioBuffer);
          
          tempFilePaths.push(tempFilePath);
          fileListContent += `file '${tempFilePath.replace(/\\/g, '/')}'\n`;
          
          console.log(`Successfully generated audio for chunk ${i+1}`);
        } else {
          console.error(`No audio data in response for chunk ${i+1}:`, response.data);
          throw new Error(`No audio data in response for chunk ${i+1}`);
        }
      } catch (error) {
        console.error(`Error generating audio for chunk ${i+1}:`, error.message);
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
        }
        
        // Skip this chunk and continue with others
        continue;
      }
    }
    
    // If no audio was generated, throw an error
    if (tempFilePaths.length === 0) {
      throw new Error("Failed to generate any audio chunks");
    }
    
    // Write the file list for concatenation
    fs.writeFileSync(fileListPath, fileListContent);
    console.log(`File list written to: ${fileListPath}`);
    
    // Concatenate all audio chunks
    if (originalAudioPath && originalDuration) {
      console.log(`Concatenating audio chunks and adjusting to match original duration of ${originalDuration}s`);
      return await concatenateAndAdjustDuration(tempFilePaths, fileListPath, absoluteOutputPath, originalAudioPath, originalDuration);
    } else {
      console.log("Concatenating audio chunks without duration adjustment");
      return await simpleConcatenateAudio(tempFilePaths, fileListPath, absoluteOutputPath);
    }
  } catch (error) {
    console.error("Error in generateVoice:", error.message);
    console.error(error.stack);
    
    // Return null to indicate failure
    return null;
  }
};

// Helper function to concatenate audio files and adjust duration
const concatenateAndAdjustDuration = async (tempFilePaths, fileListPath, outputPath, originalPath, originalDuration) => {
  try {
    // Verify file list exists
    if (!fs.existsSync(fileListPath)) {
      console.error(`File list not found at: ${fileListPath}`);
      // Create the file list again if it doesn't exist
      let recreatedFileListContent = "";
      for (const tempFile of tempFilePaths) {
        recreatedFileListContent += `file '${tempFile.replace(/\\/g, '/')}'\n`;
      }
      fs.writeFileSync(fileListPath, recreatedFileListContent);
      console.log(`Recreated file list at: ${fileListPath}`);
    }
    
    // First concatenate all the audio chunks
    await simpleConcatenateAudio(tempFilePaths, fileListPath, outputPath);
    
    // Then adjust the duration to match the original
    if (originalDuration) {
      console.log(`Adjusting audio duration to match original: ${originalDuration}s`);
      return await adjustAudioDuration(outputPath, originalPath, originalDuration);
    } else {
      console.log("No original duration provided, skipping duration adjustment");
      return outputPath;
    }
  } catch (error) {
    console.error("Error in concatenateAndAdjustDuration:", error.message);
    
    // If concatenation fails, try to use the first audio chunk directly
    if (tempFilePaths.length > 0) {
      console.log("Falling back to using the first audio chunk directly");
      try {
        fs.copyFileSync(tempFilePaths[0], outputPath);
        console.log(`Copied first audio chunk to ${outputPath}`);
        return outputPath;
      } catch (fallbackError) {
        console.error("Error in fallback copy:", fallbackError.message);
      }
    }
    
    return outputPath; // Return the path even if adjustment failed
  }
};

// Helper function to adjust audio duration to match original
const adjustAudioDuration = async (audioPath, originalPath, originalDuration) => {
  return new Promise((resolve, reject) => {
    console.log(`Adjusting duration of ${audioPath} to match ${originalPath}`);
    
    // Get duration of both audio files
    ffmpeg.ffprobe(originalPath, (err, originalMetadata) => {
      if (err) {
        console.error('Error getting original audio metadata:', err.message);
        return resolve(audioPath); // Return original if we can't get metadata
      }
      
      ffmpeg.ffprobe(audioPath, (err, audioMetadata) => {
        if (err) {
          console.error('Error getting translated audio metadata:', err.message);
          return resolve(audioPath); // Return original if we can't get metadata
        }
        
        const originalDuration = originalMetadata.format.duration;
        const audioDuration = audioMetadata.format.duration;
        
        console.log(`Original duration: ${originalDuration}s, Translated duration: ${audioDuration}s`);
        
        // If durations are very close (within 0.5 seconds), no need to adjust
        if (Math.abs(originalDuration - audioDuration) < 0.5) {
          console.log('Durations are close enough, no adjustment needed');
          return resolve(audioPath);
        }
        
        const tempPath = `${audioPath}_adjusted.mp3`;
        
        // Determine if we need to speed up or slow down
        if (audioDuration > originalDuration) {
          // Need to speed up (atempo > 1.0)
          const tempo = audioDuration / originalDuration;
          
          // Limit tempo to a reasonable range (0.5 to 2.0)
          const safeTempo = Math.min(Math.max(tempo, 0.5), 2.0);
          console.log(`Speeding up audio by factor of ${safeTempo}`);
          
          ffmpeg(audioPath)
            .audioFilters(`atempo=${safeTempo}`)
            .output(tempPath)
            .on('end', () => {
              // Verify the adjusted duration
              ffmpeg.ffprobe(tempPath, (err, adjustedMetadata) => {
                if (err) {
                  console.error('Error getting adjusted audio metadata:', err.message);
                  fs.copyFileSync(audioPath, tempPath);
                  resolve(tempPath);
                } else {
                  const adjustedDuration = adjustedMetadata.format.duration;
                  console.log(`After tempo adjustment: ${adjustedDuration}s`);
                  
                  // If we're still not close enough, do a precise trim
                  if (Math.abs(adjustedDuration - originalDuration) > 0.1) {
                    const finalTempPath = `${tempPath}_final.mp3`;
                    
                    ffmpeg(tempPath)
                      .setDuration(originalDuration)
                      .output(finalTempPath)
                      .on('end', () => {
                        fs.unlinkSync(audioPath);
                        fs.unlinkSync(tempPath);
                        fs.renameSync(finalTempPath, audioPath);
                        console.log(`Final audio saved to ${audioPath}`);
                        resolve(audioPath);
                      })
                      .on('error', (err) => {
                        console.error('Error in final trimming:', err.message);
                        fs.unlinkSync(audioPath);
                        fs.renameSync(tempPath, audioPath);
                        resolve(audioPath);
                      })
                      .run();
                  } else {
                    fs.unlinkSync(audioPath);
                    fs.renameSync(tempPath, audioPath);
                    resolve(audioPath);
                  }
                }
              });
            })
            .on('error', (err) => {
              console.error('Error adjusting audio tempo:', err.message);
              resolve(audioPath);
            })
            .run();
        } else {
          // Need to slow down (atempo < 1.0) or use padding
          // For significant differences, use padding instead of extreme tempo changes
          if (originalDuration > audioDuration * 2) {
            console.log(`Using silence padding instead of extreme tempo change`);
            
            // Calculate silence duration needed at the end
            const silenceDuration = originalDuration - audioDuration;
            
            // Generate silence file
            const silencePath = `${audioPath}_silence.mp3`;
            ffmpeg()
              .input('anullsrc=r=44100:cl=stereo')
              .inputFormat('lavfi')
              .duration(silenceDuration)
              .output(silencePath)
              .on('end', () => {
                // Create file list for concatenation
                const concatListPath = `${audioPath}_concat.txt`;
                fs.writeFileSync(concatListPath, 
                  `file '${audioPath.replace(/\\/g, '/')}'\nfile '${silencePath.replace(/\\/g, '/')}'`);
                
                // Concatenate audio with silence
                ffmpeg()
                  .input(concatListPath)
                  .inputOptions(['-f', 'concat', '-safe', '0'])
                  .output(tempPath)
                  .on('end', () => {
                    // Clean up
                    fs.unlinkSync(silencePath);
                    fs.unlinkSync(concatListPath);
                    fs.unlinkSync(audioPath);
                    fs.renameSync(tempPath, audioPath);
                    console.log(`Padded audio to match original duration: ${originalDuration}s`);
                    resolve(audioPath);
                  })
                  .on('error', (err) => {
                    console.error('Error concatenating with silence:', err.message);
                    fs.unlinkSync(silencePath);
                    fs.unlinkSync(concatListPath);
                    resolve(audioPath);
                  })
                  .run();
              })
              .on('error', (err) => {
                console.error('Error generating silence:', err.message);
                resolve(audioPath);
              })
              .run();
          } else {
            // Use tempo adjustment for moderate differences
            const tempo = audioDuration / originalDuration;
            const safeTempo = Math.min(Math.max(tempo, 0.5), 2.0);
            console.log(`Slowing down audio by factor of ${safeTempo}`);
            
            ffmpeg(audioPath)
              .audioFilters(`atempo=${safeTempo}`)
              .output(tempPath)
              .on('end', () => {
                // Verify the adjusted duration
                ffmpeg.ffprobe(tempPath, (err, adjustedMetadata) => {
                  if (err) {
                    console.error('Error getting adjusted audio metadata:', err.message);
                    fs.unlinkSync(audioPath);
                    fs.renameSync(tempPath, audioPath);
                    return resolve(audioPath);
                  }
                  
                  const adjustedDuration = adjustedMetadata.format.duration;
                  console.log(`After tempo adjustment: ${adjustedDuration}s`);
                  
                  // If we're still not close enough, do a precise trim or pad
                  if (Math.abs(adjustedDuration - originalDuration) > 0.1) {
                    const finalTempPath = `${tempPath}_final.mp3`;
                    
                    if (adjustedDuration > originalDuration) {
                      // Need to trim
                      ffmpeg(tempPath)
                        .setDuration(originalDuration)
                        .output(finalTempPath)
                        .on('end', () => {
                          fs.unlinkSync(audioPath);
                          fs.unlinkSync(tempPath);
                          fs.renameSync(finalTempPath, audioPath);
                          console.log(`Final trimmed duration: ${originalDuration}s`);
                          resolve(audioPath);
                        })
                        .on('error', (err) => {
                          console.error('Error in final trimming:', err.message);
                          fs.unlinkSync(audioPath);
                          fs.renameSync(tempPath, audioPath);
                          resolve(audioPath);
                        })
                        .run();
                    } else {
                      // Need to pad with silence
                      const silenceDuration = originalDuration - adjustedDuration;
                      const silencePath = `${tempPath}_silence.mp3`;
                      
                      ffmpeg()
                        .input('anullsrc=r=44100:cl=stereo')
                        .inputFormat('lavfi')
                        .duration(silenceDuration)
                        .output(silencePath)
                        .on('end', () => {
                          // Create file list for concatenation
                          const concatListPath = `${tempPath}_concat.txt`;
                          fs.writeFileSync(concatListPath, 
                            `file '${tempPath.replace(/\\/g, '/')}'\nfile '${silencePath.replace(/\\/g, '/')}'`);
                          
                          // Concatenate audio with silence
                          ffmpeg()
                            .input(concatListPath)
                            .inputOptions(['-f', 'concat', '-safe', '0'])
                            .output(finalTempPath)
                            .on('end', () => {
                              // Clean up
                              fs.unlinkSync(silencePath);
                              fs.unlinkSync(concatListPath);
                              fs.unlinkSync(audioPath);
                              fs.unlinkSync(tempPath);
                              fs.renameSync(finalTempPath, audioPath);
                              console.log(`Final padded duration: ${originalDuration}s`);
                              resolve(audioPath);
                            })
                            .on('error', (err) => {
                              console.error('Error in final padding:', err.message);
                              fs.unlinkSync(silencePath);
                              fs.unlinkSync(concatListPath);
                              fs.unlinkSync(audioPath);
                              fs.renameSync(tempPath, audioPath);
                              resolve(audioPath);
                            })
                            .run();
                        })
                        .on('error', (err) => {
                          console.error('Error generating silence:', err.message);
                          fs.unlinkSync(audioPath);
                          fs.renameSync(tempPath, audioPath);
                          resolve(audioPath);
                        })
                        .run();
                    }
                  } else {
                    fs.unlinkSync(audioPath);
                    fs.renameSync(tempPath, audioPath);
                    resolve(audioPath);
                  }
                });
              })
              .on('error', (err) => {
                console.error('Error adjusting audio tempo:', err.message);
                resolve(audioPath);
              })
              .run();
          }
        }
      });
    });
  });
};

// Helper function to concatenate audio files
const simpleConcatenateAudio = (tempFilePaths, fileListPath, outputPath) => {
  return new Promise((resolve, reject) => {
    // Verify file list exists
    if (!fs.existsSync(fileListPath)) {
      console.error(`File list not found at: ${fileListPath}`);
      // Create the file list again if it doesn't exist
      let recreatedFileListContent = "";
      for (const tempFile of tempFilePaths) {
        recreatedFileListContent += `file '${tempFile.replace(/\\/g, '/')}'\n`;
      }
      fs.writeFileSync(fileListPath, recreatedFileListContent);
      console.log(`Recreated file list at: ${fileListPath}`);
    }
    
    // Verify all temp files exist
    const validTempFiles = tempFilePaths.filter(file => fs.existsSync(file));
    if (validTempFiles.length === 0) {
      console.error("No valid temp files found for concatenation");
      reject(new Error("No valid temp files found for concatenation"));
      return;
    } else if (validTempFiles.length < tempFilePaths.length) {
      console.warn(`Only ${validTempFiles.length} of ${tempFilePaths.length} temp files exist`);
      // Recreate file list with only valid files
      let recreatedFileListContent = "";
      for (const tempFile of validTempFiles) {
        recreatedFileListContent += `file '${tempFile.replace(/\\/g, '/')}'\n`;
      }
      fs.writeFileSync(fileListPath, recreatedFileListContent);
      console.log(`Recreated file list with valid files only`);
    }
    
    // If only one valid file, just copy it instead of using ffmpeg
    if (validTempFiles.length === 1) {
      try {
        fs.copyFileSync(validTempFiles[0], outputPath);
        console.log(`Only one audio file, copied directly to ${outputPath}`);
        
        // Clean up temporary file
        try {
          fs.unlinkSync(validTempFiles[0]);
        } catch (err) {
          console.warn(`Failed to delete temp file ${validTempFiles[0]}:`, err.message);
        }
        
        try {
          fs.unlinkSync(fileListPath);
        } catch (err) {
          console.warn(`Failed to delete file list:`, err.message);
        }
        
        resolve(outputPath);
        return;
      } catch (copyError) {
        console.error("Error copying single file:", copyError.message);
        // Continue with ffmpeg as fallback
      }
    }
    
    console.log(`Running ffmpeg concat with file list: ${fileListPath}`);
    console.log(`Output path: ${outputPath}`);
    
    ffmpeg()
      .input(fileListPath)
      .inputOptions(['-f', 'concat', '-safe', '0'])
      .output(outputPath)
      .on('start', (commandLine) => {
        console.log('FFmpeg concat command:', commandLine);
      })
      .on('end', () => {
        console.log(`Successfully concatenated audio to ${outputPath}`);
        
        // Clean up temporary files
        tempFilePaths.forEach(tempFile => {
          try {
            fs.unlinkSync(tempFile);
          } catch (err) {
            console.warn(`Failed to delete temp file ${tempFile}:`, err.message);
          }
        });
        
        try {
          fs.unlinkSync(fileListPath);
        } catch (err) {
          console.warn(`Failed to delete file list:`, err.message);
        }
        
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Error concatenating audio files:', err.message);
        reject(err);
      })
      .run();
  });
};

module.exports = generateVoice;
