import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/model.glb');

/* ─── Particles ─── */
function Particles() {
  const ref = useRef();
  const geo = useMemo(() => {
    const pos = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return pos;
  }, []);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.getElapsedTime() * 0.025; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geo, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.018} color="#a855f7" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ─── Horizontal face scan line ─── */
function ScanLine({ height = 2.5 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.position.y = (height / 2) - ((t * 0.55) % height);
    ref.current.material.opacity = 0.18 + Math.sin(t * 5) * 0.07;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[2.2, 0.022]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={8}
            transparent opacity={0.22} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─── Targeting reticle ─── */
function Reticle({ position }) {
  const ref = useRef();
  useFrame(({ clock }) => { ref.current.rotation.z = clock.getElapsedTime() * 0.9; });
  return (
    <group ref={ref} position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.125, 32]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={8} transparent opacity={0.85} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.055, 0.072, 32]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={8} transparent opacity={0.75} />
      </mesh>
      {[[0.16,0,0],[-0.16,0,0],[0,0.16,0],[0,-0.16,0]].map(([x,y,z],i) => (
        <mesh key={i} position={[x,y,z]}>
          <boxGeometry args={[i<2?0.05:0.005, i<2?0.005:0.05, 0.001]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={8} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── HUD data panel ─── */
function HUDPanel({ position, color, lineCount = 4, w = 0.58, h = 0.4 }) {
  const ref = useRef();
  const lines = useMemo(() =>
    Array.from({ length: lineCount }, (_, i) => {
      const y = h / 2 - 0.055 - i * (h / (lineCount + 1));
      const len = w * (0.45 + Math.random() * 0.45);
      return { y, len };
    }), [lineCount, w, h]);

  useFrame(({ clock }) => {
    ref.current.material.opacity = 0.5 + Math.sin(clock.getElapsedTime() * 1.8 + position[0]) * 0.15;
  });

  return (
    <group position={position}>
      <mesh ref={ref}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35}
          transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {[[0,h/2,w,0.006],[0,-h/2,w,0.006],[-w/2,0,0.006,h],[w/2,0,0.006,h]].map(([x,y,bw,bh],i) => (
        <mesh key={i} position={[x,y,0.001]}>
          <planeGeometry args={[bw, bh]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={6} transparent opacity={0.9} />
        </mesh>
      ))}
      {[[-w/2,h/2],[w/2,h/2],[-w/2,-h/2],[w/2,-h/2]].map(([x,y],i) => (
        <mesh key={i} position={[x,y,0.002]}>
          <circleGeometry args={[0.018, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={8} transparent opacity={1} />
        </mesh>
      ))}
      {lines.map(({ y, len }, i) => (
        <Line key={i}
          points={[[-w/2+0.04, y, 0.002], [-w/2+0.04+len, y, 0.002]]}
          color={color} lineWidth={1.2} transparent opacity={0.65} />
      ))}
    </group>
  );
}

/* ─── AR Glasses ─── */
  function ARGlasses({ position }) {
    const ref = useRef();
    useFrame(({ clock }) => {
      const v = 2.5 + Math.sin(clock.getElapsedTime() * 2.8) * 1.2;
      ref.current.children.forEach(c => { if (c.material) c.material.emissiveIntensity = v; });
    });
    return (
      <group ref={ref} position={position}>
        <mesh position={[-0.3, 0, 0]} rotation={[Math.PI/2,0,0]}>
          <torusGeometry args={[0.2, 0.016, 16, 64]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} />
        </mesh>
        <mesh position={[-0.3, 0, 0.01]} rotation={[Math.PI/2,0,0]}>
          <circleGeometry args={[0.184, 64]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#22d3ee" emissiveIntensity={2} transparent opacity={0.2} metalness={0.5} roughness={0} />
        </mesh>
        <mesh position={[0.3, 0, 0]} rotation={[Math.PI/2,0,0]}>
          <torusGeometry args={[0.2, 0.016, 16, 64]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={3} />
        </mesh>
        <mesh position={[0.3, 0, 0.01]} rotation={[Math.PI/2,0,0]}>
          <circleGeometry args={[0.184, 64]} />
          <meshStandardMaterial color="#7c3aed" emissive="#a855f7" emissiveIntensity={2} transparent opacity={0.2} metalness={0.5} roughness={0} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.2, 0.018, 0.018]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} />
        </mesh>
        {[[-0.56,0,-0.1,0.28],[0.56,0,-0.1,-0.28]].map(([x,y,z,ry],i) => (
          <mesh key={i} position={[x,y,z]} rotation={[0,ry,0]}>
            <boxGeometry args={[0.3, 0.014, 0.014]} />
            <meshStandardMaterial color={i===0?"#22d3ee":"#a855f7"} emissive={i===0?"#22d3ee":"#a855f7"} emissiveIntensity={2} />
          </mesh>
        ))}
      </group>
    );
  }

/* ─── Face outline dots ─── */
function FaceOutlineDots({ points, color }) {
  return points.map(([x,y,z], i) => {
    const Dot = () => {
      const r = useRef();
      useFrame(({ clock }) => {
        r.current.material.emissiveIntensity = 3 + Math.sin(clock.getElapsedTime() * 2.5 + i * 0.4) * 1.5;
      });
      return (
        <mesh ref={r} position={[x,y,z]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
        </mesh>
      );
    };
    return <Dot key={i} />;
  });
}

/* ─── Main scene ─── */
function SceneModel() {
  const group = useRef();
  const { mouse } = useThree();
  const { scene } = useGLTF('/model.glb');
  const model = useMemo(() => scene.clone(true), [scene]);

  const { center, scale: fitScale, top } = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    box.getSize(size);
    const c = new THREE.Vector3();
    box.getCenter(c);
    const maxDim = Math.max(size.x, size.y, size.z);
    const s = 2.6 / maxDim;
    const t = (box.max.y - c.y) * s;
    return { center: c, scale: s, top: t };
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

  const glassesY  = top * 0.38;
  const foreheadY = top * 0.72;
  const reticleZ  = 0.55;

  const faceOutline = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      pts.push([Math.cos(a) * 0.62, Math.sin(a) * 0.82 + glassesY * 0.3, reticleZ - 0.05]);
    }
    return pts;
  }, [glassesY]);

  return (
    <group ref={group}>
      <primitive
        object={model}
        scale={fitScale}
        position={[-center.x * fitScale, -center.y * fitScale, -center.z * fitScale]}
      />

      <ARGlasses position={[0, glassesY, reticleZ]} />
      <Reticle position={[0, foreheadY, reticleZ]} />
      <ScanLine height={top * 2.2} />
      <FaceOutlineDots points={faceOutline} color="#22d3ee" />

      {[[-0.5, glassesY * 0.6, reticleZ], [0.5, glassesY * 0.6, reticleZ]].map(([x,y,z],i) => (
        <Line key={i}
          points={[[x, y, z], [x + (i===0?-0.22:0.22), y - 0.08, z - 0.05]]}
          color="#a855f7" lineWidth={1.5} transparent opacity={0.7} />
      ))}

      <HUDPanel position={[-1.5,  0.3, 0]} color="#22d3ee" lineCount={5} />
      <HUDPanel position={[ 1.5,  0.3, 0]} color="#a855f7" lineCount={4} />
      <HUDPanel position={[-1.45,-0.5, 0]} color="#3b82f6" lineCount={3} w={0.5} h={0.3} />
      <HUDPanel position={[ 1.45,-0.5, 0]} color="#ec4899" lineCount={3} w={0.5} h={0.3} />

      <Line points={[[-1.21, 0.3, 0], [-0.65, glassesY * 0.8, reticleZ * 0.6]]} color="#22d3ee" lineWidth={1} transparent opacity={0.5} />
      <Line points={[[ 1.21, 0.3, 0], [ 0.65, glassesY * 0.8, reticleZ * 0.6]]} color="#a855f7" lineWidth={1} transparent opacity={0.5} />
      <Line points={[[-1.2, -0.5, 0], [-0.5, -0.3, reticleZ * 0.5]]}            color="#3b82f6" lineWidth={1} transparent opacity={0.5} />
      <Line points={[[ 1.2, -0.5, 0], [ 0.5, -0.3, reticleZ * 0.5]]}            color="#ec4899" lineWidth={1} transparent opacity={0.5} />

      {[[-1.8,1.0,0.2,'#22d3ee'],[1.9,0.8,0.1,'#a855f7'],[0.1,top+0.3,-0.2,'#3b82f6'],[-1.7,-0.9,0.1,'#ec4899'],[1.8,-0.8,0.2,'#22d3ee']].map(([x,y,z,c],i) => {
        const Node = () => {
          const r = useRef();
          useFrame(({ clock }) => {
            r.current.position.y = y + Math.sin(clock.getElapsedTime() * 0.9 + i) * 0.1;
            r.current.material.emissiveIntensity = 3 + Math.sin(clock.getElapsedTime() * 2.2 + i) * 1.5;
          });
          return (
            <mesh ref={r} position={[x,y,z]}>
              <sphereGeometry args={[0.042, 14, 14]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={3} />
            </mesh>
          );
        };
        return <Node key={i} />;
      })}
    </group>
  );
}

export default function VRModel() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.2, 5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[0, 3, 5]}  intensity={3.5} color="#ffffff" />
        <directionalLight position={[-3, 2, 3]} intensity={2}   color="#ffe0c0" />
        <directionalLight position={[3, 1, 3]}  intensity={1.5} color="#c0d0ff" />
        <pointLight       position={[-3, 2, 4]} intensity={3}   color="#a855f7" />
        <pointLight       position={[3, -1, 3]} intensity={2.5} color="#22d3ee" />
        <spotLight        position={[0, 5, 5]}  intensity={4}   color="#ffe8d0" angle={0.45} penumbra={0.8} />

        <Particles />
        <Stars radius={35} depth={25} count={800} factor={2} fade speed={0.4} />

        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
          <SceneModel />
        </Float>
      </Canvas>
    </div>
  );
}
