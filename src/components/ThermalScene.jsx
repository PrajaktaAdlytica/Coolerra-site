import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Line, RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const frost = new THREE.Color("#f7f8f5");
const mineral = new THREE.Color("#062722");

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function sceneOpacity(progress, center, range = 0.82) {
  const distance = Math.abs(progress - center);
  return 1 - THREE.MathUtils.smoothstep(distance, range * 0.48, range);
}

function setOpacity(group, opacity) {
  if (!group) return;
  if (group.userData.lastOpacity !== undefined && opacity <= 0.008 && group.userData.lastOpacity <= 0.008) return;
  group.userData.lastOpacity = opacity;
  group.visible = opacity > 0.008;
  group.traverse((child) => {
    if (!child.material) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (material.userData.baseOpacity === undefined) material.userData.baseOpacity = material.opacity;
      material.transparent = true;
      material.opacity = material.userData.baseOpacity * opacity;
      material.depthWrite = opacity > 0.92 && material.userData.baseOpacity > 0.9;
    });
  });
}

function createCGeometry(depth = 0.34) {
  const shape = new THREE.Shape();
  const outer = 1.78;
  const inner = 0.92;
  const start = Math.PI * 0.23;
  const end = Math.PI * 1.77;
  const steps = 72;

  shape.moveTo(Math.cos(start) * outer, Math.sin(start) * outer);
  for (let index = 1; index <= steps; index += 1) {
    const angle = start + ((end - start) * index) / steps;
    shape.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
  }
  for (let index = steps; index >= 0; index -= 1) {
    const angle = start + ((end - start) * index) / steps;
    shape.lineTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
  }
  shape.closePath();

  const upperAperture = new THREE.Path();
  upperAperture.absarc(-0.05, 1.28, 0.22, 0, Math.PI * 2, false);
  const lowerAperture = new THREE.Path();
  lowerAperture.absarc(0.08, -1.28, 0.24, 0, Math.PI * 2, false);
  shape.holes.push(upperAperture, lowerAperture);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelSegments: 5,
    steps: 1,
    bevelSize: 0.075,
    bevelThickness: 0.075,
    curveSegments: 48,
  });
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

function CameraRig({ progressRef }) {
  const { camera, size } = useThree();
  const keyframes = useMemo(() => [
    { position: [0.45, 0.05, 6.7], target: [0.1, 0, 0] },
    { position: [1.6, 1.5, 7.9], target: [0.3, -0.2, 0] },
    { position: [1.15, 1.3, 7.7], target: [0.1, -0.15, 0] },
    { position: [0.3, 0.15, 7.1], target: [0.2, 0, 0] },
    { position: [0.8, 0.65, 7.8], target: [0.15, 0, 0] },
    { position: [0.25, 0.35, 7.1], target: [0, 0, 0] },
    { position: [0.2, 1.4, 7.4], target: [0, -0.2, 0] },
  ], []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const progress = clamp(progressRef.current, 0, 6);
    const index = Math.min(5, Math.floor(progress));
    const mix = THREE.MathUtils.smoothstep(progress - index, 0, 1);
    const a = keyframes[index];
    const b = keyframes[index + 1];
    const mobile = size.width < 760;
    const x = THREE.MathUtils.lerp(a.position[0], b.position[0], mix);
    const y = THREE.MathUtils.lerp(a.position[1], b.position[1], mix);
    const z = THREE.MathUtils.lerp(a.position[2], b.position[2], mix) + (mobile ? 2.1 : 0);
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mobile ? x * 0.35 : x, 0.07);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y, 0.07);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, z, 0.07);
    target.set(
      THREE.MathUtils.lerp(a.target[0], b.target[0], mix),
      THREE.MathUtils.lerp(a.target[1], b.target[1], mix),
      0,
    );
    camera.lookAt(target);
  });
  return null;
}

function Environment({ progressRef }) {
  const { scene } = useThree();
  const color = useMemo(() => frost.clone(), []);
  useFrame(() => {
    const darkMix = THREE.MathUtils.smoothstep(progressRef.current, 5.15, 5.8);
    color.copy(frost).lerp(mineral, darkMix);
    scene.background = color;
    if (scene.fog) scene.fog.color.copy(color);
  });
  return null;
}

