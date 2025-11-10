"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid } from "@react-three/drei";
import * as THREE from "three";

function Point({ position, color }: { position: [number, number, number]; color: string }) {
	const meshRef = useRef<THREE.Mesh>(null);
	
	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.rotation.y += 0.005;
		}
	});

	return (
		<mesh ref={meshRef} position={position}>
			<sphereGeometry args={[0.2, 16, 16]} />
			<meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
		</mesh>
	);
}

function PrincipalAxis({ angle, length = 12 }: { angle: number; length?: number }) {
	// Calculate axis direction based on angle in 3D space
	const theta = angle; // Azimuthal angle
	const phi = angle * 0.5; // Polar angle
	
	const x = Math.sin(phi) * Math.cos(theta) * length;
	const y = Math.sin(phi) * Math.sin(theta) * length;
	const z = Math.cos(phi) * length;
	
	// Calculate rotation for the cylinder
	const direction = new THREE.Vector3(x, y, z).normalize();
	const axis = new THREE.Vector3(0, 1, 0);
	const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);
	
	return (
		<group>
			{/* Main axis line as a cylinder - centered at origin, extending along direction */}
			<mesh quaternion={quaternion}>
				<cylinderGeometry args={[0.08, 0.08, length * 2, 16]} />
				<meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.6} />
			</mesh>
			{/* Arrow head at the positive end */}
			<mesh position={[x * 0.95, y * 0.95, z * 0.95]} quaternion={quaternion}>
				<coneGeometry args={[0.35, 1, 8]} />
				<meshStandardMaterial color="#ec4899" emissive="#ec4899" emissiveIntensity={0.6} />
			</mesh>
		</group>
	);
}

function Scene3D({ data, projectionAngle }: { data: number[][]; projectionAngle: number }) {
	const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];
	
	return (
		<>
			<PerspectiveCamera makeDefault position={[15, 15, 15]} fov={55} />
			<ambientLight intensity={0.7} />
			<directionalLight position={[10, 15, 10]} intensity={0.8} />
			<directionalLight position={[-10, -10, -10]} intensity={0.3} />
			<Grid args={[20, 20]} cellColor="#6b7280" sectionColor="#9ca3af" />
			<axesHelper args={[10]} />
			<PrincipalAxis angle={projectionAngle} />
			{data.map((point, idx) => (
				<Point key={idx} position={[point[0], point[1], point[2]]} color={colors[idx % colors.length]} />
			))}
			<OrbitControls enableDamping dampingFactor={0.05} />
		</>
	);
}

export default Scene3D;