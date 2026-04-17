import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/model.glb');

function Model() {
  const group = useRef();
  const { mouse, size } = useThree();
  const { scene } = useGLTF('/model.glb');
  const model = useMemo(() => scene.clone(true), [scene]);

  const { center, fitScale } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const sz  = new THREE.Vector3();
    box.getSize(sz);
    const c = new THREE.Vector3();
    box.getCenter(c);
    const s = 2.6 / Math.max(sz.x, sz.y, sz.z);
    return { center: c, fitScale: s };
  }, [model]);

  useEffect(() => {
    model.traverse(child => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(m => {
          m.emissive = new THREE.Color('#1a0a30');
          m.emissiveIntensity = 0.25;
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
        position={[-center.x * fitScale, -center.y * fitScale, -center.z * fitScale]}
      />
    </group>
  );
}

export default function VRModelDesktop() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.2, 5], fov: 42 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ambientLight intensity={1} />
        <pointLight       position={[-3, 2, 4]} intensity={5}   color="#a855f7" />
        <pointLight       position={[3, -1, 3]} intensity={4} color="#22d3ee" />
        <spotLight        position={[0, 5, 5]}  intensity={4}   color="#ffffff" angle={0.45} penumbra={0.8} />

        <Stars radius={35} depth={20} count={150} factor={2} fade speed={0.4} />

        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
          <Model />
        </Float>
      </Canvas>
    </div>
  );
}

