'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClosingSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const router = useRouter();

  const cards = [
    { icon: '📈', title: 'Reduce Complexity', desc: 'Fewer metrics, same story' },
    { icon: '🎯', title: 'Find Patterns', desc: 'See relationships clearly' },
    { icon: '⚡', title: 'Faster Analysis', desc: 'One view instead of many' },
    { icon: '💡', title: 'Keep Essence', desc: 'Preserve what matters' },
  ];

  return (
    <section id="summary" className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 px-8 py-20">
        
        {/* Main message */}
        <div 
          onClick={() => router.push('/learn')}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-14 mb-16 shadow-2xl text-center cursor-pointer group hover:shadow-3xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
        >
          <div className="text-8xl mb-8 group-hover:scale-125 transition-transform duration-300">🔬</div>
          <h3 className="text-5xl font-bold text-white mb-6">
            Curious about the math?
          </h3>
          <p className="text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed mb-4">
            Discover how PCA works step-by-step
          </p>
          <div className="inline-block">
            <span className="text-lg text-purple-100 font-semibold group-hover:text-white transition-colors">
              Click to explore →
            </span>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-7xl lg:text-8xl font-black text-white mb-8">
            The Bottom Line
          </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {cards.map((card, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-10 border border-white/20 text-center transition-all duration-300 cursor-pointer ${
                hoveredCard === idx 
                  ? 'bg-white/20 scale-110 shadow-2xl border-white/40' 
                  : 'hover:bg-white/15 hover:scale-105'
              }`}
            >
              <div className={`text-6xl mb-6 transition-transform duration-300 ${
                hoveredCard === idx ? 'scale-125 rotate-6' : ''
              }`}>
                {card.icon}
              </div>
              <h4 className="text-2xl font-bold text-white mb-3">{card.title}</h4>
              <p className="text-gray-300 text-lg">{card.desc}</p>
            </div>
          ))}
        </div>
        
        {/* Transformation visualization */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20 mb-16">
          <div className="flex items-center justify-center gap-10 lg:gap-20 flex-wrap">
            <div className="text-center">
              <div className="text-6xl font-black text-white mb-3">8</div>
              <div className="text-gray-300 text-lg">Dimensions</div>
            </div>
            <div className="text-5xl text-purple-400 animate-pulse">→</div>
            <div className="text-center">
              <div className="text-6xl font-black text-white mb-3">2</div>
              <div className="text-gray-300 text-lg">Dimensions</div>
            </div>
            <div className="text-5xl text-purple-400 animate-pulse">=</div>
            <div className="text-center">
              <div className="text-6xl font-black text-green-400 mb-3">✓</div>
              <div className="text-gray-300 text-lg">Essence Preserved</div>
            </div>
          </div>
        </div>
        
        {/* Use cases */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-10 shadow-xl mb-16">
          <h4 className="text-3xl font-bold text-white mb-8 text-center">When to Use PCA</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="text-3xl mt-1">✓</div>
              <div className="text-white text-lg">Too many overlapping features</div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl mt-1">✓</div>
              <div className="text-white text-lg">Need to visualize high-dimensional data</div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl mt-1">✓</div>
              <div className="text-white text-lg">Reduce complexity without losing meaning</div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-3xl mt-1">✓</div>
              <div className="text-white text-lg">Find patterns across many variables</div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50"
          >
            ↑ Back to Top
          </button>
        </div>
    </section>
  );
}
