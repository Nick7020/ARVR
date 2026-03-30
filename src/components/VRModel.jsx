import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, Torus, RoundedBox, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

/* ─── Neon orbit ring ─── */
function OrbitRing({ radius, speed, color, rx = 0, ry = 0, rz = 0 }) {
  const ref = useRef();
  useFrame(({ clock }) => { ref.current.rotation.z = clock.getElapsedTime() * speed; });
  return (
    <group ref={ref} rotation={[rx, ry, rz]}>
      <Torus args={[radius, 0.008, 16, 128]}>
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={4} transparent opacity={0.8} />
      </Torus>
    </group>
  );
}

/* ─── Spinning wireframe cube ─── */
function WireCube({ position, size, color, speed }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.x = t;
    ref.current.rotation.y = t * 0.7;
    ref.current.position.y = position[1] + Math.sin(t) * 0.12;
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} wireframe transparent opacity={0.7} />
    </mesh>
  );
}

/* ─── Holographic scan sweep ─── */
function ScanLine() {
  const ref = useRef();
  useFrame(({ clock }) => {
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.7) * 0.9;
    ref.current.material.opacity = 0.06 + Math.abs(Math.sin(clock.getElapsedTime() * 0.7)) * 0.07;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[4, 4]} />
      <meshStandardMaterial color="#22d3ee" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ─── Particle cloud ─── */
function Particles() {
  const ref = useRef();
  const geo = useMemo(() => {
    const pos = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 9;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 9;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 9;
    }
    return pos;
  }, []);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.getElapsedTime() * 0.03; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geo, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#a855f7" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

/* ─── The actual VR Headset ─── */
function VRHeadset() {
  const group   = useRef();
  const lensL   = useRef();
  const lensR   = useRef();
  const glowL   = useRef();
  const glowR   = useRef();
  const { mouse } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.35) * 0.35 + mouse.x * 0.12;
    group.current.rotation.x = Math.sin(t * 0.25) * 0.07 - mouse.y * 0.07;
    group.current.position.y = Math.sin(t * 0.45) * 0.1;

    const pulse = 1.8 + Math.sin(t * 2.2) * 0.9;
    lensL.current.material.emissiveIntensity = pulse;
    lensR.current.material.emissiveIntensity = pulse + Math.sin(t * 2.2 + 0.6) * 0.4;
    glowL.current.material.opacity = 0.25 + Math.sin(t * 2.2) * 0.15;
    glowR.current.material.opacity = 0.25 + Math.sin(t * 2.2 + 0.6) * 0.15;
  });

  /* shared materials */
  const bodyMat   = <meshStandardMaterial color="#0c0020" metalness={0.95} roughness={0.08} envMapIntensity={1} />;
  const rubberMat = <meshStandardMaterial color="#080015" metalness={0.2} roughness={0.9} />;

  return (
    <group ref={group} scale={1.05}>

      {/* ══ MAIN BODY — wide rounded box ══ */}
      <RoundedBox args={[2.4, 1.0, 0.72]} radius={0.18} smoothness={6} position={[0, 0, 0]}>
        {bodyMat}
      </RoundedBox>

      {/* Front face plate (slightly proud) */}
      <RoundedBox args={[2.28, 0.88, 0.08]} radius={0.12} smoothness={4} position={[0, 0, 0.36]}>
        <meshStandardMaterial color="#100030" metalness={0.98} roughness={0.04} />
      </RoundedBox>

      {/* ══ NEON EDGE TRIM — top & bottom ══ */}
      {[0.5, -0.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[2.42, 0.025, 0.74]} />
          <meshStandardMaterial color={i === 0 ? '#a855f7' : '#22d3ee'}
            emissive={i === 0 ? '#a855f7' : '#22d3ee'} emissiveIntensity={5} />
        </mesh>
      ))}
      {/* Side trim */}
      {[-1.21, 1.21].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <boxGeometry args={[0.025, 1.02, 0.74]} />
          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={4} />
        </mesh>
      ))}

      {/* ══ LEFT LENS ASSEMBLY ══ */}
      {/* Outer housing ring */}
      <mesh position={[-0.62, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.045, 20, 64]} />
        <meshStandardMaterial color="#0a001e" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Lens glass */}
      <mesh ref={lensL} position={[-0.62, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.255, 64]} />
        <meshStandardMaterial color="#1d4ed8" emissive="#3b82f6" emissiveIntensity={1.8}
          transparent opacity={0.92} metalness={0.3} roughness={0} />
      </mesh>
      {/* Inner glow disc */}
      <mesh ref={glowL} position={[-0.62, 0, 0.435]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 64]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={6}
          transparent opacity={0.3} />
      </mesh>
      {/* Lens inner ring accent */}
      <mesh position={[-0.62, 0, 0.44]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.19, 0.255, 64]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={8}
          transparent opacity={0.5} />
      </mesh>

      {/* ══ RIGHT LENS ASSEMBLY ══ */}
      <mesh position={[0.62, 0, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.045, 20, 64]} />
        <meshStandardMaterial color="#0a001e" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh ref={lensR} position={[0.62, 0, 0.42]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.255, 64]} />
        <meshStandardMaterial color="#1d4ed8" emissive="#3b82f6" emissiveIntensity={1.8}
          transparent opacity={0.92} metalness={0.3} roughness={0} />
      </mesh>
      <mesh ref={glowR} position={[0.62, 0, 0.435]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.18, 64]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={6}
          transparent opacity={0.3} />
      </mesh>
      <mesh position={[0.62, 0, 0.44]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.19, 0.255, 64]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={8}
          transparent opacity={0.5} />
      </mesh>

      {/* ══ NOSE BRIDGE ══ */}
      <RoundedBox args={[0.28, 0.22, 0.1]} radius={0.06} smoothness={4} position={[0, -0.08, 0.4]}>
        {rubberMat}
      </RoundedBox>

      {/* ══ FACE GASKET / FOAM PADDING ══ */}
      <mesh position={[0, 0, -0.36]}>
        <torusGeometry args={[0.82, 0.09, 10, 80, Math.PI * 1.6]} />
        <meshStandardMaterial color="#0a0018" metalness={0.1} roughness={0.95} />
      </mesh>

      {/* ══ LEFT STRAP ARM ══ */}
      <RoundedBox args={[0.7, 0.28, 0.1]} radius={0.06} smoothness={4}
        position={[-1.52, 0, -0.12]} rotation={[0, 0.18, 0]}>
        {bodyMat}
      </RoundedBox>
      {/* Left strap glow line */}
      <mesh position={[-1.52, 0.14, -0.12]} rotation={[0, 0.18, 0]}>
        <boxGeometry args={[0.72, 0.012, 0.11]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={4} />
      </mesh>

      {/* ══ RIGHT STRAP ARM ══ */}
      <RoundedBox args={[0.7, 0.28, 0.1]} radius={0.06} smoothness={4}
        position={[1.52, 0, -0.12]} rotation={[0, -0.18, 0]}>
        {bodyMat}
      </RoundedBox>
      <mesh position={[1.52, 0.14, -0.12]} rotation={[0, -0.18, 0]}>
        <boxGeometry args={[0.72, 0.012, 0.11]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={4} />
      </mesh>

      {/* ══ TOP HEAD STRAP ══ */}
      <RoundedBox args={[0.2, 0.62, 0.08]} radius={0.05} smoothness={4}
        position={[0, 0.62, -0.18]} rotation={[0.35, 0, 0]}>
        {bodyMat}
      </RoundedBox>

      {/* ══ POWER BUTTON (right side) ══ */}
      <mesh position={[1.22, -0.28, 0.05]}>
        <cylinderGeometry args={[0.045, 0.045, 0.07, 20]} />
        <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={8} />
      </mesh>

      {/* ══ VOLUME ROCKER (left side) ══ */}
      {[-0.08, 0.08].map((y, i) => (
        <mesh key={i} position={[-1.22, y, 0.05]}>
          <boxGeometry args={[0.05, 0.1, 0.14]} />
          <meshStandardMaterial color="#1a0040" metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* ══ FRONT CAMERA DOTS ══ */}
      {[[-0.85, 0.3, 0.41], [0.85, 0.3, 0.41], [0, 0.3, 0.41]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshStandardMaterial color="#0a001e" metalness={0.95} roughness={0.05}
            emissive="#1a0040" emissiveIntensity={1} />
        </mesh>
      ))}

      {/* ══ ORBIT RINGS ══ */}
      <OrbitRing radius={1.6} speed={0.55}  color="#a855f7" rx={Math.PI / 7} />
      <OrbitRing radius={1.95} speed={-0.38} color="#22d3ee" rx={-Math.PI / 6} ry={Math.PI / 8} />
      <OrbitRing radius={1.3} speed={0.85}  color="#3b82f6" rx={Math.PI / 2.2} />

      {/* ══ SCAN SWEEP ══ */}
      <ScanLine />

      {/* ══ FLOATING CUBES ══ */}
      <WireCube position={[-2.0, 0.7, 0.2]}  size={0.17} color="#a855f7" speed={0.75} />
      <WireCube position={[2.1, -0.55, 0.1]} size={0.13} color="#22d3ee" speed={1.05} />
      <WireCube position={[0.3, 1.2, -0.4]}  size={0.11} color="#3b82f6" speed={0.6}  />
      <WireCube position={[-0.9, -1.1, 0.5]} size={0.09} color="#ec4899" speed={1.2}  />
    </group>
  );
}

/* ─── Canvas export ─── */
export default function VRModel() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0.2, 4.8], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.15} />
        <pointLight position={[-4, 3, 4]}  intensity={4}   color="#a855f7" />
        <pointLight position={[4, -2, 3]}  intensity={3}   color="#22d3ee" />
        <pointLight position={[0, 2, 5]}   intensity={1.5} color="#3b82f6" />
        <spotLight  position={[0, 6, 4]}   intensity={3}   color="#ffffff" angle={0.35} penumbra={1} castShadow />

        <Particles />
        <Stars radius={35} depth={25} count={900} factor={2} fade speed={0.4} />

        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.35}>
          <VRHeadset />
        </Float>
      </Canvas>
    </div>
  );
}
