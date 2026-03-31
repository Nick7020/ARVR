import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/model.glb');

const isMobile = window.innerWidth < 768;

function Model() {
  const group = useRef();
  const { mouse, size } = useThree();
  const { scene } = useGLTF('/model.glb');
  const model = useMemo(() => scene.clone(true), [scene]);

  /* auto-fit — tighter scale on small screens */
  const { center, fitScale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const sz  = new THREE.Vector3();
    box.getSize(sz);
    const c = new THREE.Vector3();
    box.getCenter(c);
    const targetUnits = size.width < 640 ? 2.2 : 2.8;
    const s = targetUnits / Math.max(sz.x, sz.y, sz.z);
    return { center: c, fitScale: s };
  }, [model, size.width]);

  /* subtle emissive tint so it reads on dark bg */
  useEffect(() => {
    model.traverse(child => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(m => {
          m.emissive = new THREE.Color('#1a0a30');
          m.emissiveIntensity = 0.2;
          m.needsUpdate = true;
        });
      }
    });
  }, [model]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.3) * 0.3 + mouse.x * 0.15;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.05 - mouse.y * 0.06;
    group.current.position.y = Math.sin(t * 0.45) * 0.08;
  });

  return (
    <group ref={group}>
      <primitive
        object={model}
        scale={fitScale}
        position={[
          -center.x * fitScale,
          -center.y * fitScale,
          -center.z * fitScale,
        ]}
      />
    </group>
  );
}

export default function VRModel() {
  // On mobile show nothing heavy — just a glow orb to save performance
  if (isMobile) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%)', width: 280, height: 280 }} />
          <div className="relative z-10 text-center">
            <div className="text-8xl mb-4" style={{ filter: 'drop-shadow(0 0 20px rgba(139,92,246,0.8))' }}>🥽</div>
            <p className="text-purple-400/60 text-xs tracking-widest uppercase">AR / VR</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.2, 5], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
        frameloop="always"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[0, 3, 5]}  intensity={3.5} color="#ffffff" />
        <directionalLight position={[-3, 2, 3]} intensity={2}   color="#ffe0c0" />
        <directionalLight position={[3, 1, 3]}  intensity={1.5} color="#c0d0ff" />
        <pointLight       position={[-3, 2, 4]} intensity={3}   color="#a855f7" />
        <pointLight       position={[3, -1, 3]} intensity={2.5} color="#22d3ee" />
        <spotLight        position={[0, 5, 5]}  intensity={4}   color="#ffe8d0" angle={0.45} penumbra={0.8} />

        <Stars radius={35} depth={25} count={500} factor={2} fade speed={0.4} />

        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
          <Model />
        </Float>
      </Canvas>
    </div>
  );
}
