import React from 'react'
import { ArrowRight, Globe, Mic, Video } from "lucide-react"
const Hero = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">
              Break Language Barriers with AI Video Translation
            </h1>
            <p className="text-lg md:text-xl text-purple-200 max-w-2xl mx-auto">
              Transform your content for global audiences. Upload once, reach everywhere with our AI-powered video
              translation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#translator"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-10 px-6 py-2 text-base"
            >
              Try It Now <ArrowRight className="h-4 w-4 ml-2" />
            </a>
          </div>

          {/* Animated Translation Visualization */}
          <div className="w-full max-w-4xl mt-8 relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Original Video */}
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 transform transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                <div className="flex justify-center mb-4">
                  <Video className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-purple-200 mb-2">Original Video</h3>
                <p className="text-purple-300">Upload your content in any language</p>
                <div className="mt-4 p-2 bg-purple-900/30 rounded text-sm text-purple-200 font-mono">
                  "Hello, welcome to our product demo."
                </div>
              </div>

              {/* AI Processing */}
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 transform transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 animate-pulse rounded-lg"></div>
                <div className="relative">
                  <div className="flex justify-center mb-4">
                    <Globe className="h-12 w-12 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-200 mb-2">AI Translation</h3>
                  <p className="text-purple-300">Our AI translates and syncs audio</p>
                  <div className="flex items-center justify-center h-16 mt-4">
                    <div className="flex space-x-1">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-8 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                          style={{
                            animation: `equalizer 1s ease-in-out infinite`,
                            animationDelay: `${i * 0.15}s`,
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Translated Result */}
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20 transform transition-all duration-500 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                <div className="flex justify-center mb-4">
                  <Mic className="h-12 w-12 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-purple-200 mb-2">Translated Video</h3>
                <p className="text-purple-300">Perfect lip-sync in target language</p>
                <div className="mt-4 p-2 bg-purple-900/30 rounded text-sm text-purple-200 font-mono">
                  "नमस्ते, हमारे उत्पाद डेमो में आपका स्वागत है।"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background animated elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-purple-600/10 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-pink-600/10 rounded-full filter blur-3xl"></div>

      {/* Add animation keyframes */}
      <style jsx="true">{`
        @keyframes equalizer {
          0%, 100% { height: 8px; }
          50% { height: 32px; }
        }
      `}</style>
    </section>
  )
}

export default Hero
