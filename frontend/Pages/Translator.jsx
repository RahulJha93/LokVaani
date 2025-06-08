import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dialog } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Upload,
  Languages,
  Play,
  Download,
  FileText,
  Loader2,
} from "lucide-react";

const gradientAnimationStyle = `
  @keyframes gradientAnimation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const languages = [
  { code: "Bengali", name: "Bengali" },
  { code: "Gujarati", name: "Gujarati" },
  { code: "Hindi", name: "Hindi" },
  { code: "Kannada", name: "Kannada" },
  { code: "Malayalam", name: "Malayalam" },
  { code: "Marathi", name: "Marathi" },
  { code: "Odia", name: "Odia" },
  { code: "Punjabi", name: "Punjabi" },
  { code: "Tamil", name: "Tamil" },
  { code: "Telugu", name: "Telugu" },
  { code: "English", name: "English" }
];

const bulbul = [
  { code: "meera", name: "meera" },
  { code: "pavithra", name: "pavithra" },
  { code: "maitreyi", name: "maitreyi" },
  { code: "amol", name: "amol" },
  { code: "arvind", name: "arvind" },
  { code: "amartya", name: "amartya" },
];


const Translator = () => {
  const [maintenanceOpen, setMaintenanceOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null); // local preview
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState({
    videoUrl: null,
    transcription: null,
    captions: null,
  });

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadedVideoUrl(URL.createObjectURL(e.target.files[0]));
      setResult({ videoUrl: null, transcription: null, captions: null });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setUploadedVideoUrl(URL.createObjectURL(e.dataTransfer.files[0]));
      setResult({ videoUrl: null, transcription: null, captions: null });
    }
  };

  const handleTranslate = async () => {
    if (!selectedFile || !selectedLanguage) return;

    setIsProcessing(true);
    setProgress(0);

    // Progress simulation (optional, can be improved with real progress from backend)
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 95 : prev + 5));
    }, 300);
    

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('language', selectedLanguage);
      formData.append('speaker', selectedVoice);

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process video.');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error("Failed to process video");
      }
      
      console.log("Response data:", data);
      
      setResult({
        videoUrl: data.finalVideoUrl || null,
        transcription: data.transcript || '',
        captions: data.caption || '',
      });
      setProgress(100);
    } catch (error) {
      alert(error.message || 'An error occurred while processing the video.');
    } finally {
      clearInterval(interval);
      setIsProcessing(false);
    }
  };

  // Helper to convert base64 to Blob
  // Helper to convert base64 to Blob
function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
  try {
    // Strip any data URLs or unnecessary prefixes
    const base64String = b64Data.split(',').pop();
    const byteCharacters = atob(base64String); // Decode the base64 string
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  } catch (error) {
    console.error("Error decoding base64:", error);
    return null;
  }
}


  const downloadTranscription = () => {
    if (!result.transcription) return;

    const blob = new Blob([result.transcription], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transcription_${selectedLanguage}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section id="translator" className="py-20">
      <style>{gradientAnimationStyle}</style>
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
            Translate Your Video Now
          </h2>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Upload your video, select a target language, and let our AI do the rest. Get a professionally translated video in minutes.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <Card className="backdrop-blur-sm bg-black/30 border-purple-500/20">
          <CardHeader>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent">
                Video Translation Tool
              </CardTitle>
              <CardDescription className="text-purple-200">
                Upload a video file and select the language you want to translate it to.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {(!result.videoUrl && selectedFile && uploadedVideoUrl) ? (
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden border border-purple-500/20 bg-black/50">
                      <video ref={videoRef} src={uploadedVideoUrl} controls className="w-full h-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-400/50 text-purple-200 hover:bg-purple-600/30 hover:text-purple-100 transition-colors"
                        onClick={() => {
                          setSelectedFile(null);
                          setUploadedVideoUrl(null);
                          setResult({ videoUrl: null, transcription: null, captions: null });
                        }}
                      >
                        Change Video
                      </Button>
                    </div>
                  </div>
                ) : (!result.videoUrl ? (
                  <div
                    className="border-2 border-dashed border-purple-500/30 rounded-lg p-10 text-center cursor-pointer hover:bg-purple-950/30 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <Upload className="h-12 w-12 text-purple-400" />
                      <div className="space-y-2">
                        <h3 className="font-medium text-lg text-purple-200">Upload your video</h3>
                        <p className="text-sm text-purple-300">
                          Drag and drop your video file here, or click to browse
                        </p>
                        <p className="text-xs text-purple-300">Supports MP4, MOV, AVI, and WebM formats up to 500MB</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-400/50 text-purple-200 hover:bg-purple-600/30 hover:text-purple-100 transition-colors"
                      >
                        Select File
                      </Button>
                    </div>
                    <Input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden border border-purple-500/20 bg-black/50">
                      <video ref={videoRef} src={result.videoUrl} controls className="w-full h-full" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-400/50 text-purple-200 hover:bg-purple-600/30 hover:text-purple-100 transition-colors"
                        onClick={() => {
                          setSelectedFile(null);
                          setUploadedVideoUrl(null);
                          setResult({ videoUrl: null, transcription: null, captions: null });
                        }}
                      >
                        Change Video
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-400/50 text-purple-200 hover:bg-purple-600/30 hover:text-purple-100 transition-colors"
                        onClick={() => {
                          if (videoRef.current) {
                            videoRef.current.currentTime = 0;
                            videoRef.current.play();
                          }
                        }}
                      >
                        <Play className="h-4 w-4 mr-2" /> Play
                      </Button>
                    </div>
                  </div>
                ))}
                {!result.videoUrl && (
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-purple-200">
                    Target Language
                  </Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage} disabled={isProcessing}>
                    <SelectTrigger
                      id="language"
                      className="w-full bg-purple-950/30 border-purple-500/30 text-purple-200 focus:border-pink-400 focus:ring-pink-400/20 transition-colors"
                    >
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-950 border-purple-500/30 text-purple-200">
                      {languages.map((language) => (
                        <SelectItem
                          key={language.code}
                          value={language.code}
                          className="focus:bg-purple-800 focus:text-purple-100"
                        >
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                )}

                {!result.videoUrl && (
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-purple-200">
                    Choose Voice
                  </Label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice} disabled={isProcessing}>
                    <SelectTrigger
                      id="language"
                      className="w-full bg-purple-950/30 border-purple-500/30 text-purple-200 focus:border-pink-400 focus:ring-pink-400/20 transition-colors"
                    >
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-950 border-purple-500/30 text-purple-200">
                      {bulbul.map((language) => (
                        <SelectItem
                          key={language.code}
                          value={language.code}
                          className="focus:bg-purple-800 focus:text-purple-100"
                        >
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                )}

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-purple-200">
                      <span>Processing video...</span>
                      <span>{progress}%</span>
                    </div>
                    {/* shadcn/ui Progress bar */}
                    <div className="w-full">
                      <Progress value={progress} className="h-4 bg-purple-950/50 border border-purple-700/40" />
                    </div>
                    <p className="text-xs text-purple-300 text-center mt-2">
                      This may take a few minutes depending on the video length
                    </p>
                  </div>
                )}
                {/* Always show progress bar during processing */}
                {/* Already handled above, so no further changes needed for progress bar */}

                {result.transcription && (
                  <div className="space-y-2">
                    <Label htmlFor="transcription" className="text-purple-200">
                      Transcription
                    </Label>
                    <Textarea
                      id="transcription"
                      value={result.transcription}
                      readOnly
                      className="h-40 resize-none bg-purple-950/30 border-purple-500/30 text-purple-200 focus:border-pink-400 focus:ring-pink-400/20 transition-colors"
                    />
                    <Label htmlFor="transcription" className="text-purple-200">
                      Caption
                    </Label>
                    <Textarea
                      id="transcription"
                      value={result.captions}
                      readOnly
                      className="h-40 resize-none bg-purple-950/30 border-purple-500/30 text-purple-200 focus:border-pink-400 focus:ring-pink-400/20 transition-colors"
                    />
                    {result.captions && (
                      <Button
                        variant="outline"
                        className="mt-2 border-purple-400/50 text-purple-200 hover:bg-purple-600/30 hover:text-purple-100 transition-colors"
                        onClick={() => {
                          const blob = new Blob([result.captions], { type: 'text/vtt' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `captions_${selectedLanguage}.vtt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" /> Download Captions
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="mt-2 border-purple-400/50 text-purple-200 hover:bg-purple-600/30 hover:text-purple-100 transition-colors"
                      onClick={downloadTranscription}
                      disabled={!result.transcription}
                    >
                      <FileText className="h-4 w-4 mr-2" /> Download Transcription
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                className="border-purple-400/50 text-purple-200 hover:bg-purple-600/30 hover:text-purple-100 transition-colors"
                onClick={() => {
                  setSelectedFile(null)
                  setSelectedLanguage("")
                  setResult({ videoUrl: null, transcription: null, captions: null })
                }}
                disabled={isProcessing || (!selectedFile && !result.videoUrl)}
              >
                Reset
              </Button>
              <div className="space-x-2">
                {result.videoUrl ? (
                  <>
                    <Button
                      variant="outline"
                      className="border-purple-400/50 text-purple-200 hover:bg-purple-600/30 hover:text-purple-100 transition-colors"
                      onClick={() => {
                        if (result.videoUrl) {
                          window.open(result.videoUrl, '_blank');
                        }
                      }}
                    >
                      <Languages className="h-4 w-4 mr-2" /> Open Video
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="border-purple-400/50 text-purple-200 hover:bg-purple-600/30 hover:text-purple-100 transition-colors"
                      onClick={handleTranslate}
                      disabled={isProcessing || !selectedFile}
                    >
                      <Languages className="h-4 w-4 mr-2" /> Translate Video
                    </Button>
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
    </>
  );
};
  
export default Translator;
