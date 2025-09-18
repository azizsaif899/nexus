'use client'

import Link from 'next/link'
import {
  Sun,
  Moon,
  Menu,
  Sparkles
} from 'lucide-react'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4 mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-white">NEXUS</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="#features" className="text-slate-300 transition-colors hover:text-white">Features</Link>
          <Link href="#pricing" className="text-slate-300 transition-colors hover:text-white">Pricing</Link>
          <Link href="#faq" className="text-slate-300 transition-colors hover:text-white">FAQ</Link>
        </nav>

        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-md hover:bg-slate-800 transition-colors">
            <Sun className="h-5 w-5 text-slate-400 dark:hidden" />
            <Moon className="h-5 w-5 text-slate-400 hidden dark:block" />
            <span className="sr-only">Toggle theme</span>
          </button>
           <Link href="#" className="inline-flex items-center justify-center rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950">
            Get Started
          </Link>
          <button className="md:hidden p-2 rounded-md hover:bg-slate-800 transition-colors">
            <Menu className="h-6 w-6 text-slate-400" />
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
