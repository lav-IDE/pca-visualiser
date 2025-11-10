"use client";

import { useEffect, useState } from "react";

export default function ClientCanvas({ children }: { children: React.ReactNode }) {
	const [CanvasComp, setCanvasComp] = useState<any>(null);

	useEffect(() => {
		let mounted = true;
		import("@react-three/fiber").then((mod) => {
			if (mounted) setCanvasComp(() => mod.Canvas);
		});
		return () => {
			mounted = false;
		};
	}, []);

	if (!CanvasComp) return null;
	return <CanvasComp>{children}</CanvasComp>;
}
