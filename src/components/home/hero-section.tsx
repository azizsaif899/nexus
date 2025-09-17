'use client'

import Image from 'next/image'
import Link from 'next/link'

const HeroSection = () => {
  return (
    <section className="relative bg-slate-950 py-20 md:py-32">
      <div className="container max-w-screen-2xl mx-auto px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
          AI-POWERED AUTOMATION
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
          Work Less. Automate More.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
          AzizSys helps you automate your workflows, so you can focus on what truly matters. We leverage cutting-edge AI to streamline your processes and boost productivity.
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link
            href="#pricing"
            className="rounded-md bg-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            Get Started
          </Link>
          <a href="#" className="text-sm font-semibold leading-6 text-white flex items-center">
            Learn more <span aria-hidden="true" className="ml-2">→</span>
          </a>
        </div>
      </div>
      <div className="absolute inset-0 z-[-1] overflow-hidden">
         <div className="absolute -top-[20rem] left-1/2 -translate-x-1/2 w-[80rem] h-[60rem] bg-[radial-gradient(circle_at_50%_50%,rgba(30,64,175,0.2),rgba(15,23,42,0))]"></div>
      </div>
      <div className="mt-16 md:mt-24 w-full flex justify-center">
        <div className="relative w-full max-w-5xl aspect-[16/9]">
            <Image 
                src="/placeholder.svg" 
                alt="AI Robot working on a laptop" 
                fill
                className="object-contain" 
            />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
