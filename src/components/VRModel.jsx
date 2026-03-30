import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Torus, RoundedBox, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Particles ─── */
function Particles() {
  const ref = useRef();
  const geo = useMemo(() => {
    const pos = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
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

/* ─── Horizontal scan line sweeping down the face ─── */
function FaceScanLine() {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ref.current.position.y = 1.4 - ((t * 0.6) % 3.2);
    ref.current.material.opacity = 0.18 + Math.sin(t * 4) * 0.06;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1.6, 0.018]} />
      <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={6}
        transparent opacity={0.2} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─── AR Glasses on the face ─── */
function ARGlasses() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.material.emissiveIntensity = 2.5 + Math.sin(clock.getElapsedTime() * 2.5) * 1.2;
  });
  return (
    <group position={[0, 0.18, 0.62]}>
      {/* Left lens frame */}
      <mesh position={[-0.28, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.19, 0.018, 16, 64]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} />
      </mesh>
      {/* Left lens glass */}
      <mesh position={[-0.28, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.172, 64]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#22d3ee" emissiveIntensity={1.5}
          transparent opacity={0.22} metalness={0.5} roughness={0} />
      </mesh>
      {/* Left lens HUD grid */}
      <mesh position={[-0.28, 0, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.172, 6]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={4}
          transparent opacity={0.25} wireframe />
      </mesh>

      {/* Right lens frame */}
      <mesh ref={ref} position={[0.28, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.19, 0.018, 16, 64]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={3} />
      </mesh>
      <mesh position={[0.28, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.172, 64]} />
        <meshStandardMaterial color="#7c3aed" emissive="#a855f7" emissiveIntensity={1.5}
          transparent opacity={0.22} metalness={0.5} roughness={0} />
      </mesh>
      <mesh position={[0.28, 0, 0.015]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.172, 6]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={4}
          transparent opacity={0.25} wireframe />
      </mesh>

      {/* Bridge */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.18, 0.022, 0.022]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.52, 0, -0.12]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.28, 0.016, 0.016]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={2} />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.52, 0, -0.12]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.28, 0.016, 0.016]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

/* ─── Floating HUD panel (left side) ─── */
function HUDPanel({ position, color, lines = 4, width = 0.55, height = 0.38 }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.material.opacity = 0.55 + Math.sin(clock.getElapsedTime() * 1.5) * 0.15;
  });
  const linePositions = useMemo(() =>
    Array.from({ length: lines }, (_, i) => {
      const y = height / 2 - 0.06 - i * (height / (lines + 1));
      return [[-width / 2 + 0.04, y, 0], [width / 2 - 0.04 - Math.random() * 0.1, y, 0]];
    }), [lines, width, height]);

  return (
    <group position={position}>
      {/* Panel bg */}
      <mesh ref={ref}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4}
          transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      {/* Border */}
      <mesh>
        <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
        <lineBasicMaterial color={color} />
      </mesh>
      {/* Corner accents */}
      {[[-width/2, height/2], [width/2, height/2], [-width/2, -height/2], [width/2, -height/2]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.001]}>
          <planeGeometry args={[0.04, 0.04]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={6} transparent opacity={0.9} />
        </mesh>
      ))}
      {/* Data lines */}
      {linePositions.map(([start, end], i) => (
        <Line key={i} points={[start, end]} color={color} lineWidth={1} transparent opacity={0.6} />
      ))}
    </group>
  );
}

/* ─── Orbit ring ─── */
function OrbitRing({ radius, speed, color, rx = 0, ry = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => { ref.current.rotation.z = clock.getElapsedTime() * speed; });
  return (
    <group ref={ref} rotation={[rx, ry, 0]}>
      <Torus args={[radius, 0.007, 12, 120]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} transparent opacity={0.7} />
      </Torus>
    </group>
  );
}

