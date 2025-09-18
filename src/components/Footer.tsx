'use client'
import Link from 'next/link'
import { Github, Twitter, Linkedin, Sparkles } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
             <Link href="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-primary to-cyan-400 w-8 h-8 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-foreground">NEXUS</span>
            </Link>
            <p className="text-sm text-muted-foreground">The ultimate AI partner for your business.</p>
            <p className="text-xs text-muted-foreground/50">&copy; {new Date().getFullYear()} NEXUS. All rights reserved.</p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="mailto:hello@nexus.com" className="hover:text-foreground transition-colors">hello@nexus.com</a></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Contact Sales</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Press Inquiries</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
            <div className="flex space-x-4">
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <Github className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-6 w-6 text-muted-foreground hover:text-foreground transition-colors" />
                </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
