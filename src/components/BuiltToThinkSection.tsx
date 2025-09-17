'use client'
import Image from 'next/image'

const BuiltToThinkSection = () => {
  return (
    <section className="py-20 md:py-32 bg-slate-950">
      <div className="container max-w-screen-2xl mx-auto px-4">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">About Us</p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Built to Think. Designed to Scale.
            </h2>
            <p className="mt-6 text-lg text-slate-400">
              We are a team of AI researchers and engineers passionate about building the future of automation. Our mission is to create intelligent systems that are not only powerful but also accessible and easy to use for everyone.
            </p>
            <div className="mt-8 space-y-4">
              <div className="rounded-lg bg-slate-900 p-4">
                  <div className="flex justify-between mb-1">
                      <span className="text-base font-medium text-blue-400">AI-Powered Automation</span>
                      <span className="text-sm font-medium text-blue-400">95%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{width: '95%'}}></div>
                  </div>
              </div>
              <div className="rounded-lg bg-slate-900 p-4">
                  <div className="flex justify-between mb-1">
                      <span className="text-base font-medium text-blue-400">Customer Satisfaction</span>
                      <span className="text-sm font-medium text-blue-400">98%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{width: '98%'}}></div>
                  </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 w-full flex justify-center">
            <div className="relative w-full max-w-md aspect-square">
                <Image 
                    src="/placeholder.svg" 
                    alt="AI Robot sitting at a desk" 
                    fill
                    className="object-contain" 
                />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BuiltToThinkSection
