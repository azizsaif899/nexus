'use client'

import Image from 'next/image'
import Link from 'next/link'

const HeroSection = () => {
  return (
    <section className="relative bg-background pt-24 pb-20 md:pt-32 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-50">
         <div className="absolute -top-[20rem] left-1/2 -translate-x-1/2 w-[80rem] h-[60rem] bg-radial-gradient"></div>
         <div 
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl animate-[float_15s_ease-in-out_infinite]"
          style={{ animationDelay: '0s' }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-400/10 rounded-full filter blur-3xl animate-[float-slower_20s_ease-in-out_infinite]"
          style={{ animationDelay: '5s' }}
        ></div>
      </div>
      <div className="container max-w-screen-xl mx-auto px-4 text-center relative z-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">
          AI-POWERED AUTOMATION
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          Work Less. Automate More.
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
          NEXUS helps you automate your workflows, so you can focus on what truly matters. We leverage cutting-edge AI to streamline your processes and boost productivity.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="#pricing"
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:bg-primary/80 hover:scale-105 hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            Get Started
          </Link>
          <a href="#" className="text-sm font-semibold leading-6 text-foreground flex items-center group">
            Learn more <span aria-hidden="true" className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
      <div className="mt-16 md:mt-24 w-full flex justify-center">
        <div className="relative w-full max-w-5xl aspect-[16/9] rounded-xl overflow-hidden border border-primary/20 shadow-lg">
            <Image 
                src="https://picsum.photos/seed/ai-robot/1200/675"
                alt="AI Robot working on a laptop"
                fill
                className="object-cover"
                data-ai-hint="robot future"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
