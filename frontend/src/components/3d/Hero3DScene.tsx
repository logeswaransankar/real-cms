import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Ambient floating particles representing gold/amber luxury aura
function GoldDustParticles({ count = 35, reducedMotion = false }: { count?: number; reducedMotion?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const scl = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
      scl[i] = Math.random() * 0.8 + 0.2;
    }
    return [pos, scl];
  }, [count]);

  useFrame((_, delta) => {
    if (reducedMotion || !pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.02;
    pointsRef.current.rotation.x += delta * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#d4af37"
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// Architectural Pavilion Sculpture
function ArchitecturalSculpture({
  pointer,
  reducedMotion,
}: {
  pointer: { x: number; y: number };
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      if (!reducedMotion) {
        // Continuous subtle rotation
        const targetRotY = t * 0.08 + pointer.x * 0.35;
        const targetRotX = Math.sin(t * 0.05) * 0.1 - pointer.y * 0.25;
        groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 3, delta);
        groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 3, delta);
      } else {
        groupRef.current.rotation.y = 0.2;
        groupRef.current.rotation.x = 0.05;
      }
    }

    if (!reducedMotion) {
      if (ringRef1.current) ringRef1.current.rotation.z = t * 0.1;
      if (ringRef2.current) ringRef2.current.rotation.z = -t * 0.07;
      if (coreRef.current) {
        coreRef.current.rotation.y = -t * 0.15;
      }
    }
  });

  return (
    <group ref={groupRef} position={[1.2, 0.2, 0]}>
      {/* Floating Modern Luxury Crystal Pavilion */}
      <Float
        speed={reducedMotion ? 0 : 2}
        rotationIntensity={reducedMotion ? 0 : 0.4}
        floatIntensity={reducedMotion ? 0 : 0.8}
      >
        {/* Foundation Slabs (Architectural Podium) */}
        <mesh position={[0, -1.2, 0]}>
          <boxGeometry args={[3.2, 0.15, 3.2]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>

        <mesh position={[0, -0.9, 0]}>
          <boxGeometry args={[2.8, 0.1, 2.8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Slender Architectural Columns */}
        {[
          [-1.2, 0, -1.2],
          [1.2, 0, -1.2],
          [-1.2, 0, 1.2],
          [1.2, 0, 1.2],
        ].map(([cx, cy, cz], idx) => (
          <mesh key={idx} position={[cx, cy, cz]}>
            <cylinderGeometry args={[0.04, 0.04, 1.8, 16]} />
            <meshStandardMaterial color="#c5a880" metalness={0.95} roughness={0.15} />
          </mesh>
        ))}

        {/* Central Luminous Crystal Cube */}
        <mesh ref={coreRef} position={[0, 0, 0]}>
          <boxGeometry args={[1.6, 1.6, 1.6]} />
          <MeshDistortMaterial
            color="#c5a880"
            emissive="#52391b"
            emissiveIntensity={0.6}
            roughness={0.15}
            metalness={0.9}
            distort={reducedMotion ? 0 : 0.2}
            speed={reducedMotion ? 0 : 1.2}
            transparent
            opacity={0.85}
          />
        </mesh>

        {/* Interior Wireframe Geometry */}
        <mesh position={[0, 0, 0]}>
          <octahedronGeometry args={[1.9, 0]} />
          <meshBasicMaterial color="#fcd34d" wireframe opacity={0.35} transparent />
        </mesh>

        {/* Cantilevered Floating Roof */}
        <mesh position={[0, 1.1, 0]}>
          <boxGeometry args={[3.6, 0.16, 3.6]} />
          <meshStandardMaterial
            color="#090d16"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>

        {/* Roof Skylight Rim */}
        <mesh position={[0, 1.22, 0]}>
          <boxGeometry args={[2.0, 0.05, 2.0]} />
          <meshStandardMaterial color="#c5a880" metalness={1} roughness={0.1} />
        </mesh>
      </Float>

      {/* Orbital Gold Rings */}
      <mesh ref={ringRef1} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[3.0, 0.02, 16, 100]} />
        <meshStandardMaterial color="#ebdfc8" emissive="#9b7a4d" metalness={0.9} roughness={0.1} />
      </mesh>

      <mesh ref={ringRef2} rotation={[-Math.PI / 5, Math.PI / 6, 0]}>
        <torusGeometry args={[3.6, 0.015, 16, 100]} />
        <meshStandardMaterial color="#c5a880" opacity={0.5} transparent metalness={0.8} />
      </mesh>
    </group>
  );
}

export const Hero3DScene: React.FC = () => {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check user preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Track mouse coordinates for interactive parallax
  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setPointer({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  // Pause rendering when scrolled out of viewport for performance
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden opacity-75 z-0 transition-opacity duration-1000"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        frameloop={isVisible ? 'always' : 'never'}
      >
        <ambientLight intensity={0.7} />
        {/* Champagne Warm Key Light */}
        <directionalLight position={[6, 7, 5]} intensity={2.2} color="#f6d89e" />
        {/* Soft Cool Obsidian Rim Light */}
        <directionalLight position={[-6, -3, -4]} intensity={0.8} color="#60a5fa" />
        {/* Golden Underglow Light */}
        <pointLight position={[1.2, -2, 1]} intensity={1.5} color="#d4af37" distance={8} />

        <ArchitecturalSculpture pointer={pointer} reducedMotion={reducedMotion} />
        <GoldDustParticles count={35} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
};
