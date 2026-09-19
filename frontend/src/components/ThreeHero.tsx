"use client";

import { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

const buildNodes = (): { id: number; initialPos: THREE.Vector3; targetPos: THREE.Vector3 }[] => {
  const radius = 1.5;
  const numNodes = 6;

  return Array.from({ length: numNodes }).map((_, i) => {
    const angle = (i / numNodes) * Math.PI * 2;
    return {
      id: i,
      initialPos: new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ),
      targetPos: new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      ),
    };
  });
};

// A simple orchestrated animation of nodes coming together
const NodesAnimation = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [nodes] = useState(buildNodes);
  const [animationProgress, setAnimationProgress] = useState(0);

  useFrame((state, delta) => {
    if (animationProgress < 1) {
      setAnimationProgress(prev => Math.min(prev + delta * 0.4, 1)); // takes ~2.5s
    }
    if (groupRef.current) {
      // Gentle floating after forming
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const ochreColor = new THREE.Color('#B9863C');
  const pineColor = new THREE.Color('#21463D');
  const skillNames = [
    'JavaScript',
    'Algorithms',
    'Database',
    'Frontend',
    'API',
    'Cloud',
  ];
  
  // Interpolate color based on progress (from ochre to pine)
  const currentColor = ochreColor.clone().lerp(pineColor, Math.min(animationProgress * 1.5, 1));

  return (
    <group ref={groupRef}>
      {nodes.map(node => {
        const currentPos = new THREE.Vector3().copy(node.initialPos).lerp(node.targetPos, animationProgress);
        return (
          <group key={node.id} position={currentPos}>
            <Sphere args={[0.3, 32, 32]}>
              <meshStandardMaterial color={currentColor} roughness={0.2} metalness={0.1} />
            </Sphere>
            <Text
              position={[0, -0.55, 0]}
              fontSize={0.18}
              color="#21463D"
              anchorX="center"
              anchorY="middle"
            >
              {skillNames[node.id]}
            </Text>
          </group>
        );
      })}
      {/* Draw connecting lines when close to forming */}
      {animationProgress > 0.8 && (
        nodes.map((node, i) => {
          const nextNode = nodes[(i + 1) % nodes.length];
          return (
            <Line
              key={`line-${i}`}
              points={[node.targetPos, nextNode.targetPos]}
              color="#E4E8E2"
              lineWidth={2}
              transparent
              opacity={(animationProgress - 0.8) * 5}
            />
          );
        })
      )}
      {/* Center Verified Node */}
      <Sphere args={[0.4, 32, 32]} position={[0, 0, 0]} scale={animationProgress > 0.9 ? (animationProgress - 0.9) * 10 : 0.001}>
        <meshStandardMaterial color={pineColor} roughness={0.2} metalness={0.1} />
      </Sphere>
    </group>
  );
};

export default function ThreeHero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  if (prefersReducedMotion) {
    // Static fallback for accessibility
    return (
      <div className="w-full h-full flex items-center justify-center relative">
        <svg viewBox="0 0 100 100" className="w-64 h-64 text-primary">
          <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="50" cy="50" r="15" fill="currentColor" />
          <circle cx="50" cy="5" r="8" fill="currentColor" />
          <circle cx="95" cy="25" r="8" fill="currentColor" />
          <circle cx="95" cy="75" r="8" fill="currentColor" />
          <circle cx="50" cy="95" r="8" fill="currentColor" />
          <circle cx="5" cy="75" r="8" fill="currentColor" />
          <circle cx="5" cy="25" r="8" fill="currentColor" />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#E4E8E2" />
        <NodesAnimation />
      </Canvas>
    </div>
  );
}
