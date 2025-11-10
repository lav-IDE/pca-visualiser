"use client";

import RawThreeScene from "./RawThreeScene";

export default function SceneWrapper({ data, projectionAngle }: { data: any; projectionAngle: number }) {
	if (!data) return null;
	return (
		<RawThreeScene data={data} projectionAngle={projectionAngle} />
	);
}
