import { Suspense, useCallback, useMemo, useRef } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber/native';
import * as THREE from 'three';
import { VehicleType } from '../hooks/useJourneyController';

type CinematicSceneProps = {
  isMoving: boolean;
  sceneTravel: number;
  vehicle: VehicleType;
};

const orbitRef = { thetaOffset: 0, phiOffset: 0, dragging: false };

export function CinematicScene({ isMoving, sceneTravel, vehicle }: CinematicSceneProps) {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        orbitRef.dragging = true;
      },
      onPanResponderMove: (_, gesture) => {
        orbitRef.thetaOffset += gesture.dx * 0.004;
        orbitRef.phiOffset -= gesture.dy * 0.003;
        orbitRef.phiOffset = Math.max(-0.25, Math.min(0.7, orbitRef.phiOffset));
      },
      onPanResponderRelease: () => {
        orbitRef.dragging = false;
      },
      onPanResponderTerminate: () => {
        orbitRef.dragging = false;
      },
    })
  ).current;

  return (
    <View style={styles.wrapper} {...panResponder.panHandlers}>
      <Canvas
        style={styles.canvas}
        camera={{ position: [-10, 4, 0], fov: 56 }}
        gl={{ antialias: false }}
      >
        <color attach="background" args={['#c8e4f6']} />
        <fog attach="fog" args={['#d4eeff', 35, 140]} />

        <ambientLight intensity={1.0} />
        <hemisphereLight args={['#fff8e0', '#88c8e8', 1.6]} />
        <directionalLight
          castShadow
          intensity={2.8}
          position={[25, 30, 10]}
          color="#fff4d8"
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
        <directionalLight intensity={0.5} position={[-15, 12, -10]} color="#b8e0ff" />

        <Suspense fallback={null}>
          <BehindCamera heroX={sceneTravel} isMoving={isMoving} />
          <Sky heroX={sceneTravel} />
          <DestinationMountain heroX={sceneTravel} />
          <FrozenGround heroX={sceneTravel} />
          <IceRoad heroX={sceneTravel} />
          <FrozenSea heroX={sceneTravel} />
          <Icebergs heroX={sceneTravel} />
          <SideMountains heroX={sceneTravel} />
          <FarRidgeline heroX={sceneTravel} />
          <IceCrystals heroX={sceneTravel} />
          <FrozenPools heroX={sceneTravel} />
          <SnowParticles heroX={sceneTravel} />
          <Hero sceneTravel={sceneTravel} isMoving={isMoving} />
          <TargetPenguin heroX={sceneTravel} />
          <SupportVehicle heroX={sceneTravel} isMoving={isMoving} vehicle={vehicle} />
        </Suspense>
      </Canvas>
    </View>
  );
}

/* ── Camera: directly behind hero, looking straight down the road ── */

function BehindCamera({ heroX, isMoving }: { heroX: number; isMoving: boolean }) {
  const { camera } = useThree();
  const smoothTheta = useRef(0);
  const smoothPhi = useRef(0.22);
  const smoothPos = useRef(new THREE.Vector3());
  const lookAt = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const radius = isMoving ? 8 : 11;
    const basePhi = isMoving ? 0.2 : 0.28;
    const lookAhead = isMoving ? 20 : 14;
    const lookHeight = isMoving ? 1.8 : 2.5;

    if (!orbitRef.dragging) {
      orbitRef.thetaOffset *= 0.93;
      orbitRef.phiOffset *= 0.93;
    }

    const lerpSpeed = 1 - Math.exp(-delta * 3.2);
    smoothTheta.current += (orbitRef.thetaOffset - smoothTheta.current) * lerpSpeed;
    smoothPhi.current += (basePhi + orbitRef.phiOffset - smoothPhi.current) * lerpSpeed;

    const theta = smoothTheta.current;
    const phi = smoothPhi.current;

    // Behind hero: negative X offset, orbit theta rotates around Y
    const cx = heroX - radius * Math.cos(phi) * Math.cos(theta);
    const cy = radius * Math.sin(phi) + 2.0;
    const cz = radius * Math.cos(phi) * Math.sin(theta);

    smoothPos.current.set(cx, cy, cz);
    camera.position.lerp(smoothPos.current, lerpSpeed);

    lookAt.current.set(heroX + lookAhead, lookHeight, 0);
    camera.lookAt(lookAt.current);
  });

  return null;
}

