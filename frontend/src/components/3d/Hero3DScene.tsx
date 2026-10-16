import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AmbientGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08;
      groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.12;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Floating golden geometric orb */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[1.5, 0.5, -1]}>
          <icosahedronGeometry args={[1.8, 1]} />
          <MeshDistortMaterial
            color="#c5a880"
            emissive="#453116"
            roughness={0.2}
            metalness={0.9}
            distort={0.25}
            speed={1.5}
            wireframe={true}
          />
        </mesh>
      </Float>

      {/* Outer orbital rings */}
      <mesh ref={ringRef} position={[1.5, 0.5, -1]}>
        <torusGeometry args={[2.8, 0.02, 16, 100]} />
        <meshStandardMaterial color="#ebdfc8" emissive="#9b7a4d" metalness={1} roughness={0.1} />
      </mesh>
      <mesh position={[1.5, 0.5, -1]} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[3.4, 0.015, 16, 100]} />
        <meshStandardMaterial color="#c5a880" opacity={0.6} transparent metalness={0.8} />
      </mesh>
    </group>
  );
}

export const Hero3DScene: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[4, 5, 4]} intensity={1.5} color="#c5a880" />
        <directionalLight position={[-4, -2, -2]} intensity={0.5} color="#3b82f6" />
        <AmbientGeometry />
      </Canvas>
    </div>
  );
};
