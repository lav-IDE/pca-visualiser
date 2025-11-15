"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function RawThreeScene({ data, components, rotation }: { data: number[][]; components?: number[][] | null; rotation: number }) {
	const containerRef = useRef<HTMLDivElement>(null);
	const axisGroupRef = useRef<THREE.Group | null>(null);
	const controlsRef = useRef<OrbitControls | null>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	const gridRef = useRef<THREE.GridHelper | null>(null);
	const axesRef = useRef<THREE.AxesHelper | null>(null);
	const centerRef = useRef<THREE.Vector3>(new THREE.Vector3(0,0,0));
	const radiusRef = useRef<number>(12);

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const width = container.clientWidth;
		const height = container.clientHeight;

		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x000000);
		sceneRef.current = scene;

		const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 5000);
		cameraRef.current = camera;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		container.appendChild(renderer.domElement);

		// Lights
		const ambient = new THREE.AmbientLight(0xffffff, 0.9);
		scene.add(ambient);
		const dir1 = new THREE.DirectionalLight(0xffffff, 0.9);
		dir1.position.set(10, 15, 10);
		scene.add(dir1);
		const dir2 = new THREE.DirectionalLight(0xffffff, 0.4);
		dir2.position.set(-10, -10, -10);
		scene.add(dir2);

		// Principal axis group
		const axisGroup = new THREE.Group();
		axisGroupRef.current = axisGroup;
		scene.add(axisGroup);

		// Data points
		const colors = [0x3b82f6, 0x10b981, 0xf59e0b, 0xef4444, 0x8b5cf6, 0xec4899, 0x06b6d4];
		const sphereGeo = new THREE.SphereGeometry(0.22, 16, 16);
		data.forEach((p, idx) => {
			const mat = new THREE.MeshStandardMaterial({ color: colors[idx % colors.length], emissive: colors[idx % colors.length], emissiveIntensity: 0.25 });
			const mesh = new THREE.Mesh(sphereGeo, mat);
			mesh.position.set(p[0], p[1], p[2]);
			scene.add(mesh);
		});

		// Compute bounds to fit camera, grid, and axes
		let center = new THREE.Vector3(0, 0, 0);
		let radius = 10;
		if (data.length > 0) {
			const xs = data.map(p => p[0]);
			const ys = data.map(p => p[1]);
			const zs = data.map(p => p[2]);
			const minX = Math.min(...xs), maxX = Math.max(...xs);
			const minY = Math.min(...ys), maxY = Math.max(...ys);
			const minZ = Math.min(...zs), maxZ = Math.max(...zs);
			center = new THREE.Vector3((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
			radius = Math.max(maxX - minX, maxY - minY, maxZ - minZ) / 2;
			if (!isFinite(radius) || radius <= 0) radius = 10;
		}
		centerRef.current = center;
		radiusRef.current = radius;

		// Grid and axes sized to data
		const gridSize = Math.max(20, Math.ceil(radius * 4 / 10) * 10);
		const grid = new THREE.GridHelper(gridSize, gridSize, 0x9ca3af, 0x6b7280);
		grid.position.set(center.x, center.y, center.z);
		gridRef.current = grid;
		scene.add(grid);

		const axes = new THREE.AxesHelper(Math.max(10, radius * 2));
		axes.position.set(center.x, center.y, center.z);
		axesRef.current = axes;
		scene.add(axes);

		// Position axis group at the dataset center so it spans across points
		axisGroup.position.copy(center);

		// Position camera slightly closer for a tighter view
		const camDistance = radius * 1.4; // was 3, zoom in a bit
		camera.position.set(center.x + camDistance, center.y + camDistance, center.z + camDistance);
		camera.lookAt(center);

		// Controls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.target.copy(center);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;
		controlsRef.current = controls;

		// Resize
		const onResize = () => {
			if (!containerRef.current || !cameraRef.current) return;
			const w = containerRef.current.clientWidth;
			const h = containerRef.current.clientHeight;
			cameraRef.current.aspect = w / h;
			cameraRef.current.updateProjectionMatrix();
			renderer.setSize(w, h);
		};
		window.addEventListener('resize', onResize);

		let raf = 0;
		const animate = () => {
			raf = requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		};
		animate();

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener('resize', onResize);
			controls.dispose();
			renderer.dispose();
			container.removeChild(renderer.domElement);
			controlsRef.current = null;
			sceneRef.current = null;
			cameraRef.current = null;
			gridRef.current = null;
			axesRef.current = null;
		};
	}, [data]);

	// Update principal plane when PCA components or rotation change
	useEffect(() => {
		if (!axisGroupRef.current) return;
		const axisGroup = axisGroupRef.current;
		while (axisGroup.children.length) axisGroup.remove(axisGroup.children[0]);

		const radius = radiusRef.current;
		const size = Math.max(8, radius * 2.5);

		if (components && components.length >= 2) {
			// build basis from PCA components
			const u = new THREE.Vector3(components[0][0], components[0][1], components[0][2]).normalize();
			const v = new THREE.Vector3(components[1][0], components[1][1], components[1][2]).normalize();

			// rotate basis vectors within their plane by 'rotation' (visual rotation)
			const rot = rotation || 0;
			const uRot = u.clone().multiplyScalar(Math.cos(rot)).add(v.clone().multiplyScalar(Math.sin(rot))).normalize();
			const vRot = v.clone().multiplyScalar(Math.cos(rot)).sub(u.clone().multiplyScalar(Math.sin(rot))).normalize();
			const normal = uRot.clone().cross(vRot).normalize();

			// plane mesh
			const planeGeo = new THREE.PlaneGeometry(size, size, 8, 8);
			const planeMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, opacity: 0.08, transparent: true, side: THREE.DoubleSide });
			const plane = new THREE.Mesh(planeGeo, planeMat);

			// align plane so its local X= uRot, Y= vRot, Z = normal
			const basis = new THREE.Matrix4();
			basis.makeBasis(uRot, vRot, normal);
			plane.setRotationFromMatrix(basis);
			plane.position.copy(centerRef.current);
			axisGroup.add(plane);

			// grid on plane (using GridHelper and orienting it)
			const grid = new THREE.GridHelper(size, 10, 0x6b7280, 0x374151);
			grid.position.copy(centerRef.current);
			grid.setRotationFromMatrix(basis);
			axisGroup.add(grid);
		}
	}, [components, rotation]);

	return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