/* ── Sky + Sun ── */

function Sky({ heroX }: { heroX: number }) {
  return (
    <group>
      {/* Sun positioned ahead and high, so it illuminates the mountain */}
      <group position={[heroX + 100, 28, -15]}>
        <mesh>
          <sphereGeometry args={[5, 32, 32]} />
          <meshBasicMaterial color="#fff8d0" transparent opacity={0.9} />
        </mesh>
        <mesh>
          <sphereGeometry args={[10, 24, 24]} />
          <meshBasicMaterial color="#fffae0" transparent opacity={0.1} />
        </mesh>
        <mesh>
          <sphereGeometry args={[18, 16, 16]} />
          <meshBasicMaterial color="#fff5c8" transparent opacity={0.04} />
        </mesh>
      </group>
    </group>
  );
}

/* ── THE destination mountain — one massive peak straight ahead ── */

function DestinationMountain({ heroX }: { heroX: number }) {
  const mountainX = heroX + 90;

  return (
    <group position={[mountainX, 0, 0]}>
      {/* Main massive peak */}
      <mesh castShadow>
        <coneGeometry args={[22, 48, 7]} />
        <meshStandardMaterial color="#b8d8ec" roughness={0.35} metalness={0.08} />
      </mesh>
      {/* Snow cap layer */}
      <mesh position={[0, 18, 0]}>
        <coneGeometry args={[12, 20, 7]} />
        <meshStandardMaterial color="#dceef8" roughness={0.2} metalness={0.15} />
      </mesh>
      {/* Summit ice crown */}
      <mesh position={[0, 26, 0]}>
        <octahedronGeometry args={[6, 0]} />
        <meshStandardMaterial color="#f0faff" roughness={0.08} metalness={0.35} />
      </mesh>
      {/* Summit glow beacon */}
      <mesh position={[0, 32, 0]}>
        <sphereGeometry args={[1.5, 12, 12]} />
        <meshBasicMaterial color="#fff8d0" transparent opacity={0.4} />
      </mesh>

      {/* Flanking shoulder peaks — left */}
      <mesh position={[-18, 0, -8]} castShadow>
        <coneGeometry args={[14, 32, 6]} />
        <meshStandardMaterial color="#c0ddef" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[-18, 12, -8]}>
        <coneGeometry args={[7, 14, 5]} />
        <meshStandardMaterial color="#ddf0fa" roughness={0.18} metalness={0.18} />
      </mesh>

      {/* Flanking shoulder peaks — right */}
      <mesh position={[-14, 0, 12]} castShadow>
        <coneGeometry args={[12, 28, 6]} />
        <meshStandardMaterial color="#c4e0f0" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[-14, 10, 12]}>
        <coneGeometry args={[6, 12, 5]} />
        <meshStandardMaterial color="#e0f2fa" roughness={0.18} metalness={0.16} />
      </mesh>

      {/* Outer range — wider spread */}
      <mesh position={[-30, 0, -20]} castShadow>
        <coneGeometry args={[10, 22, 5]} />
        <meshStandardMaterial color="#c8e2f0" roughness={0.32} metalness={0.08} />
      </mesh>
      <mesh position={[-25, 0, 22]} castShadow>
        <coneGeometry args={[11, 24, 5]} />
        <meshStandardMaterial color="#c4dfe8" roughness={0.32} metalness={0.08} />
      </mesh>

      {/* Base glacier / ice shelf at the foot of the mountain */}
      <mesh position={[-20, 1.5, 0]}>
        <boxGeometry args={[30, 4, 50]} />
        <meshStandardMaterial color="#d0eaf6" roughness={0.25} metalness={0.12} />
      </mesh>
    </group>
  );
}

