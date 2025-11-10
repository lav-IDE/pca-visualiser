'use client';

import { useState } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { FinanceData } from '@/lib/financeData';

interface BeforePCASectionProps {
  data: FinanceData[];
}

export default function BeforePCASection({ data }: BeforePCASectionProps) {
  const [activeChart, setActiveChart] = useState(0);
  
  const charts = [
    { name: 'PE vs PB', data: data.map(d => ({ x: d.pe, y: d.pb, name: d.company })), color: '#3b82f6' },
    { name: 'ROE vs ROA', data: data.map(d => ({ x: d.roe, y: d.roa, name: d.company })), color: '#10b981' },
    { name: 'PE vs ROE', data: data.map(d => ({ x: d.pe, y: d.roe, name: d.company })), color: '#f59e0b' },
    { name: 'Volatility vs Return', data: data.map(d => ({ x: d.volatility, y: d.oneYearReturn, name: d.company })), color: '#ef4444' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-gray-200">
          <p className="font-bold text-gray-900 mb-1">{payload[0].payload.name}</p>
          <p className="text-sm text-gray-600">
            X: {payload[0].payload.x.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            Y: {payload[0].payload.y.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="before-pca" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-5xl md:text-6xl font-black text-gray-900">Before</span>
            <span className="text-3xl text-gray-600 ml-3">PCA</span>
          </div>
          <p className="text-gray-600 text-lg mt-4">8 dimensions • Multiple 2D views needed</p>
        </div>
        
        {/* Chart selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {charts.map((chart, idx) => (
            <button
              key={idx}
              onClick={() => setActiveChart(idx)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-110 ${
                activeChart === idx
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl scale-110'
                  : 'bg-white text-gray-700 hover:bg-emerald-50 shadow-md hover:shadow-lg'
              }`}
            >
              {chart.name}
            </button>
          ))}
        </div>
        
        {/* Main chart display */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/50 mb-8 hover:shadow-3xl transition-shadow duration-300">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">{charts[activeChart].name}</h3>
            <p className="text-center text-gray-500 text-sm">One of 28 possible 2D combinations</p>
          </div>
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
              <XAxis 
                type="number" 
                dataKey="x" 
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#9ca3af' }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                stroke="#6b7280"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#9ca3af' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: charts[activeChart].color, opacity: 0.3 }} />
              <Scatter 
                name="Companies" 
                data={charts[activeChart].data} 
                fill={charts[activeChart].color}
                shape="circle"
              >
                {charts[activeChart].data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={charts[activeChart].color}
                    opacity={0.7}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        {/* Info card */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold mb-2">28 Combinations</div>
              <div className="text-emerald-100">That's how many 2D views we'd need to see all relationships</div>
            </div>
            <div className="text-6xl">📊</div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => document.getElementById('after-pca')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-full hover:from-emerald-700 hover:to-teal-700 transform hover:scale-110 transition-all duration-300 shadow-lg"
          >
            See PCA Solution →
          </button>
        </div>
      </div>
    </section>
  );
}
