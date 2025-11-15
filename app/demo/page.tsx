"use client";

import { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Customized } from 'recharts';
import { useRouter } from 'next/navigation';
import { generateFinanceData } from '@/lib/financeData';
import { performPCA } from '@/lib/pca';

// Metric configuration
const metricKeys = ['pe', 'pb', 'eps', 'volatility', 'debtRatio', 'roe', 'roa', 'oneYearReturn'] as const;
const metricLabels: Record<(typeof metricKeys)[number], string> = {
	pe: 'PE',
	pb: 'PB',
	eps: 'EPS',
	volatility: 'Vol',
	debtRatio: 'Debt',
	roe: 'ROE',
	roa: 'ROA',
	oneYearReturn: 'Return',
};

// Build 2D points from dataset and selected metrics (expects exactly 2 metrics)
function build2DFromSelection(data: any[], selected: (typeof metricKeys)[number][]): number[][] {
	if (selected.length !== 2) return [];
	return data.map((row) => [row[selected[0]], row[selected[1]]]);
}

// Standardize 2D points (mean 0, std 1) and return standardized points plus means/stds
function standardize2D(points: number[][]) {
	if (!points || points.length === 0) return { standardized: [], means: [0, 0], stds: [1, 1] };
	const n = points.length;
	const means = [0, 0];
	for (let i = 0; i < n; i++) {
		means[0] += points[i][0];
		means[1] += points[i][1];
	}
	means[0] /= n;
	means[1] /= n;
	const stds = [0, 0];
	for (let i = 0; i < n; i++) {
		stds[0] += Math.pow(points[i][0] - means[0], 2);
		stds[1] += Math.pow(points[i][1] - means[1], 2);
	}
	stds[0] = Math.sqrt(stds[0] / (n - 1)) || 1;
	stds[1] = Math.sqrt(stds[1] / (n - 1)) || 1;
	const standardized = points.map((p) => [(p[0] - means[0]) / stds[0], (p[1] - means[1]) / stds[1]]);
	return { standardized, means, stds };
}

// Project standardized 2D points onto a unit axis given by angle (radians)
function projectTo1DFromStandardized(standardized: number[][], angle: number) {
	const ux = Math.cos(angle);
	const uy = Math.sin(angle);
	return standardized.map((p) => p[0] * ux + p[1] * uy);
}