/* ── Frozen ground ── */

function FrozenGround({ heroX }: { heroX: number }) {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[heroX + 20, -0.6, 0]}>
        <planeGeometry args={[300, 200]} />
        <meshStandardMaterial color="#e2f0fa" metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[heroX + 20, -0.55, 0]}>
        <planeGeometry args={[300, 200]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.12} metalness={0.6} roughness={0.05} />
      </mesh>
    </group>
  );
}

/* ── Glossy ice road ── */

function IceRoad({ heroX }: { heroX: number }) {
  const segLen = 30;
  const base = Math.floor(heroX / segLen) - 2;
  const segments = useMemo(() => Array.from({ length: 8 }, (_, i) => base + i), [base]);

  return (
    <group>
      {segments.map((seg) => {
        const x = seg * segLen + segLen / 2;
        return (
          <group key={seg}>
            <mesh receiveShadow position={[x, -0.38, 0]}>
              <boxGeometry args={[segLen + 1, 0.16, 4.5]} />
              <meshStandardMaterial color="#c0e0f5" metalness={0.45} roughness={0.1} />
            </mesh>
            {/* Edge lines */}
            <mesh position={[x, -0.28, 2.3]}>
              <boxGeometry args={[segLen + 1, 0.06, 0.1]} />
              <meshStandardMaterial color="#9cd0e8" metalness={0.3} roughness={0.15} />
            </mesh>
            <mesh position={[x, -0.28, -2.3]}>
              <boxGeometry args={[segLen + 1, 0.06, 0.1]} />
              <meshStandardMaterial color="#9cd0e8" metalness={0.3} roughness={0.15} />
            </mesh>
            {/* Center dashes */}
            {[0, 6, 12, 18, 24].map((offset) => (
              <mesh key={offset} position={[seg * segLen + offset + 1.5, -0.27, 0]}>
                <boxGeometry args={[2, 0.04, 0.14]} />
                <meshStandardMaterial color="#a8d8f0" metalness={0.4} roughness={0.1} />
              </mesh>
            ))}
          </group>
        );
      })}
    </group>
  );
}

/* ── Frozen sea on both sides ── */

function FrozenSea({ heroX }: { heroX: number }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[heroX + 20, -0.72, -20]}>
        <planeGeometry args={[300, 35]} />
        <meshStandardMaterial color="#88c4e4" metalness={0.6} roughness={0.06} transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[heroX + 20, -0.72, 20]}>
        <planeGeometry args={[300, 35]} />
        <meshStandardMaterial color="#8cc8e6" metalness={0.6} roughness={0.06} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

/* ── Icebergs in the frozen sea ── */

function Icebergs({ heroX }: { heroX: number }) {
  const segLen = 22;
  const base = Math.floor(heroX / segLen) - 2;
  const segments = useMemo(() => Array.from({ length: 9 }, (_, i) => base + i), [base]);

  return (
    <group>
      {segments.map((seg) => {
        const sx = seg * segLen;
        const seed = Math.abs(sx * 137 + 42) % 1000;
        return Array.from({ length: 4 }, (_, i) => {
          const h = ((seed + i * 83) * 67) % 997;
          const side = i < 2 ? -1 : 1;
          const x = sx + (h % 18) + 2;
          const z = side * (12 + (h % 14));
          const scale = 1 + (h % 5) * 0.5;
          const height = 2.5 + (h % 7) * 0.6;
          return (
            <group key={`${seg}-ib-${i}`} position={[x, -0.3, z]}>
              <mesh castShadow>
                <coneGeometry args={[scale, height, 5]} />
                <meshStandardMaterial color="#d4ecf8" roughness={0.18} metalness={0.2} />
              </mesh>
              <mesh position={[0, height * 0.28, 0]}>
                <octahedronGeometry args={[scale * 0.55, 0]} />
                <meshStandardMaterial color="#e8f6ff" roughness={0.1} metalness={0.3} transparent opacity={0.9} />
              </mesh>
            </group>
          );
        });
      })}
    </group>
  );
}

