import React from 'react'
import { Globe, Mic, Video, Download, Clock, Shield, Sparkles, Languages, FileText, Headphones } from "lucide-react"

const Feature = () => {

    const features = [
        {
          icon: <Globe className="h-8 w-8 text-purple-400" />,
          title: "50+ Languages",
          description: "Translate your videos into more than 50 regional languages from around the world.",
        },
        {
          icon: <Mic className="h-8 w-8 text-purple-400" />,
          title: "Natural Voice Synthesis",
          description: "AI-generated voices that sound natural and authentic to each regional language.",
        },
        {
          icon: <Download className="h-8 w-8 text-purple-400" />,
          title: "Easy Downloads",
          description: "Download your translated videos and transcriptions with a single click.",
        },
        {
          icon: <Clock className="h-8 w-8 text-purple-400" />,
          title: "Fast Processing",
          description: "Get your translated videos in minutes, not hours or days.",
        },
        {
          icon: <Shield className="h-8 w-8 text-purple-400" />,
          title: "Secure & Private",
          description: "Your videos are processed securely and deleted after translation is complete.",
        },
        {
          icon: <Sparkles className="h-8 w-8 text-purple-400" />,
          title: "Cultural Adaptation",
          description: "AI adapts content to be culturally appropriate for the target language.",
        },
        {
          icon: <Languages className="h-8 w-8 text-purple-400" />,
          title: "Dialect Options",
          description: "Choose from multiple dialects within each language for more accurate translations.",
        },
        {
          icon: <FileText className="h-8 w-8 text-purple-400" />,
          title: "Full Transcription",
          description: "Get complete transcriptions in both the original and translated languages.",
        },
        {
          icon: <Headphones className="h-8 w-8 text-purple-400" />,
          title: "Audio-Only Option",
          description: "Extract just the translated audio if you don't need the video.",
        },
      ]
    
      return (
        <section id="features" className="py-10">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">Powerful Translation Features</h2>
              <p className="text-lg text-purple-200 max-w-2xl mx-auto">
                Our AI-powered platform offers everything you need to translate your videos into regional languages with
                precision and authenticity.
              </p>
            </div>
    
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col p-6 bg-black/30 backdrop-blur-sm rounded-lg border border-purple-500/20 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2 text-purple-200">{feature.title}</h3>
                  <p className="text-purple-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
  )
}

export default Feature
