import * as THREE from "three";
import {
  canvas,
  canvasTexture,
  clamp,
  damp,
  disposeScene,
  glowTexture,
  lerp,
  mulberry32,
  noise2D,
  prefersReducedMotion,
  renderRatio,
  smooth,
} from "../shared/three-utils";

/* Build clock: each stage is a slice of height, like a quarter of a game. */
export const STAGES = [
  { q: "Q1", name: "Foundation", t0: 0, t1: 0.9, h0: 0, h1: 1.2 },
  { q: "Q2", name: "Hardwood", t0: 0.9, t1: 1.5, h0: 1.2, h1: 1.62 },
  { q: "Q3", name: "The stands", t0: 1.5, t1: 3.4, h0: 1.62, h1: 7.45 },
  { q: "Q4", name: "Roof truss", t0: 3.4, t1: 4.3, h0: 7.45, h1: 9.4 },
  { q: "Final", name: "Jumbotron", t0: 4.3, t1: 5.2, h0: 9.4, h1: 12.8 },
] as const;
export const BUILD_T = 5.2;
const TOP = 12.8;

export const PRESETS = ["Morning", "Noon", "Dusk", "Night"] as const;
type Preset = {
  top: string; hor: string; fog: string; sun: string; sunI: number; sunDir: [number, number, number];
  hemiS: string; hemiG: string; hemiI: number; grassB: string; grassT: string; ground: string; night: number; exp: number;
};
const P: Preset[] = [
  { top: "#cfd3c9", hor: "#f0e3c4", fog: "#eadcbb", sun: "#ffe3b5", sunI: 2.6, sunDir: [-0.6, 0.45, 0.66], hemiS: "#f4ead2", hemiG: "#6d6340", hemiI: 1.1, grassB: "#6c6a3c", grassT: "#a9a766", ground: "#858250", night: 0, exp: 1.0 },
  { top: "#94b4cc", hor: "#e8ecea", fog: "#dfe5e2", sun: "#fff7ea", sunI: 3.2, sunDir: [0.25, 0.92, 0.3], hemiS: "#eef3f6", hemiG: "#5b6238", hemiI: 1.2, grassB: "#5a6833", grassT: "#9fb060", ground: "#77844a", night: 0, exp: 0.95 },
  { top: "#4d4c78", hor: "#f2a676", fog: "#d99a78", sun: "#ff9a5a", sunI: 2.4, sunDir: [0.75, 0.16, -0.64], hemiS: "#f0b08c", hemiG: "#3c2c2a", hemiI: 0.8, grassB: "#5c4a30", grassT: "#b58e5c", ground: "#6d5a3c", night: 0.25, exp: 1.05 },
  { top: "#050814", hor: "#1b2340", fog: "#141a30", sun: "#9fb2ff", sunI: 0.5, sunDir: [-0.3, 0.7, -0.6], hemiS: "#3a4575", hemiG: "#0b0c12", hemiI: 0.55, grassB: "#171d18", grassT: "#34453a", ground: "#1c2420", night: 1, exp: 1.1 },
];

/* ─── textures ─────────────────────────────────────────────────────────── */

