import React from 'react'
import { useState } from "react"
import { Globe, Menu, X } from "lucide-react"
import logo from "../src/assets/logo.png"
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/30 px-6 flex justify-center">
    <div className="container flex h-16 items-center justify-between">
      <div className="flex items-center gap-2">
        <img src={logo} alt="" className="w-32" />
      </div>

      

      <div className="hidden md:flex items-center gap-4">
        <a href="#features" className="text-sm font-medium text-purple-200 hover:text-pink-200 transition-colors">
          Features
        </a>
        <a href="#translator" className="text-sm font-medium text-purple-200 hover:text-pink-200 transition-colors">
          Translator
        </a>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-9 px-4 py-2">
          Get Started
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-purple-200"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>

    {/* Mobile Navigation */}
    {isMenuOpen && (
      <div className="md:hidden container py-4 pb-6 border-b border-purple-500/20 bg-black/30">
        <nav className="flex flex-col space-y-4">
          <a
            href="#features"
            className="text-sm font-medium text-purple-200 hover:text-pink-200 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </a>
          <a
            href="#translator"
            className="text-sm font-medium text-purple-200 hover:text-pink-200 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Translator
          </a>
          <div className="flex flex-col space-y-2 pt-2">
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-9 px-4 py-2">
              Get Started
            </button>
          </div>
        </nav>
      </div>
    )}
  </header>
  )
}

export default Navbar
