'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { FinanceData } from '@/lib/financeData';
import { PCAResult } from '@/lib/pca';

interface AfterPCASectionProps {
  data: FinanceData[];
  pcaResult: PCAResult;
}

export default function AfterPCASection({ data, pcaResult }: AfterPCASectionProps) {

  const pcaData = pcaResult.transformed.map((point, idx) => ({
    x: point[0],
    y: point[1],
    name: data[idx].company,
    index: idx,
  }));

  const varianceExplained1 = (pcaResult.explainedVariance[0] * 100).toFixed(1);
  const varianceExplained2 = (pcaResult.explainedVariance[1] * 100).toFixed(1);
  const totalVarianceExplained = ((pcaResult.explainedVariance[0] + pcaResult.explainedVariance[1]) * 100).toFixed(1);
  const remainingVariance = (100 - parseFloat(totalVarianceExplained)).toFixed(1);

  // Generate vibrant colors
  const colors = pcaData.map((_, idx) => {
    const hue = (idx * 137.5) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-xl border border-gray-200 animate-pop">
          <p className="font-bold text-gray-900 mb-2 text-lg">{payload[0].payload.name}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">PC1:</span> {payload[0].payload.x.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">PC2:</span> {payload[0].payload.y.toFixed(2)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="after-pca" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 px-4 py-20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-5xl md:text-6xl font-black text-white">After</span>
            <span className="text-3xl text-purple-200 ml-3">PCA</span>
          </div>
          <p className="text-purple-200 text-lg mt-4">8 dimensions → 2 dimensions</p>
        </div>
        
        {/* Variance cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300">
            <div className="text-4xl font-bold text-white mb-2">{varianceExplained1}%</div>
            <div className="text-purple-200 text-sm">PC1 Variance</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300">
            <div className="text-4xl font-bold text-white mb-2">{varianceExplained2}%</div>
            <div className="text-purple-200 text-sm">PC2 Variance</div>
          </div>
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="text-4xl font-bold text-white mb-2">{totalVarianceExplained}%</div>
            <div className="text-purple-100 text-sm">PC1 + PC2</div>
            <div className="text-purple-200 text-xs mt-1">({remainingVariance}% in other components)</div>
          </div>
        </div>
        
        {/* Main PCA chart */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 mb-8 hover:shadow-3xl transition-all duration-300">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">All 8 Dimensions in One View</h3>
            <p className="text-purple-200 text-sm">Each point = one company (all metrics combined)</p>
          </div>
          <ResponsiveContainer width="100%" height={600}>
            <ScatterChart margin={{ top: 20, right: 30, bottom: 60, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                type="number" 
                dataKey="x" 
                stroke="#e9d5ff"
                tick={{ fill: '#e9d5ff', fontSize: 12, fontWeight: 'bold' }}
                label={{ value: 'Principal Component 1', position: 'insideBottom', offset: -10, fill: '#e9d5ff', fontSize: 14, fontWeight: 'bold' }}
                axisLine={{ stroke: '#c084fc' }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                stroke="#e9d5ff"
                tick={{ fill: '#e9d5ff', fontSize: 12, fontWeight: 'bold' }}
                label={{ value: 'Principal Component 2', angle: -90, position: 'insideLeft', fill: '#e9d5ff', fontSize: 14, fontWeight: 'bold' }}
                axisLine={{ stroke: '#c084fc' }}
              />
              <ReferenceLine x={0} stroke="rgba(255,255,255,0.3)" strokeDasharray="2 2" />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" strokeDasharray="2 2" />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.5)' }}
              />
              <Scatter 
                name="Companies" 
                data={pcaData} 
                fill="#8b5cf6"
                shape="circle"
              >
                {pcaData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index]}
                    opacity={0.8}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        {/* Comparison cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">📊</div>
              <div className="text-white font-bold text-xl">Before</div>
            </div>
            <div className="text-purple-200 text-sm">
              <div>• 8 dimensions</div>
              <div>• 28 chart combinations</div>
              <div>• Hard to visualize</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 border border-white/20 hover:scale-105 transition-all duration-300 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">✨</div>
              <div className="text-white font-bold text-xl">After</div>
            </div>
            <div className="text-purple-100 text-sm">
              <div>• 2 dimensions</div>
              <div>• 1 unified view</div>
              <div>• {totalVarianceExplained}% variance captured (PC1 + PC2)</div>
              <div className="text-purple-200 text-xs mt-1">• {remainingVariance}% remains in other 6 components</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => document.getElementById('summary')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 bg-white text-purple-900 font-bold rounded-full hover:bg-purple-50 transform hover:scale-110 transition-all duration-300 shadow-xl"
          >
            See Summary →
          </button>
        </div>
      </div>
    </section>
  );
}
