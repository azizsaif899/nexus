'use client'

import Image from 'next/image'
import Link from 'next/link'

const HeroSection = () => {
  return (
    <section className="relative bg-slate-950 pt-24 pb-20 md:pt-32 md:pb-28">
      <div className="absolute inset-0 z-0 overflow-hidden">
         <div className="absolute -top-[20rem] left-1/2 -translate-x-1/2 w-[80rem] h-[60rem] bg-[radial-gradient(circle_at_50%_50%,rgba(22,163,175,0.15),rgba(15,23,42,0))]"></div>
      </div>
      <div className="container max-w-screen-xl mx-auto px-4 text-center relative z-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          AI-POWERED AUTOMATION
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Work Less. Automate More.
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          NEXUS helps you automate your workflows, so you can focus on what truly matters. We leverage cutting-edge AI to streamline your processes and boost productivity.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="#pricing"
            className="rounded-md bg-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-cyan-400 hover:shadow-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Get Started
          </Link>
          <a href="#" className="text-sm font-semibold leading-6 text-white flex items-center group">
            Learn more <span aria-hidden="true" className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
      <div className="mt-16 md:mt-24 w-full flex justify-center">
        <div className="relative w-full max-w-5xl aspect-[16/9] rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl shadow-cyan-500/10">
            <Image 
                src="https://picsum.photos/seed/ai-typing/1200/675"
                alt="AI Robot working on a laptop"
                fill
                className="object-cover"
                data-ai-hint="robot future"
            />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