function texConcrete(seed: number, base: [number, number, number], rep: [number, number]) {
  const W = 256;
  const { c, ctx } = canvas(W, W);
  const img = ctx.createImageData(W, W);
  const n = noise2D(seed);
  const rnd = mulberry32(seed);
  for (let y = 0; y < W; y++)
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4;
      const k = n(x / 30, y / 30) * 10 + n(x / 6, y / 6) * 5 + (rnd() - 0.5) * 14;
      img.data[i] = base[0] + k;
      img.data[i + 1] = base[1] + k;
      img.data[i + 2] = base[2] + k;
      img.data[i + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
  // Form-work seams.
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  for (let y = 0; y < W; y += 64) ctx.fillRect(0, y, W, 2);
  return canvasTexture(c, { repeat: rep });
}

function texHardwood() {
  const S = 96;
  const { c, ctx } = canvas(3.2 * S, 5.6 * S);
  const rnd = mulberry32(8);
  const n = noise2D(8);
  for (let x = 0; x < c.width; x += 10) {
    let y = 0;
    while (y < c.height) {
      const len = 60 + rnd() * 140;
      const l = 175 + rnd() * 35;
      ctx.fillStyle = `rgb(${l + 30}, ${l - 30}, ${l - 95})`;
      ctx.fillRect(x, y, 10, len);
      ctx.fillStyle = "rgba(60,30,10,0.25)";
      ctx.fillRect(x, y, 1, len);
      y += len;
    }
  }
  const img = ctx.getImageData(0, 0, c.width, c.height);
  for (let y = 0; y < c.height; y++)
    for (let x = 0; x < c.width; x++) {
      const i = (y * c.width + x) * 4;
      const g = n(x / 3, y / 40) * 10;
      img.data[i] += g; img.data[i + 1] += g; img.data[i + 2] += g;
    }
  ctx.putImageData(img, 0, 0);

  ctx.setTransform(S, 0, 0, S, 1.6 * S, 2.8 * S);
  ctx.strokeStyle = "rgba(255,255,255,0.95)";
  ctx.lineWidth = 0.035;
  ctx.strokeRect(-1.5, -2.7, 3, 5.4);
  ctx.beginPath(); ctx.moveTo(-1.5, 0); ctx.lineTo(1.5, 0); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, 0.36, 0, Math.PI * 2); ctx.stroke();
  for (const s of [-1, 1]) {
    ctx.fillStyle = "rgba(232, 52, 78, 0.85)";
    const y0 = s < 0 ? -2.7 : 2.7 - 1.15;
    ctx.fillRect(-0.49, y0, 0.98, 1.15);
    ctx.strokeRect(-0.49, y0, 0.98, 1.15);
    ctx.beginPath();
    ctx.arc(0, s * 2.45, 1.35, s < 0 ? 0.15 : Math.PI + 0.15, s < 0 ? Math.PI - 0.15 : -0.15);
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(232, 52, 78, 0.9)";
  ctx.beginPath(); ctx.arc(0, 0, 0.24, 0, Math.PI * 2); ctx.fill();
  return canvasTexture(c);
}

function texFacade(night: boolean) {
  const { c, ctx } = canvas(1024, 256);
  const rnd = mulberry32(night ? 4 : 2);
  ctx.fillStyle = night ? "#000" : "#8e9aa0";
  ctx.fillRect(0, 0, 1024, 256);
  for (let x = 0; x < 32; x++)
    for (let y = 0; y < 4; y++) {
      if (night) {
        const on = rnd() > 0.35;
        ctx.fillStyle = on ? `rgba(255, ${200 + ((rnd() * 40) | 0)}, 150, ${0.5 + rnd() * 0.5})` : "rgba(0,0,0,1)";
      } else {
        const l = 120 + rnd() * 40;
        ctx.fillStyle = `rgb(${l - 20}, ${l}, ${l + 12})`;
      }
      ctx.fillRect(x * 32 + 3, y * 64 + 4, 26, 56);
    }
  return canvasTexture(c, { repeat: [3, 1] });
}

function texJumbo() {
  const { c, ctx } = canvas(512, 340);
  ctx.fillStyle = "#07070b";
  ctx.fillRect(0, 0, 512, 340);
  ctx.fillStyle = "#e8344e";
  ctx.font = "900 150px 'Archivo', 'Helvetica Neue', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("BUL", 256, 170);
  ctx.fillStyle = "#f6efe0";
  ctx.font = "600 44px 'Archivo', 'Helvetica Neue', sans-serif";
  ctx.fillText("102 — 98", 256, 250);
  ctx.fillStyle = "#9a94b8";
  ctx.font = "500 26px ui-monospace, Menlo, monospace";
  ctx.fillText("FINAL · YOU CALLED IT", 256, 300);
  return canvasTexture(c);
}

/* ─── scene ────────────────────────────────────────────────────────────── */

export type BuildHandle = {
  rebuild: () => void;
  seek: (t: number) => void;
  togglePause: () => boolean;
  setPreset: (i: number) => void;
  recenter: () => void;
  setPointer: (x: number, y: number) => void;
  setActive: (on: boolean) => void;
  dispose: () => void;
};

export function createBuild(
  canvasEl: HTMLCanvasElement,
  onFrame: (t: number, pct: number, stage: number) => void,
): BuildHandle {
  const reduced = prefersReducedMotion();
  const mobile = innerWidth < 700;

  const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.localClippingEnabled = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog("#eadcbb", 95, 320);
  const camera = new THREE.PerspectiveCamera(28, 1, 0.5, 900);

  /* The cut plane: everything structural keeps only y <= h. */
  const CLIP = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  /* Scaffolding lives in the band just above the line. */
  const SC_LO = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const SC_HI = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);

  const clipped = <T extends THREE.Material>(m: T) => {
    m.clippingPlanes = [CLIP];
    m.clipShadows = true;
    return m;
  };

  /* ── sky ── */
  const skyU = { uTop: { value: new THREE.Color() }, uHor: { value: new THREE.Color() }, uSun: { value: new THREE.Vector3() }, uSunC: { value: new THREE.Color() } };
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(600, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false, uniforms: skyU,
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform vec3 uTop, uHor, uSun, uSunC; varying vec3 vDir;
        void main(){
          float h = max(vDir.y, 0.0);
          vec3 col = mix(uHor, uTop, pow(smoothstep(0.0, 0.55, h), 0.8));
          float s = max(dot(normalize(vDir), normalize(uSun)), 0.0);
          col += uSunC * (pow(s, 12.0) * 0.25 + pow(s, 900.0) * 1.2);
          gl_FragColor = vec4(col, 1.0);
        }`,
    }),
  );
  scene.add(sky);

  const stars = (() => {
    const N = 3500;
    const pos = new Float32Array(N * 3);
    const rnd = mulberry32(99);
    for (let i = 0; i < N; i++) {
      const th = rnd() * Math.PI * 2;
      const el = 0.05 + rnd() * 1.2;
      pos.set([Math.cos(th) * Math.cos(el) * 520, Math.sin(el) * 520, Math.sin(th) * Math.cos(el) * 520], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({ color: "#dfe4ff", size: 1.3, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false }));
  })();
  scene.add(stars);

  /* ── lights ── */
  const hemi = new THREE.HemisphereLight("#fff", "#444", 1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight("#fff", 3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  const sc = sun.shadow.camera;
  sc.left = -26; sc.right = 26; sc.top = 26; sc.bottom = -26; sc.near = 1; sc.far = 120;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  scene.add(sun, sun.target);

  /* ── terrain: flat meadow around the plaza, hills rising far out ── */
  const terrain = (() => {
    const n = noise2D(4);
    const R = 34, A = 160;
    const g = new THREE.BufferGeometry();
    const pos: number[] = [];
    const col: number[] = [];
    const idx: number[] = [];
    const cA = new THREE.Color("#8e8a56"), cB = new THREE.Color("#b8ab76"), cC = new THREE.Color("#c9bfa0"), tmp = new THREE.Color();
    for (let i = 0; i <= R; i++) {
      const r = 12 * Math.pow(i / R, 2.2) * 26 + (i === 0 ? 0 : 0.5);
      for (let j = 0; j < A; j++) {
        const a = (j / A) * Math.PI * 2;
        const x = Math.cos(a) * r, z = Math.sin(a) * r;
        const far = smooth(70, 220, r);
        const hgt = far * (18 + 22 * n(x / 60, z / 60)) * (0.6 + 0.4 * n(x / 20 + 3, z / 20)) + n(x / 9, z / 9) * 0.25 * smooth(15, 22, r);
        pos.push(x, Math.max(-0.2, hgt), z);
        tmp.copy(cA).lerp(cB, 0.5 + 0.5 * n(x / 14, z / 14)).lerp(cC, far * 0.7);
        col.push(tmp.r, tmp.g, tmp.b);
      }
    }
    for (let i = 0; i < R; i++)
      for (let j = 0; j < A; j++) {
        const a = i * A + j, b = i * A + ((j + 1) % A), c2 = (i + 1) * A + j, d = (i + 1) * A + ((j + 1) % A);
        idx.push(a, c2, b, b, c2, d);
      }
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 1, flatShading: false }));
    m.receiveShadow = true;
    return m;
  })();
  scene.add(terrain);

  const plaza = new THREE.Mesh(
    new THREE.CircleGeometry(14.5, 96),
    new THREE.MeshStandardMaterial({ map: texConcrete(12, [196, 186, 162], [8, 8]), roughness: 0.95 }),
  );
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.y = 0.02;
  plaza.receiveShadow = true;
  scene.add(plaza);

  /* ── grass: one instanced ribbon, wind entirely in the vertex shader ── */
  const grassU = THREE.UniformsUtils.merge([
    THREE.UniformsLib.fog,
    { uTime: { value: 0 }, uBase: { value: new THREE.Color() }, uTip: { value: new THREE.Color() } },
  ]);
  const grass = (() => {
    const N = reduced ? 20000 : mobile ? 45000 : 110000;
    const base = new THREE.BufferGeometry();
    // 3-segment tapered blade, y in [0,1]
    const bp = [-0.5, 0, 0, 0.5, 0, 0, -0.38, 0.35, 0, 0.38, 0.35, 0, -0.22, 0.7, 0, 0.22, 0.7, 0, 0, 1, 0];
    base.setAttribute("position", new THREE.Float32BufferAttribute(bp, 3));
    base.setIndex([0, 1, 2, 2, 1, 3, 2, 3, 4, 4, 3, 5, 4, 5, 6]);
    const g = new THREE.InstancedBufferGeometry();
    g.index = base.index;
    g.attributes.position = base.attributes.position;
    const off = new Float32Array(N * 4);
    const rnd = mulberry32(21);
    const n = noise2D(5);
    for (let i = 0; i < N; i++) {
      const r = 15 + Math.pow(rnd(), 1.35) * 62;
      const a = rnd() * Math.PI * 2;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const patch = 0.55 + 0.45 * n(x / 6, z / 6);
      off.set([x, z, rnd() * Math.PI, (0.16 + rnd() * 0.24) * patch], i * 4);
    }
    g.setAttribute("aOff", new THREE.InstancedBufferAttribute(off, 4));
    g.instanceCount = N;
    const m = new THREE.ShaderMaterial({
      uniforms: grassU,
      fog: true,
      side: THREE.DoubleSide,
      vertexShader: `
        #include <common>
        #include <fog_pars_vertex>
        attribute vec4 aOff; uniform float uTime; varying float vH;
        void main(){
          vec3 p = position;
          vH = p.y;
          float s = aOff.w;
          p.x *= 0.05; p.y *= s;
          float c = cos(aOff.z), si = sin(aOff.z);
          p = vec3(p.x * c, p.y, p.x * si);
          vec3 w = vec3(aOff.x, 0.0, aOff.y);
          float gust = sin(uTime * 1.3 + w.x * 0.18 + w.z * 0.11) * 0.5 + sin(uTime * 2.7 + w.x * 0.5) * 0.18;
          float bend = vH * vH * (0.22 + gust * 0.2) * s;
          p.x += bend; p.z += bend * 0.35; p.y -= bend * bend * 0.4;
          vec4 mvPosition = modelViewMatrix * vec4(p + w, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
      fragmentShader: `
        #include <common>
        #include <fog_pars_fragment>
        uniform vec3 uBase, uTip; varying float vH;
        void main(){
          gl_FragColor = vec4(mix(uBase, uTip, smoothstep(0.0, 1.0, vH)), 1.0);
          #include <fog_fragment>
        }`,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.frustumCulled = false;
    return mesh;
  })();
  scene.add(grass);

  /* ── the arena ── */
  const arena = new THREE.Group();
  scene.add(arena);
  const concrete = clipped(new THREE.MeshStandardMaterial({ map: texConcrete(3, [206, 198, 180], [6, 1]), roughness: 0.9 }));
  const concreteDark = clipped(new THREE.MeshStandardMaterial({ map: texConcrete(6, [168, 160, 144], [10, 2]), roughness: 0.95 }));
  const steel = clipped(new THREE.MeshStandardMaterial({ color: "#2e2a26", roughness: 0.45, metalness: 0.75 }));
  const white = clipped(new THREE.MeshStandardMaterial({ color: "#efe8da", roughness: 0.6 }));
  const add = (m: THREE.Mesh) => {
    m.castShadow = true;
    m.receiveShadow = true;
    arena.add(m);
    return m;
  };

  // Q1 foundation: stepped plinth with four stairs.
  [[10.6, 0, 0.4], [10.1, 0.4, 0.8], [9.7, 0.8, 1.2]].forEach(([r, y0, y1]) => {
    const m = add(new THREE.Mesh(new THREE.CylinderGeometry(r, r, y1 - y0, 128), concreteDark));
    m.position.y = (y0 + y1) / 2;
  });
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
    for (let s = 0; s < 6; s++) {
      const step = add(new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 0.34), concrete));
      const r = 11.9 - s * 0.34;
      step.position.set(Math.cos(a) * r, 0.1 + s * 0.2, Math.sin(a) * r);
      step.rotation.y = -a + Math.PI / 2;
    }
  }

  // Q2 hardwood.
  const deck = add(new THREE.Mesh(new THREE.CylinderGeometry(9.4, 9.4, 0.14, 128), concrete));
  deck.position.y = 1.27;
  const floor = add(new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 0.16, 5.6),
    [concreteDark, concreteDark, clipped(new THREE.MeshStandardMaterial({ map: texHardwood(), roughness: 0.4 })), concreteDark, concreteDark, concreteDark],
  ));
  floor.position.y = 1.42;

  // Q3 seating bowl: a lathed rake of treads and risers.
  const TIERS = 12;
  const r0 = 3.9, rN = 8.6, y0 = 1.5, yN = 7.2;
  const tread = (rN - r0) / TIERS;
  const rise = (yN - y0) / TIERS;
  const prof: THREE.Vector2[] = [new THREE.Vector2(r0 - 0.01, 1.34), new THREE.Vector2(r0, y0)];
  for (let i = 0; i < TIERS; i++) {
    prof.push(new THREE.Vector2(r0 + tread * (i + 1), y0 + rise * i));
    prof.push(new THREE.Vector2(r0 + tread * (i + 1), y0 + rise * (i + 1)));
  }
  prof.push(new THREE.Vector2(rN + 0.4, yN), new THREE.Vector2(rN + 0.4, 1.34));
  add(new THREE.Mesh(new THREE.LatheGeometry(prof, 160), concrete));

  // Seats: instanced, colored by section with scattered fans.
  {
    const seatGeo = new THREE.BoxGeometry(0.2, 0.2, 0.16);
    seatGeo.translate(0, 0.1, 0);
    const spots: { x: number; y: number; z: number; a: number; tier: number }[] = [];
    for (let i = 0; i < TIERS; i++) {
      const r = r0 + tread * (i + 0.55);
      const y = y0 + rise * i;
      const count = Math.floor((Math.PI * 2 * r) / 0.26);
      for (let k = 0; k < count; k++) {
        const a = (k / count) * Math.PI * 2;
        const sec = (a / (Math.PI * 2)) * 10;
        if (Math.abs(sec - Math.round(sec)) < 0.045) continue; // aisles
        spots.push({ x: Math.cos(a) * r, y, z: Math.sin(a) * r, a, tier: i });
      }
    }
    const seats = new THREE.InstancedMesh(seatGeo, clipped(new THREE.MeshStandardMaterial({ roughness: 0.6 })), spots.length);
    const d = new THREE.Object3D();
    const col = new THREE.Color();
    const rnd = mulberry32(17);
    spots.forEach((s, i) => {
      d.position.set(s.x, s.y, s.z);
      d.lookAt(0, s.y, 0);
      d.updateMatrix();
      seats.setMatrixAt(i, d.matrix);
      const fan = rnd() < 0.1;
      col.set(fan ? "#f6efe0" : s.tier < 5 ? "#e8344e" : s.tier < 9 ? "#6d52e8" : "#2e2a26");
      seats.setColorAt(i, col);
    });
    seats.castShadow = true;
    seats.receiveShadow = true;
    arena.add(seats);
  }

  // Q3 facade: glass drum, piers and cornice bands.
  const facadeDay = texFacade(false);
  const facadeNight = texFacade(true);
  const glass = clipped(new THREE.MeshStandardMaterial({ map: facadeDay, emissive: "#ffffff", emissiveMap: facadeNight, emissiveIntensity: 0, roughness: 0.25, metalness: 0.4, side: THREE.DoubleSide }));
  const drum = add(new THREE.Mesh(new THREE.CylinderGeometry(9.15, 9.15, 5.9, 160, 1, true), glass));
  drum.position.y = 1.34 + 2.95;
  const PIERS = 36;
  for (let k = 0; k < PIERS; k++) {
    const a = (k / PIERS) * Math.PI * 2;
    const p = add(new THREE.Mesh(new THREE.BoxGeometry(0.42, 6.1, 0.5), white));
    p.position.set(Math.cos(a) * 9.36, 1.34 + 3.05, Math.sin(a) * 9.36);
    p.rotation.y = -a;
  }
  [[3.3, 0.1], [5.3, 0.1], [7.3, 0.22]].forEach(([y, t]) => {
    const band = add(new THREE.Mesh(new THREE.TorusGeometry(9.42, t, 10, 180), white));
    band.rotation.x = Math.PI / 2;
    band.position.y = y;
  });

  // Q4 roof truss and membrane canopy.
  [[7.75, 0.09], [8.9, 0.09]].forEach(([y, t]) => {
    const ring = add(new THREE.Mesh(new THREE.TorusGeometry(9.1, t, 8, 180), steel));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
  });
  {
    const strut = new THREE.CylinderGeometry(0.04, 0.04, 1, 6);
    const N = 72;
    for (let k = 0; k < N; k++) {
      const a0 = (k / N) * Math.PI * 2, a1 = ((k + 1) / N) * Math.PI * 2;
      const pA = new THREE.Vector3(Math.cos(a0) * 9.1, 7.75, Math.sin(a0) * 9.1);
      const pB = new THREE.Vector3(Math.cos(a1) * 9.1, 8.9, Math.sin(a1) * 9.1);
      const m = add(new THREE.Mesh(strut, steel));
      m.position.copy(pA).lerp(pB, 0.5);
      m.scale.y = pA.distanceTo(pB);
      m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pB.clone().sub(pA).normalize());
    }
  }
  const canopy = add(new THREE.Mesh(
    new THREE.RingGeometry(6.6, 9.7, 160, 1),
    clipped(new THREE.MeshStandardMaterial({ color: "#f5efe3", roughness: 0.7, side: THREE.DoubleSide, transparent: true, opacity: 0.94 })),
  ));
  canopy.rotation.x = -Math.PI / 2;
  canopy.position.y = 9.02;

  // Final: four light masts and a jumbotron slung between them.
  const mastTops: THREE.Vector3[] = [];
  const mastLamps: THREE.MeshStandardMaterial[] = [];
  for (let k = 0; k < 4; k++) {
    const a = (k / 4) * Math.PI * 2;
    const x = Math.cos(a) * 9.95, z = Math.sin(a) * 9.95;
    const mast = add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 11.2, 12), steel));
    mast.position.set(x, 1.2 + 5.6, z);
    const lampMat = clipped(new THREE.MeshStandardMaterial({ color: "#faf4e4", emissive: "#fff2d0", emissiveIntensity: 0.2 }));
    mastLamps.push(lampMat);
    const head = add(new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.8, 0.22), lampMat));
    head.position.set(x, 12.55, z);
    head.lookAt(0, 4, 0);
    mastTops.push(new THREE.Vector3(x, 12.1, z));
  }
  const jumboTex = texJumbo();
  const jumboFace = clipped(new THREE.MeshStandardMaterial({ map: jumboTex, emissive: "#ffffff", emissiveMap: jumboTex, emissiveIntensity: 0.35, roughness: 0.5 }));
  const jumbo = add(new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.7, 2.6), [jumboFace, jumboFace, steel, steel, jumboFace, jumboFace]));
  jumbo.position.y = 10.6;
  {
    const pts: number[] = [];
    for (const t of mastTops) {
      const cx = Math.round(t.x / 9.95) * 1.3, cz = Math.round(t.z / 9.95) * 1.3;
      pts.push(cx, 11.45, cz, t.x, t.y, t.z);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    arena.add(new THREE.LineSegments(g, clipped(new THREE.LineBasicMaterial({ color: "#2e2a26" }))));
  }
  const nightLight = new THREE.PointLight("#ffe6c0", 0, 40, 1.6);
  nightLight.position.set(0, 13, 0);
  scene.add(nightLight);

  /* ── scaffolding: ignores the cut plane, stands in the band above it ── */
  const scaffoldMat = new THREE.MeshStandardMaterial({ color: "#e2ad4c", roughness: 0.8, clippingPlanes: [SC_LO, SC_HI] });
  {
    const poles: THREE.Matrix4[] = [];
    const d = new THREE.Object3D();
    const R = 10.25, N = 40;
    for (let k = 0; k < N; k++) {
      const a = (k / N) * Math.PI * 2;
      d.position.set(Math.cos(a) * R, TOP / 2, Math.sin(a) * R);
      d.rotation.set(0, 0, 0);
      d.scale.set(1, TOP, 1);
      d.updateMatrix();
      poles.push(d.matrix.clone());
    }
    for (let y = 0.9; y < TOP; y += 1.0) {
      for (let k = 0; k < N; k++) {
        const a0 = (k / N) * Math.PI * 2, a1 = ((k + 1) / N) * Math.PI * 2;
        const pA = new THREE.Vector3(Math.cos(a0) * R, y, Math.sin(a0) * R);
        const pB = new THREE.Vector3(Math.cos(a1) * R, y + (k % 2 ? 1 : 0), Math.sin(a1) * R);
        const pC = new THREE.Vector3(Math.cos(a1) * R, y, Math.sin(a1) * R);
        for (const [p0, p1] of [[pA, pC], [pA, pB]]) {
          d.position.copy(p0).lerp(p1, 0.5);
          d.scale.set(1, p0.distanceTo(p1), 1);
          d.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p1.clone().sub(p0).normalize());
          d.updateMatrix();
          poles.push(d.matrix.clone());
        }
      }
    }
    const inst = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.035, 0.035, 1, 5), scaffoldMat, poles.length);
    poles.forEach((m, i) => inst.setMatrixAt(i, m));
    inst.castShadow = true;
    scene.add(inst);
  }

  /* ── cut line: a glowing ring, a solid cap and construction sparks ── */
  const outerR = (h: number) => (h < 0.4 ? 10.6 : h < 0.8 ? 10.1 : h < 1.2 ? 9.7 : h < 7.45 ? 9.5 : 9.3);
  const innerR = (h: number) => (h < 1.62 ? 0 : h < 7.2 ? r0 + ((h - y0) / (yN - y0)) * (rN - r0) : 9.0);
  const CAP_SEG = 128;
  const capGeo = new THREE.BufferGeometry();
  const capPos = new Float32Array((CAP_SEG + 1) * 2 * 3);
  capGeo.setAttribute("position", new THREE.BufferAttribute(capPos, 3));
  {
    const idx: number[] = [];
    for (let k = 0; k < CAP_SEG; k++) {
      const a = k * 2, b = k * 2 + 1, c2 = k * 2 + 2, d2 = k * 2 + 3;
      idx.push(a, c2, b, b, c2, d2);
    }
    capGeo.setIndex(idx);
  }
  const capMat = new THREE.MeshStandardMaterial({ color: "#d7cdb7", roughness: 1, side: THREE.DoubleSide });
  const cap = new THREE.Mesh(capGeo, capMat);
  cap.frustumCulled = false;
  scene.add(cap);
  const setCap = (h: number) => {
    const ri = innerR(h), ro = outerR(h) - 0.02;
    for (let k = 0; k <= CAP_SEG; k++) {
      const a = (k / CAP_SEG) * Math.PI * 2;
      const c = Math.cos(a), s = Math.sin(a);
      capPos.set([c * ri, h, s * ri, c * ro, h, s * ro], k * 6);
    }
    capGeo.attributes.position.needsUpdate = true;
    capGeo.computeVertexNormals();
  };

  const cutRing = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.012, 6, 200),
    new THREE.MeshBasicMaterial({ color: "#ff3a55", transparent: true, toneMapped: false }),
  );
  cutRing.rotation.x = Math.PI / 2;
  scene.add(cutRing);

  const sparkU = { uTime: { value: 0 }, uH: { value: 0 }, uR: { value: 10 }, uA: { value: 1 }, uMap: { value: glowTexture("rgba(255,200,140,1)", "rgba(255,120,80,0.35)") } };
  const sparks = (() => {
    const N = 360;
    const a = new Float32Array(N * 3);
    const rnd = mulberry32(55);
    for (let i = 0; i < N; i++) a.set([rnd() * Math.PI * 2, rnd(), 0.4 + rnd()], i * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(N * 3), 3));
    g.setAttribute("aS", new THREE.BufferAttribute(a, 3));
    const m = new THREE.ShaderMaterial({
      uniforms: sparkU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `attribute vec3 aS; uniform float uTime, uH, uR; varying float vL;
        void main(){
          float life = fract(uTime * aS.z * 0.6 + aS.y);
          float a = aS.x + life * 0.2;
          vec3 p = vec3(cos(a) * (uR + life * 0.3), uH + life * 1.1, sin(a) * (uR + life * 0.3));
          vL = 1.0 - life;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = (40.0 * vL + 6.0) / -mv.z * 6.0;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `uniform sampler2D uMap; uniform float uA; varying float vL;
        void main(){ vec4 t = texture2D(uMap, gl_PointCoord); gl_FragColor = vec4(t.rgb, t.a * vL * uA); }`,
    });
    const p = new THREE.Points(g, m);
    p.frustumCulled = false;
    return p;
  })();
  scene.add(sparks);

  /* ── state ── */
  let t = reduced ? BUILD_T : 0;
  let paused = false;
  let active = true;
  let preset = 0;
  const cur = {
    top: new THREE.Color(P[0].top), hor: new THREE.Color(P[0].hor), fog: new THREE.Color(P[0].fog), sun: new THREE.Color(P[0].sun),
    hemiS: new THREE.Color(P[0].hemiS), hemiG: new THREE.Color(P[0].hemiG), grassB: new THREE.Color(P[0].grassB), grassT: new THREE.Color(P[0].grassT),
    ground: new THREE.Color(P[0].ground), sunDir: new THREE.Vector3(...P[0].sunDir), sunI: P[0].sunI, hemiI: P[0].hemiI, night: 0, exp: 1,
  };
  const orbit = { az: 0.62, el: 0.19, taz: 0.62, tel: 0.19, dist: 66 };
  const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
  const tc = new THREE.Color();

  const heightAt = (time: number) => {
    for (const s of STAGES) if (time <= s.t1) return lerp(s.h0, s.h1, smooth(0, 1, (time - s.t0) / (s.t1 - s.t0)) * 0.3 + ((time - s.t0) / (s.t1 - s.t0)) * 0.7);
    return TOP + 0.2;
  };
  const stageAt = (time: number) => STAGES.findIndex((s) => time <= s.t1);

  const resize = () => {
    const w = canvasEl.clientWidth, h = canvasEl.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(renderRatio(w));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    orbit.dist = camera.aspect < 0.8 ? 108 : camera.aspect < 1.2 ? 84 : 66;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvasEl);
  resize();

  /* drag to orbit; vertical touch drags still scroll the page */
  let drag: { x: number; y: number; az: number; el: number } | null = null;
  const down = (e: PointerEvent) => {
    drag = { x: e.clientX, y: e.clientY, az: orbit.taz, el: orbit.tel };
    canvasEl.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (!drag) return;
    orbit.taz = drag.az - (e.clientX - drag.x) * 0.006;
    orbit.tel = clamp(drag.el + (e.clientY - drag.y) * (e.pointerType === "touch" ? 0 : 0.004), 0.08, 1.1);
  };
  const up = () => (drag = null);
  const dbl = () => {
    orbit.taz = 0.62;
    orbit.tel = 0.19;
  };
  canvasEl.addEventListener("pointerdown", down);
  canvasEl.addEventListener("pointermove", move);
  canvasEl.addEventListener("pointerup", up);
  canvasEl.addEventListener("pointercancel", up);
  canvasEl.addEventListener("dblclick", dbl);

  let raf = 0;
  let last = performance.now();
  let clock = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!active) return;
    clock += dt;
    if (!paused && t < BUILD_T) t = Math.min(BUILD_T, t + dt);

    // Time of day cross-fades rather than cuts.
    const tp = P[preset];
    const k = 1 - Math.exp(-2.2 * dt);
    cur.top.lerp(tc.set(tp.top), k); cur.hor.lerp(tc.set(tp.hor), k); cur.fog.lerp(tc.set(tp.fog), k); cur.sun.lerp(tc.set(tp.sun), k);
    cur.hemiS.lerp(tc.set(tp.hemiS), k); cur.hemiG.lerp(tc.set(tp.hemiG), k); cur.grassB.lerp(tc.set(tp.grassB), k); cur.grassT.lerp(tc.set(tp.grassT), k);
    cur.ground.lerp(tc.set(tp.ground), k);
    cur.sunDir.lerp(new THREE.Vector3(...tp.sunDir), k).normalize();
    cur.sunI = damp(cur.sunI, tp.sunI, 2.2, dt); cur.hemiI = damp(cur.hemiI, tp.hemiI, 2.2, dt);
    cur.night = damp(cur.night, tp.night, 2.2, dt); cur.exp = damp(cur.exp, tp.exp, 2.2, dt);

    skyU.uTop.value.copy(cur.top); skyU.uHor.value.copy(cur.hor); skyU.uSun.value.copy(cur.sunDir); skyU.uSunC.value.copy(cur.sun);
    (scene.fog as THREE.Fog).color.copy(cur.fog);
    grassU.fogColor.value.copy(cur.fog);
    grassU.uBase.value.copy(cur.grassB); grassU.uTip.value.copy(cur.grassT);
    grassU.uTime.value = reduced ? 0 : clock;
    (terrain.material as THREE.MeshStandardMaterial).color.copy(cur.ground).multiplyScalar(1.25);
    hemi.color.copy(cur.hemiS); hemi.groundColor.copy(cur.hemiG); hemi.intensity = cur.hemiI;
    sun.color.copy(cur.sun); sun.intensity = cur.sunI;
    sun.position.copy(cur.sunDir).multiplyScalar(60); sun.target.position.set(0, 0, 0);
    renderer.toneMappingExposure = cur.exp;
    (stars.material as THREE.PointsMaterial).opacity = smooth(0.5, 1, cur.night) * 0.85;
    glass.emissiveIntensity = cur.night * 1.6;
    jumboFace.emissiveIntensity = 0.35 + cur.night * 1.6;
    mastLamps.forEach((m) => (m.emissiveIntensity = 0.2 + cur.night * 3));
    nightLight.intensity = cur.night * 260 * (t >= BUILD_T ? 1 : 0.2);

    // The cut plane.
    const h = heightAt(t);
    CLIP.constant = h;
    SC_LO.constant = -h;
    SC_HI.constant = h + 3.2;
    const building = h < TOP;
    cap.visible = building && h < 9.2 && h > 0.02;
    if (cap.visible) setCap(h);
    capMat.color.copy(tc.set("#d7cdb7")).multiplyScalar(0.85 + cur.hemiI * 0.1);
    cutRing.visible = building && h > 0.02;
    cutRing.position.y = h + 0.01;
    const rr = h < 9.4 ? outerR(h) + 0.03 : 1.35;
    cutRing.scale.set(rr, rr, 1);
    sparkU.uTime.value = clock; sparkU.uH.value = h; sparkU.uR.value = rr; sparkU.uA.value = building ? 1 : 0;
    sparks.visible = building && !reduced;

    // Camera: fixed viewpoint that leans with the pointer.
    ptr.sx = damp(ptr.sx, ptr.x, 2.5, dt); ptr.sy = damp(ptr.sy, ptr.y, 2.5, dt);
    orbit.az = damp(orbit.az, orbit.taz, 5, dt); orbit.el = damp(orbit.el, orbit.tel, 5, dt);
    const az = orbit.az + ptr.sx * 0.1, el = orbit.el - ptr.sy * 0.05;
    camera.position.set(Math.sin(az) * Math.cos(el) * orbit.dist, 4.6 + Math.sin(el) * orbit.dist, Math.cos(az) * Math.cos(el) * orbit.dist);
    camera.lookAt(0, 4.6, 0);

    renderer.render(scene, camera);
    onFrame(t, Math.round((Math.min(h, TOP) / TOP) * 100), stageAt(t));
  };
  raf = requestAnimationFrame(frame);

  return {
    rebuild: () => { t = 0; paused = false; },
    seek: (v) => { t = clamp(v, 0, BUILD_T); },
    togglePause: () => (paused = !paused),
    setPreset: (i) => (preset = ((i % P.length) + P.length) % P.length),
    recenter: dbl,
    setPointer: (x, y) => { ptr.x = x; ptr.y = y; },
    setActive: (on) => { active = on; last = performance.now(); },
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvasEl.removeEventListener("pointerdown", down);
      canvasEl.removeEventListener("pointermove", move);
      canvasEl.removeEventListener("pointerup", up);
      canvasEl.removeEventListener("pointercancel", up);
      canvasEl.removeEventListener("dblclick", dbl);
      disposeScene(scene);
      renderer.dispose();
    },
  };
}
