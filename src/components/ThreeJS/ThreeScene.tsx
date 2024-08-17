import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const scene = new THREE.Scene();
            scene.background = new THREE.Color("#18181b");
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(200, 200, true);
            containerRef.current?.appendChild(renderer.domElement);
            camera.position.z = 2;
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshBasicMaterial({ color: 'rgb(59, 130, 246)', });
            const cube = new THREE.Mesh(geometry, material);
            scene.add(cube);
            const renderScene = () => {
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
                renderer.render(scene, camera);
                requestAnimationFrame(renderScene);
            };
            renderScene()
        }
    }, []);
    return <div key={"cubo"} ref={containerRef} />;
};
export default ThreeScene;