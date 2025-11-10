'use client';

import { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useRouter } from 'next/navigation';
import dynamic from "next/dynamic";
import { generateFinanceData } from '@/lib/financeData';
import { performPCA } from '@/lib/pca';

const SceneWrapper = dynamic(() => import("../../components/three/SceneWrapper"), { ssr: false });

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

// Build 3D points from dataset and selected metrics
function build3DFromSelection(data: any[], selected: (typeof metricKeys)[number][]): number[][] {
	if (selected.length !== 3) return [];
	return data.map(row => [row[selected[0]], row[selected[1]], row[selected[2]]]);
}

// Convert slider angle -> unit axis vector (same mapping used for projection)
function unitFromAngle(angle: number) {
	const theta = angle;
	const phi = angle * 0.5;
	const ux = Math.sin(phi) * Math.cos(theta);
	const uy = Math.sin(phi) * Math.sin(theta);
	const uz = Math.cos(phi);
	return [ux, uy, uz] as const;
}

// Project 3D to 2D based on angle (collapse onto a single axis)
function projectTo2D(data: number[][], angle: number): number[][] {
	const [ux, uy, uz] = unitFromAngle(angle);
	return data.map(point => {
		const scalar = point[0] * ux + point[1] * uy + point[2] * uz;
		return [scalar, 0];
	});
}

// Find best angle (0..2π) that aligns unitFromAngle(angle) with target axis u (maximizes |dot|)
function findBestAngleForAxis(u: number[], steps = 1440): { angle: number; alignment: number } {
	let best = { angle: 0, alignment: -1 };
	for (let i = 0; i < steps; i++) {
		const a = (i / steps) * Math.PI * 2;
		const v = unitFromAngle(a);
		const dot = Math.abs(v[0] * u[0] + v[1] * u[1] + v[2] * u[2]);
		if (dot > best.alignment) best = { angle: a, alignment: dot };
	}
	return best;
}

