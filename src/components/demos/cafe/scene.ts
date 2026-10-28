/**
 * Casa Jabuticaba: pão de queijo rising in the oven.
 *
 * A round baking pan with eight cheese breads and a jabuticaba-glazed cup of coffee,
 * seen through the hero arch (the mouth of the oven). Scroll is the bake: one progress
 * value puffs the breads up (staggered, back of the oven first), deepens their crust
 * from pale dough to golden-brown, advects the steam over the cup and eases the camera
 * down to show the rise. Nothing is time-based except the damped pointer parallax, so
 * an idle frame is perfectly still.
 *
 * Cost: a handful of draw calls (breads, contact shadows, steam, and the pan, cup, saucer,
 * handle and coffee sharing one standard program). The breads are icospheres displaced by
 * noise once on the CPU; the shader only shapes them by bake and paints the crust.
 */
import {
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  DirectionalLight,
  DoubleSide,
  HemisphereLight,
  IcosahedronGeometry,
  InstancedBufferAttribute,
  InstancedMesh,
  LatheGeometry,
  Matrix4,
  Mesh,
  MeshStandardMaterial,
  NeutralToneMapping,
  Object3D,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderChunk,
  ShaderMaterial,
  SRGBColorSpace,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import type { SceneContext, SceneInstance } from '../../../lib/three/mount';

// ---- Noise ------------------------------------------------------------------------------------

// 3D simplex noise for the GPU, after Ian McEwan and Stefan Gustavson (Ashima Arts, MIT licence).
const NOISE = /* glsl */ `
vec3 cjMod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 cjMod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 cjPermute(vec4 x) { return cjMod289(((x * 34.0) + 10.0) * x); }
float cjNoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = cjMod289(i);
  vec4 p = cjPermute(cjPermute(cjPermute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  vec3 ns = 0.142857142857 * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

/** Deterministic random numbers, so every visit bakes the same tray. */
function random(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// The same family of noise on the CPU, for the one-off displacement of the dough.
// 3D simplex noise after Stefan Gustavson's public-domain reference implementation.
const GRAD = [1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1];
function noise3(seed: number) {
  const p = new Uint8Array(256).map((_, i) => i);
  const rand = random(seed);
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = p[i]; p[i] = p[j]; p[j] = t;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const F3 = 1 / 3, G3 = 1 / 6;
  const corner = (x: number, y: number, z: number, h: number) => {
    let t = 0.6 - x * x - y * y - z * z;
    if (t < 0) return 0;
    const g = (h % 12) * 3;
    t *= t;
    return t * t * (GRAD[g] * x + GRAD[g + 1] * y + GRAD[g + 2] * z);
  };
  return (x: number, y: number, z: number) => {
    const s = (x + y + z) * F3;
    const i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s);
    const t = (i + j + k) * G3;
    const x0 = x - i + t, y0 = y - j + t, z0 = z - k + t;
    let i1 = 0, j1 = 0, k1 = 0, i2 = 0, j2 = 0, k2 = 0;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; i2 = 1; j2 = 1; }
      else if (x0 >= z0) { i1 = 1; i2 = 1; k2 = 1; }
      else { k1 = 1; i2 = 1; k2 = 1; }
    } else if (y0 < z0) { k1 = 1; j2 = 1; k2 = 1; }
    else if (x0 < z0) { j1 = 1; j2 = 1; k2 = 1; }
    else { j1 = 1; i2 = 1; j2 = 1; }
    const ii = i & 255, jj = j & 255, kk = k & 255;
    return 32 * (
      corner(x0, y0, z0, perm[ii + perm[jj + perm[kk]]]) +
      corner(x0 - i1 + G3, y0 - j1 + G3, z0 - k1 + G3, perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]]) +
      corner(x0 - i2 + 2 * G3, y0 - j2 + 2 * G3, z0 - k2 + 2 * G3, perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]]) +
      corner(x0 - 1 + 3 * G3, y0 - 1 + 3 * G3, z0 - 1 + 3 * G3, perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]])
    );
  };
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// ---- Dough --------------------------------------------------------------------------------------

/**
 * The bread's shape at a given bake: a lumpy radius from the precomputed noise, a slumped
 * dough ball that rises and puffs (with a small overshoot mid-bake), and a flat base on the
 * pan. The GLSL and the JS versions are the same function.
 */
const SHAPE_GLSL = /* glsl */ `
vec3 cjShape(vec3 dir, vec4 nz, float b, float size) {
  float amp = mix(0.03, 0.058, b);
  float crack = nz.y * smoothstep(0.15, 0.7, dir.y) * smoothstep(0.45, 1.0, b);
  vec3 p = dir * (1.0 + amp * nz.x - crack * 0.025);
  float puff = sin(3.14159265 * b);
  float sy = mix(0.66, 0.9, b) + 0.07 * puff;
  float sxz = mix(0.92, 1.0, b) - 0.025 * puff;
  p.y *= sy;
  p.xz *= sxz;
  float floorY = -0.62 * sy;
  float t = 1.0 - smoothstep(floorY - 0.25, floorY + 0.28, p.y);
  p.y = mix(p.y, floorY - (floorY - p.y) * 0.12, t);
  p.xz *= 1.0 + 0.07 * t;
  p.y -= floorY - 0.02;
  return p * mix(0.8, 1.0, b) * size;
}
`;
function shape(out: Float32Array, o: number, dx: number, dy: number, dz: number, n: number, ridge: number, b: number, size: number) {
  const amp = mix(0.03, 0.058, b);
  const crack = ridge * smoothstep(0.15, 0.7, dy) * smoothstep(0.45, 1, b);
  const r = 1 + amp * n - crack * 0.025;
  let x = dx * r, y = dy * r, z = dz * r;
  const puff = Math.sin(Math.PI * b);
  const sy = mix(0.66, 0.9, b) + 0.07 * puff;
  const sxz = mix(0.92, 1, b) - 0.025 * puff;
  y *= sy; x *= sxz; z *= sxz;
  const floorY = -0.62 * sy;
  const t = 1 - smoothstep(floorY - 0.25, floorY + 0.28, y);
  y = mix(y, floorY - (floorY - y) * 0.12, t);
  x *= 1 + 0.07 * t; z *= 1 + 0.07 * t;
  y -= floorY - 0.02;
  const s = mix(0.8, 1, b) * size;
  out[o] = x * s; out[o + 1] = y * s; out[o + 2] = z * s;
}

interface Bread { x: number; z: number; size: number; delay: number; tone: number; seed: number }

/**
 * All breads in one geometry (one draw call). Each vertex carries its direction on the unit
 * sphere, its noise (lumps, fissure ridge, broad mottling), the bread's centre and bake
 * window, and the normals of the raw and the baked shape, so the GPU runs no noise per vertex.
 */
function doughGeometry(breads: Bread[], detail: number) {
  const ico = new IcosahedronGeometry(1, detail);
  const src = ico.getAttribute('position');
  const ids = new Map<string, number>();
  const dirs: number[] = [];
  const tri: number[] = [];
  for (let i = 0; i < src.count; i++) {
    const x = src.getX(i), y = src.getY(i), z = src.getZ(i);
    const key = `${Math.round(x * 1e4)},${Math.round(y * 1e4)},${Math.round(z * 1e4)}`;
    let id = ids.get(key);
    if (id === undefined) { id = dirs.length / 3; dirs.push(x, y, z); ids.set(key, id); }
    tri.push(id);
  }
  ico.dispose();
  const V = dirs.length / 3;
  const count = breads.length * V;
  const position = new Float32Array(count * 3);
  const noise = new Float32Array(count * 4);
  const info = new Float32Array(count * 4);
  const centre = new Float32Array(count * 3);
  const raw = new Float32Array(count * 3);
  const baked = new Float32Array(count * 3);
  const index = new Uint16Array(breads.length * tri.length);
  breads.forEach((b, bi) => {
    const lumps = noise3(b.seed), ridges = noise3(b.seed + 101), mottle = noise3(b.seed + 202);
    for (let v = 0; v < V; v++) {
      const o = bi * V + v;
      const dx = dirs[v * 3], dy = dirs[v * 3 + 1], dz = dirs[v * 3 + 2];
      const n = lumps(dx * 1.3, dy * 1.3, dz * 1.3) + 0.4 * lumps(dx * 3.2 + 7, dy * 3.2, dz * 3.2);
      const ridge = smoothstep(0.86, 1, 1 - Math.abs(ridges(dx * 2.4, dy * 2.4, dz * 2.4)));
      position[o * 3] = dx; position[o * 3 + 1] = dy; position[o * 3 + 2] = dz;
      noise[o * 4] = n; noise[o * 4 + 1] = ridge; noise[o * 4 + 2] = mottle(dx * 1.8, dy * 1.8, dz * 1.8);
      info[o * 4] = b.delay; info[o * 4 + 1] = b.tone; info[o * 4 + 2] = b.size;
      centre[o * 3] = b.x; centre[o * 3 + 2] = b.z;
      shape(raw, o * 3, dx, dy, dz, n, ridge, 0, b.size);
      shape(baked, o * 3, dx, dy, dz, n, ridge, 1, b.size);
    }
    for (let t = 0; t < tri.length; t++) index[bi * tri.length + t] = bi * V + tri[t];
  });
  // Normals of the two extreme shapes; the shader blends them as the bread bakes.
  const normalsOf = (positions: Float32Array) => {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(positions, 3));
    g.setIndex(new BufferAttribute(index, 1));
    g.computeVertexNormals();
    const n = g.getAttribute('normal').array as Float32Array;
    g.dispose();
    return n;
  };
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(position, 3));
  geometry.setAttribute('normal', new BufferAttribute(normalsOf(raw), 3));
  geometry.setAttribute('aBakedNormal', new BufferAttribute(normalsOf(baked), 3));
  geometry.setAttribute('aNoise', new BufferAttribute(noise, 4));
  geometry.setAttribute('aBread', new BufferAttribute(info, 4));
  geometry.setAttribute('aCentre', new BufferAttribute(centre, 3));
  geometry.setIndex(new BufferAttribute(index, 1));
  return geometry;
}

const lathe = (points: [number, number][], segments: number) =>
  new LatheGeometry(points.map(([x, y]) => new Vector2(x, y)), segments);

const BREADS = 8;
const PAN_FLOOR = 0.04;
const CUP = new Vector3(1.5, 0, -3.15);
const CUP_SCALE = 1.45;
const COFFEE_Y = 0.5;

export async function create(canvas: HTMLCanvasElement, _ctx: SceneContext): Promise<SceneInstance> {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.02;

  const scene = new Scene();
  const camera = new PerspectiveCamera(24, 0.8, 0.5, 60);
  const target = new Vector3(0.18, 1.0, -0.85);

  // Light: a warm oven key from behind and above, a creamy sky with a toasted bounce, a soft
  // front fill, and a small high front light that puts the jabuticaba-dot highlight on the glaze.
  scene.add(new HemisphereLight(0xfff3e2, 0x9c7656, 1.15));
  const key = new DirectionalLight(0xffd9ae, 2.6);
  key.position.set(-3.4, 5.6, -3.0);
  scene.add(key);
  const fill = new DirectionalLight(0xfff0e0, 0.6);
  fill.position.set(3.8, 2.6, 6.0);
  scene.add(fill);
  const glint = new DirectionalLight(0xffffff, 0.9);
  glint.position.set(-1.5, 6.5, 7.5);
  scene.add(glint);

  const uniforms = {
    uBake: { value: 0 },
    uRaw: { value: new Color('#ede6d3') },
    uPale: { value: new Color('#ebd5a4') },
    uGold: { value: new Color('#d9ae62') },
    uBrown: { value: new Color('#a9743b') },
    uBlister: { value: new Color('#7a5130') },
  };

  // ---- Breads -----------------------------------------------------------------------------
  const rand = random(19);
  const breads: Bread[] = [];
  const spots: [number, number][] = [[0.05, 0.02]];
  for (let i = 0; i < BREADS - 1; i++) {
    const a = (i / (BREADS - 1)) * Math.PI * 2 + 0.35;
    spots.push([Math.cos(a) * 1.3, Math.sin(a) * 1.3]);
  }
  spots.forEach(([x, z], i) => {
    const jx = x + (rand() - 0.5) * 0.14;
    const jz = z + (rand() - 0.5) * 0.14;
    const size = (0.92 + rand() * 0.16) * 0.5;
    // The back of the oven is hotter: the back row starts first.
    const delay = Math.min(0.4, Math.max(0, ((jz + 1.4) / 2.8) * 0.26 + rand() * 0.14));
    breads.push({ x: jx, z: jz, size, delay, tone: rand(), seed: 11 + i * 7 });
  });

  const breadMaterial = new MeshStandardMaterial({ roughness: 0.6, metalness: 0 });
  breadMaterial.defines = { ...breadMaterial.defines, CJ_WRAP: '0.55' };
  breadMaterial.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', /* glsl */ `#include <common>
        uniform float uBake;
        attribute vec3 aBakedNormal;
        attribute vec4 aNoise;
        attribute vec4 aBread;
        attribute vec3 aCentre;
        varying vec3 vCjDir;
        varying vec4 vCjNoise;
        varying vec2 vCjBake;
        ${SHAPE_GLSL}`)
      .replace('#include <beginnormal_vertex>', /* glsl */ `
        float cjB = smoothstep(aBread.x, aBread.x + 0.6, uBake);
        vec3 objectNormal = normalize(mix(normal, aBakedNormal, cjB));`)
      .replace('#include <begin_vertex>', /* glsl */ `
        vec3 transformed = cjShape(position, aNoise, cjB, aBread.z) + aCentre;
        vCjDir = position;
        vCjNoise = aNoise;
        vCjBake = vec2(cjB, aBread.y);`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', /* glsl */ `#include <common>
        uniform vec3 uRaw;
        uniform vec3 uPale;
        uniform vec3 uGold;
        uniform vec3 uBrown;
        uniform vec3 uBlister;
        varying vec3 vCjDir;
        varying vec4 vCjNoise;
        varying vec2 vCjBake;
        ${NOISE}
        // Bump from a procedural height (surface-gradient method, as in three's bumpmap chunk).
        vec3 cjPerturb(vec3 surfPos, vec3 surfNorm, float height, float faceDir) {
          vec3 sx = normalize(dFdx(surfPos));
          vec3 sy = normalize(dFdy(surfPos));
          vec3 r1 = cross(sy, surfNorm);
          vec3 r2 = cross(surfNorm, sx);
          float det = dot(sx, r1) * faceDir;
          vec3 grad = sign(det) * (dFdx(height) * r1 + dFdy(height) * r2);
          return normalize(abs(det) * surfNorm - grad);
        }`)
      .replace('#include <lights_physical_pars_fragment>', ShaderChunk.lights_physical_pars_fragment.replace(
        'reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );',
        /* glsl */ `reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
        // Wrap lighting: light bleeds past the terminator, tinted warm, like light inside soft dough.
        float cjWrap = saturate( ( dot( geometryNormal, directLight.direction ) + CJ_WRAP ) / ( 1.0 + CJ_WRAP ) );
        reflectedLight.directDiffuse += max( cjWrap - dotNL, 0.0 ) * directLight.color * BRDF_Lambert( material.diffuseContribution ) * vec3( 1.0, 0.62, 0.4 );`))
      .replace('#include <color_fragment>', /* glsl */ `
        // Crust: the crown browns first, the sides follow, the base stays pale.
        float cjB = vCjBake.x;
        float cjH = smoothstep(-0.4, 0.95, vCjDir.y);
        float cjN = vCjNoise.z;
        float cjLump = vCjNoise.x;
        float cjBl = cjNoise(vCjDir * 16.0 + vCjBake.y * 31.0);
        float cjCrust = cjB * (0.32 + 0.82 * cjH) + 0.14 * cjN * cjB + 0.07 * cjLump * cjB;
        vec3 cjCol = mix(uRaw, uPale, smoothstep(0.0, 0.55, cjB));
        cjCol = mix(cjCol, uGold, smoothstep(0.2, 0.78, cjCrust));
        cjCol = mix(cjCol, uBrown, smoothstep(0.62, 1.1, cjCrust) * 0.85);
        float cjRing = (1.0 - smoothstep(-0.93, -0.7, vCjDir.y)) * cjB;
        cjCol = mix(cjCol, uGold * 0.92, cjRing * 0.6);
        // Cheese blisters: small matte freckles where the crust is golden.
        float cjSpot = smoothstep(0.62, 0.88, cjBl) * smoothstep(0.45, 1.0, cjCrust);
        cjCol = mix(cjCol, uBlister, cjSpot * 0.32);
        // Fissures: a few thin lines on the crown where the crust split, showing paler crumb.
        float cjRidge = 1.0 - abs(cjNoise(vCjDir * 1.6 + vCjBake.y * 17.0));
        float cjCrack = smoothstep(0.972, 0.994, cjRidge) * smoothstep(-0.15, 0.25, cjN) * smoothstep(0.3, 0.8, vCjDir.y) * smoothstep(0.6, 1.0, cjB);
        cjCol = mix(cjCol, uPale, cjCrack * 0.45);
        cjCol *= (0.95 + 0.1 * vCjBake.y) * (1.0 + 0.05 * cjLump * cjB);
        diffuseColor.rgb = cjCol;`)
      .replace('#include <roughnessmap_fragment>', /* glsl */ `
        float roughnessFactor = mix(0.52, 0.7, smoothstep(0.1, 0.8, cjB)) + cjN * 0.06 + cjSpot * 0.1 + cjCrack * 0.12;`)
      .replace('#include <normal_fragment_maps>', /* glsl */ `#include <normal_fragment_maps>
        // Fine pitting of the crust, deeper as it bakes.
        float cjHeight = cjBl * 0.5 * mix(0.0012, 0.003, cjB);
        normal = cjPerturb(-vViewPosition, normal, cjHeight, faceDirection);`);
  };
  const dough = new Mesh(doughGeometry(breads, 12), breadMaterial);
  dough.frustumCulled = false;
  dough.position.y = PAN_FLOOR;
  scene.add(dough);

  // ---- Pan, cup, saucer, coffee: one standard program -------------------------------------
  // With no environment map, glossy surfaces would only catch point highlights. A cheap fake
  // reflection (a tall window to the left, a creamy sky, a Fresnel rim) gives the jabuticaba glaze
  // the gloss of the brand's dot. Same hook source for every material, so one program.
  const softbox = (strength: number) => (shader: { uniforms: Record<string, { value: unknown }>; fragmentShader: string }) => {
    shader.uniforms.uSoftbox = { value: strength };
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uSoftbox;')
      .replace('#include <aomap_fragment>', `
        vec3 cjR = inverseTransformDirection(reflect(-geometryViewDir, geometryNormal), viewMatrix);
        float cjAz = atan(cjR.x, cjR.z);
        float cjBox = (1.0 - smoothstep(0.16, 0.36, abs(cjAz + 0.95))) * smoothstep(-0.95, -0.55, cjR.y) * (1.0 - smoothstep(0.3, 0.6, cjR.y));
        float cjSky = smoothstep(0.15, 0.85, cjR.y) * 0.3;
        float cjFres = pow(1.0 - saturate(dot(geometryNormal, geometryViewDir)), 4.0) * 0.6;
        reflectedLight.indirectSpecular += uSoftbox * (cjBox * vec3(1.0, 0.96, 0.92) + (cjSky + cjFres) * vec3(0.98, 0.9, 0.8));
        #include <aomap_fragment>`);
  };
  const R = 2.12;
  const pan = new Mesh(
    lathe([
      [0, PAN_FLOOR], [R - 0.06, PAN_FLOOR], [R - 0.01, PAN_FLOOR + 0.03], [R + 0.05, 0.2], [R + 0.075, 0.235],
      [R + 0.11, 0.245], [R + 0.135, 0.225], [R + 0.12, 0.19], [R + 0.06, 0.02], [R, 0], [0, 0],
    ], 72),
    new MeshStandardMaterial({ color: '#3a302b', roughness: 0.42, metalness: 0.3, side: DoubleSide }),
  );
  pan.material.onBeforeCompile = softbox(0.12);
  scene.add(pan);

  const glaze = new MeshStandardMaterial({ color: '#2b1530', roughness: 0.14, metalness: 0, side: DoubleSide });
  const porcelain = new MeshStandardMaterial({ color: '#f2e9da', roughness: 0.3, metalness: 0, side: DoubleSide });
  const coffeeMaterial = new MeshStandardMaterial({ color: '#1f1009', roughness: 0.06, metalness: 0, side: DoubleSide });
  glaze.onBeforeCompile = softbox(0.85);
  porcelain.onBeforeCompile = softbox(0.18);
  coffeeMaterial.onBeforeCompile = softbox(0.22);
  const body = new Mesh(lathe([
    [0, 0], [0.26, 0], [0.29, 0.025], [0.33, 0.17], [0.37, 0.38], [0.4, 0.56], [0.405, 0.6], [0.39, 0.608],
    [0.375, 0.57], [0.345, 0.38], [0.3, 0.17], [0.25, 0.075], [0, 0.075],
  ], 48), glaze);
  const saucer = new Mesh(lathe([
    [0, 0], [0.38, 0], [0.44, 0.018], [0.62, 0.06], [0.645, 0.074], [0.625, 0.082], [0.44, 0.045], [0.3, 0.035], [0, 0.035],
  ], 56), porcelain);
  const handleGeometry = new TorusGeometry(0.15, 0.04, 10, 24, Math.PI * 1.25);
  handleGeometry.rotateZ(-Math.PI * 0.625);
  handleGeometry.translate(0.47, 0.33, 0);
  const handle = new Mesh(handleGeometry, glaze);
  body.position.y = handle.position.y = 0.035;
  body.rotation.y = handle.rotation.y = -0.5;
  const coffeeGeometry = new CircleGeometry(0.36, 40);
  coffeeGeometry.rotateX(-Math.PI / 2);
  const coffee = new Mesh(coffeeGeometry, coffeeMaterial);
  coffee.position.y = COFFEE_Y;
  const cup = new Object3D();
  cup.add(saucer, body, handle, coffee);
  cup.position.copy(CUP);
  cup.scale.setScalar(CUP_SCALE);
  scene.add(cup);

  // ---- Contact shadows (soft blobs, one draw call) -----------------------------------------
  const blobs = [
    ...breads.map((b) => ({ x: b.x + 0.07, z: b.z + 0.09, sx: 1.12, sz: 1.22, delay: b.delay, size: b.size * 2, kind: 0, strength: 0.75 })),
    { x: 0.12, z: 0.16, sx: 4.9, sz: 4.9, delay: -1, size: 1, kind: 1, strength: 0.5 },
    { x: CUP.x + 0.1, z: CUP.z + 0.14, sx: 1.55 * CUP_SCALE, sz: 1.55 * CUP_SCALE, delay: -1, size: 1, kind: 1, strength: 0.55 },
  ];
  const shadowGeometry = new PlaneGeometry(1, 1);
  shadowGeometry.rotateX(-Math.PI / 2);
  shadowGeometry.setAttribute('aDelay', new InstancedBufferAttribute(new Float32Array(blobs.flatMap((b) => [b.delay, b.size])), 2));
  shadowGeometry.setAttribute('aKind', new InstancedBufferAttribute(new Float32Array(blobs.flatMap((b) => [b.kind, b.strength])), 2));
  const shadows = new InstancedMesh(shadowGeometry, new ShaderMaterial({
    uniforms: { uBake: uniforms.uBake },
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      uniform float uBake;
      attribute vec2 aDelay;
      attribute vec2 aKind;
      varying vec2 vUv;
      varying vec2 vKind;
      void main() {
        float b = smoothstep(aDelay.x, aDelay.x + 0.6, uBake);
        vec3 p = position;
        p.xz *= aKind.x > 0.5 ? 1.0 : mix(0.8, 1.0, b) * aDelay.y;
        vUv = uv - 0.5;
        vKind = aKind;
        gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(p, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      varying vec2 vKind;
      void main() {
        float r = length(vUv) * 2.0;
        float core = 1.0 - smoothstep(0.0, vKind.x > 0.5 ? 0.9 : 0.62, r);
        float soft = 1.0 - smoothstep(0.0, 1.0, r);
        float a = (core * 0.6 + soft * soft * 0.4) * vKind.y;
        vec3 tint = vKind.x > 0.5 ? vec3(0.42, 0.27, 0.18) : vec3(0.1, 0.06, 0.04);
        gl_FragColor = vec4(tint, a);
      }`,
  }), blobs.length);
  const matrix = new Matrix4();
  blobs.forEach((b, i) => {
    const y = b.kind ? 0.003 : PAN_FLOOR + 0.004;
    shadows.setMatrixAt(i, matrix.makeScale(b.sx, 1, b.sz).setPosition(b.x, y, b.z));
  });
  shadows.frustumCulled = false;
  shadows.renderOrder = -1;
  scene.add(shadows);

  // ---- Steam: one billboard with a scroll-advected noise wisp --------------------------------
  const steamUniforms = { uRise: { value: 0 } };
  const steamGeometry = new PlaneGeometry(1, 1);
  steamGeometry.translate(0, 0.5, 0);
  const steam = new Mesh(steamGeometry, new ShaderMaterial({
    uniforms: steamUniforms,
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uRise;
      varying vec2 vUv;
      ${NOISE}
      void main() {
        float y = vUv.y;
        float t = uRise;
        float sway = (sin(y * 3.1 - t * 2.3) * 0.11 + sin(y * 6.0 - t * 5.0 + 1.7) * 0.04) * smoothstep(0.0, 0.75, y);
        float x = vUv.x - 0.5 - sway;
        float width = mix(0.06, 0.19, smoothstep(0.0, 1.0, y));
        float core = exp(-(x * x) / (width * width));
        float halo = exp(-(x * x) / (width * width * 5.0)) * 0.3;
        vec3 q = vec3(vUv.x * 4.0, y * 2.6 - t * 2.2, t * 0.35);
        float n = cjNoise(q) * 0.6 + cjNoise(q * 2.3 + 7.1) * 0.4;
        float a = (core * smoothstep(-0.45, 0.45, n) + halo * smoothstep(-0.6, 0.6, n)) * smoothstep(0.0, 0.12, y) * (1.0 - smoothstep(0.45, 1.0, y));
        gl_FragColor = vec4(vec3(0.995, 1.0, 1.0), min(1.0, a * 1.05));
      }`,
  }));
  steam.position.set(CUP.x, (COFFEE_Y + 0.05) * CUP_SCALE, CUP.z);
  steam.scale.set(1.6, 3.6, 1);
  steam.renderOrder = 2;
  scene.add(steam);

  // ---- Camera, progress, pointer -----------------------------------------------------------
  let progress = 0;
  let fitDistance = 12;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  const place = () => {
    const elevation = (38 - 6 * progress - pointer.y * 1.6) * (Math.PI / 180);
    const azimuth = (-6 + pointer.x * 3.2) * (Math.PI / 180);
    const distance = fitDistance * (1 - 0.06 * progress);
    camera.position.set(
      target.x + Math.sin(azimuth) * Math.cos(elevation) * distance,
      target.y + Math.sin(elevation) * distance,
      target.z + Math.cos(azimuth) * Math.cos(elevation) * distance,
    );
    camera.lookAt(target);
    // Billboard the wisp around its vertical axis.
    steam.rotation.y = Math.atan2(camera.position.x - steam.position.x, camera.position.z - steam.position.z);
  };

  // Where the driver links in parallel, compile every program before the first frame so the
  // main thread is not blocked waiting on the GPU.
  place();
  if (renderer.extensions.has('KHR_parallel_shader_compile')) await renderer.compileAsync(scene, camera);

  return {
    resize(w, h, dpr) {
      const width = Math.max(1, w);
      const height = Math.max(1, h);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Fit the pan and the cup across the frame, whatever the arch's proportions.
      const halfFov = Math.tan((camera.fov * Math.PI) / 360);
      fitDistance = Math.max(2.45 / (halfFov * camera.aspect), 2.9 / halfFov);
      camera.updateProjectionMatrix();
    },
    setProgress(p) {
      progress = Math.min(1, Math.max(0, p));
      uniforms.uBake.value = progress;
      steamUniforms.uRise.value = progress * 1.7;
    },
    setPointer(x, y) {
      pointer.tx = Math.max(-1, Math.min(1, x));
      pointer.ty = Math.max(-1, Math.min(1, y));
    },
    // Only the damped pointer parallax asks for frames; it settles in about a second.
    tick(dt) {
      const k = 1 - Math.exp(-dt * 7);
      pointer.x += (pointer.tx - pointer.x) * k;
      pointer.y += (pointer.ty - pointer.y) * k;
      const settled = Math.abs(pointer.tx - pointer.x) < 1e-3 && Math.abs(pointer.ty - pointer.y) < 1e-3;
      if (settled) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
      return !settled;
    },
    render() {
      place();
      renderer.render(scene, camera);
    },
    dispose() {
      scene.traverse((object) => {
        const mesh = object as Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) material.forEach((mat) => mat.dispose());
        else material?.dispose();
      });
      renderer.dispose();
    },
  };
}
