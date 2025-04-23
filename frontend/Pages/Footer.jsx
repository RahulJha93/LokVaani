import React from 'react'
import { Globe } from "lucide-react"
import { Link } from 'react-router-dom'
import logo from "../src/assets/logo.png"
const Footer = () => {
  return (
    <footer className="border-t border-purple-500/20 py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img src={logo} alt="" className="w-42" />
            </div>
            <p className="text-sm text-purple-300">
              Breaking language barriers with AI-powered video translation technology.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-purple-200">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
                  Enterprise
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-purple-200">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-purple-200">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-purple-500/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-purple-300">© 2025 LokVaani. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
              <span className="sr-only">Twitter</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </Link>
            <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect width="4" height="12" x="2" y="9" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </Link>
            <Link href="#" className="text-purple-300 hover:text-pink-200 transition-colors">
              <span className="sr-only">GitHub</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