export default function DemoPage() {
	const router = useRouter();
	const [projectionAngle, setProjectionAngle] = useState(0);
	const [financeData, setFinanceData] = useState<any[]>([]);
	const [selectedMetrics, setSelectedMetrics] = useState<(typeof metricKeys)[number][]>(['pe', 'roe']);
	const [pts2D, setPts2D] = useState<number[][]>([]);
	const [standardizedPts, setStandardizedPts] = useState<number[][]>([]);
	const [means2D, setMeans2D] = useState<number[] | null>(null);
	const [stds2D, setStds2D] = useState<number[] | null>(null);
	const [pcaComponent, setPcaComponent] = useState<number[] | null>(null);
	const [projected1D, setProjected1D] = useState<number[]>([]);
	const [optimalAngle, setOptimalAngle] = useState<number | null>(null);

	useEffect(() => {
		const d = generateFinanceData();
		setFinanceData(d);
	}, []);

	// Recompute 2D points, standardize and PCA (1 component) when selection/data changes
	useEffect(() => {
		const pts = build2DFromSelection(financeData, selectedMetrics);
		setPts2D(pts);
			if (pts.length > 0) {
				const { standardized, means, stds } = standardize2D(pts);
				setStandardizedPts(standardized);
				setMeans2D(means);
				setStds2D(stds);
			try {
				const pca1 = performPCA(pts, 1);
				const comp = pca1.components && pca1.components.length > 0 ? pca1.components[0] : null;
				if (comp) {
					const norm = Math.hypot(comp[0], comp[1]) || 1;
					  const unit = [comp[0] / norm, comp[1] / norm];
					setPcaComponent(unit);
					const angle = Math.atan2(unit[1], unit[0]);
					setOptimalAngle(angle);
					const proj = projectTo1DFromStandardized(standardized, projectionAngle);
					setProjected1D(proj);
				} else {
					setPcaComponent(null);
					setOptimalAngle(null);
					setProjected1D([]);
				}
			} catch (e) {
				setPcaComponent(null);
				setOptimalAngle(null);
				setProjected1D([]);
			}
		} else {
			setStandardizedPts([]);
			setPcaComponent(null);
			setOptimalAngle(null);
			setProjected1D([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [financeData, selectedMetrics]);

	// Update projection when slider angle changes
	const handleAngleChange = (angle: number) => {
		setProjectionAngle(angle);
		if (standardizedPts && standardizedPts.length > 0) {
			const proj = projectTo1DFromStandardized(standardizedPts, angle);
			setProjected1D(proj);
		}
	};

	// Colors: use a single harmonious color for all datapoints
	const pointColor = '#8b5cf6';
	const leftChartData = pts2D.map((point, idx) => ({ x: point[0], y: point[1], color: pointColor, idx }));
	// right chart: pure 1D projection (y = 0)
	const rightChartData = projected1D.map((val, idx) => ({ x: val, y: 0, color: pointColor, idx }));
	// compute Y domain for right chart and bias it upwards so the axis sits higher
	const rightMaxAbs = projected1D && projected1D.length > 0 ? Math.max(1, ...projected1D.map((v) => Math.abs(v))) : 1;
	// bottomFactor < 1 and topFactor > 1 shifts the zero-line upward inside the chart
	const bottomFactor = 0.5; // how much of maxAbs to allow below zero
	const topFactor = 1.5; // how much of maxAbs to allow above zero
	const rightYAxisDomain: [number, number] = [-rightMaxAbs * bottomFactor, rightMaxAbs * topFactor];

	// Metric selection handlers (limit to 2)
	const toggleMetric = (key: (typeof metricKeys)[number]) => {
		let next = [...selectedMetrics];
		if (next.includes(key)) next = next.filter((k) => k !== key);
		else if (next.length < 2) next.push(key);
		else next = [next[1], key];
		if (next.length > 2) next = next.slice(next.length - 2);
		setSelectedMetrics(next);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden flex flex-col px-8 py-12">
			{/* Background */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
			</div>

			{/* Header */}
			<div className="relative z-10 pt-8 px-4 mb-12">
				<button onClick={() => router.push('/')} className="mb-8 px-7 py-3 bg-white/10 backdrop-blur-lg text-white rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 font-semibold text-base">← Back to Home</button>
				<div className="mb-8">
					<h1 className="text-6xl lg:text-7xl font-black text-white mb-6">2D → 1D (Your Metrics)</h1>
					<p className="text-2xl text-purple-200">Pick any two metrics. See how PCA finds the principal axis and how points project onto it.</p>
				</div>

				<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center mb-8">
					<p className="text-purple-100 text-base">
						What you see as beads are <span className="font-semibold">your companies</span> plotted by the two metrics you selected.
						Use the slider to rotate the projection axis and observe how points move along the axis. Snap to PCA to align with the principal axis that captures the most variance.
					</p>
				</div>
			</div>

			{/* Main content */}
			<div className="relative z-10 max-w-7xl mx-auto px-4 pb-8 flex-1 flex flex-col gap-8">
				{/* Controls */}
				<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-6">
					<div className="grid md:grid-cols-2 gap-8">
						<div>
							<h3 className="text-white font-bold text-lg mb-4">Choose 2 Metrics</h3>
							<div className="flex flex-wrap gap-3">
								{metricKeys.map((key) => {
									const active = selectedMetrics.includes(key);
									return (
										<button
											key={key}
											onClick={() => toggleMetric(key)}
											className={`px-4 py-2 rounded-full text-base font-semibold transition-all ${active ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-white text-gray-800 hover:bg-purple-50'}`}
										>
											{metricLabels[key]}
										</button>
									);
								})}
							</div>
							<p className="text-purple-200 text-xs mt-2">Selected: {selectedMetrics.map((m) => metricLabels[m]).join(', ')}</p>
						</div>

						<div>
							<h3 className="text-white font-bold text-lg mb-4">Principal Axis Angle</h3>
							<div className="flex items-center gap-4">
								<input type="range" min="0" max={Math.PI * 2} step="0.01" value={projectionAngle} onChange={(e) => handleAngleChange(parseFloat(e.target.value))} className="flex-1 h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider" />
								<div className="text-white font-mono min-w-[100px] text-right text-base">{(projectionAngle * 180 / Math.PI).toFixed(1)}°</div>
							</div>

							<div className="flex items-center gap-3 mt-4">
								{pcaComponent ? (
									<div className="px-4 py-2 rounded-full text-sm font-semibold bg-green-500 text-white">PCA: {(optimalAngle ?? 0) * 180 / Math.PI >= 0 ? (optimalAngle! * 180 / Math.PI).toFixed(1) + '°' : (optimalAngle! * 180 / Math.PI).toFixed(1) + '°'}</div>
								) : (
									<div className="px-4 py-2 rounded-full text-sm font-semibold bg-white/20 text-white">PCA axis not ready</div>
								)}
								<button onClick={() => { if (optimalAngle !== null) handleAngleChange(optimalAngle); }} className="px-3 py-1 rounded-md bg-white/10 text-white border border-white/20 hover:bg-white/20 text-sm font-medium">Snap to PCA</button>
							</div>
							<p className="text-purple-200 text-sm mt-2">Rotate the projection axis with the slider, or snap to the PCA-computed axis for the best spread.</p>
						</div>
					</div>
				</div>

				{/* 2D data (left) and 1D projection (right) */}
				<div className="grid md:grid-cols-2 gap-8 flex-1">
					{/* 2D View */}
					<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
						<h2 className="text-3xl font-bold text-white mb-6 text-center">2D Data ({metricLabels[selectedMetrics[0]]} vs {metricLabels[selectedMetrics[1]]})</h2>
						<div className="h-[500px] rounded-lg bg-white/5 p-4">
							<ResponsiveContainer width="100%" height="100%">
												<ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
									<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
									<XAxis type="number" dataKey="x" stroke="#e9d5ff" tick={{ fill: '#e9d5ff', fontSize: 12 }} axisLine={{ stroke: '#c084fc' }} name={metricLabels[selectedMetrics[0]]} />
									<YAxis type="number" dataKey="y" stroke="#e9d5ff" tick={{ fill: '#e9d5ff', fontSize: 12 }} axisLine={{ stroke: '#c084fc' }} name={metricLabels[selectedMetrics[1]]} />
									<Tooltip content={({ active, payload }) => {
										if (active && payload && payload[0]) {
											const p = payload[0].payload;
											return (
												<div className="bg-gray-900/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-gray-700">
													<p className="text-white text-sm">{metricLabels[selectedMetrics[0]]}: {p.x.toFixed(2)}</p>
													<p className="text-white text-sm">{metricLabels[selectedMetrics[1]]}: {p.y.toFixed(2)}</p>
												</div>
											);
										}
										return null;
									}} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.25)' }} />
														<Scatter name="Points" data={leftChartData} fill={pointColor}>
															{leftChartData.map((entry: any, index: number) => (
																<Cell key={`left-${index}`} fill={entry.color} opacity={0.95} />
															))}
														</Scatter>

																			{/* Draw current projection axis line (mapped back to original metric scale).
																					This line follows the slider-controlled angle (projectionAngle).
																			*/}
																			{means2D && stds2D && (
																				<Customized
																					component={({ xAxisMap, yAxisMap }: any) => {
																						try {
																							const ux = Math.cos(projectionAngle);
																							const uy = Math.sin(projectionAngle);
																							// map to original metric scale
																							const vOrigX = ux * stds2D[0];
																							const vOrigY = uy * stds2D[1];
																							const meanX = means2D[0];
																							const meanY = means2D[1];

																							const xs = pts2D.map((p) => p[0]);
																							const ys = pts2D.map((p) => p[1]);
																							const xRange = Math.max(...xs) - Math.min(...xs) || 1;
																							const yRange = Math.max(...ys) - Math.min(...ys) || 1;
																							const length = Math.max(xRange, yRange) * 1.5;

																							const p1 = [meanX - vOrigX * length, meanY - vOrigY * length];
																							const p2 = [meanX + vOrigX * length, meanY + vOrigY * length];

																							const xScale = xAxisMap[0].scale;
																							const yScale = yAxisMap[0].scale;
																							const x1 = xScale(p1[0]);
																							const y1 = yScale(p1[1]);
																							const x2 = xScale(p2[0]);
																							const y2 = yScale(p2[1]);

																							const elements: any[] = [];
																							elements.push(
																								<line key="slider-axis" x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c4b5fd" strokeWidth={2} strokeOpacity={0.8} strokeLinecap="round" strokeDasharray="4 3" />
																							);

																							return <g>{elements}</g>;
																						} catch (err) {
																							return null;
																						}
																					}}
																				/>
																			)}
								</ScatterChart>
							</ResponsiveContainer>
						</div>
						<p className="text-purple-200 text-sm text-center mt-4">Points plotted by the two metrics you selected.</p>
					</div>

					{/* 1D Projection */}
					<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
						<h2 className="text-2xl font-bold text-white mb-4 text-center">1D Projection (Principal Axis)</h2>
						<div className="h-[500px] rounded-lg bg-white/5 p-4">
							<ResponsiveContainer width="100%" height="100%">
								<ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
																			<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" horizontal={false} />
																			<XAxis type="number" dataKey="x" stroke="#e9d5ff" tick={{ fill: '#e9d5ff', fontSize: 12 }} axisLine={{ stroke: '#c084fc' }} />
																			<YAxis type="number" dataKey="y" domain={rightYAxisDomain} hide />
									<Tooltip content={({ active, payload }) => {
										if (active && payload && payload[0]) {
											const p = payload[0].payload;
											return (
												<div className="bg-gray-900/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-gray-700">
													<p className="text-white text-sm">Projection: {p.x.toFixed(3)}</p>
												</div>
											);
										}
										return null;
									}} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.25)' }} />
									<Scatter name="Projected" data={rightChartData} fill={pointColor}>
										{rightChartData.map((entry: any, index: number) => (
											<Cell key={`right-${index}`} fill={entry.color} opacity={0.95} />
										))}
									</Scatter>
								</ScatterChart>
							</ResponsiveContainer>
						</div>
						<p className="text-purple-200 text-sm text-center mt-4">Points projected onto the axis you set with the slider. Snap to PCA to align with the principal axis.</p>
					</div>
				</div>

				<div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center mb-6">
					<p className="text-purple-100 text-sm mt-2">
						Principal axis shows the direction with the most variance in the standardized metric space. Projecting onto it concentrates the important signal into a single coordinate.
					</p>
				</div>
			</div>
		</div>
	);
}

