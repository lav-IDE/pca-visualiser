'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import DatasetSection from '@/components/DatasetSection';
import BeforePCASection from '@/components/BeforePCASection';
import AfterPCASection from '@/components/AfterPCASection';
import ClosingSection from '@/components/ClosingSection';
import { generateFinanceData, extractFeatures, FinanceData } from '@/lib/financeData';
import { performPCA, PCAResult } from '@/lib/pca';

export default function Home() {
  const [data, setData] = useState<FinanceData[]>([]);
  const [pcaResult, setPcaResult] = useState<PCAResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    // Generate data and perform PCA
    setTimeout(() => {
      const financeData = generateFinanceData();
      setData(financeData);
      
      const features = extractFeatures(financeData);
      const result = performPCA(features, 2);
      setPcaResult(result);
      
      setLoadingProgress(100);
      setTimeout(() => {
        setLoading(false);
      }, 300);
    }, 1000);

    return () => clearInterval(progressInterval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
            <div 
              className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl">✨</div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Loading PCA</h2>
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden mx-auto">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
          <p className="text-purple-200 mt-4">{loadingProgress}%</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden">
      <HeroSection />
      <DatasetSection data={data} />
      <BeforePCASection data={data} />
      {pcaResult && <AfterPCASection data={data} pcaResult={pcaResult} />}
      <ClosingSection />
    </main>
  );
}