/* ── Mountains along both sides of the road ── */

function SideMountains({ heroX }: { heroX: number }) {
  const segLen = 16;
  const base = Math.floor(heroX / segLen) - 2;
  const segments = useMemo(() => Array.from({ length: 12 }, (_, i) => base + i), [base]);

  return (
    <group>
      {segments.map((seg) => {
        const sx = seg * segLen;
        const seed = Math.abs(sx * 53 + 17) % 500;
        return Array.from({ length: 4 }, (_, i) => {
          const h = ((seed + i * 41) * 79) % 499;
          const side = i % 2 === 0 ? -1 : 1;
          const x = sx + (h % 12) + 2;
          const z = side * (6 + (h % 6));
          const height = 3.5 + (h % 8);
          const s = 1.5 + (h % 3) * 0.6;
          return (
            <group key={`${seg}-sm-${i}`} position={[x, 0, z]}>
              <mesh castShadow receiveShadow>
                <coneGeometry args={[s, height, 6]} />
                <meshStandardMaterial color="#c8e4f2" roughness={0.3} metalness={0.1} />
              </mesh>
              <mesh position={[0, height * 0.35, 0]}>
                <octahedronGeometry args={[s * 0.45, 0]} />
                <meshStandardMaterial color="#ecf8ff" roughness={0.1} metalness={0.25} />
              </mesh>
            </group>
          );
        });
      })}
    </group>
  );
}

/* ── Distant ridgeline backdrop ── */

function FarRidgeline({ heroX }: { heroX: number }) {
  const segLen = 30;
  const base = Math.floor(heroX / segLen) - 2;
  const segments = useMemo(() => Array.from({ length: 8 }, (_, i) => base + i), [base]);

  return (
    <group>
      {segments.map((seg) => {
        const sx = seg * segLen;
        const seed = Math.abs(sx * 101) % 700;
        return Array.from({ length: 6 }, (_, i) => {
          const h = ((seed + i * 59) * 113) % 699;
          const side = i % 2 === 0 ? -1 : 1;
          const x = sx + (h % 24) + 3;
          const z = side * (30 + (h % 18));
          const height = 12 + (h % 16);
          const s = 3.5 + (h % 5) * 1.0;
          return (
            <group key={`${seg}-fr-${i}`} position={[x, 0, z]}>
              <mesh>
                <coneGeometry args={[s * 2.5, height, 5]} />
                <meshStandardMaterial color="#bed8ea" roughness={0.35} metalness={0.08} />
              </mesh>
              <mesh position={[0, height * 0.38, 0]}>
                <coneGeometry args={[s * 1.2, height * 0.35, 5]} />
                <meshStandardMaterial color="#d8edf8" roughness={0.2} metalness={0.15} />
              </mesh>
            </group>
          );
        });
      })}
    </group>
  );
}

/* ── Ice crystals near road ── */

function IceCrystals({ heroX }: { heroX: number }) {
  const segLen = 14;
  const base = Math.floor(heroX / segLen) - 2;
  const segments = useMemo(() => Array.from({ length: 12 }, (_, i) => base + i), [base]);

  return (
    <group>
      {segments.map((seg) => {
        const sx = seg * segLen;
        const hash = Math.abs(sx * 71) % 500;
        return Array.from({ length: 4 }, (_, i) => {
          const h2 = ((hash + i * 53) * 97) % 499;
          const side = i % 2 === 0 ? 1 : -1;
          const x = sx + (h2 % 10) + 2;
          const z = side * (3.0 + (h2 % 3));
          const scale = 0.2 + (h2 % 5) * 0.1;
          return (
            <group key={`${seg}-cr-${i}`} position={[x, scale * 0.5, z]}>
              <mesh castShadow>
                <octahedronGeometry args={[scale, 0]} />
                <meshStandardMaterial color="#b0e0ff" metalness={0.55} roughness={0.05} transparent opacity={0.8} />
              </mesh>
            </group>
          );
        });
      })}
    </group>
  );
}