/* ─── Targeting reticle on forehead ─── */
function TargetReticle() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * 0.8;
    ref.current.children.forEach((c, i) => {
      if (c.material) c.material.opacity = 0.4 + Math.sin(clock.getElapsedTime() * 3 + i) * 0.3;
    });
  });
  return (
    <group ref={ref} position={[0, 0.82, 0.62]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.09, 0.11, 32]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={6} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.065, 32]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={6} transparent opacity={0.6} />
      </mesh>
      {/* Cross hairs */}
      {[[0.13, 0, 0], [-0.13, 0, 0], [0, 0.13, 0], [0, -0.13, 0]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[i < 2 ? 0.04 : 0.004, i < 2 ? 0.004 : 0.04, 0.001]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={6} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── The Human Head ─── */
function HumanHead() {
  const group = useRef();
  const { mouse } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.3) * 0.25 + mouse.x * 0.18;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.06 - mouse.y * 0.08;
    group.current.position.y = Math.sin(t * 0.4) * 0.08;
  });

  // Visible skin — warm beige/tan that reads clearly on dark bg
  const skinMat = (
    <meshStandardMaterial color="#c8956c" metalness={0.05} roughness={0.75}
      emissive="#7a3d1a" emissiveIntensity={0.35} />
  );
  const darkMat = (
    <meshStandardMaterial color="#3a1a0a" metalness={0.05} roughness={0.9} />
  );

  return (
    <group ref={group}>

      {/* ══ CRANIUM (main skull dome) ══ */}
      <mesh position={[0, 0.28, 0]} scale={[1, 1.12, 0.98]}>
        <sphereGeometry args={[0.72, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.72]} />
        {skinMat}
      </mesh>

      {/* ══ FACE (front flattened ellipsoid) ══ */}
      <mesh position={[0, -0.02, 0.12]} scale={[0.68, 0.88, 0.52]}>
        <sphereGeometry args={[0.72, 48, 48]} />
        {skinMat}
      </mesh>

      {/* ══ FOREHEAD ══ */}
      <mesh position={[0, 0.55, 0.38]} scale={[0.62, 0.28, 0.38]}>
        <sphereGeometry args={[0.72, 32, 32]} />
        {skinMat}
      </mesh>

      {/* ══ CHEEKS ══ */}
      {[-0.32, 0.32].map((x, i) => (
        <mesh key={i} position={[x, 0.0, 0.42]} scale={[0.38, 0.32, 0.28]}>
          <sphereGeometry args={[0.72, 24, 24]} />
          {skinMat}
        </mesh>
      ))}

      {/* ══ NOSE ══ */}
      <mesh position={[0, 0.08, 0.62]} scale={[0.13, 0.22, 0.18]}>
        <sphereGeometry args={[0.72, 24, 24]} />
        {skinMat}
      </mesh>
      {/* Nose tip */}
      <mesh position={[0, -0.02, 0.68]} scale={[0.1, 0.08, 0.1]}>
        <sphereGeometry args={[0.72, 16, 16]} />
        {skinMat}
      </mesh>
      {/* Nostrils */}
      {[-0.1, 0.1].map((x, i) => (
        <mesh key={i} position={[x, -0.06, 0.65]} scale={[0.06, 0.05, 0.06]}>
          <sphereGeometry args={[0.72, 12, 12]} />
          {darkMat}
        </mesh>
      ))}

      {/* ══ LIPS ══ */}
      <mesh position={[0, -0.2, 0.6]} scale={[0.22, 0.055, 0.1]}>
        <sphereGeometry args={[0.72, 24, 24]} />
        <meshStandardMaterial color="#c0504a" metalness={0.1} roughness={0.7} emissive="#7a1a18" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, -0.26, 0.58]} scale={[0.18, 0.05, 0.09]}>
        <sphereGeometry args={[0.72, 24, 24]} />
        <meshStandardMaterial color="#a03030" metalness={0.1} roughness={0.7} emissive="#601010" emissiveIntensity={0.3} />
      </mesh>

      {/* ══ CHIN ══ */}
      <mesh position={[0, -0.42, 0.42]} scale={[0.3, 0.22, 0.28]}>
        <sphereGeometry args={[0.72, 24, 24]} />
        {skinMat}
      </mesh>

      {/* ══ JAW LINE ══ */}
      {[-0.38, 0.38].map((x, i) => (
        <mesh key={i} position={[x, -0.3, 0.22]} scale={[0.22, 0.35, 0.22]}>
          <sphereGeometry args={[0.72, 20, 20]} />
          {skinMat}
        </mesh>
      ))}

      {/* ══ EARS ══ */}
      {[-0.72, 0.72].map((x, i) => (
        <group key={i} position={[x, 0.08, 0]}>
          <mesh scale={[0.14, 0.22, 0.1]}>
            <sphereGeometry args={[0.72, 20, 20]} />
            {skinMat}
          </mesh>
          {/* Ear canal */}
          <mesh position={[i === 0 ? 0.06 : -0.06, 0, 0]} scale={[0.05, 0.1, 0.06]}>
            <sphereGeometry args={[0.72, 12, 12]} />
            {darkMat}
          </mesh>
        </group>
      ))}

      {/* ══ NECK ══ */}
      <mesh position={[0, -0.82, 0.05]}>
        <cylinderGeometry args={[0.22, 0.26, 0.55, 24]} />
        {skinMat}
      </mesh>

      {/* ══ EYE SOCKETS ══ */}
      {[-0.26, 0.26].map((x, i) => (
        <group key={i} position={[x, 0.2, 0.56]}>
          {/* Socket shadow */}
          <mesh scale={[0.18, 0.13, 0.1]}>
            <sphereGeometry args={[0.72, 20, 20]} />
            <meshStandardMaterial color="#5a2a10" metalness={0.1} roughness={0.9} />
          </mesh>
          {/* Eyeball white */}
          <mesh position={[0, 0, 0.04]} scale={[0.12, 0.1, 0.08]}>
            <sphereGeometry args={[0.72, 20, 20]} />
            <meshStandardMaterial color="#f0eaf8" metalness={0} roughness={0.4} emissive="#ffffff" emissiveIntensity={0.15} />
          </mesh>
          {/* Iris — glowing cyan for AR look */}
          <mesh position={[0, 0, 0.1]} scale={[0.065, 0.065, 0.04]}>
            <sphereGeometry args={[0.72, 16, 16]} />
            <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} />
          </mesh>
          {/* Pupil */}
          <mesh position={[0, 0, 0.13]} scale={[0.028, 0.028, 0.02]}>
            <sphereGeometry args={[0.72, 12, 12]} />
            <meshStandardMaterial color="#050010" />
          </mesh>
          {/* Eyebrow */}
          <mesh position={[0, 0.16, 0.02]} rotation={[0, 0, i === 0 ? 0.15 : -0.15]}
            scale={[0.18, 0.028, 0.04]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#3a1a08" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* ══ HAIR (top dome cap) ══ */}
      <mesh position={[0, 0.55, -0.05]} scale={[0.74, 0.42, 0.76]}>
        <sphereGeometry args={[0.72, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <meshStandardMaterial color="#1a0a04" metalness={0.4} roughness={0.6}
          emissive="#3a1a08" emissiveIntensity={0.4} />
      </mesh>
      {/* Hair sides */}
      {[-0.68, 0.68].map((x, i) => (
        <mesh key={i} position={[x, 0.22, -0.08]} scale={[0.18, 0.55, 0.62]}>
          <sphereGeometry args={[0.72, 20, 20]} />
          <meshStandardMaterial color="#1a0a04" metalness={0.4} roughness={0.6} emissive="#3a1a08" emissiveIntensity={0.3} />
        </mesh>
      ))}

      {/* ══ AR NEON FACE OUTLINE GLOW ══ */}
      {/* Forehead scan glow */}
      <mesh position={[0, 0.62, 0.42]} rotation={[0.3, 0, 0]}>
        <planeGeometry args={[0.9, 0.04]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={5}
          transparent opacity={0.5} />
      </mesh>
      {/* Cheekbone lines */}
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={i} position={[x, 0.05, 0.5]} rotation={[0, i === 0 ? 0.4 : -0.4, 0]}>
          <planeGeometry args={[0.3, 0.008]} />
          <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={6}
            transparent opacity={0.7} />
        </mesh>
      ))}
      {/* Jaw line glow */}
      <mesh position={[0, -0.48, 0.38]} rotation={[0.3, 0, 0]}>
        <planeGeometry args={[0.65, 0.008]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={5}
          transparent opacity={0.6} />
      </mesh>

      {/* ══ AR GLASSES ══ */}
      <ARGlasses />

      {/* ══ TARGETING RETICLE ══ */}
      <TargetReticle />

      {/* ══ FACE SCAN LINE ══ */}
      <FaceScanLine />

      {/* ══ HUD PANELS ══ */}
      <HUDPanel position={[-1.35, 0.3, 0.1]}  color="#22d3ee" lines={5} width={0.6} height={0.42} />
      <HUDPanel position={[1.35, 0.3, 0.1]}   color="#a855f7" lines={4} width={0.55} height={0.38} />
      <HUDPanel position={[-1.3, -0.45, 0.1]} color="#3b82f6" lines={3} width={0.5} height={0.28} />
      <HUDPanel position={[1.3, -0.45, 0.1]}  color="#ec4899" lines={3} width={0.5} height={0.28} />

      {/* ══ CONNECTOR LINES from HUD to face ══ */}
      <Line points={[[-1.05, 0.3, 0.1], [-0.72, 0.2, 0.5]]}  color="#22d3ee" lineWidth={1} transparent opacity={0.5} />
      <Line points={[[1.05, 0.3, 0.1],  [0.72, 0.2, 0.5]]}   color="#a855f7" lineWidth={1} transparent opacity={0.5} />
      <Line points={[[-1.05, -0.45, 0.1], [-0.5, -0.3, 0.5]]} color="#3b82f6" lineWidth={1} transparent opacity={0.5} />
      <Line points={[[1.05, -0.45, 0.1],  [0.5, -0.3, 0.5]]}  color="#ec4899" lineWidth={1} transparent opacity={0.5} />

      {/* ══ ORBIT RINGS ══ */}
      <OrbitRing radius={1.55} speed={0.5}  color="#a855f7" rx={Math.PI / 8} />
      <OrbitRing radius={1.85} speed={-0.35} color="#22d3ee" rx={-Math.PI / 6} ry={Math.PI / 7} />
      <OrbitRing radius={1.25} speed={0.75} color="#3b82f6" rx={Math.PI / 2.5} />

      {/* ══ FLOATING DATA NODES ══ */}
      {[
        [-1.7, 0.9, 0.2, '#22d3ee'],
        [1.8, 0.7, 0.1, '#a855f7'],
        [0, 1.5, -0.2, '#3b82f6'],
        [-1.6, -0.8, 0.1, '#ec4899'],
        [1.7, -0.7, 0.2, '#22d3ee'],
      ].map(([x, y, z, color], i) => {
        const NodeDot = () => {
          const r = useRef();
          useFrame(({ clock }) => {
            r.current.position.y = y + Math.sin(clock.getElapsedTime() * 0.8 + i) * 0.1;
            r.current.material.emissiveIntensity = 3 + Math.sin(clock.getElapsedTime() * 2 + i) * 1.5;
          });
          return (
            <mesh ref={r} position={[x, y, z]}>
              <sphereGeometry args={[0.045, 16, 16]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
            </mesh>
          );
        };
        return <NodeDot key={i} />;
      })}
    </group>
  );
}

/* ─── Canvas export ─── */
export default function VRModel() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.1, 3.8], fov: 44 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Strong white key light from front-top to illuminate the face */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[0, 2, 5]}   intensity={4}   color="#ffe8d0" />
        <directionalLight position={[-2, 1, 3]}  intensity={2}   color="#ffd0a0" />
        <pointLight       position={[0, 3, 4]}   intensity={6}   color="#ffffff" />
        <pointLight       position={[-3, 2, 4]}  intensity={3}   color="#a855f7" />
        <pointLight       position={[3, -1, 3]}  intensity={2.5} color="#22d3ee" />
        <spotLight        position={[0, 4, 5]}   intensity={5}   color="#ffe0c0" angle={0.5} penumbra={0.8} />

        <Particles />
        <Stars radius={30} depth={20} count={700} factor={2} fade speed={0.4} />

        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.3}>
          <HumanHead />
        </Float>
      </Canvas>
    </div>
  );
}
