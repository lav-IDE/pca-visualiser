"use client";

import dynamic from "next/dynamic";

const ClientCanvas = dynamic(() => import("./ClientCanvas"), { ssr: false });

export default function FiberCanvas({ children }: { children: React.ReactNode }) {
	return <ClientCanvas>{children}</ClientCanvas>;
}