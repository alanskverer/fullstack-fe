import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  canvas,
  canvasTexture,
  damp,
  disposeScene,
  glowTexture,
  mulberry32,
  noise2D,
  prefersReducedMotion,
  renderRatio,
  smooth,
} from "../shared/three-utils";

const ROSE = "#ff3055";
const VIOLET = "#7c5cfc";

/* Court is 16 m wide (x) and 30 m long (z) including the apron. */
const RIM_Z = 12.425;
const BOARD_Z = 12.8;
const RIM_Y = 3.05;

type Key = { pos: THREE.Vector3; tgt: THREE.Vector3; fov: number };
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

/* One composed shot per chapter; the route pauses on each key. */
const KEYS: Key[] = [
  { pos: v(-8, 2.4, 26), tgt: v(0, 3.4, -8), fov: 40 },
  { pos: v(-3.4, 3.7, -5.6), tgt: v(0, 3.0, -12.4), fov: 38 },
  { pos: v(7.5, 0.55, 3.5), tgt: v(-3, 0.7, -5), fov: 44 },
  { pos: v(-2, 1.5, 9.5), tgt: v(11.5, 6.4, 2), fov: 40 },
  { pos: v(0, 17, 28), tgt: v(0, 0, -3), fov: 40 },
  { pos: v(-15, 25, 21), tgt: v(0, 0, -2), fov: 42 },
];

function catmull(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, t: number, out: THREE.Vector3) {
  const t2 = t * t;
  const t3 = t2 * t;
  out.set(0, 0, 0)
    .addScaledVector(p0, -0.5 * t3 + t2 - 0.5 * t)
    .addScaledVector(p1, 1.5 * t3 - 2.5 * t2 + 1)
    .addScaledVector(p2, -1.5 * t3 + 2 * t2 + 0.5 * t)
    .addScaledVector(p3, 0.5 * t3 - 0.5 * t2);
  return out;
}

/* ─── textures ─────────────────────────────────────────────────────────── */

