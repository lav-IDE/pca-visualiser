'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [showButton3D, setShowButton3D] = useState(false);
  const [showButtonCompress, setShowButtonCompress] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="h-screen flex flex-col items-stretch justify-between bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>
      </div>

      {/* Top content section */}
      <div className="relative z-10 flex items-center justify-between flex-1 px-12 py-20 gap-16">
        {/* Left side - narrative */}
        <div className="flex flex-col justify-center flex-1">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-8xl lg:text-9xl font-black text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 drop-shadow-2xl leading-tight">
              PCA
            </h1>
            <p className="text-2xl lg:text-3xl text-purple-100 mb-8 font-light leading-relaxed">
              Reduce complexity.<br/>Keep meaning.
            </p>
            
            {/* The PCA story introduction */}
            <div className="space-y-4 max-w-lg">
              <p className="text-base text-purple-100 leading-relaxed">
                Imagine you have a book with <span className="font-bold text-white">100 pages</span>. Every page contains different information—market trends, financial metrics, hidden patterns. But most is redundant.
              </p>
              
              <p className="text-base text-purple-100 leading-relaxed">
                What if you could compress that into <span className="font-bold text-white">just 2 pages</span>? Pages powerful enough to capture <span className="font-bold text-pink-300">90% of the entire story</span>. That's <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">Principal Component Analysis</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Center - Interactive demo cards */}
        <div className={`hidden lg:flex flex-col gap-6 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button 
            onClick={() => router.push('/demo')}
            className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer text-center w-56"
          >
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📷</div>
            <h3 className="text-xl font-bold text-white mb-2">3D → 2D</h3>
            <p className="text-purple-200 text-sm">Interactive projection</p>
          </button>
          
          <button 
            onClick={() => router.push('/compress')}
            className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer text-center w-56"
          >
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📚</div>
            <h3 className="text-xl font-bold text-white mb-2">100 → 2</h3>
            <p className="text-purple-200 text-sm">Compression explorer</p>
          </button>
        </div>

        {/* Right side - visual statistics */}
        <div className={`hidden lg:flex flex-col gap-4 w-72 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Stat card 1 */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/10 transition-all">
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-2">100</div>
            <p className="text-purple-100 text-sm font-semibold">Original Dimensions</p>
            <p className="text-purple-200 text-xs mt-1">Financial metrics</p>
          </div>

          {/* Stat card 2 */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/10 transition-all">
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300 mb-2">2</div>
            <p className="text-purple-100 text-sm font-semibold">Principal Components</p>
            <p className="text-purple-200 text-xs mt-1">Maximum variance</p>
          </div>

          {/* Stat card 3 */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/10 transition-all">
            <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300 mb-2">90%</div>
            <p className="text-purple-100 text-sm font-semibold">Information Kept</p>
            <p className="text-purple-200 text-xs mt-1">Story intact</p>
          </div>
        </div>
      </div>

      {/* Bottom CTA section */}
      <div className="relative z-10 flex flex-col items-center justify-end px-12 pb-16">
        <div className={`flex justify-center gap-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button 
            onClick={() => document.getElementById('dataset')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50"
          >
            Explore Data →
          </button>
        </div>
        
        <div className="mt-8 animate-bounce">
          <div className="text-white/60 text-5xl">↓</div>
        </div>
      </div>
    </section>
  );
}
