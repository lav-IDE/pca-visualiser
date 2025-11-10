'use client';

import { useState } from 'react';

export default function ClosingSection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const cards = [
    { icon: '📈', title: 'Reduce Complexity', desc: 'Fewer metrics, same story' },
    { icon: '🎯', title: 'Find Patterns', desc: 'See relationships clearly' },
    { icon: '⚡', title: 'Faster Analysis', desc: 'One view instead of many' },
    { icon: '💡', title: 'Keep Essence', desc: 'Preserve what matters' },
  ];

  return (
    <section id="summary" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 px-4 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-6xl md:text-7xl font-black text-white mb-6">
            The Bottom Line
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto"></div>
        </div>
        
        {/* Main message */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 mb-12 shadow-2xl text-center">
          <div className="text-6xl mb-6">✨</div>
          <h3 className="text-4xl font-bold text-white mb-4">
            PCA Keeps the Essence
          </h3>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Reduce complexity without losing meaning
          </p>
        </div>
        
        {/* Feature cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center transition-all duration-300 cursor-pointer ${
                hoveredCard === idx 
                  ? 'bg-white/20 scale-110 shadow-2xl border-white/40' 
                  : 'hover:bg-white/15 hover:scale-105'
              }`}
            >
              <div className={`text-5xl mb-4 transition-transform duration-300 ${
                hoveredCard === idx ? 'scale-125 rotate-6' : ''
              }`}>
                {card.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{card.title}</h4>
              <p className="text-gray-300 text-sm">{card.desc}</p>
            </div>
          ))}
        </div>
        
        {/* Transformation visualization */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-12">
          <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
            <div className="text-center">
              <div className="text-5xl font-black text-white mb-2">8</div>
              <div className="text-gray-300 text-sm">Dimensions</div>
            </div>
            <div className="text-4xl text-purple-400 animate-pulse">→</div>
            <div className="text-center">
              <div className="text-5xl font-black text-white mb-2">2</div>
              <div className="text-gray-300 text-sm">Dimensions</div>
            </div>
            <div className="text-4xl text-purple-400 animate-pulse">=</div>
            <div className="text-center">
              <div className="text-5xl font-black text-green-400 mb-2">✓</div>
              <div className="text-gray-300 text-sm">Essence Preserved</div>
            </div>
          </div>
        </div>
        
        {/* Use cases */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-xl">
          <h4 className="text-2xl font-bold text-white mb-6 text-center">When to Use PCA</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✓</div>
              <div className="text-white">Too many overlapping metrics</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✓</div>
              <div className="text-white">Need to visualize high-dimensional data</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✓</div>
              <div className="text-white">Reduce complexity without losing meaning</div>
            </div>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✓</div>
              <div className="text-white">Find patterns across many variables</div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-12 text-center">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-full hover:from-purple-700 hover:to-pink-700 transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 text-lg"
          >
            ↑ Back to Top
          </button>
        </div>
      </div>
    </section>
  );
}
