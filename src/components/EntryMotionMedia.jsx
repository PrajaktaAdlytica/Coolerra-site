import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const imageUrl = "/assets/visual/coolerra-entry-thermal-boundary.png";

const vertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uImageAspect;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    float screenAspect = uResolution.x / uResolution.y;
    vec2 scale = vec2(1.0);
    if (screenAspect > uImageAspect) {
      scale.y = uImageAspect / screenAspect;
    } else {
      scale.x = screenAspect / uImageAspect;
    }
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    float time = uTime;
    vec2 uv = coverUv(vUv);

    float cameraZoom = 1.022 + sin(time * 0.16) * 0.008;
    uv = (uv - 0.5) / cameraZoom + 0.5;

    vec2 cameraDrift = vec2(
      sin(time * 0.13) * 0.007,
      cos(time * 0.1) * 0.0045
    );

    float cooledField = smoothstep(0.34, 0.88, vUv.x) * smoothstep(0.12, 0.88, vUv.y);
    float thermalField = smoothstep(0.25, 0.72, vUv.x) * smoothstep(0.72, 0.28, vUv.y);
    float coolantWave = sin(vUv.y * 42.0 + time * 1.05) * 0.0038;
    coolantWave += sin((vUv.x + vUv.y) * 27.0 - time * 0.72) * 0.0022;
    float heatWave = sin(vUv.y * 58.0 - time * 1.46) * 0.0032;

    vec2 movingUv = uv + cameraDrift;
    movingUv.x += coolantWave * cooledField + heatWave * thermalField;
    movingUv.y += cos(vUv.x * 35.0 + time * 0.78) * 0.002 * cooledField;
    movingUv.y += sin(vUv.x * 46.0 - time * 1.18) * 0.0015 * thermalField;

    vec3 color = texture2D(uTexture, movingUv).rgb;

    float coolingPulse = 0.5 + 0.5 * sin(time * 0.42 + vUv.x * 4.0);
    float thermalPulse = 0.5 + 0.5 * sin(time * 0.74 - vUv.y * 5.0);
    float coolantFlow = pow(max(0.0, sin(vUv.x * 24.0 - vUv.y * 8.0 - time * 1.1)), 12.0);
    float heatFlow = pow(max(0.0, sin(vUv.x * 18.0 + vUv.y * 15.0 - time * 1.35)), 18.0);
    vec3 coolingLight = vec3(0.54, 0.86, 0.80) * cooledField * (coolingPulse * 0.045 + coolantFlow * 0.09);
    vec3 thermalLight = vec3(1.0, 0.34, 0.25) * thermalField * (thermalPulse * 0.035 + heatFlow * 0.065);

    float sweepPosition = fract(time * 0.075) * 1.8 - 0.35;
    float sweep = exp(-pow((vUv.x + vUv.y * 0.28) - sweepPosition, 2.0) / 0.0045);
    color += coolingLight + thermalLight + vec3(0.62, 0.92, 0.86) * sweep * cooledField * 0.115;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function MotionPlane({ active }) {
  const materialRef = useRef(null);
  const texture = useTexture(imageUrl);
  const { gl, invalidate, size } = useThree();

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uImageAspect: { value: 1672 / 941 },
  }), [texture]);

  useEffect(() => {
    materialRef.current?.uniforms.uResolution.value.set(size.width, size.height);
    invalidate();
  }, [invalidate, size.height, size.width]);

  useEffect(() => {
    if (!active) return undefined;
    let frame;
    const render = () => {
      invalidate();
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [active, invalidate]);

  useFrame(({ clock }) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={materialRef} uniforms={uniforms} vertexShader={vertexShader} fragmentShader={fragmentShader} />
    </mesh>
  );
}

export function EntryMotionMedia() {
  const containerRef = useRef(null);
  const [active, setActive] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(query.matches);
    updateMotionPreference();
    query.addEventListener("change", updateMotionPreference);
    return () => query.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0.01 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="entry-prologue__media">
      <img
        src={imageUrl}
        alt="A physical thermal boundary between cooled AI infrastructure and rising compute heat"
        fetchPriority="high"
      />
      {!reducedMotion && (
        <Canvas
          aria-hidden="true"
          dpr={[1, 1.35]}
          frameloop="demand"
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <MotionPlane active={active} />
        </Canvas>
      )}
    </div>
  );
}
