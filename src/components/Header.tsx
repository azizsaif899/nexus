
'use client'

import Link from 'next/link'
import {
  Sun,
  Moon,
  Menu,
  Sparkles,
  Globe,
  User,
} from 'lucide-react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"


const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4 mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-gradient-to-br from-primary to-cyan-400 w-8 h-8 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-foreground">NEXUS</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-x-8 text-sm font-medium">
          <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">Flow</Link>
          <Link href="/chat" className="text-muted-foreground transition-colors hover:text-foreground">Chat</Link>
          <Link href="/crm" className="text-muted-foreground transition-colors hover:text-foreground">CRM</Link>
          <Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</Link>
          <Link href="#pricing" className="text-muted-foreground transition-colors hover:text-foreground">Pricing</Link>
          <Link href="#faq" className="text-muted-foreground transition-colors hover:text-foreground">FAQ</Link>
        </nav>

        <div className="flex items-center gap-x-4">
          <button className="p-2 rounded-md hover:bg-accent transition-colors group">
            <Sun className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors dark:hidden" />
            <Moon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors hidden dark:block" />
            <span className="sr-only">Toggle theme</span>
          </button>
           <button className="p-2 rounded-md hover:bg-accent transition-colors group">
            <Globe className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="sr-only">Toggle language</span>
          </button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <button className="md:hidden p-2 rounded-md hover:bg-accent transition-colors">
            <Menu className="h-6 w-6 text-muted-foreground" />
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
