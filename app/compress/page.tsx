"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateFinanceData, extractFeatures, FinanceData } from "@/lib/financeData";
import { performPCA } from "@/lib/pca";

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

function buildMatrix(data: FinanceData[], selected: (typeof metricKeys)[number][]) {
	// Use same order as extractFeatures for consistency
	const order: (typeof metricKeys)[number][] = ['pe','pb','eps','volatility','debtRatio','roe','roa','oneYearReturn'];
	const cols = selected.length > 0 ? selected : order;
	// Ensure we use the selected metrics in the order they appear in the order array
	const orderedSelected = order.filter(k => cols.includes(k));
	return data.map(row => orderedSelected.map((k) => (row as any)[k] as number));
}

export default function CompressPage() {
	const router = useRouter();
	const [data, setData] = useState<FinanceData[]>([]);
	// Default to all 8 metrics in same order as extractFeatures: pe, pb, eps, volatility, debtRatio, roe, roa, oneYearReturn
	const [selected, setSelected] = useState<(typeof metricKeys)[number][]>(['pe','pb','eps','volatility','debtRatio','roe','roa','oneYearReturn']);
	const [pc1, setPc1] = useState(0);
	const [pc2, setPc2] = useState(0);

	useEffect(() => {
		setData(generateFinanceData());
	}, []);

	useEffect(() => {
		if (data.length === 0) return;
		// If all 8 metrics are selected in the correct order, use extractFeatures for consistency
		const all8Metrics = ['pe','pb','eps','volatility','debtRatio','roe','roa','oneYearReturn'];
		const isAll8Selected = selected.length === 8 && all8Metrics.every(m => selected.includes(m));
		
		let X: number[][];
		if (isAll8Selected) {
			// Use extractFeatures to match main page exactly
			X = extractFeatures(data);
		} else {
			// Use buildMatrix for custom selections
			X = buildMatrix(data, selected);
		}
		
		try {
			const pca = performPCA(X, 2);
			const v1 = Math.round((pca.explainedVariance[0] || 0) * 1000) / 10;
			const v2 = Math.round((pca.explainedVariance[1] || 0) * 1000) / 10;
			setPc1(v1);
			setPc2(v2);
		} catch (e) {
			setPc1(0);
			setPc2(0);
		}
	}, [data, selected]);

	const toggle = (k: (typeof metricKeys)[number]) => {
		let next = [...selected];
		if (next.includes(k)) next = next.filter(x => x !== k);
		else next.push(k);
		setSelected(next);
	};

	const total = Math.round((pc1 + pc2) * 10) / 10;

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
			{/* Background */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
				<div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
			</div>

			<div className="relative z-10 pt-8 px-4 max-w-5xl mx-auto">
				<button onClick={() => router.push('/')} className="mb-4 px-6 py-2 bg-white/10 backdrop-blur-lg text-white rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20">← Back to Home</button>
				<div className="text-center mb-8">
					<h1 className="text-5xl md:text-6xl font-black text-white mb-4">100 → 2 Pages</h1>
					<p className="text-xl text-purple-200">How much of the story do 2 pages keep?</p>
				</div>

				<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6">
					<h3 className="text-white font-bold mb-3">Pick the metrics to compress</h3>
					<div className="flex flex-wrap gap-2">
						{metricKeys.map((k) => {
							const active = selected.includes(k);
							return (
								<button key={k} onClick={() => toggle(k)} className={`px-3 py-2 rounded-full text-sm font-semibold transition-all ${active ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-white text-gray-800 hover:bg-purple-50'}`}>
									{metricLabels[k]}
								</button>
							);
						})}
					</div>
					<p className="text-purple-200 text-xs mt-2">Select 2+ metrics. We’ll compress them into 2 principal pages (PC1 & PC2).</p>
				</div>

				<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
					<h3 className="text-xl font-bold text-white mb-3 text-center">Explained by Two Pages</h3>
					<div className="space-y-3">
						<div>
							<div className="flex justify-between text-purple-100 text-sm mb-1"><span>Page 1 (PC1)</span><span>{pc1}%</span></div>
							<div className="w-full h-2 rounded bg-white/10 overflow-hidden">
								<div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" style={{ width: `${Math.min(100, pc1)}%` }} />
							</div>
						</div>
						<div>
							<div className="flex justify-between text-purple-100 text-sm mb-1"><span>Page 2 (PC2)</span><span>{pc2}%</span></div>
							<div className="w-full h-2 rounded bg-white/10 overflow-hidden">
								<div className="h-2 bg-gradient-to-r from-indigo-400 to-cyan-400" style={{ width: `${Math.min(100, pc2)}%` }} />
							</div>
						</div>
						<div className="text-center text-purple-100 text-sm mt-2">
							Total kept with 2 pages: <span className="font-semibold">{total}%</span>
						</div>
					</div>
					<p className="text-purple-200 text-xs text-center mt-3">Like compressing a 100‑page book to 2 pages that still tell the same story.</p>
				</div>
			</div>
		</div>
	);
}
