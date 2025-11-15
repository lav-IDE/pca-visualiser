"use client";

import RawThreeScene from "./RawThreeScene";

export default function SceneWrapper({ data, components, rotation }: { data: any; components?: number[][] | null; rotation?: number }) {
	if (!data) return null;
	return (
		<RawThreeScene data={data} components={components} rotation={rotation ?? 0} />
	);
}
