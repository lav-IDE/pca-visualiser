'use client';

import { useState } from 'react';
import { FinanceData } from '@/lib/financeData';

interface DatasetSectionProps {
  data: FinanceData[];
}

export default function DatasetSection({ data }: DatasetSectionProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);
  const [hoveredHeader, setHoveredHeader] = useState<string | null>(null);

  const metrics = ['pe', 'pb', 'eps', 'volatility', 'debtRatio', 'roe', 'roa', 'oneYearReturn'];
  const metricLabels = ['PE', 'PB', 'EPS', 'Vol', 'Debt', 'ROE', 'ROA', 'Return'];
  const metricFullForms: { [key: string]: string } = {
    'pe': 'Price-to-Earnings Ratio',
    'pb': 'Price-to-Book Ratio',
    'eps': 'Earnings Per Share',
    'volatility': 'Volatility',
    'debtRatio': 'Debt Ratio',
    'roe': 'Return on Equity',
    'roa': 'Return on Assets',
    'oneYearReturn': '1 Year Return'
  };

  return (
    <section id="dataset" className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-gray-100 px-8 py-16 relative">
      <div className="flex-1 flex flex-col">
        <div className="mb-16">
          <div className="mb-6">
            <span className="text-7xl lg:text-8xl font-black text-gray-900">8</span>
            <span className="text-3xl lg:text-4xl text-gray-600 ml-4">Dimensions</span>
          </div>
          <p className="text-gray-600 text-xl">25 companies • 8 metrics each</p>
        </div>
        
        {/* Metric badges */}
        <div className="flex flex-wrap gap-4 mb-12 relative">
          {metrics.map((metric, idx) => (
            <div key={metric} className="relative group">
              <button
                onClick={() => setSelectedMetric(selectedMetric === metric ? null : metric)}
                onMouseEnter={() => setHoveredMetric(metric)}
                onMouseLeave={() => setHoveredMetric(null)}
                className={`px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 transform hover:scale-110 ${
                  selectedMetric === metric
                    ? 'bg-indigo-600 text-white shadow-lg scale-110'
                    : 'bg-white text-gray-700 hover:bg-indigo-50 shadow-md hover:shadow-lg'
                }`}
              >
                {metricLabels[idx]}
              </button>
              
              {/* Tooltip for metric badge */}
              {hoveredMetric === metric && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-5 py-3 bg-gray-900 text-white text-sm rounded-lg shadow-xl z-50 whitespace-nowrap animate-pop">
                  <div className="font-semibold text-base">{metricFullForms[metric]}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold mb-3">{data.length}</div>
            <div className="text-blue-100 text-lg">Companies</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-8 text-white shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold mb-3">200</div>
            <div className="text-pink-100 text-lg">Data Points</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold mb-3">8</div>
            <div className="text-purple-100 text-lg">Metrics</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-8 text-white shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-5xl font-bold mb-3">→ 2</div>
            <div className="text-indigo-100 text-lg">After PCA</div>
          </div>
        </div>
        
        {/* Compact table */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 mb-12 flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-base">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-left font-bold text-lg">Company</th>
                  {metrics.map((metric, idx) => (
                    <th
                      key={metric}
                      className="px-5 py-4 text-right font-bold text-lg relative group"
                      onMouseEnter={() => setHoveredHeader(metric)}
                      onMouseLeave={() => setHoveredHeader(null)}
                    >
                      <div className="cursor-help">
                        {metricLabels[idx]}
                      </div>
                      
                      {/* Tooltip for table header */}
                      {hoveredHeader === metric && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl z-50 whitespace-nowrap animate-pop">
                          <div className="font-semibold">{metricFullForms[metric]}</div>
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={`transition-all duration-200 ${
                      hoveredRow === idx 
                        ? 'bg-indigo-50 scale-[1.02] shadow-md' 
                        : 'hover:bg-gray-50'
                    }`}
                    onMouseEnter={() => setHoveredRow(idx)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900 text-base">{row.company}</td>
                    <td className="px-5 py-4 text-right text-gray-700 font-mono text-base">{row.pe.toFixed(1)}</td>
                    <td className="px-5 py-4 text-right text-gray-700 font-mono text-base">{row.pb.toFixed(1)}</td>
                    <td className="px-5 py-4 text-right text-gray-700 font-mono text-base">{row.eps.toFixed(2)}</td>
                    <td className="px-5 py-4 text-right text-gray-700 font-mono text-base">{row.volatility.toFixed(1)}</td>
                    <td className="px-5 py-4 text-right text-gray-700 font-mono text-base">{row.debtRatio.toFixed(1)}</td>
                    <td className="px-5 py-4 text-right text-gray-700 font-mono text-base">{row.roe.toFixed(1)}</td>
                    <td className="px-5 py-4 text-right text-gray-700 font-mono text-base">{row.roa.toFixed(1)}</td>
                    <td className="px-5 py-4 text-right text-gray-700 font-mono text-base">{row.oneYearReturn.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-12 text-center">
          <button 
            onClick={() => document.getElementById('before-pca')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-full hover:from-indigo-700 hover:to-purple-700 transform hover:scale-110 transition-all duration-300 shadow-lg"
          >
            View Visualizations →
          </button>
        </div>
      </div>
    </section>
  );
}
