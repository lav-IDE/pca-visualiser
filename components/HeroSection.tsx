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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 px-4 py-20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 drop-shadow-2xl">
            PCA
          </h1>
          <p className="text-2xl md:text-3xl text-purple-200 mb-12 font-light">
            Reduce complexity. Keep meaning.
          </p>
        </div>
        
        <div className={`grid md:grid-cols-2 gap-6 mb-12 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div 
            className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setShowButton3D(true)}
            onMouseLeave={() => setShowButton3D(false)}
            onClick={() => router.push('/demo')}
          >
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📷</div>
            <h3 className="text-xl font-bold text-white mb-2">3D → 2D</h3>
            <p className="text-purple-200 text-sm">Photo of a 3D object</p>
            
            {/* Button that appears on hover */}
            {showButton3D && (
              <div className="absolute inset-0 flex items-center justify-center animate-pop">
              </div>
            )}
          </div>
          
          <div 
            className="group relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setShowButtonCompress(true)}
            onMouseLeave={() => setShowButtonCompress(false)}
            onClick={() => router.push('/compress')}
          >
            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">📚</div>
            <h3 className="text-xl font-bold text-white mb-2">100 → 2</h3>
            <p className="text-purple-200 text-sm">Pages compressed, story intact</p>
            {showButtonCompress && (
              <div className="absolute inset-0 flex items-center justify-center animate-pop">
              </div>
            )}
          </div>
        </div>
        
        <div className={`flex justify-center gap-4 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <button 
            onClick={() => document.getElementById('dataset')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50"
          >
            Explore Data →
          </button>
        </div>
        
        <div className="mt-16 animate-bounce">
          <div className="text-white/60 text-4xl">↓</div>
        </div>
      </div>
    </section>
  );
}