export default function DemoPage() {
	const router = useRouter();
	const [projectionAngle, setProjectionAngle] = useState(0);
	const [financeData, setFinanceData] = useState<any[]>([]);
	const [selectedMetrics, setSelectedMetrics] = useState<(typeof metricKeys)[number][]>(['pe','roe','oneYearReturn']);
	const [data3D, setData3D] = useState<number[][]>([]);
	const [projected2D, setProjected2D] = useState<number[][]>([]);
	const [bestAngle, setBestAngle] = useState<number | null>(null);
	const [bestAlignmentPct, setBestAlignmentPct] = useState<number>(0);

	useEffect(() => {
		const d = generateFinanceData();
		setFinanceData(d);
	}, []);

	// Recompute 3D and PCA-best angle when selection/data changes
	useEffect(() => {
		const pts3D = build3DFromSelection(financeData, selectedMetrics);
		setData3D(pts3D);
		// Default projection for current angle
		setProjected2D(projectTo2D(pts3D, projectionAngle));
		// Compute PCA axis if we have enough data
		if (pts3D.length > 0) {
			try {
				const pca1 = performPCA(pts3D, 1);
				const comp = pca1.components[0]; // length 3
				if (comp && comp.length >= 3) {
					// Normalize
					const norm = Math.hypot(comp[0], comp[1], comp[2]) || 1;
					const u = [comp[0] / norm, comp[1] / norm, comp[2] / norm];
					const best = findBestAngleForAxis(u);
					setBestAngle(best.angle);
					setBestAlignmentPct(Math.round(best.alignment * 1000) / 10);
				}
			} catch (e) {
				setBestAngle(null);
				setBestAlignmentPct(0);
			}
		} else {
			setBestAngle(null);
			setBestAlignmentPct(0);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [financeData, selectedMetrics]);

	// Update 2D on angle change
	const handleAngleChange = (angle: number) => {
		setProjectionAngle(angle);
		setProjected2D(projectTo2D(data3D, angle));
	};

	// Colors
	const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
	const chartData = projected2D.map((point, idx) => ({ x: point[0], y: point[1], color: colors[idx % colors.length] }));

	// Metric selection handlers
	const toggleMetric = (key: (typeof metricKeys)[number]) => {
		let next = [...selectedMetrics];
		if (next.includes(key)) {
			next = next.filter(k => k !== key);
		} else {
			if (next.length < 3) next.push(key);
		}
		if (next.length > 3) next = next.slice(next.length - 3);
		setSelectedMetrics(next);
	};

	const closeToBest = bestAngle != null && Math.abs(((projectionAngle - bestAngle + Math.PI * 3) % (Math.PI * 2)) - Math.PI) < (Math.PI / 180) * 2; // within 2°

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
			{/* Background */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
			</div>
			{/* Header */}
			<div className="relative z-10 pt-8 px-4">
				<button onClick={() => router.push('/')} className="mb-4 px-6 py-2 bg-white/10 backdrop-blur-lg text-white rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20">← Back to Home</button>
				<div className="text-center mb-6">
					<h1 className="text-5xl md:text-6xl font-black text-white mb-4">3D → 2D (Your Metrics)</h1>
					<p className="text-xl text-purple-200">Pick any three metrics. Project them onto the principal axis.</p>
				</div>
				{/* Visual explanation (beads = your chosen datapoints) */}
				<div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center mb-6">
					<p className="text-purple-100 text-sm">
						What you see as beads are <span className="font-semibold">your companies</span> plotted by the three metrics you selected.
						The slider rotates a line (principal axis). We drop each bead onto that line and show their positions in 2D.
						Snap to the PCA angle when the badge turns green—the story along that line is clearest there.
					</p>
				</div>
			</div>
			{/* Main content */}
			<div className="relative z-10 max-w-7xl mx-auto px-4 pb-8">
				{/* Controls */}
				<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
					<div className="grid md:grid-cols-2 gap-6">
						<div>
							<h3 className="text-white font-bold mb-3">Choose 3 Metrics</h3>
							<div className="flex flex-wrap gap-2">
								{metricKeys.map((key) => {
									const active = selectedMetrics.includes(key);
									return (
										<button
											key={key}
											onClick={() => toggleMetric(key)}
											className={`px-3 py-2 rounded-full text-sm font-semibold transition-all ${active ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-white text-gray-800 hover:bg-purple-50'}`}
										>
											{metricLabels[key]}
										</button>
									);
								})}
							</div>
							<p className="text-purple-200 text-xs mt-2">Selected: {selectedMetrics.map(m => metricLabels[m]).join(', ')}</p>
						</div>
						<div>
							<h3 className="text-white font-bold mb-3">Principal Axis Angle</h3>
							<div className="flex items-center gap-4">
								<input type="range" min="0" max={Math.PI * 2} step="0.01" value={projectionAngle} onChange={(e) => handleAngleChange(parseFloat(e.target.value))} className="flex-1 h-3 bg-white/20 rounded-lg appearance-none cursor-pointer slider" />
								<div className="text-white font-mono min-w-[80px] text-right">{(projectionAngle * 180 / Math.PI).toFixed(1)}°</div>
							</div>
							<div className="flex items-center gap-3 mt-3">
								{bestAngle != null && (
									<div className={`px-3 py-2 rounded-full text-xs font-semibold ${closeToBest ? 'bg-green-500 text-white' : 'bg-white/20 text-white'}`}>
										Optimal: {(bestAngle * 180 / Math.PI).toFixed(1)}° • Alignment: {bestAlignmentPct}%
									</div>
								)}
								{bestAngle != null && (
									<button onClick={() => handleAngleChange(bestAngle)} className="px-3 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700">
										Snap to Optimal
									</button>
								)}
							</div>
							<p className="text-purple-200 text-xs mt-2">Hint: when the badge turns green, you're on the PCA principal axis.</p>
						</div>
					</div>
				</div>
				{/* 3D and 2D views */}
				<div className="grid md:grid-cols-2 gap-6">
					{/* 3D View */}
					<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
						<h2 className="text-2xl font-bold text-white mb-4 text-center">3D Data Points</h2>
						<div className="h-[420px] rounded-lg overflow-hidden bg-black/20">
							{typeof window !== "undefined" && data3D.length > 0 && (
								<SceneWrapper data={data3D} projectionAngle={projectionAngle} />
							)}
						</div>
						<p className="text-purple-200 text-sm text-center mt-4">Each bead = one company at your chosen metrics.</p>
					</div>
					{/* 2D Projection */}
					<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
						<h2 className="text-2xl font-bold text-white mb-4 text-center">2D Projection (Collapsed to Axis)</h2>
						<div className="h-[420px] rounded-lg bg-white/5 p-4">
							<ResponsiveContainer width="100%" height="100%">
								<ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
									<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
									<XAxis type="number" dataKey="x" stroke="#e9d5ff" tick={{ fill: '#e9d5ff', fontSize: 12 }} axisLine={{ stroke: '#c084fc' }} />
									<YAxis type="number" dataKey="y" stroke="#e9d5ff" tick={{ fill: '#e9d5ff', fontSize: 12 }} axisLine={{ stroke: '#c084fc' }} domain={[0, 0]} />
									<Tooltip content={({ active, payload }) => {
										if (active && payload && payload[0]) {
											return (
												<div className="bg-gray-900/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-gray-700">
													<p className="text-white text-sm">Axis Position: {payload[0].payload.x.toFixed(2)}</p>
												</div>
											);
										}
										return null;
									}} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.3)' }} />
									<Scatter name="Projected Points" data={chartData} fill="#8b5cf6">
										{chartData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.color} opacity={0.95} />
										))}
									</Scatter>
								</ScatterChart>
							</ResponsiveContainer>
						</div>
						<p className="text-purple-200 text-sm text-center mt-4">All points lie on the principal axis (y = 0)</p>
					</div>
				</div>
			</div>
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20 text-center mb-6">
        <p className="text-purple-100 text-sm mt-2">
						Why clearest there? At the principal axis the beads <span className="font-semibold">spread out the most</span> along one line.
						That means maximum separation of companies (differences are amplified), minimal overlap, and the distance along the line
						captures the most information with the least clutter.
				</p>
				</div>
		</div>
    
	);
}

