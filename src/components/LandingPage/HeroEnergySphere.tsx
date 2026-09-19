import { useEffect, useRef } from "react";
import * as THREE from "three";

const BASE_COLOR = new THREE.Color("#1B1534");
const PURPLE = new THREE.Color("#7C5CFC");
const ROSE = new THREE.Color("#FF3055");
const TEAL = new THREE.Color("#06D6A0");

function addBasketballSeams(group: THREE.Group) {
  const seamMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color("#6E5CFF"),
    transparent: true,
    opacity: 0.85,
  });

  const equator = new THREE.Mesh(
    new THREE.TorusGeometry(1.03, 0.024, 12, 128),
    seamMaterial,
  );
  equator.rotation.x = Math.PI / 2;

  const meridianA = new THREE.Mesh(
    new THREE.TorusGeometry(1.03, 0.024, 12, 128, Math.PI),
    seamMaterial,
  );
  meridianA.rotation.z = Math.PI / 2;

  const meridianB = meridianA.clone();
  meridianB.rotation.y = Math.PI / 2;

  group.add(equator, meridianA, meridianB);
}

function disposeMaterial(material: THREE.Material | THREE.Material[]) {
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose());
    return;
  }
  material.dispose();
}

export function HeroEnergySphere() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { x: 0, y: 0 };
    const targetRotation = { x: 0.12, y: 0.38 };
    const cameraTarget = new THREE.Vector3(0, 0, 8.8);
    let disposed = false;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.copy(cameraTarget);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const root = new THREE.Group();
    root.position.set(1.75, 0.02, 0);
    scene.add(root);

    const ambient = new THREE.AmbientLight(0xffffff, 1.25);
    const key = new THREE.PointLight(PURPLE, 34, 22, 2);
    key.position.set(3.2, 2.8, 4.8);
    const fill = new THREE.PointLight(ROSE, 24, 22, 2);
    fill.position.set(-3.5, -2.4, 3.2);
    const rim = new THREE.PointLight(TEAL, 12, 24, 2);
    rim.position.set(0.4, 3.5, -2.5);
    scene.add(ambient, key, fill, rim);

    const sphereGroup = new THREE.Group();
    root.add(sphereGroup);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.38, 32),
      new THREE.MeshPhysicalMaterial({
        color: BASE_COLOR,
        emissive: PURPLE.clone().multiplyScalar(0.55),
        emissiveIntensity: 1.35,
        roughness: 0.28,
        metalness: 0.22,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      }),
    );
    sphereGroup.add(core);

    const wireframe = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.42, 2),
      new THREE.MeshBasicMaterial({
        color: PURPLE,
        wireframe: true,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
      }),
    );
    sphereGroup.add(wireframe);

    addBasketballSeams(sphereGroup);

    const shellMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uColorA: { value: PURPLE },
        uColorB: { value: ROSE },
        uColorC: { value: TEAL },
        uOpacity: { value: 0.82 },
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorC;
        uniform float uOpacity;
        uniform float uTime;
        uniform vec2 uPointer;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - max(dot(viewDirection, normalize(vNormal)), 0.0), 2.1);
          float pulse = 0.85 + 0.15 * sin(uTime * 1.6 + vNormal.y * 4.0);
          float pointerGlow = 1.0 + dot(normalize(vNormal.xz), uPointer) * 0.35;
          vec3 color = mix(uColorA, uColorB, clamp(vNormal.y * 0.5 + 0.5, 0.0, 1.0));
          color = mix(color, uColorC, fresnel * 0.35);
          gl_FragColor = vec4(color * pulse * pointerGlow, fresnel * uOpacity);
        }
      `,
    });

    const shell = new THREE.Mesh(new THREE.SphereGeometry(1.74, 64, 64), shellMaterial);
    sphereGroup.add(shell);

    const innerPulse = new THREE.Mesh(
      new THREE.SphereGeometry(1.18, 32, 32),
      new THREE.MeshBasicMaterial({
        color: PURPLE,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    sphereGroup.add(innerPulse);

    const orbitRingA = new THREE.Mesh(
      new THREE.TorusGeometry(2.35, 0.018, 12, 180),
      new THREE.MeshBasicMaterial({
        color: PURPLE,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      }),
    );
    orbitRingA.rotation.x = Math.PI / 2.4;
    root.add(orbitRingA);

    const orbitRingB = new THREE.Mesh(
      new THREE.TorusGeometry(2.75, 0.012, 8, 160),
      new THREE.MeshBasicMaterial({
        color: ROSE,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
      }),
    );
    orbitRingB.rotation.y = Math.PI / 3;
    root.add(orbitRingB);

    const particleCount = reducedMotion.matches ? 48 : 140;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i += 1) {
      const radius = 2.1 + Math.random() * 3.4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.cos(phi) * 0.72;
      particlePositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) * 0.75;
      particleSizes[i] = 0.8 + Math.random() * 2.6;
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3),
    );
    particlesGeometry.setAttribute("size", new THREE.BufferAttribute(particleSizes, 1));

    const particlesMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPurple: { value: PURPLE },
        uTeal: { value: TEAL },
        uRose: { value: ROSE },
      },
      vertexShader: `
        attribute float size;
        uniform float uTime;
        varying float vMix;
        varying float vSpark;

        void main() {
          vec3 transformed = position;
          transformed.y += sin(uTime * 0.7 + position.x * 2.0) * 0.14;
          transformed.x += cos(uTime * 0.55 + position.y * 1.5) * 0.1;
          transformed.z += sin(uTime * 0.45 + position.z * 1.8) * 0.08;
          vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
          gl_PointSize = size * (190.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          vMix = clamp((position.y + 4.0) / 8.0, 0.0, 1.0);
          vSpark = 0.5 + 0.5 * sin(uTime * 3.0 + position.x * 5.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uPurple;
        uniform vec3 uTeal;
        uniform vec3 uRose;
        varying float vMix;
        varying float vSpark;

        void main() {
          vec2 centered = gl_PointCoord - 0.5;
          float strength = smoothstep(0.5, 0.0, length(centered));
          vec3 color = mix(uPurple, uTeal, vMix);
          color = mix(color, uRose, vSpark * 0.35);
          gl_FragColor = vec4(color, strength * (0.45 + vSpark * 0.35));
        }
      `,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    root.add(particles);

    const glowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColorA: { value: PURPLE },
          uColorB: { value: ROSE },
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2(0, 0) },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform float uTime;
          uniform vec2 uPointer;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv - 0.5 + uPointer * 0.08;
            float radius = length(uv);
            float pulse = 0.9 + 0.1 * sin(uTime * 1.4);
            float glow = smoothstep(0.82, 0.0, radius) * pulse;
            vec3 color = mix(uColorA, uColorB, vUv.y);
            gl_FragColor = vec4(color, glow * 0.24);
          }
        `,
      }),
    );
    glowPlane.position.set(0.55, -0.12, -2.8);
    root.add(glowPlane);

    const clock = new THREE.Clock();
    let frameId = 0;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      pointer.x = THREE.MathUtils.clamp(x * 2 - 1, -1, 1);
      pointer.y = THREE.MathUtils.clamp(y * 2 - 1, -1, 1);
      targetRotation.y = 0.38 + pointer.x * 0.28;
      targetRotation.x = 0.12 - pointer.y * 0.2;
    };

    const handlePointerLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
      targetRotation.x = 0.12;
      targetRotation.y = 0.38;
    };

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);

      const isMobile = width < 900;
      root.position.set(isMobile ? 0.2 : 1.85, isMobile ? -0.25 : 0, 0);
      root.scale.setScalar(isMobile ? 0.82 : 1.15);
    };

    const animate = () => {
      if (disposed) return;
      frameId = window.requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      const motionScale = reducedMotion.matches ? 0.25 : 1;

      sphereGroup.rotation.x = THREE.MathUtils.lerp(
        sphereGroup.rotation.x,
        targetRotation.x,
        0.05,
      );
      sphereGroup.rotation.y = THREE.MathUtils.lerp(
        sphereGroup.rotation.y,
        targetRotation.y + elapsed * 0.16 * motionScale,
        0.05,
      );
      sphereGroup.position.y = Math.sin(elapsed * 0.85) * 0.14 * motionScale;

      wireframe.rotation.x += 0.002 * motionScale;
      wireframe.rotation.y += 0.0035 * motionScale;
      innerPulse.scale.setScalar(1 + Math.sin(elapsed * 2.2) * 0.08 * motionScale);

      shell.rotation.y = -elapsed * 0.08 * motionScale;
      shell.rotation.z = elapsed * 0.03 * motionScale;
      shell.scale.setScalar(1 + Math.sin(elapsed * 1.35) * 0.025 * motionScale);

      orbitRingA.rotation.z += 0.004 * motionScale;
      orbitRingB.rotation.x -= 0.003 * motionScale;
      orbitRingB.rotation.z += 0.002 * motionScale;

      particles.rotation.y += 0.0012 * motionScale;
      particles.rotation.x = THREE.MathUtils.lerp(
        particles.rotation.x,
        pointer.y * 0.12,
        0.04,
      );

      key.position.x = THREE.MathUtils.lerp(key.position.x, 3.2 + pointer.x * 1.4, 0.04);
      key.position.y = THREE.MathUtils.lerp(key.position.y, 2.8 + pointer.y * 1.1, 0.04);
      fill.position.x = THREE.MathUtils.lerp(fill.position.x, -3.5 - pointer.x * 0.8, 0.04);

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.35, 0.03);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, -pointer.y * 0.22, 0.03);
      camera.lookAt(0, 0, 0);

      shellMaterial.uniforms.uTime.value = elapsed;
      shellMaterial.uniforms.uOpacity.value =
        0.72 + Math.sin(elapsed * 1.2) * 0.12 * motionScale;
      shellMaterial.uniforms.uPointer.value.set(pointer.x, pointer.y);

      particlesMaterial.uniforms.uTime.value = elapsed;
      (glowPlane.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed;
      (glowPlane.material as THREE.ShaderMaterial).uniforms.uPointer.value.set(
        pointer.x,
        pointer.y,
      );

      (core.material as THREE.MeshPhysicalMaterial).emissiveIntensity =
        1.1 + Math.sin(elapsed * 2) * 0.35 * motionScale;

      renderer.render(scene, camera);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      core.geometry.dispose();
      disposeMaterial(core.material);
      wireframe.geometry.dispose();
      disposeMaterial(wireframe.material);
      shell.geometry.dispose();
      shellMaterial.dispose();
      innerPulse.geometry.dispose();
      disposeMaterial(innerPulse.material);
      orbitRingA.geometry.dispose();
      disposeMaterial(orbitRingA.material);
      orbitRingB.geometry.dispose();
      disposeMaterial(orbitRingB.material);
      glowPlane.geometry.dispose();
      disposeMaterial(glowPlane.material);

      sphereGroup.traverse((child: THREE.Object3D) => {
        if (child instanceof THREE.Mesh && child !== core && child !== shell && child !== wireframe && child !== innerPulse && child !== glowPlane) {
          child.geometry.dispose();
          disposeMaterial(child.material);
        }
      });

      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="sc-hero-orb"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    />
  );
}