/* ── Frozen water pools ── */

function FrozenPools({ heroX }: { heroX: number }) {
  const segLen = 20;
  const base = Math.floor(heroX / segLen) - 2;
  const segments = useMemo(() => Array.from({ length: 8 }, (_, i) => base + i), [base]);

  return (
    <group>
      {segments.map((seg) => {
        const sx = seg * segLen;
        const h = Math.abs(sx * 89) % 300;
        const side = seg % 2 === 0 ? 1 : -1;
        const x = sx + (h % 14) + 3;
        const z = side * (7 + (h % 5));
        const radius = 1.5 + (h % 4);
        return (
          <group key={`pool-${seg}`}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.54, z]}>
              <circleGeometry args={[radius, 20]} />
              <meshStandardMaterial color="#78bce0" metalness={0.65} roughness={0.04} transparent opacity={0.7} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.52, z]}>
              <ringGeometry args={[radius, radius + 0.35, 20]} />
              <meshStandardMaterial color="#d4eafa" metalness={0.3} roughness={0.2} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/* ── Snowfall ── */

function SnowParticles({ heroX }: { heroX: number }) {
  const count = 500;
  const ref = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = Math.random() * 24;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      vel[i * 3] = (Math.random() - 0.5) * 0.4;
      vel[i * 3 + 1] = -(0.3 + Math.random() * 0.6);
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.25;
    }
    return [pos, vel];
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += velocities[i * 3] * delta;
      arr[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      arr[i * 3 + 2] += velocities[i * 3 + 2] * delta;
      if (arr[i * 3 + 1] < -1) {
        arr[i * 3] = heroX + (Math.random() - 0.5) * 80;
        arr[i * 3 + 1] = 18 + Math.random() * 8;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 60;
      }
    }
    ref.current.position.x = heroX;
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.14} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ── Hero (the walker) ── */

function Hero({ isMoving, sceneTravel }: { isMoving: boolean; sceneTravel: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const bob = isMoving ? Math.sin(t * 8) * 0.09 : Math.sin(t * 1.2) * 0.02;
    const sway = isMoving ? Math.sin(t * 4) * 0.04 : 0;
    groupRef.current.position.set(sceneTravel, bob, 0);
    groupRef.current.rotation.z = sway;
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow position={[0, 1.3, 0]}>
        <capsuleGeometry args={[0.28, 0.72, 8, 12]} />
        <meshStandardMaterial color="#ff8e63" roughness={0.4} metalness={0.05} />
      </mesh>
      <mesh castShadow position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.28, 18, 18]} />
        <meshStandardMaterial color="#ffd2ba" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[-0.18, 1.4, 0]}>
        <boxGeometry args={[0.2, 0.38, 0.32]} />
        <meshStandardMaterial color="#5da3d0" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0.12, 1.82, 0.22]}>
        <boxGeometry args={[0.3, 0.16, 0.12]} />
        <meshStandardMaterial color="#ffe56f" emissive="#fff0b3" emissiveIntensity={0.3} />
      </mesh>
      <mesh castShadow position={[-0.13, 0.5, 0]}>
        <boxGeometry args={[0.13, 0.88, 0.13]} />
        <meshStandardMaterial color="#3a6a94" />
      </mesh>
      <mesh castShadow position={[0.13, 0.5, 0]}>
        <boxGeometry args={[0.13, 0.88, 0.13]} />
        <meshStandardMaterial color="#3a6a94" />
      </mesh>
      <mesh receiveShadow position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 18]} />
        <meshBasicMaterial color="#7ac8e8" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

/* ── Target penguin ── */

