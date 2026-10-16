import React, { Suspense, useState, useRef, useEffect, useMemo, Component, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  useGLTF,
  Environment,
  ContactShadows,
  Float,
  useProgress,
  Html,
} from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import {
  Box,
  Sun,
  Compass,
  RotateCw,
  Maximize2,
  Minimize2,
  AlertCircle,
  Eye,
  RefreshCw,
  Camera,
  Layers,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

interface Property3DViewerProps {
  modelUrl?: string;
  enabled?: boolean;
  title?: string;
  fallbackImage?: string;
  cameraPreset?: string;
  lightingPreset?: string;
  tour360Url?: string;
}

// React Error Boundary for Three.js GLTF model loading
class ModelErrorBoundary extends Component<
  { fallback: ReactNode; onError?: (error: Error) => void; children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: ReactNode; onError?: (error: Error) => void; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Luxury In-Canvas Loading Indicator with Progress Percentage
function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="glass-panel px-6 py-4 rounded-2xl flex flex-col items-center space-y-3 shadow-luxury border border-champagne-400/40 min-w-[220px]">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-champagne-400/20 border-t-champagne-400 animate-spin" />
          <Box className="w-5 h-5 text-champagne-400 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-200">
            Generating 3D Spatial Scene
          </p>
          <p className="text-[11px] text-champagne-400 font-mono mt-1">
            {progress ? `${Math.round(progress)}%` : 'Initializing...'}
          </p>
        </div>
        <div className="w-full bg-obsidian-950 rounded-full h-1.5 overflow-hidden border border-white/10">
          <div
            className="bg-gradient-to-r from-champagne-500 to-champagne-300 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Html>
  );
}

// Procedural Luxury Architectural Pavilion (Used as fallback or primary model)
function ArchitecturalPavilionModel({
  wireframe,
  reducedMotion,
}: {
  wireframe: boolean;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (groupRef.current && !reducedMotion) {
      groupRef.current.rotation.y += delta * 0.08;
    }
    if (waterRef.current && !reducedMotion) {
      const mat = waterRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.roughness = 0.1 + Math.sin(Date.now() * 0.002) * 0.05;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Foundation Landscape / Reflection Podium */}
      <mesh position={[0, -0.65, 0]}>
        <cylinderGeometry args={[3.4, 3.8, 0.35, 32]} />
        <meshStandardMaterial
          color="#0b1120"
          roughness={0.3}
          metalness={0.8}
          wireframe={wireframe}
        />
      </mesh>

      {/* Infinity Reflection Water Pool */}
      <mesh ref={waterRef} position={[0, -0.47, 1.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.6, 1.2]} />
        <meshStandardMaterial
          color="#0284c7"
          roughness={0.05}
          metalness={0.9}
          transparent
          opacity={wireframe ? 1 : 0.8}
          wireframe={wireframe}
        />
      </mesh>

      {/* Ground Floor Cantilevered Glass Pavilion */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2.4, 1.5, 2.4]} />
        <meshStandardMaterial
          color="#d4af37"
          roughness={0.15}
          metalness={0.85}
          transparent={!wireframe}
          opacity={wireframe ? 1 : 0.75}
          wireframe={wireframe}
        />
      </mesh>

      {/* Slender Structural Architectural Columns */}
      {[
        [-1.3, 0.3, -1.3],
        [1.3, 0.3, -1.3],
        [-1.3, 0.3, 1.3],
        [1.3, 0.3, 1.3],
      ].map(([x, y, z], idx) => (
        <mesh key={idx} position={[x, y, z]}>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 16]} />
          <meshStandardMaterial color="#c5a880" metalness={0.95} roughness={0.1} />
        </mesh>
      ))}

      {/* Cantilevered Balcony Slab */}
      <mesh position={[0.4, 1.1, 0.3]}>
        <boxGeometry args={[2.8, 0.14, 2.6]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.25}
          metalness={0.9}
          wireframe={wireframe}
        />
      </mesh>

      {/* Upper Floor Sky Suite */}
      <mesh position={[0.4, 1.8, 0.3]}>
        <boxGeometry args={[1.8, 1.2, 1.8]} />
        <meshStandardMaterial
          color="#e2d4be"
          roughness={0.1}
          metalness={0.7}
          transparent={!wireframe}
          opacity={wireframe ? 1 : 0.85}
          wireframe={wireframe}
        />
      </mesh>

      {/* Floating Modern Roof Pergola with Slats */}
      <mesh position={[0.4, 2.45, 0.3]}>
        <boxGeometry args={[3.2, 0.12, 3.0]} />
        <meshStandardMaterial color="#020617" roughness={0.3} metalness={0.95} wireframe={wireframe} />
      </mesh>

      {/* Interior Warm Illumination Core */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 1.4, 16]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#eab308"
          emissiveIntensity={wireframe ? 0 : 0.8}
          roughness={0.3}
          metalness={0.2}
          wireframe={wireframe}
        />
      </mesh>
    </group>
  );
}

