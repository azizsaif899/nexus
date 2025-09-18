'use client'
import Link from 'next/link'
import { Github, Twitter, Linkedin, Sparkles } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="container max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
             <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">NEXUS</span>
            </Link>
            <p className="text-sm text-slate-400">The ultimate AI partner for your business.</p>
            <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} NEXUS. All rights reserved.</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="mailto:hello@nexus.com" className="hover:text-white transition-colors">hello@nexus.com</a></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact Sales</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Press Inquiries</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <Github className="h-6 w-6 text-slate-400 hover:text-white transition-colors" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-6 w-6 text-slate-400 hover:text-white transition-colors" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-6 w-6 text-slate-400 hover:text-white transition-colors" />
                </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