function TargetPenguin({ heroX }: { heroX: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const penguinX = heroX + 32;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.set(penguinX, Math.sin(t * 1.5) * 0.06, 0);
    groupRef.current.rotation.y = Math.PI + Math.sin(t * 0.8) * 0.2;
  });

  return (
    <group ref={groupRef}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <capsuleGeometry args={[0.22, 0.42, 8, 10]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} />
      </mesh>
      <mesh position={[0.08, 0.58, 0]}>
        <capsuleGeometry args={[0.16, 0.32, 8, 10]} />
        <meshStandardMaterial color="#f8f8ff" roughness={0.7} />
      </mesh>
      <mesh castShadow position={[0, 1.12, 0]}>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} />
      </mesh>
      <mesh position={[0.14, 1.16, 0.1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.14, 1.16, -0.1]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.22, 1.08, 0]}>
        <coneGeometry args={[0.06, 0.12, 5]} />
        <meshStandardMaterial color="#ff9a3c" roughness={0.4} />
      </mesh>
      <mesh position={[-0.05, 0.65, 0.24]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.06, 0.3, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} />
      </mesh>
      <mesh position={[-0.05, 0.65, -0.24]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.06, 0.3, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} />
      </mesh>
      {/* Beacon */}
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshBasicMaterial color="#ffda44" transparent opacity={0.7} />
      </mesh>
      <mesh position={[0, 2.2, 0]}>
        <sphereGeometry args={[0.4, 10, 10]} />
        <meshBasicMaterial color="#ffda44" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

/* ── Support vehicles ── */

function SupportVehicle({
  heroX,
  isMoving,
  vehicle,
}: {
  heroX: number;
  isMoving: boolean;
  vehicle: VehicleType;
}) {
  const snowmobileRef = useRef<THREE.Group>(null);
  const helicopterRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (vehicle === 'snowmobile' && snowmobileRef.current) {
      snowmobileRef.current.position.set(heroX - 1.6, 0.2, -1.6);
      snowmobileRef.current.rotation.y = 0.06;
      if (isMoving) snowmobileRef.current.position.y += Math.sin(t * 6) * 0.03;
    }
    if (vehicle === 'helicopter' && helicopterRef.current) {
      helicopterRef.current.position.set(heroX + 2, 6.5 + Math.sin(t * 2.2) * 0.25, -2.5);
      helicopterRef.current.rotation.y = -0.12;
      helicopterRef.current.rotation.z = Math.sin(t * 1.6) * 0.03;
    }
  });

  if (vehicle === 'snowmobile') {
    return (
      <group ref={snowmobileRef}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.36, 0.5]} />
          <meshStandardMaterial color="#ffd86b" emissive="#fff0bb" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <boxGeometry args={[0.5, 0.28, 0.42]} />
          <meshStandardMaterial color="#7fd2f8" roughness={0.3} />
        </mesh>
        <mesh position={[0.24, -0.22, 0.24]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1, 12]} />
          <meshStandardMaterial color="#2d5a80" />
        </mesh>
        <mesh position={[0.24, -0.22, -0.24]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 1, 12]} />
          <meshStandardMaterial color="#2d5a80" />
        </mesh>
      </group>
    );
  }

  if (vehicle === 'helicopter') {
    return (
      <group ref={helicopterRef}>
        <mesh castShadow>
          <capsuleGeometry args={[0.26, 1, 6, 10]} />
          <meshStandardMaterial color="#ffb457" emissive="#fff0bd" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[0.55, 0.12, 0]}>
          <boxGeometry args={[1, 0.08, 0.08]} />
          <meshStandardMaterial color="#4a7a9e" />
        </mesh>
        <Rotor />
      </group>
    );
  }

  return null;
}

function Rotor() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 20;
  });

  return (
    <group ref={ref} position={[0, 0.5, 0]}>
      <mesh>
        <boxGeometry args={[1.8, 0.03, 0.08]} />
        <meshStandardMaterial color="#3d6d90" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[1.8, 0.03, 0.08]} />
        <meshStandardMaterial color="#3d6d90" />
      </mesh>
    </group>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  canvas: {
    flex: 1,
  },
});