// Custom Model Loader Wrapper
function GltfModelWrapper({ url, wireframe }: { url: string; wireframe: boolean }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m: any) => {
            if ('wireframe' in m) m.wireframe = wireframe;
          });
        } else if (mesh.material && 'wireframe' in (mesh.material as any)) {
          (mesh.material as any).wireframe = wireframe;
        }
      }
    });
  }, [scene, wireframe]);

  return <primitive object={scene} scale={1.3} position={[0, -0.4, 0]} />;
}

// 360-degree Equirectangular Photo Sphere Component
function PhotoSphere360({ imageUrl }: { imageUrl: string }) {
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(imageUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [imageUrl]);

  return (
    <mesh>
      {/* Inverted sphere (inside view) */}
      <sphereGeometry args={[50, 60, 40]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

// Camera controller helper to smoothly update orbit presets
function CameraPresetController({ preset }: { preset: string }) {
  const { camera } = useThree();

  useEffect(() => {
    switch (preset) {
      case 'AERIAL_VIEW':
        camera.position.set(4.5, 6.5, 5.5);
        break;
      case 'CORNER_PERSPECTIVE':
        camera.position.set(4.0, 2.2, 4.0);
        break;
      case 'TERRACE_VIEW':
        camera.position.set(2.0, 0.8, 3.2);
        break;
      case 'FRONT_ELEVATION':
      default:
        camera.position.set(0.0, 1.8, 5.5);
        break;
    }
    camera.lookAt(0, 0.5, 0);
  }, [preset, camera]);

  return null;
}

export const Property3DViewer: React.FC<Property3DViewerProps> = ({
  modelUrl,
  enabled = true,
  title = 'Interactive 3D Architectural Model',
  fallbackImage,
  cameraPreset = 'FRONT_ELEVATION',
  lightingPreset = 'GOLDEN_HOUR',
  tour360Url,
}) => {
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeLighting, setActiveLighting] = useState(lightingPreset);
  const [activeCameraPreset, setActiveCameraPreset] = useState(cameraPreset);
  const [modelLoadError, setModelLoadError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [viewMode, setViewMode] = useState<'3D' | '360'>( '3D' );

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Check reduced-motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches) {
      setAutoRotate(false);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) setAutoRotate(false);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Update lighting preset if prop changes
  useEffect(() => {
    if (lightingPreset) setActiveLighting(lightingPreset);
  }, [lightingPreset]);

  // Update camera preset if prop changes
  useEffect(() => {
    if (cameraPreset) setActiveCameraPreset(cameraPreset);
  }, [cameraPreset]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleResetCamera = () => {
    setActiveCameraPreset('FRONT_ELEVATION');
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // If 3D is disabled for this property, show verified photography
  if (!enabled) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-champagne-400/20 bg-obsidian-900 shadow-luxury">
        <img
          src={
            fallbackImage ||
            'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
          }
          alt={title}
          className="w-full h-[480px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-900/40 to-transparent flex items-end p-6">
          <div className="flex items-center space-x-3 text-sm text-champagne-300">
            <AlertCircle className="w-5 h-5 text-champagne-400 flex-shrink-0" />
            <span>
              3D interactive spatial view is disabled for this listing. Verified architectural photography displayed.
            </span>
          </div>
        </div>
      </div>
    );
  }

  const effectiveFallbackImage =
    fallbackImage ||
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80';

  return (
    <div
      ref={containerRef}
      className={`relative rounded-2xl overflow-hidden border border-champagne-400/30 bg-obsidian-950 shadow-luxury transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : 'h-[520px] w-full'
      }`}
    >
      {/* Top Header Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Title and Badge */}
        <div className="glass-panel px-3.5 py-1.5 rounded-full pointer-events-auto flex items-center space-x-2 border border-white/10">
          <Box className="w-4 h-4 text-champagne-400" />
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-200">
            {title}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-champagne-400/20 text-champagne-300 font-mono">
            {viewMode === '360' ? '360° Sphere' : modelUrl && !modelLoadError ? 'GLTF Realtime' : '3D Spatial'}
          </span>
        </div>

        {/* View Mode Switcher (3D Model vs 360° Panorama) */}
        <div className="glass-panel p-1 rounded-full pointer-events-auto flex items-center space-x-1 border border-white/10">
          <button
            onClick={() => setViewMode('3D')}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition flex items-center space-x-1.5 ${
              viewMode === '3D'
                ? 'bg-champagne-400 text-obsidian-950 font-semibold shadow-glow-gold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Model</span>
          </button>
          <button
            onClick={() => setViewMode('360')}
            className={`px-3 py-1 rounded-full text-[11px] font-medium transition flex items-center space-x-1.5 ${
              viewMode === '360'
                ? 'bg-champagne-400 text-obsidian-950 font-semibold shadow-glow-gold'
                : 'text-slate-300 hover:text-white'
            }`}
            title="360° Equirectangular Panoramic Experience"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>360° Panorama</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto">
          {viewMode === '3D' && (
            <>
              {/* Camera Presets Selector */}
              <div className="glass-panel rounded-full px-2 py-1 flex items-center space-x-1 border border-white/10">
                <Camera className="w-3.5 h-3.5 text-champagne-400 ml-1" />
                <select
                  value={activeCameraPreset}
                  onChange={(e) => setActiveCameraPreset(e.target.value)}
                  className="bg-transparent text-[11px] text-slate-200 outline-none cursor-pointer pr-1"
                  title="Camera Angle Preset"
                >
                  <option value="FRONT_ELEVATION" className="bg-obsidian-900 text-white">
                    Front Elevation
                  </option>
                  <option value="AERIAL_VIEW" className="bg-obsidian-900 text-white">
                    Aerial Drone View
                  </option>
                  <option value="CORNER_PERSPECTIVE" className="bg-obsidian-900 text-white">
                    Corner Perspective
                  </option>
                  <option value="TERRACE_VIEW" className="bg-obsidian-900 text-white">
                    Terrace Horizon
                  </option>
                </select>
              </div>

              {/* Lighting Mode toggle */}
              <button
                onClick={() =>
                  setActiveLighting(
                    activeLighting === 'GOLDEN_HOUR'
                      ? 'STUDIO'
                      : activeLighting === 'STUDIO'
                      ? 'OBSIDIAN_NIGHT'
                      : 'GOLDEN_HOUR'
                  )
                }
                className="glass-panel px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-300 hover:text-white transition flex items-center space-x-1.5 border border-white/10"
                title="Change Lighting Atmosphere"
              >
                <Sun className="w-3.5 h-3.5 text-champagne-400" />
                <span>
                  {activeLighting === 'GOLDEN_HOUR'
                    ? 'Golden Hour'
                    : activeLighting === 'STUDIO'
                    ? 'Studio Sun'
                    : 'Obsidian Night'}
                </span>
              </button>

              {/* Wireframe toggle */}
              <button
                onClick={() => setWireframe(!wireframe)}
                className={`glass-panel px-3 py-1.5 rounded-full text-[11px] font-medium transition flex items-center space-x-1.5 border border-white/10 ${
                  wireframe
                    ? 'bg-champagne-400 text-obsidian-950 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Toggle BIM Architectural Wireframe"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Wireframe</span>
              </button>

              {/* Auto rotate toggle */}
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`glass-panel p-2 rounded-full text-xs transition border border-white/10 ${
                  autoRotate ? 'text-champagne-400' : 'text-slate-400 hover:text-white'
                }`}
                title="Toggle Auto Rotation"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              {/* Reset camera view button */}
              <button
                onClick={handleResetCamera}
                className="glass-panel p-2 rounded-full text-slate-400 hover:text-white transition border border-white/10"
                title="Reset Camera View"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="glass-panel p-2 rounded-full text-slate-400 hover:text-white transition border border-white/10"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Model Load Error Notice */}
      {modelLoadError && viewMode === '3D' && (
        <div className="absolute top-16 left-4 z-20 pointer-events-auto">
          <div className="p-2.5 rounded-xl bg-amber-950/80 backdrop-blur-md border border-amber-500/40 text-amber-200 text-xs flex items-center space-x-2 max-w-md shadow-luxury">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>External GLB model was unreachable. Rendering interactive procedural pavilion.</span>
          </div>
        </div>
      )}

      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 1.8, 5.5], fov: viewMode === '360' ? 70 : 45 }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
      >
        {/* Dynamic Atmosphere & Lighting based on preset */}
        {activeLighting === 'GOLDEN_HOUR' && (
          <>
            <ambientLight intensity={0.7} color="#fff1db" />
            <directionalLight position={[6, 7, 4]} intensity={2.2} color="#fbbf24" castShadow />
            <directionalLight position={[-5, 2, -4]} intensity={0.6} color="#60a5fa" />
            <pointLight position={[0, 2, 0]} intensity={1.2} color="#f59e0b" distance={10} />
          </>
        )}
        {activeLighting === 'STUDIO' && (
          <>
            <ambientLight intensity={1.0} color="#ffffff" />
            <directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-5, 4, -3]} intensity={0.9} color="#cbd5e1" />
          </>
        )}
        {activeLighting === 'OBSIDIAN_NIGHT' && (
          <>
            <ambientLight intensity={0.3} color="#1e1b4b" />
            <directionalLight position={[5, 9, 3]} intensity={1.4} color="#93c5fd" />
            <directionalLight position={[-4, -2, -3]} intensity={0.3} color="#3b82f6" />
            <pointLight position={[0, 1, 0]} intensity={2.5} color="#fbbf24" distance={8} />
          </>
        )}

        <CameraPresetController preset={activeCameraPreset} />

        <Suspense fallback={<CanvasLoader />}>
          {viewMode === '360' ? (
            /* 360-degree Panorama Mode */
            <PhotoSphere360 imageUrl={effectiveFallbackImage} />
          ) : (
            /* 3D Building Model Mode */
            <>
              {modelUrl && !modelLoadError ? (
                <ModelErrorBoundary
                  onError={() => setModelLoadError(true)}
                  fallback={<ArchitecturalPavilionModel wireframe={wireframe} reducedMotion={reducedMotion} />}
                >
                  <Float
                    speed={reducedMotion ? 0 : 1.2}
                    rotationIntensity={reducedMotion ? 0 : 0.15}
                    floatIntensity={reducedMotion ? 0 : 0.25}
                  >
                    <GltfModelWrapper url={modelUrl} wireframe={wireframe} />
                  </Float>
                </ModelErrorBoundary>
              ) : (
                <ArchitecturalPavilionModel wireframe={wireframe} reducedMotion={reducedMotion} />
              )}

              <ContactShadows
                position={[0, -1.0, 0]}
                opacity={0.6}
                scale={10}
                blur={2.5}
                far={4}
                color="#000000"
              />
              <Environment preset="city" />
            </>
          )}
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enableZoom={true}
          enablePan={viewMode === '3D'}
          enableDamping={true}
          dampingFactor={0.05}
          autoRotate={autoRotate && !reducedMotion}
          autoRotateSpeed={0.9}
          minDistance={viewMode === '360' ? 0.1 : 2.0}
          maxDistance={viewMode === '360' ? 20 : 14.0}
          maxPolarAngle={viewMode === '360' ? Math.PI : Math.PI / 2 + 0.1}
          minPolarAngle={viewMode === '360' ? 0 : 0.1}
        />
      </Canvas>

      {/* Bottom Hint Banner */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none flex items-center justify-between">
        <p className="text-[11px] text-slate-300 bg-obsidian-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-md">
          {viewMode === '360'
            ? 'Drag to look around in 360° • Scroll / pinch to zoom'
            : '1-finger drag to rotate 360° • Pinch / scroll to zoom • 2-finger drag to pan'}
        </p>

        {tour360Url && (
          <a
            href={tour360Url}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto text-[11px] text-champagne-300 hover:text-white bg-obsidian-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-champagne-400/30 flex items-center space-x-1.5 hover:border-champagne-400 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-champagne-400" />
            <span>Launch Virtual Tour</span>
          </a>
        )}
      </div>
    </div>
  );
};