function ServerRack({ position, scale = 1, hot = false }) {
  return (
    <group position={position} scale={scale}>
      <RoundedBox args={[0.34, 1.22, 0.44]} radius={0.025} smoothness={2}>
        <meshStandardMaterial color="#10211e" roughness={0.45} metalness={0.42} />
      </RoundedBox>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={index} position={[0, -0.46 + index * 0.15, 0.226]} scale={[0.25, 0.037, 0.012]}>
          <boxGeometry />
          <meshStandardMaterial
            color={hot && index > 3 ? "#ff5b45" : "#82cbc1"}
            emissive={hot && index > 3 ? "#ff5b45" : "#82cbc1"}
            emissiveIntensity={hot && index > 3 ? 1.2 : 0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

function RackCore({ compact = false }) {
  const positions = useMemo(() => Array.from({ length: compact ? 7 : 12 }, (_, index) => [
    -1.05 + (index % (compact ? 2 : 4)) * 0.42,
    -0.58 + Math.floor(index / (compact ? 2 : 4)) * 0.82,
    -0.12 + (index % 2) * 0.05,
  ]), [compact]);
  return (
    <group>
      {positions.map((position, index) => (
        <ServerRack key={`${position.join("-")}-${index}`} position={position} scale={compact ? 0.72 : 0.62} hot={index === positions.length - 2} />
      ))}
    </group>
  );
}

function StudioRibs() {
  return (
    <group position={[0, 0, -2.2]}>
      {Array.from({ length: 29 }, (_, index) => (
        <mesh key={index} position={[-4.4 + index * 0.32, 0, index % 2 ? -0.06 : 0]} scale={[0.025, 2.8, 0.12]}>
          <boxGeometry />
          <meshStandardMaterial color={index > 23 ? "#efd8d4" : "#e8eeeb"} roughness={0.86} />
        </mesh>
      ))}
      <mesh position={[0, -2.18, 1]} scale={[5.4, 0.04, 3.6]}>
        <boxGeometry />
        <meshStandardMaterial color="#edf1ee" roughness={0.78} />
      </mesh>
    </group>
  );
}

function PhaseLensScene({ progressRef, center = 0, combined = false }) {
  const group = useRef();
  const geometry = useMemo(() => createCGeometry(0.34), []);
  const layers = useMemo(() => Array.from({ length: 13 }, (_, index) => index), []);

  useFrame(() => {
    const opacity = sceneOpacity(progressRef.current, center, combined ? 1.1 : 0.9);
    setOpacity(group.current, opacity);
    if (!group.current) return;
    const local = progressRef.current - center;
    group.current.rotation.y = -0.16 + local * 0.07;
    group.current.rotation.x = 0.02 + Math.abs(local) * 0.025;
    group.current.rotation.z = -0.035 + local * 0.02;
    group.current.scale.setScalar((combined ? 0.82 : 0.88) + opacity * 0.02);
  });

  return (
    <group ref={group} position={[1.05, 0, 0]}>
      <StudioRibs />
      <group rotation={[0, 0, -0.02]}>
        {layers.map((index) => (
          <mesh key={index} geometry={geometry} position={[0, 0, -0.34 - index * 0.028]} scale={1 + index * 0.012}>
            <meshPhysicalMaterial
              color={index > 7 ? "#efc1bc" : "#b7ded8"}
              roughness={0.12}
              metalness={0.02}
              transmission={0.82}
              thickness={0.75}
              clearcoat={0.8}
              clearcoatRoughness={0.12}
              opacity={0.16 + index * 0.025}
              wireframe={index % 2 === 0}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            color="#f9f8f5"
            roughness={0.16}
            transmission={0.7}
            thickness={1.2}
            clearcoat={1}
            clearcoatRoughness={0.09}
            opacity={0.38}
            side={THREE.DoubleSide}
          />
        </mesh>
        <group position={[0, -0.02, 0.08]}>
          <ServerRack position={[-1.42, 0, 0]} scale={0.82} />
          <ServerRack position={[-1.19, 0, 0.02]} scale={0.82} hot />
          <ServerRack position={[-0.96, 0, 0.04]} scale={0.82} />
        </group>
        <Line points={[[-1.35, 1.05, 0.36], [-0.42, 0.5, 0.38], [0.65, 0.48, 0.4]]} color="#e9b8b2" lineWidth={1.2} transparent opacity={0.82} />
        <Line points={[[-1.38, -1.15, 0.36], [-0.45, -0.58, 0.38], [0.63, -0.56, 0.4]]} color="#82cbc1" lineWidth={1.2} transparent opacity={0.82} />
      </group>
    </group>
  );
}

function MonitorHallScene({ progressRef, center = 2 }) {
  const group = useRef();
  const rackPositions = useMemo(() => Array.from({ length: 18 }, (_, index) => {
    const row = index < 9 ? -0.82 : 0.7;
    return [-2 + (index % 9) * 0.5, 0, row];
  }), []);

  useFrame(() => {
    const opacity = sceneOpacity(progressRef.current, center, 1.2);
    setOpacity(group.current, opacity);
    if (!group.current) return;
    const local = progressRef.current - center;
    group.current.rotation.y = -0.12 + local * 0.035;
    group.current.position.y = -0.55 + Math.abs(local) * 0.04;
  });

  return (
    <group ref={group} rotation={[-0.42, -0.12, 0]} position={[1.35, -0.55, 0]} scale={0.9}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.69, 0]}>
        <planeGeometry args={[6.4, 4.5, 20, 20]} />
        <meshStandardMaterial color="#e8eeeb" roughness={0.92} />
      </mesh>
      <gridHelper args={[6.4, 22, "#a8bbb5", "#d9e2df"]} position={[0, -0.67, 0]} />
      {rackPositions.map((position, index) => (
        <ServerRack key={index} position={position} scale={0.68} hot={index === 14 || index === 15} />
      ))}
      <mesh position={[0.1, -0.05, 0]} scale={[4.9, 0.06, 0.78]}>
        <boxGeometry />
        <meshPhysicalMaterial color="#82cbc1" transmission={0.38} thickness={0.3} opacity={0.42} />
      </mesh>
      <mesh position={[1.65, 0.02, 0.65]} scale={[1.5, 0.08, 0.66]}>
        <boxGeometry />
        <meshPhysicalMaterial color="#ff8a6f" emissive="#ff5b45" emissiveIntensity={0.28} transmission={0.2} opacity={0.56} />
      </mesh>
      {Array.from({ length: 11 }, (_, index) => (
        <Line
          key={index}
          points={[[-2.45, -0.05 + index * 0.02, -0.4 + index * 0.13], [-0.4, 0.02 + index * 0.025, -0.34 + index * 0.13], [2.42, index > 4 ? 0.35 : 0.04, -0.28 + index * 0.13]]}
          color={index > 4 ? "#ff5b45" : "#6bc9d6"}
          lineWidth={1.15}
          transparent
          opacity={0.76}
        />
      ))}
      <group position={[-2.65, -0.3, 1.55]}>
        {Array.from({ length: 5 }, (_, index) => (
          <mesh key={index} position={[index * 0.42, 0, 0]} scale={[0.28, 0.7, 0.34]}>
            <boxGeometry />
            <meshStandardMaterial color="#cfd9d6" metalness={0.5} roughness={0.34} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function CapacityCutawayScene({ progressRef }) {
  const group = useRef();
  const geometry = useMemo(() => createCGeometry(0.58), []);

  useFrame(() => {
    const opacity = sceneOpacity(progressRef.current, 3, 0.95);
    setOpacity(group.current, opacity);
    if (!group.current) return;
    const local = progressRef.current - 3;
    group.current.rotation.y = 0.03 + local * 0.045;
    group.current.position.x = 0.45 - local * 0.08;
  });

  return (
    <group ref={group} position={[1.22, 0, 0]}>
      <mesh geometry={geometry} scale={[1.1, 1.1, 1]}>
        <meshStandardMaterial color="#111817" roughness={0.24} metalness={0.54} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={index} geometry={geometry} position={[0, 0, 0.36 + index * 0.055]} scale={1.01 + index * 0.016}>
          <meshPhysicalMaterial color={index % 3 === 0 ? "#82cbc1" : "#dce6e2"} transmission={0.74} thickness={0.24} roughness={0.2} opacity={0.13} wireframe={index % 2 === 0} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <Line points={[[-1.35, 1.25, 0.72], [-0.5, 0.83, 0.76], [0.65, 0.68, 0.78], [1.15, 0.38, 0.78]]} color="#ff5b45" lineWidth={1.8} transparent opacity={0.92} />
      <Line points={[[-1.38, -1.25, 0.7], [-0.5, -0.86, 0.74], [0.62, -0.72, 0.76], [1.18, -0.4, 0.76]]} color="#82cbc1" lineWidth={1.8} transparent opacity={0.9} />
      <group position={[-0.78, -0.38, 0.76]} scale={0.42}><RackCore compact /></group>
    </group>
  );
}

function createWaveLoop(layer) {
  const width = 4.2 - layer * 0.04;
  const depth = 2.9 - layer * 0.035;
  const points = [];
  const segments = 46;
  for (let index = 0; index <= segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    const x = Math.cos(angle) * width * 0.5;
    const z = Math.sin(angle) * depth * 0.5;
    const y = Math.sin(angle * 2.4 + layer * 0.34) * 0.13 + layer * 0.13 - 0.85;
    points.push([x, y, z]);
  }
  return points;
}

function PredictLayersScene({ progressRef }) {
  const group = useRef();
  const waves = useMemo(() => Array.from({ length: 15 }, (_, index) => createWaveLoop(index)), []);

  useFrame(() => {
    const opacity = sceneOpacity(progressRef.current, 4, 0.95);
    setOpacity(group.current, opacity);
    if (!group.current) return;
    const local = progressRef.current - 4;
    group.current.rotation.y = -0.13 + local * 0.045;
    group.current.rotation.x = -0.08;
  });

  return (
    <group ref={group} position={[1.05, 0.25, 0]}>
      {waves.map((points, index) => (
        <Line key={index} points={points} color={index < 5 ? "#7dbfb5" : "#c7d6d2"} lineWidth={index % 4 === 0 ? 1.4 : 0.72} transparent opacity={0.34 + index * 0.018} />
      ))}
      <group position={[-0.2, -0.1, 0]} rotation={[0, 0.1, 0]} scale={0.72}>
        {Array.from({ length: 14 }, (_, index) => (
          <ServerRack key={index} position={[-1.55 + (index % 7) * 0.5, -0.08, index < 7 ? -0.56 : 0.52]} scale={0.62} hot={index === 5 || index === 12} />
        ))}
      </group>
      <Line points={[[-2.05, -0.56, -0.9], [-1.2, -0.35, -0.5], [-0.4, 0.08, -0.1], [0.55, 0.42, 0.38], [1.92, 0.8, 0.82]]} color="#ff5b45" lineWidth={2} transparent opacity={0.95} />
      <Line points={[[-2.02, -0.82, 0.85], [-1.1, -0.58, 0.45], [-0.12, -0.34, 0.12], [0.82, -0.05, -0.24], [1.95, 0.24, -0.78]]} color="#0d4a3e" lineWidth={2.2} transparent opacity={0.96} />
    </group>
  );
}

function createParticleField(count, side) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const i = index * 3;
    positions[i] = side * (0.55 + Math.random() * 2.8);
    positions[i + 1] = -0.6 + Math.random() * 1.7 + Math.sin(index * 0.31) * 0.2;
    positions[i + 2] = -1.3 + Math.random() * 2.8;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geometry;
}

function BoundaryScene({ progressRef }) {
  const group = useRef();
  const warmParticles = useMemo(() => createParticleField(520, -1), []);
  const coolParticles = useMemo(() => createParticleField(520, 1), []);

  useFrame(() => {
    const opacity = sceneOpacity(progressRef.current, 6, 1.2);
    setOpacity(group.current, opacity);
    if (!group.current) return;
    group.current.rotation.y = -0.08 + (progressRef.current - 6) * 0.03;
  });

  return (
    <group ref={group} position={[0.3, 0, 0]} rotation={[-0.35, -0.08, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[8, 6, 32, 32]} />
        <meshStandardMaterial color="#07110f" roughness={0.9} metalness={0.22} />
      </mesh>
      <gridHelper args={[8, 30, "#234039", "#132a25"]} position={[0, -0.97, 0]} />
      <points geometry={warmParticles}>
        <pointsMaterial color="#e9a7a0" size={0.055} sizeAttenuation transparent opacity={0.92} />
      </points>
      <points geometry={coolParticles}>
        <pointsMaterial color="#b8dfd8" size={0.05} sizeAttenuation transparent opacity={0.9} />
      </points>
      <group position={[0, -0.25, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        {Array.from({ length: 6 }, (_, index) => (
          <mesh key={index} rotation={[0, 0, index * (Math.PI / 3)]}>
            <torusGeometry args={[0.66, 0.18, 16, 34, Math.PI * 0.24]} />
            <meshPhysicalMaterial color={index < 3 ? "#e9b8b2" : "#82cbc1"} transmission={0.36} roughness={0.28} emissive={index < 3 ? "#7b2e29" : "#174f47"} emissiveIntensity={0.24} />
          </mesh>
        ))}
      </group>
      <Line points={[[-3.2, -0.5, -0.75], [-1.4, -0.3, -0.24], [-0.55, -0.2, 0.08], [0, -0.25, 0.2]]} color="#e9b8b2" lineWidth={1.4} transparent opacity={0.86} />
      <Line points={[[3.2, 0.4, 0.72], [1.52, 0.1, 0.36], [0.62, -0.12, 0.18], [0, -0.25, 0.2]]} color="#82cbc1" lineWidth={1.4} transparent opacity={0.86} />
    </group>
  );
}

function Scene({ progressRef }) {
  return (
    <>
      <fog attach="fog" args={["#f7f8f5", 7.2, 13]} />
      <ambientLight intensity={1.2} />
      <directionalLight position={[-4, 5, 6]} intensity={2.7} color="#fffdf8" />
      <pointLight position={[3.5, 2.5, 3]} intensity={8} distance={9} color="#ffb1a8" />
      <pointLight position={[-3, -1.5, 4]} intensity={6} distance={9} color="#b9fff4" />
      <CameraRig progressRef={progressRef} />
      <Environment progressRef={progressRef} />
      <PhaseLensScene progressRef={progressRef} center={0} />
      <MonitorHallScene progressRef={progressRef} center={1.65} />
      <CapacityCutawayScene progressRef={progressRef} />
      <PredictLayersScene progressRef={progressRef} />
      <PhaseLensScene progressRef={progressRef} center={4.65} combined />
      <BoundaryScene progressRef={progressRef} />
      <ContactShadows position={[0, -2.1, 0]} opacity={0.16} scale={7} blur={2.8} far={5} resolution={256} color="#39675e" />
    </>
  );
}

function InvalidateBridge({ invalidateRef }) {
  const { invalidate } = useThree();

  useEffect(() => {
    if (!invalidateRef) return undefined;
    invalidateRef.current = invalidate;
    return () => { invalidateRef.current = null; };
  }, [invalidate, invalidateRef]);

  return null;
}

export function ThermalScene({ progressRef, invalidateRef, className = "" }) {
  return (
    <div className={`thermal-scene ${className}`} aria-hidden="true">
      <Canvas
        dpr={[1, 1.35]}
        camera={{ position: [0.45, 0.05, 6.7], fov: 41, near: 0.1, far: 30 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        frameloop="demand"
      >
        <InvalidateBridge invalidateRef={invalidateRef} />
        <Scene progressRef={progressRef} />
      </Canvas>
    </div>
  );
}
