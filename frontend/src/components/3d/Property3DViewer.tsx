import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Sun, Compass, RotateCw, Maximize2, AlertCircle } from 'lucide-react';

interface Property3DViewerProps {
  modelUrl?: string;
  enabled?: boolean;
  title?: string;
  fallbackImage?: string;
  cameraPreset?: string;
  lightingPreset?: string;
}

// Fallback interactive architectural 3D pavilion model if external GLB is missing or during errors
function ArchitecturalPavilionModel({ wireframe }: { wireframe: boolean }) {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Foundation podium */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[2.8, 3.2, 0.4, 32]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.2}
          metalness={0.8}
          wireframe={wireframe}
        />
      </mesh>

      {/* Main glass & bronze architectural pavilion */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2.2, 1.8, 2.2]} />
        <meshStandardMaterial
          color="#c5a880"
          roughness={0.15}
          metalness={0.85}
          transparent={!wireframe}
          opacity={wireframe ? 1 : 0.85}
          wireframe={wireframe}
        />
      </mesh>

      {/* Floating Cantilever Roof */}
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[3.2, 0.18, 3.2]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.3}
          metalness={0.9}
          wireframe={wireframe}
        />
      </mesh>

      {/* Inner architectural core */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 1.8, 16]} />
        <meshStandardMaterial
          color="#f5f0e6"
          roughness={0.4}
          metalness={0.3}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

// Custom model loader with error boundary fallback
function GltfModelWrapper({ url, wireframe }: { url: string; wireframe: boolean }) {
  const { scene } = useGLTF(url);

  // Traverse and apply wireframe if toggled
  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m: any) => { if ('wireframe' in m) m.wireframe = wireframe; });
      } else if (mesh.material && 'wireframe' in (mesh.material as any)) {
        (mesh.material as any).wireframe = wireframe;
      }
    }
  });

  return <primitive object={scene} scale={1.5} position={[0, -0.5, 0]} />;
}

export const Property3DViewer: React.FC<Property3DViewerProps> = ({
  modelUrl,
  enabled = true,
  title = 'Interactive 3D Architectural Model',
  fallbackImage,
  cameraPreset = 'FRONT_ELEVATION',
  lightingPreset = 'GOLDEN_HOUR',
}) => {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeLighting, setActiveLighting] = useState(lightingPreset);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!enabled) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-champagne-400/20 bg-obsidian-800">
        <img
          src={fallbackImage || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'}
          alt={title}
          className="w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/40 to-transparent flex items-end p-6">
          <div className="flex items-center space-x-3 text-sm text-champagne-300">
            <AlertCircle className="w-5 h-5 text-champagne-400" />
            <span>3D Interactive view disabled for this listing. Verified photography displayed.</span>
          </div>
        </div>
      </div>
    );
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl overflow-hidden border border-champagne-400/30 bg-obsidian-900 shadow-luxury transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[500px] w-full'
      }`}
    >
      {/* 3D Viewer Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="glass-panel px-4 py-2 rounded-full pointer-events-auto flex items-center space-x-2">
          <Box className="w-4 h-4 text-champagne-400" />
          <span className="text-xs uppercase tracking-widest font-semibold text-slate-200">
            {title}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-champagne-400/20 text-champagne-300 font-mono">
            R3F Realtime
          </span>
        </div>

        <div className="flex items-center space-x-2 pointer-events-auto">
          {/* Wireframe toggle */}
          <button
            onClick={() => setWireframe(!wireframe)}
            className={`glass-panel px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center space-x-1.5 ${
              wireframe ? 'bg-champagne-400 text-obsidian-900' : 'text-slate-300 hover:text-white'
            }`}
            title="Toggle Wireframe Architecture"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Wireframe</span>
          </button>

          {/* Lighting Mode toggle */}
          <button
            onClick={() =>
              setActiveLighting(
                activeLighting === 'GOLDEN_HOUR'
                  ? 'STUDIO'
                  : activeLighting === 'STUDIO'
                  ? 'ARCHITECTURAL_SUN'
                  : 'GOLDEN_HOUR'
              )
            }
            className="glass-panel px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white transition flex items-center space-x-1.5"
            title="Change Lighting Preset"
          >
            <Sun className="w-3.5 h-3.5 text-champagne-400" />
            <span>{activeLighting.replace('_', ' ')}</span>
          </button>

          {/* Auto rotate toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`glass-panel p-2 rounded-full text-xs transition ${
              autoRotate ? 'text-champagne-400' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Auto Rotation"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="glass-panel p-2 rounded-full text-slate-400 hover:text-white transition"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas
        camera={{
          position: cameraPreset === 'AERIAL_VIEW' ? [4, 6, 6] : [3, 2.5, 4.5],
          fov: 45,
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Dynamic Lighting based on Preset */}
        {activeLighting === 'GOLDEN_HOUR' && (
          <>
            <ambientLight intensity={0.6} color="#ffe8d6" />
            <directionalLight position={[5, 6, 3]} intensity={1.8} color="#f59e0b" castShadow />
            <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#3b82f6" />
          </>
        )}
        {activeLighting === 'STUDIO' && (
          <>
            <ambientLight intensity={0.9} color="#ffffff" />
            <directionalLight position={[4, 5, 4]} intensity={1.2} color="#ffffff" />
            <directionalLight position={[-4, 3, -2]} intensity={0.8} color="#e2e8f0" />
          </>
        )}
        {activeLighting === 'ARCHITECTURAL_SUN' && (
          <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[6, 9, 2]} intensity={2.2} color="#fffbeb" castShadow />
            <directionalLight position={[-3, -2, -3]} intensity={0.2} color="#94a3b8" />
          </>
        )}

        <Suspense
          fallback={
            <mesh>
              <sphereGeometry args={[0.5, 16, 16]} />
              <meshBasicMaterial color="#c5a880" wireframe />
            </mesh>
          }
        >
          {modelUrl && !hasError ? (
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
              <GltfModelWrapper url={modelUrl} wireframe={wireframe} />
            </Float>
          ) : (
            <ArchitecturalPavilionModel wireframe={wireframe} />
          )}

          <ContactShadows
            position={[0, -1.2, 0]}
            opacity={0.6}
            scale={10}
            blur={2}
            far={4}
            color="#000000"
          />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          minDistance={2}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2 + 0.1}
        />
      </Canvas>

      {/* Bottom Hint */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <p className="text-[11px] text-slate-400 bg-obsidian-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
          Drag to rotate 360° • Scroll to zoom • Right-click to pan
        </p>
      </div>
    </div>
  );
};