function texCourt() {
  const S = 64; // px per metre
  const { c, ctx } = canvas(16 * S, 30 * S);
  ctx.setTransform(S, 0, 0, S, 8 * S, 15 * S);
  const n = noise2D(11);

  ctx.fillStyle = "#0c0a18";
  ctx.fillRect(-8, -15, 16, 30);
  ctx.fillStyle = "#18122f";
  ctx.fillRect(-7.5, -14, 15, 28);

  // Worn acrylic: low-frequency blotches so the paint isn't flat.
  const img = ctx.getImageData(0, 0, c.width, c.height);
  for (let y = 0; y < c.height; y += 2) {
    for (let x = 0; x < c.width; x += 2) {
      const k = n(x / 90, y / 90) * 0.5 + n(x / 18, y / 18) * 0.25;
      const d = k * 14;
      for (let oy = 0; oy < 2; oy++)
        for (let ox = 0; ox < 2; ox++) {
          const i = ((y + oy) * c.width + x + ox) * 4;
          img.data[i] += d;
          img.data[i + 1] += d;
          img.data[i + 2] += d * 1.4;
        }
    }
  }
  ctx.putImageData(img, 0, 0);
  ctx.setTransform(S, 0, 0, S, 8 * S, 15 * S);

  for (const side of [-1, 1]) {
    const yb = side * RIM_Z;
    const base = side * 14;
    // Three-point zone in a lighter violet.
    ctx.fillStyle = "rgba(124, 92, 252, 0.16)";
    ctx.beginPath();
    ctx.moveTo(-6.6, base);
    if (side < 0) {
      ctx.lineTo(-6.6, yb + 1.41);
      ctx.arc(0, yb, 6.75, Math.PI - 0.21, 0.21, true);
    } else {
      ctx.lineTo(-6.6, yb - 1.41);
      ctx.arc(0, yb, 6.75, Math.PI + 0.21, -0.21, false);
    }
    ctx.lineTo(6.6, base);
    ctx.closePath();
    ctx.fill();

    // Lane in BUL rose.
    ctx.fillStyle = "rgba(255, 48, 85, 0.78)";
    const laneY = side < 0 ? base : base - 5.8;
    ctx.fillRect(-2.45, laneY, 4.9, 5.8);

    ctx.strokeStyle = "rgba(240, 236, 255, 0.92)";
    ctx.lineWidth = 0.07;
    ctx.strokeRect(-2.45, laneY, 4.9, 5.8);
    ctx.beginPath();
    ctx.arc(0, side * (14 - 5.8), 1.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-6.6, base);
    if (side < 0) {
      ctx.lineTo(-6.6, yb + 1.41);
      ctx.arc(0, yb, 6.75, Math.PI - 0.21, 0.21, true);
    } else {
      ctx.lineTo(-6.6, yb - 1.41);
      ctx.arc(0, yb, 6.75, Math.PI + 0.21, -0.21, false);
    }
    ctx.lineTo(6.6, base);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(240, 236, 255, 0.92)";
  ctx.lineWidth = 0.08;
  ctx.strokeRect(-7.5, -14, 15, 28);
  ctx.beginPath();
  ctx.moveTo(-7.5, 0);
  ctx.lineTo(7.5, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "rgba(255, 48, 85, 0.9)";
  ctx.beginPath();
  ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = "#f4f1ff";
  ctx.font = "700 1.05px 'Onest', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("BUL", 0, 0.05);
  ctx.restore();

  return canvasTexture(c);
}

function texAsphalt() {
  const W = 512;
  const { c, ctx } = canvas(W, W);
  const img = ctx.createImageData(W, W);
  const rnd = mulberry32(5);
  const n = noise2D(3);
  for (let y = 0; y < W; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const k = 14 + rnd() * 16 + n(x / 40, y / 40) * 8;
      img.data[i] = k;
      img.data[i + 1] = k + 1;
      img.data[i + 2] = k + 5;
      img.data[i + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
  return canvasTexture(c, { repeat: [60, 60] });
}

/* Roughness map for the ground: dark puddles reflect the floodlights. */
function texPuddles() {
  const W = 512;
  const { c, ctx } = canvas(W, W);
  const img = ctx.createImageData(W, W);
  const n = noise2D(19);
  for (let y = 0; y < W; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const k = n(x / 70, y / 70) + 0.5 * n(x / 20, y / 20);
      const r = 200 - smooth(0.15, 0.4, k) * 120;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = r;
      img.data[i + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
  return canvasTexture(c, { srgb: false, repeat: [12, 12] });
}

function texChainLink() {
  const { c, ctx } = canvas(64, 64);
  ctx.strokeStyle = "rgba(170, 176, 196, 0.9)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 32); ctx.lineTo(32, 0); ctx.lineTo(64, 32); ctx.lineTo(32, 64); ctx.closePath();
  ctx.stroke();
  return canvasTexture(c);
}

function texWindows() {
  const { c, ctx } = canvas(256, 512);
  const rnd = mulberry32(23);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 256, 512);
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 8; x++) {
      const r = rnd();
      if (r > 0.78) {
        ctx.fillStyle = r > 0.95 ? "rgba(157, 134, 255, 0.9)" : `rgba(255, ${190 + ((rnd() * 40) | 0)}, 130, ${0.55 + rnd() * 0.4})`;
      } else {
        ctx.fillStyle = "rgba(40, 46, 70, 0.35)";
      }
      ctx.fillRect(6 + x * 31, 6 + y * 31, 18, 22);
    }
  return canvasTexture(c);
}

function texMoon() {
  const S = 512;
  const { c, ctx } = canvas(S, S);
  const rnd = mulberry32(41);
  const g = ctx.createRadialGradient(S * 0.42, S * 0.4, S * 0.05, S / 2, S / 2, S * 0.5);
  g.addColorStop(0, "#ff7a6a");
  g.addColorStop(0.7, "#e0233a");
  g.addColorStop(1, "#8e1024");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 90; i++) {
    const r = (4 + rnd() * rnd() * 40) * (S / 512);
    const x = rnd() * S;
    const y = rnd() * S;
    ctx.fillStyle = `rgba(90, 8, 20, ${0.12 + rnd() * 0.25})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  for (const [x, y, r] of [[0.62, 0.38, 0.16], [0.36, 0.64, 0.12], [0.7, 0.66, 0.09]]) {
    ctx.fillStyle = "rgba(110, 10, 26, 0.35)";
    ctx.beginPath();
    ctx.ellipse(x * S, y * S, r * S, r * S * 0.8, 0.4, 0, Math.PI * 2);
    ctx.fill();
  }
  return canvasTexture(c);
}

function texBall() {
  const { c, ctx } = canvas(512, 256);
  ctx.fillStyle = "#c9531f";
  ctx.fillRect(0, 0, 512, 256);
  const rnd = mulberry32(3);
  for (let i = 0; i < 6000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${rnd() * 0.12})`;
    ctx.fillRect(rnd() * 512, rnd() * 256, 2, 2);
  }
  ctx.strokeStyle = "#1a0d08";
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(0, 128); ctx.lineTo(512, 128); ctx.stroke();
  for (const x of [128, 384]) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke(); }
  for (const x0 of [0, 256]) {
    ctx.beginPath();
    for (let y = 0; y <= 256; y += 4) ctx.lineTo(x0 + 64 + Math.sin((y / 256) * Math.PI) * 50, y);
    ctx.stroke();
  }
  return canvasTexture(c);
}

/* ─── scene ────────────────────────────────────────────────────────────── */

export type NightCourt = {
  setProgress: (p: number) => void;
  setKeyTimes: (t: number[]) => void;
  setPointer: (x: number, y: number) => void;
  dispose: () => void;
};

export function createNightCourt(canvasEl: HTMLCanvasElement): NightCourt {
  const reduced = prefersReducedMotion();
  const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#05070c");
  scene.fog = new THREE.FogExp2("#070a12", 0.0115);

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 900);

  /* Sky: a gradient dome so the horizon glows faintly with city haze. */
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(500, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {},
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec3 vDir;
        void main(){
          float h = vDir.y;
          vec3 zen = vec3(0.012, 0.016, 0.03);
          vec3 mid = vec3(0.03, 0.03, 0.07);
          vec3 hor = vec3(0.13, 0.06, 0.12);
          vec3 col = mix(hor, mid, smoothstep(0.0, 0.16, h));
          col = mix(col, zen, smoothstep(0.16, 0.6, h));
          gl_FragColor = vec4(col, 1.0);
        }`,
    }),
  );
  scene.add(sky);

  const stars = (() => {
    const N = 1600;
    const pos = new Float32Array(N * 3);
    const rnd = mulberry32(9);
    for (let i = 0; i < N; i++) {
      const th = rnd() * Math.PI * 2;
      const el = 0.08 + Math.pow(rnd(), 0.7) * 1.3;
      pos[i * 3] = Math.cos(th) * Math.cos(el) * 420;
      pos[i * 3 + 1] = Math.sin(el) * 420;
      pos[i * 3 + 2] = Math.sin(th) * Math.cos(el) * 420;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({ color: "#c9d2ff", size: 1.4, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.7 }));
  })();
  scene.add(stars);

  /* The rose moon sits behind the far hoop in the opening shot. */
  const moon = new THREE.Mesh(new THREE.SphereGeometry(26, 48, 32), new THREE.MeshBasicMaterial({ map: texMoon(), fog: false }));
  moon.position.set(38, 56, -170);
  moon.rotation.y = -0.6;
  scene.add(moon);
  const moonGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowTexture("rgba(255,70,90,0.55)", "rgba(255,48,85,0.12)"), blending: THREE.AdditiveBlending, depthWrite: false, fog: false }),
  );
  moonGlow.scale.set(170, 170, 1);
  moonGlow.position.copy(moon.position).add(v(0, 0, -5));
  scene.add(moonGlow);

  scene.add(new THREE.HemisphereLight("#3a3f78", "#0a0608", 0.55));
  const moonLight = new THREE.DirectionalLight("#ff6b7d", 0.35);
  moonLight.position.copy(moon.position);
  scene.add(moonLight);

  /* Ground and court */
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 600),
    new THREE.MeshStandardMaterial({ map: texAsphalt(), roughnessMap: texPuddles(), roughness: 1, metalness: 0.2 }),
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  const court = new THREE.Mesh(
    new THREE.PlaneGeometry(16, 30),
    new THREE.MeshStandardMaterial({ map: texCourt(), roughness: 0.62, metalness: 0.02 }),
  );
  court.rotation.x = -Math.PI / 2;
  court.position.y = 0.012;
  scene.add(court);

  /* Hoops */
  const steel = new THREE.MeshStandardMaterial({ color: "#1d2130", roughness: 0.5, metalness: 0.7 });
  const rimMat = new THREE.MeshStandardMaterial({ color: ROSE, emissive: ROSE, emissiveIntensity: 0.6, roughness: 0.35, metalness: 0.6 });
  const boardMat = new THREE.MeshPhysicalMaterial({ color: "#c8d0ff", roughness: 0.08, transmission: 0.7, transparent: true, opacity: 0.35, thickness: 0.05 });
  const lineMat = new THREE.MeshBasicMaterial({ color: "#f2efff" });
  const netMat = new THREE.LineBasicMaterial({ color: "#d9dbe8", transparent: true, opacity: 0.8 });

  for (const side of [-1, 1]) {
    const g = new THREE.Group();
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 4.2, 16), steel);
    pole.position.set(0, 2.1, side * 14.9);
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 2.1), steel);
    arm.position.set(0, 3.5, side * 13.85);
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.05, 0.04), boardMat);
    board.position.set(0, 3.45, side * BOARD_Z);
    const frame = new THREE.Group();
    const bar = (w: number, h: number, x: number, y: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), lineMat);
      m.position.set(x, y, side * (BOARD_Z - side * 0.03));
      frame.add(m);
    };
    bar(1.8, 0.04, 0, 3.96); bar(1.8, 0.04, 0, 2.94); bar(0.04, 1.05, -0.88, 3.45); bar(0.04, 1.05, 0.88, 3.45);
    bar(0.59, 0.035, 0, 3.4); bar(0.59, 0.035, 0, 3.05 + 0.0); bar(0.035, 0.45, -0.28, 3.23); bar(0.035, 0.45, 0.28, 3.23);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.225, 0.012, 10, 48), rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(0, RIM_Y, side * RIM_Z);

    const netPts: number[] = [];
    const strands = 12;
    for (let i = 0; i < strands; i++) {
      for (let k = 0; k < 4; k++) {
        const a0 = ((i + k * 0.5) / strands) * Math.PI * 2;
        const a1 = ((i + (k + 1) * 0.5) / strands) * Math.PI * 2;
        const r0 = 0.225 - k * 0.025;
        const r1 = 0.225 - (k + 1) * 0.025;
        netPts.push(Math.cos(a0) * r0, RIM_Y - k * 0.11, side * RIM_Z + Math.sin(a0) * r0);
        netPts.push(Math.cos(a1) * r1, RIM_Y - (k + 1) * 0.11, side * RIM_Z + Math.sin(a1) * r1);
        const a2 = ((i - (k + 1) * 0.5) / strands) * Math.PI * 2;
        netPts.push(Math.cos(a0) * r0, RIM_Y - k * 0.11, side * RIM_Z + Math.sin(a0) * r0);
        netPts.push(Math.cos(a2) * r1, RIM_Y - (k + 1) * 0.11, side * RIM_Z + Math.sin(a2) * r1);
      }
    }
    const netGeo = new THREE.BufferGeometry();
    netGeo.setAttribute("position", new THREE.Float32BufferAttribute(netPts, 3));
    const net = new THREE.LineSegments(netGeo, netMat);

    g.add(pole, arm, board, frame, rim, net);
    scene.add(g);
  }

  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 24), new THREE.MeshStandardMaterial({ map: texBall(), roughness: 0.75 }));
  ball.position.set(0.9, 0.12, -1.4);
  ball.rotation.set(0.4, 1.2, 0.2);
  scene.add(ball);
  const ball2 = ball.clone();
  ball2.position.set(-1.6, 0.12, -11.3);
  scene.add(ball2);

  /* Chain-link fence around the court */
  const linkTex = texChainLink();
  const fenceMat = (len: number) => {
    const t = linkTex.clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(len / 0.22, 4 / 0.22);
    t.needsUpdate = true;
    return new THREE.MeshStandardMaterial({ map: t, transparent: true, depthWrite: false, side: THREE.DoubleSide, roughness: 0.6, metalness: 0.6 });
  };
  const FX = 11;
  const FZ = 20;
  const fenceH = 4;
  const sides: [number, number, number, number][] = [
    [0, -FZ, FX * 2, 0], [0, FZ, FX * 2, 0], [-FX, 0, FZ * 2, Math.PI / 2], [FX, 0, FZ * 2, Math.PI / 2],
  ];
  for (const [x, z, len, rot] of sides) {
    // The near side stays open so the opening shot isn't caged.
    if (z === FZ) continue;
    const f = new THREE.Mesh(new THREE.PlaneGeometry(len, fenceH), fenceMat(len));
    f.position.set(x, fenceH / 2, z);
    f.rotation.y = rot;
    scene.add(f);
  }
  const postGeo = new THREE.CylinderGeometry(0.04, 0.04, fenceH, 8);
  for (let x = -FX; x <= FX; x += 2.75)
    for (const z of [-FZ]) {
      const p = new THREE.Mesh(postGeo, steel);
      p.position.set(x, fenceH / 2, z);
      scene.add(p);
    }
  for (let z = -FZ; z <= FZ; z += 2.5)
    for (const x of [-FX, FX]) {
      const p = new THREE.Mesh(postGeo, steel);
      p.position.set(x, fenceH / 2, z);
      scene.add(p);
    }

  /* Floodlights with visible beams */
  const glow = glowTexture("rgba(255,244,224,1)", "rgba(255,220,180,0.3)");
  const beams: THREE.Mesh[] = [];
  const lampMat = new THREE.MeshBasicMaterial({ color: "#fff6e6" });
  const beamMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: { uColor: { value: new THREE.Color("#ffe9cc") } },
    vertexShader: `varying float vV; varying vec3 vN; varying vec3 vView;
      void main(){ vV = uv.y; vec4 mv = modelViewMatrix * vec4(position,1.0); vView = -mv.xyz; vN = normalMatrix * normal; gl_Position = projectionMatrix * mv; }`,
    fragmentShader: `uniform vec3 uColor; varying float vV; varying vec3 vN; varying vec3 vView;
      void main(){
        float facing = abs(dot(normalize(vN), normalize(vView)));
        float a = pow(vV, 1.8) * 0.055 * smoothstep(0.0, 0.7, facing);
        gl_FragColor = vec4(uColor * a, a);
      }`,
  });
  const lightSpots: [number, number][] = [[-10.2, -17.5], [10.2, -17.5], [-10.2, 17.5], [10.2, 17.5]];
  for (const [x, z] of lightSpots) {
    const H = 12;
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.22, H, 12), steel);
    pole.position.set(x, H / 2, z);
    scene.add(pole);
    const head = new THREE.Group();
    head.position.set(x, H + 0.4, z);
    head.lookAt(0, 0, z * 0.25);
    const housing = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.3, 0.35), steel);
    head.add(housing);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 2; j++) {
        const lamp = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.42), lampMat);
        lamp.position.set(-0.8 + i * 0.8, -0.26 + j * 0.52, 0.18);
        head.add(lamp);
      }
    scene.add(head);

    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.7 }));
    halo.scale.set(6.5, 6.5, 1);
    halo.position.copy(head.position);
    scene.add(halo);

    const target = v(0, 0, z * 0.25);
    const spot = new THREE.SpotLight("#ffe7c4", 420, 70, 0.62, 0.6, 2);
    spot.position.copy(head.position);
    spot.target.position.copy(target);
    scene.add(spot, spot.target);

    const dir = target.clone().sub(head.position);
    const L = dir.length();
    const beamGeo = new THREE.CylinderGeometry(0.9, Math.tan(0.55) * L, L, 40, 1, true);
    beamGeo.translate(0, -L / 2, 0);
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.copy(head.position);
    beam.quaternion.setFromUnitVectors(v(0, -1, 0), dir.normalize());
    scene.add(beam);
    beams.push(beam);
  }

  /* Scoreboard on the +x sideline — the "Live" chapter looks up at it. */
  const board = canvas(1024, 512);
  const boardTex = canvasTexture(board.c);
  let clock = 42;
  const drawBoard = () => {
    const ctx = board.ctx;
    ctx.fillStyle = "#04050a";
    ctx.fillRect(0, 0, 1024, 512);
    ctx.fillStyle = "#0c0f1c";
    for (let y = 0; y < 512; y += 8) ctx.fillRect(0, y, 1024, 1);
    ctx.fillStyle = ROSE;
    ctx.font = "700 54px 'Onest', 'Helvetica Neue', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("BUL  ● LIVE", 48, 86);
    ctx.fillStyle = "#8f98b8";
    ctx.textAlign = "right";
    ctx.font = "500 40px ui-monospace, Menlo, monospace";
    ctx.fillText("Q4  00:" + String(clock).padStart(2, "0"), 976, 84);
    ctx.textAlign = "center";
    ctx.fillStyle = "#f3f0ff";
    ctx.font = "300 190px 'Onest', 'Helvetica Neue', sans-serif";
    ctx.fillText("102", 300, 330);
    ctx.fillText("98", 740, 330);
    ctx.fillStyle = VIOLET;
    ctx.fillText(":", 520, 318);
    ctx.font = "500 36px ui-monospace, Menlo, monospace";
    ctx.fillStyle = "#8f98b8";
    ctx.fillText("HOME", 300, 410);
    ctx.fillText("AWAY", 740, 410);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("YOUR CALL  104 : 99   ·   RANK #24 ▲3", 512, 480);
    boardTex.needsUpdate = true;
  };
  drawBoard();
  const scoreboard = new THREE.Group();
  const sbPole = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.24, 5, 12), steel);
  sbPole.position.y = 2.5;
  const sbFrame = new THREE.Mesh(new THREE.BoxGeometry(0.3, 2.9, 5.6), steel);
  sbFrame.position.y = 6.3;
  const sbScreen = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 2.6), new THREE.MeshBasicMaterial({ map: boardTex, toneMapped: false }));
  sbScreen.position.set(-0.16, 6.3, 0);
  sbScreen.rotation.y = -Math.PI / 2;
  scoreboard.add(sbPole, sbFrame, sbScreen);
  scoreboard.position.set(12.4, 0, 2);
  scene.add(scoreboard);
  const sbLight = new THREE.PointLight(VIOLET, 30, 18, 2);
  sbLight.position.set(11, 6.3, 2);
  scene.add(sbLight);

  /* Skyline: merged boxes with world-scaled window UVs. */
  {
    const rnd = mulberry32(77);
    const geos: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 150; i++) {
      const a = rnd() * Math.PI * 2;
      const r = 95 + rnd() * 120;
      const w = 8 + rnd() * 16;
      const d = 8 + rnd() * 16;
      const h = 10 + Math.pow(rnd(), 2.2) * 58;
      const g = new THREE.BoxGeometry(w, h, d);
      const uv = g.getAttribute("uv") as THREE.BufferAttribute;
      for (let f = 0; f < 6; f++) {
        const faceW = f < 2 ? d : w;
        for (let k = 0; k < 4; k++) {
          const idx = f * 4 + k;
          if (f === 2 || f === 3) uv.setXY(idx, 0.005, 0.005);
          else uv.setXY(idx, uv.getX(idx) * (faceW / 26), uv.getY(idx) * (h / 52));
        }
      }
      g.translate(Math.cos(a) * r, h / 2, Math.sin(a) * r);
      geos.push(g);
    }
    const winTex = texWindows();
    winTex.wrapS = winTex.wrapT = THREE.RepeatWrapping;
    const city = new THREE.Mesh(
      mergeGeometries(geos),
      new THREE.MeshStandardMaterial({ color: "#090b14", emissive: "#ffffff", emissiveMap: winTex, emissiveIntensity: 1.4, roughness: 0.9 }),
    );
    geos.forEach((g) => g.dispose());
    scene.add(city);
  }

  /* Rain: streaks wrapped around the camera entirely in the vertex shader. */
  const rain = (() => {
    const N = reduced ? 0 : 5200;
    const pos = new Float32Array(N * 2 * 3);
    const seed = new Float32Array(N * 2 * 4);
    const rnd = mulberry32(13);
    for (let i = 0; i < N; i++) {
      const s = [rnd() * 50, rnd() * 30, rnd() * 50, 14 + rnd() * 8];
      for (let e = 0; e < 2; e++) {
        const k = i * 2 + e;
        pos[k * 3 + 1] = e;
        seed.set(s, k * 4);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 4));
    const m = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uCenter: { value: new THREE.Vector3() } },
      vertexShader: `attribute vec4 aSeed; uniform float uTime; uniform vec3 uCenter; varying float vA;
        void main(){
          float e = position.y;
          vec3 p;
          p.x = uCenter.x + mod(aSeed.x - uCenter.x, 50.0) - 25.0;
          p.z = uCenter.z + mod(aSeed.z - uCenter.z, 50.0) - 25.0;
          p.y = mod(aSeed.y - uTime * aSeed.w, 30.0);
          p.y += e * 0.55; p.x += e * 0.06;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          vA = e * smoothstep(42.0, 4.0, -mv.z) * smoothstep(0.0, 1.0, p.y);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `varying float vA; void main(){ gl_FragColor = vec4(vec3(0.62,0.68,0.85) * vA * 0.5, vA * 0.5); }`,
    });
    const l = new THREE.LineSegments(g, m);
    l.frustumCulled = false;
    return l;
  })();
  scene.add(rain);

  /* Confetti: instanced cards that tumble through face, edge and back,
     slipping sideways fastest when edge-on (3d-falling-leaves). */
  const CONF = reduced ? 60 : 240;
  const confetti = new THREE.InstancedMesh(
    new THREE.PlaneGeometry(0.07, 0.13),
    new THREE.MeshLambertMaterial({ side: THREE.DoubleSide, emissive: "#261c44" }),
    CONF,
  );
  confetti.frustumCulled = false;
  const cSeed: { x: number; y: number; z: number; fall: number; omega: number; slip: number; phase: number; roll: number; dir: number; tilt: number }[] = [];
  {
    const rnd = mulberry32(31);
    const palette = [ROSE, VIOLET, "#ffffff", "#ffb800", VIOLET, ROSE];
    const col = new THREE.Color();
    for (let i = 0; i < CONF; i++) {
      cSeed.push({
        x: rnd() * 34, y: rnd() * 14, z: rnd() * 34,
        fall: 0.5 + rnd() * 0.6, omega: 1.6 + rnd() * 2.4, slip: 0.4 + rnd() * 0.7,
        phase: rnd() * 6.28, roll: 0.3 + rnd() * 0.9, dir: rnd() * 6.28, tilt: rnd() * 6.28,
      });
      confetti.setColorAt(i, col.set(palette[i % palette.length]));
    }
  }
  scene.add(confetti);
  const dummy = new THREE.Object3D();

  /* Post: restrained bloom so lamps and the rim glow without washing out. */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.42, 0.5, 0.86);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  /* ── state ── */
  let keyTimes = KEYS.map((_, i) => i / (KEYS.length - 1));
  let target = 0;
  let prog = 0;
  const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
  const camPos = new THREE.Vector3();
  const camTgt = new THREE.Vector3();
  const tmp = new THREE.Vector3();

  const sample = (p: number) => {
    let i = 0;
    while (i < keyTimes.length - 2 && p > keyTimes[i + 1]) i++;
    const span = Math.max(1e-4, keyTimes[i + 1] - keyTimes[i]);
    const u = smooth(0, 1, (p - keyTimes[i]) / span);
    const k = (j: number) => KEYS[Math.max(0, Math.min(KEYS.length - 1, j))];
    catmull(k(i - 1).pos, k(i).pos, k(i + 1).pos, k(i + 2).pos, u, camPos);
    catmull(k(i - 1).tgt, k(i).tgt, k(i + 1).tgt, k(i + 2).tgt, u, camTgt);
    return k(i).fov + (k(i + 1).fov - k(i).fov) * u;
  };

  const resize = () => {
    const w = canvasEl.clientWidth;
    const h = canvasEl.clientHeight;
    if (!w || !h) return;
    const r = renderRatio(w);
    renderer.setPixelRatio(r);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(r);
    composer.setSize(w, h);
    bloom.resolution.set(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvasEl);
  resize();

  const clockTimer = window.setInterval(() => {
    clock = clock <= 0 ? 59 : clock - 1;
    drawBoard();
  }, 1000);

  let raf = 0;
  let last = performance.now();
  let time = 0;
  let running = true;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;

    prog = reduced ? target : damp(prog, target, 4.5, dt);
    ptr.sx = damp(ptr.sx, ptr.x, 3, dt);
    ptr.sy = damp(ptr.sy, ptr.y, 3, dt);
    const fov = sample(prog);
    // Portrait screens need a wider lens to keep the court in frame.
    camera.fov = fov * (camera.aspect < 0.8 ? 1.35 : 1);
    camera.updateProjectionMatrix();
    tmp.subVectors(camTgt, camPos).normalize();
    const right = tmp.clone().cross(camera.up).normalize();
    camera.position.copy(camPos).addScaledVector(right, ptr.sx * 0.45).add(v(0, -ptr.sy * 0.25, 0));
    camera.lookAt(camTgt);

    (rain.material as THREE.ShaderMaterial).uniforms.uTime.value = time;
    (rain.material as THREE.ShaderMaterial).uniforms.uCenter.value.copy(camera.position);

    const t = reduced ? 3 : time;
    const cx = camTgt.x;
    const cz = camTgt.z;
    for (let i = 0; i < CONF; i++) {
      const s = cSeed[i];
      const ang = s.phase + s.omega * t;
      const side = -(s.slip / s.omega) * Math.cos(ang);
      const wind = t * 0.35;
      const x = cx + ((((s.x + wind - cx) % 34) + 34) % 34) - 17 + Math.cos(s.dir) * side;
      const z = cz + ((((s.z - cz) % 34) + 34) % 34) - 17 + Math.sin(s.dir) * side;
      const y = 14 - ((s.y + t * s.fall) % 14);
      dummy.position.set(x, y, z);
      dummy.rotation.set(ang, s.dir + s.roll * t, s.tilt + Math.sin(t * s.roll) * 0.6);
      dummy.updateMatrix();
      confetti.setMatrixAt(i, dummy.matrix);
    }
    confetti.instanceMatrix.needsUpdate = true;

    moon.rotation.y += dt * 0.004;

    composer.render();
  };
  raf = requestAnimationFrame(frame);

  const onVis = () => {
    if (document.hidden && running) {
      cancelAnimationFrame(raf);
      running = false;
    } else if (!document.hidden && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  document.addEventListener("visibilitychange", onVis);

  return {
    setProgress: (p) => (target = p),
    setKeyTimes: (t) => {
      if (t.length === KEYS.length) keyTimes = t;
    },
    setPointer: (x, y) => {
      ptr.x = x;
      ptr.y = y;
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      window.clearInterval(clockTimer);
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      disposeScene(scene);
      composer.dispose();
      renderer.dispose();
    },
  };
}
