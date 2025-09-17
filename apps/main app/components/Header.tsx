'use client'

import Link from 'next/link'
import {
  Sun,
  Moon,
  Github,
  Twitter,
  Menu,
  Sparkles
} from 'lucide-react'

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="azizsys-gradient w-8 h-8 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg">AzizSys</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="#features" className="text-slate-300 transition-colors hover:text-white">Features</Link>
          <Link href="#pricing" className="text-slate-300 transition-colors hover:text-white">Pricing</Link>
          <Link href="#faq" className="text-slate-300 transition-colors hover:text-white">FAQ</Link>
        </div>

        <div className="flex items-center space-x-2">
          <a href="#" target="_blank" rel="noopener noreferrer" className="hidden md:block">
            <Github className="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="hidden md:block">
            <Twitter className="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
          </a>
          <button className="p-2 rounded-md hover:bg-slate-800 transition-colors">
            <Sun className="h-5 w-5 text-slate-400 dark:hidden" />
            <Moon className="h-5 w-5 text-slate-400 hidden dark:block" />
            <span className="sr-only">Toggle theme</span>
          </button>
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