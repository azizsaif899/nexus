'use client'
import Link from 'next/link'
import { Github, Twitter, Linkedin, Sparkles } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="container max-w-screen-2xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="azizsys-gradient w-8 h-8 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">AzizSys</span>
            </Link>
            <p className="text-sm text-slate-400">The ultimate AI partner for your business.</p>
            <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} AzizSys. All rights reserved.</p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white">hello@azizsys.com</a></li>
              <li><a href="#" className="hover:text-white">Contact Sales</a></li>
              <li><a href="#" className="hover:text-white">Press Inquiries</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white">About Us</Link></li>
              <li><Link href="#" className="hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4">
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <Github className="h-6 w-6 text-slate-400 hover:text-white" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-6 w-6 text-slate-400 hover:text-white" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-6 w-6 text-slate-400 hover:text-white" />
                </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
