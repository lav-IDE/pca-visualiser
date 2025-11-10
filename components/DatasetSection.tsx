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
    <section id="dataset" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 px-4 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="text-5xl md:text-6xl font-black text-gray-900">8</span>
            <span className="text-2xl text-gray-600 ml-2">Dimensions</span>
          </div>
          <p className="text-gray-600 text-lg mt-4">25 companies • 8 metrics each</p>
        </div>
        
        {/* Metric badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 relative">
          {metrics.map((metric, idx) => (
            <div key={metric} className="relative group">
              <button
                onClick={() => setSelectedMetric(selectedMetric === metric ? null : metric)}
                onMouseEnter={() => setHoveredMetric(metric)}
                onMouseLeave={() => setHoveredMetric(null)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-110 ${
                  selectedMetric === metric
                    ? 'bg-indigo-600 text-white shadow-lg scale-110'
                    : 'bg-white text-gray-700 hover:bg-indigo-50 shadow-md hover:shadow-lg'
                }`}
              >
                {metricLabels[idx]}
              </button>
              
              {/* Tooltip for metric badge */}
              {hoveredMetric === metric && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-xl z-50 whitespace-nowrap animate-pop">
                  <div className="font-semibold">{metricFullForms[metric]}</div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold">{data.length}</div>
            <div className="text-blue-100 text-sm">Companies</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold">8</div>
            <div className="text-purple-100 text-sm">Metrics</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold">200</div>
            <div className="text-pink-100 text-sm">Data Points</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg hover:scale-105 transition-transform duration-300">
            <div className="text-3xl font-bold">→ 2</div>
            <div className="text-indigo-100 text-sm">After PCA</div>
          </div>
        </div>
        
        {/* Compact table */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Company</th>
                  {metrics.map((metric, idx) => (
                    <th
                      key={metric}
                      className="px-3 py-3 text-right font-bold relative group"
                      onMouseEnter={() => setHoveredHeader(metric)}
                      onMouseLeave={() => setHoveredHeader(null)}
                    >
                      <div className="cursor-help">
                        {metricLabels[idx]}
                      </div>
                      
                      {/* Tooltip for table header */}
                      {hoveredHeader === metric && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50 whitespace-nowrap animate-pop">
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
                    <td className="px-4 py-3 font-semibold text-gray-900">{row.company}</td>
                    <td className="px-3 py-3 text-right text-gray-700 font-mono">{row.pe.toFixed(1)}</td>
                    <td className="px-3 py-3 text-right text-gray-700 font-mono">{row.pb.toFixed(1)}</td>
                    <td className="px-3 py-3 text-right text-gray-700 font-mono">{row.eps.toFixed(2)}</td>
                    <td className="px-3 py-3 text-right text-gray-700 font-mono">{row.volatility.toFixed(1)}</td>
                    <td className="px-3 py-3 text-right text-gray-700 font-mono">{row.debtRatio.toFixed(1)}</td>
                    <td className="px-3 py-3 text-right text-gray-700 font-mono">{row.roe.toFixed(1)}</td>
                    <td className="px-3 py-3 text-right text-gray-700 font-mono">{row.roa.toFixed(1)}</td>
                    <td className="px-3 py-3 text-right text-gray-700 font-mono">{row.oneYearReturn.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <button 
            onClick={() => document.getElementById('before-pca')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:from-indigo-700 hover:to-purple-700 transform hover:scale-110 transition-all duration-300 shadow-lg"
          >
            View Visualizations →
          </button>
        </div>
      </div>
    </section>
  );
}
