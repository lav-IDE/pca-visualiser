'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LearnPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Welcome to PCA Mathematics',
      subtitle: 'Principal Component Analysis Explained',
      description: 'Let\'s walk through the mathematical steps of PCA, from raw data to dimensionality reduction.',
      icon: '🔬',
      content: (
        <div className="space-y-6">
          <p className="text-xl text-purple-100 leading-relaxed">
            PCA is a linear transformation that discovers the directions of maximum variance in your data. 
            These directions become your new "principal components."
          </p>
          <p className="text-xl text-purple-100 leading-relaxed">
            Let's explore 5 key steps to understand how PCA works mathematically.
          </p>
        </div>
      ),
    },
    {
      title: 'Step 1: Data Standardization',
      subtitle: 'Zero mean, unit variance',
      icon: '📊',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-purple-100 leading-relaxed">
            First, we standardize each feature to have mean = 0 and standard deviation = 1 (z-score normalization).
          </p>
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <p className="text-purple-200 text-sm mb-4 font-mono">For each feature x:</p>
            <div className="text-2xl text-purple-300 font-mono text-center">
              x_standardized = (x - mean(x)) / std(x)
            </div>
          </div>
          <p className="text-lg text-purple-100 leading-relaxed">
            Why? This ensures each feature contributes equally, preventing features with larger scales from dominating.
          </p>
        </div>
      ),
    },
    {
      title: 'Step 2: Compute Covariance Matrix',
      subtitle: 'Understanding feature relationships',
      icon: '🔗',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-purple-100 leading-relaxed">
            The covariance matrix shows how each feature varies with every other feature.
          </p>
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <p className="text-purple-200 text-sm mb-4 font-mono">For standardized data X (n × d matrix):</p>
            <div className="text-xl text-purple-300 font-mono text-center">
              Cov = (1/n) × X<sup>T</sup> × X
            </div>
          </div>
          <p className="text-lg text-purple-100 leading-relaxed">
            This d × d matrix captures all pairwise correlations. Diagonal elements are 1 (variance of standardized features).
          </p>
        </div>
      ),
    },
    {
      title: 'Step 3: Eigenvalue Decomposition',
      subtitle: 'Finding directions of maximum variance',
      icon: '⚡',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-purple-100 leading-relaxed">
            We decompose the covariance matrix to find eigenvectors and eigenvalues.
          </p>
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <p className="text-purple-200 text-sm mb-4 font-mono">Eigenvalue problem:</p>
            <div className="text-xl text-purple-300 font-mono text-center">
              Cov × v = λ × v
            </div>
          </div>
          <p className="text-lg text-purple-100 leading-relaxed">
            <strong>Eigenvectors (v):</strong> Directions of principal components<br/>
            <strong>Eigenvalues (λ):</strong> Variance explained in each direction
          </p>
        </div>
      ),
    },
    {
      title: 'Step 4: Sort by Variance',
      subtitle: 'Keep the most important directions',
      icon: '📈',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-purple-100 leading-relaxed">
            Sort eigenvectors by eigenvalues in descending order. The eigenvector with the largest eigenvalue 
            is the direction of maximum variance (PC1), the second largest is PC2, and so on.
          </p>
          <div className="bg-white/10 rounded-xl p-6 border border-white/20 space-y-3">
            <div className="flex justify-between items-center text-purple-200">
              <span>PC1 (λ₁ = 5.2)</span>
              <div className="w-32 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
            </div>
            <div className="flex justify-between items-center text-purple-200">
              <span>PC2 (λ₂ = 2.8)</span>
              <div className="w-20 h-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded"></div>
            </div>
            <div className="flex justify-between items-center text-purple-200">
              <span>PC3 (λ₃ = 1.1)</span>
              <div className="w-8 h-2 bg-gradient-to-r from-gray-500 to-gray-600 rounded"></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Step 5: Project Data',
      subtitle: 'Transform to new space',
      icon: '🎯',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-purple-100 leading-relaxed">
            Select the top k eigenvectors (e.g., 2 for visualization) and project your data onto them.
          </p>
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <p className="text-purple-200 text-sm mb-4 font-mono">Transformation:</p>
            <div className="text-xl text-purple-300 font-mono text-center">
              X_transformed = X × W
            </div>
            <p className="text-purple-200 text-sm mt-4 font-mono">Where W contains top k eigenvectors as columns</p>
          </div>
          <p className="text-lg text-purple-100 leading-relaxed">
            This gives you k new features (principal components) that capture most of the variance with far fewer dimensions!
          </p>
        </div>
      ),
    },
    {
      title: 'Explained Variance Ratio',
      subtitle: 'How much information are we keeping?',
      icon: '📉',
      content: (
        <div className="space-y-6">
          <p className="text-lg text-purple-100 leading-relaxed">
            The explained variance ratio tells us what percentage of total variance is captured by each PC.
          </p>
          <div className="bg-white/10 rounded-xl p-6 border border-white/20">
            <div className="text-lg text-purple-300 font-mono text-center">
              Variance Ratio = λᵢ / Σ(all λ)
            </div>
          </div>
          <p className="text-lg text-purple-100 leading-relaxed">
            For our financial data: PC1 captures 60%, PC2 captures 30%, together = 90% of all information!
          </p>
          <div className="bg-white/10 rounded-xl p-6 border border-white/20 space-y-2">
            <p className="text-purple-200">PC1: 60%</p>
            <div className="w-full h-3 bg-gray-700 rounded overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-purple-500 to-pink-500" style={{width: '60%'}}></div>
            </div>
            <p className="text-purple-200 mt-4">PC1 + PC2: 90%</p>
            <div className="w-full h-3 bg-gray-700 rounded overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-purple-500 to-pink-500" style={{width: '90%'}}></div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Why This Matters',
      subtitle: 'The power of PCA',
      icon: '💡',
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="text-3xl">🎨</div>
              <div>
                <p className="text-lg font-semibold text-white">Visualization</p>
                <p className="text-purple-200">Reduces 100+ dimensions to 2D/3D for plotting</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="text-3xl">⚡</div>
              <div>
                <p className="text-lg font-semibold text-white">Efficiency</p>
                <p className="text-purple-200">Fewer features = faster ML models, less memory</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="text-3xl">🔍</div>
              <div>
                <p className="text-lg font-semibold text-white">Noise Reduction</p>
                <p className="text-purple-200">Keeps signal, discards noise and redundancy</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="text-3xl">🎯</div>
              <div>
                <p className="text-lg font-semibold text-white">Interpretation</p>
                <p className="text-purple-200">Reveals hidden patterns and relationships</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const goNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goPrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-white/10">
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-white/10 backdrop-blur-lg text-white rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 font-semibold"
          >
            ← Back
          </button>
          <div className="text-white font-semibold">
            Slide {currentSlide + 1} of {slides.length}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-16 max-w-5xl mx-auto w-full">
          <div className="text-6xl mb-8">{slide.icon}</div>
          
          <h1 className="text-5xl lg:text-6xl font-black text-white mb-4 text-center">
            {slide.title}
          </h1>
          
          <p className="text-2xl text-purple-200 mb-12 text-center">
            {slide.subtitle}
          </p>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-12 border border-white/20 w-full max-w-3xl">
            {slide.content}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center px-8 py-8 border-t border-white/10">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
              currentSlide === 0
                ? 'bg-white/5 text-white/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-110 shadow-lg'
            }`}
          >
            ← Previous
          </button>

          <div className="flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 w-8'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>

          <button
            onClick={goNext}
            disabled={currentSlide === slides.length - 1}
            className={`px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
              currentSlide === slides.length - 1
                ? 'bg-white/5 text-white/40 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-110 shadow-lg'
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
