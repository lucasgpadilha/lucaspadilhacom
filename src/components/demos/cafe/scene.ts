/**
 * Casa Jabuticaba: pão de queijo rising in the oven.
 *
 * A round baking pan with eight cheese breads and a jabuticaba-glazed cup of coffee,
 * seen through the hero arch (the mouth of the oven). Scroll is the bake: the global
 * progress puffs the breads up (staggered), deepens their crust from pale dough to
 * golden-brown and advects the steam over the cup. A short camera settle is the only
 * time-based motion; after it, frames change only on scroll or pointer.
 *
 * Draw calls: breads (1, instanced), contact shadows (1, instanced), pan, cup body,
 * saucer, handle, coffee, steam. Everything procedural; no textures are loaded.
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
  BackSide,
  MeshBasicMaterial,
  PMREMGenerator,
  SphereGeometry,
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

// 3D simplex noise, after Ian McEwan and Stefan Gustavson (Ashima Arts, MIT licence).
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

// Bump from a procedural height (Mikkelsen's surface-gradient trick, as in three's bumpmap chunk).
const PERTURB = /* glsl */ `
vec3 cjPerturb(vec3 surfPos, vec3 surfNorm, float height, float faceDir) {
  vec3 sx = normalize(dFdx(surfPos));
  vec3 sy = normalize(dFdy(surfPos));
  vec3 r1 = cross(sy, surfNorm);
  vec3 r2 = cross(surfNorm, sx);
  float det = dot(sx, r1) * faceDir;
  vec3 grad = sign(det) * (dFdx(height) * r1 + dFdy(height) * r2);
  return normalize(abs(det) * surfNorm - grad);
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

/** Icosphere with shared vertices, so the shader can displace it without cracks. */
function icosphere(detail: number) {
  const source = new IcosahedronGeometry(1, detail);
  const pos = source.getAttribute('position');
  const ids = new Map<string, number>();
  const verts: number[] = [];
  const index: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const key = `${Math.round(x * 1e4)},${Math.round(y * 1e4)},${Math.round(z * 1e4)}`;
    let id = ids.get(key);
    if (id === undefined) {
      id = verts.length / 3;
      verts.push(x, y, z);
      ids.set(key, id);
    }
    index.push(id);
  }
  source.dispose();
  const geometry = new BufferGeometry();
  const array = new Float32Array(verts);
  geometry.setAttribute('position', new BufferAttribute(array, 3));
  geometry.setAttribute('normal', new BufferAttribute(array.slice(), 3));
  geometry.setIndex(index);
  return geometry;
}

const lathe = (points: [number, number][], segments: number) =>
  new LatheGeometry(points.map(([x, y]) => new Vector2(x, y)), segments);

const BREADS = 8;
const PAN_FLOOR = 0.04;
const CUP = new Vector3(1.5, 0, -3.15);
const CUP_SCALE = 1.45;
const COFFEE_Y = 0.5;

export function create(canvas: HTMLCanvasElement, _ctx: SceneContext): SceneInstance {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.02;

  const scene = new Scene();
  const camera = new PerspectiveCamera(24, 0.8, 0.5, 60);
  const target = new Vector3(0.18, 0.9, -0.75);

  // Reflections: a tiny studio (cream sweep, warm floor, two softboxes), prefiltered once.
  // It gives the glaze its jabuticaba-dot highlight and the dough a soft, food-like ambient.
  const studio = new Scene();
  const sweep = new SphereGeometry(10, 24, 12);
  const tones = [new Color('#fff4e4'), new Color('#ead8bb'), new Color('#5c3f2e')];
  const colors: number[] = [];
  const sp = sweep.getAttribute('position');
  for (let i = 0; i < sp.count; i++) {
    const t = sp.getY(i) / 10;
    const c = t > 0 ? tones[1].clone().lerp(tones[0], Math.min(1, t * 1.6)) : tones[1].clone().lerp(tones[2], Math.min(1, -t * 2.2));
    colors.push(c.r, c.g, c.b);
  }
  sweep.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3));
  studio.add(new Mesh(sweep, new MeshBasicMaterial({ vertexColors: true, side: BackSide })));
  const box = (w: number, h: number, intensity: Color, at: Vector3) => {
    const panel = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: intensity, side: DoubleSide }));
    panel.position.copy(at);
    panel.lookAt(0, 0, 0);
    studio.add(panel);
  };
  box(5, 3, new Color(5.5, 4.6, 3.6), new Vector3(-5, 6, -4));
  box(3, 2.4, new Color(2.2, 2.1, 2.0), new Vector3(5, 3.5, 6.5));
  const pmrem = new PMREMGenerator(renderer);
  const environment = pmrem.fromScene(studio, 0.035).texture;
  pmrem.dispose();
  studio.traverse((o) => { const m = o as Mesh; m.geometry?.dispose(); (m.material as MeshBasicMaterial | undefined)?.dispose(); });
  scene.environment = environment;
  scene.environmentIntensity = 0.75;

  // Light: a warm oven key from behind and above and a soft front fill.
  scene.add(new HemisphereLight(0xfff5e8, 0xa98665, 0.3));
  const key = new DirectionalLight(0xffdcb4, 2.6);
  key.position.set(-3.4, 5.6, -3.0);
  scene.add(key);
  const fill = new DirectionalLight(0xfff0e0, 0.55);
  fill.position.set(3.8, 2.6, 6.0);
  scene.add(fill);

  const uniforms = {
    uBake: { value: 0 },
    uRaw: { value: new Color('#ede6d3') },
    uPale: { value: new Color('#ebd5a4') },
    uGold: { value: new Color('#d9ae62') },
    uBrown: { value: new Color('#a9743b') },
    uBlister: { value: new Color('#7a5130') },
  };
  const rand = random(19);

  // ---- Breads -----------------------------------------------------------------------------
  const breadGeometry = icosphere(11);
  const seeds = new Float32Array(BREADS * 4);
  const delays = new Float32Array(BREADS * 2);
  const breadMaterial = new MeshStandardMaterial({ roughness: 0.6, metalness: 0 });
  breadMaterial.defines = { ...breadMaterial.defines, CJ_WRAP: '0.55' };
  breadMaterial.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', /* glsl */ `#include <common>
        uniform float uBake;
        attribute vec4 aSeed;
        attribute vec2 aDelay;
        varying vec3 vCjDir;
        varying vec3 vCjShape;
        varying vec4 vCjBake;
        varying vec3 vCjSeed;
        ${NOISE}
        vec3 cjShape(vec3 dir, float b, out float crack) {
          float n1 = cjNoise(dir * 1.3 + aSeed.xyz);
          float n2 = cjNoise(dir * 3.2 + aSeed.zxy);
          float amp = mix(0.03, 0.07, b);
          float r = 1.0 + amp * n1 + amp * 0.45 * n2;
          float ridge = 1.0 - abs(cjNoise(dir * 2.4 + aSeed.yzx * 1.3));
          crack = smoothstep(0.86, 1.0, ridge) * smoothstep(0.15, 0.7, dir.y) * smoothstep(0.45, 1.0, b);
          r -= crack * 0.025;
          vec3 p = dir * r;
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
          return p * mix(0.8, 1.0, b) * aSeed.w;
        }`)
      .replace('#include <beginnormal_vertex>', /* glsl */ `
        float cjB = smoothstep(aDelay.x, aDelay.x + 0.6, uBake);
        vec3 cjDir = normalize(position);
        vec3 cjT1 = normalize(cross(cjDir, abs(cjDir.y) < 0.95 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0)));
        vec3 cjT2 = cross(cjDir, cjT1);
        float cjCrack;
        float cjSkip;
        vec3 cjP0 = cjShape(cjDir, cjB, cjCrack);
        vec3 cjPa = cjShape(normalize(cjDir + cjT1 * 0.015), cjB, cjSkip);
        vec3 cjPb = cjShape(normalize(cjDir + cjT2 * 0.015), cjB, cjSkip);
        vec3 objectNormal = normalize(cross(cjPa - cjP0, cjPb - cjP0));`)
      .replace('#include <begin_vertex>', /* glsl */ `
        vec3 transformed = cjP0;
        vCjDir = cjDir;
        vCjShape = cjP0 / aSeed.w + aSeed.xyz;
        vCjBake = vec4(cjB, cjCrack, aDelay.y, 0.0);
        vCjSeed = aSeed.yzx * 1.3;`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', /* glsl */ `#include <common>
        uniform vec3 uRaw;
        uniform vec3 uPale;
        uniform vec3 uGold;
        uniform vec3 uBrown;
        uniform vec3 uBlister;
        varying vec3 vCjDir;
        varying vec3 vCjShape;
        varying vec4 vCjBake;
        varying vec3 vCjSeed;
        ${NOISE}
        ${PERTURB}`)
      .replace('#include <lights_physical_pars_fragment>', ShaderChunk.lights_physical_pars_fragment.replace(
        'reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );',
        /* glsl */ `reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
        // Wrap lighting: light bleeds past the terminator, tinted warm, like light inside soft dough.
        float cjWrap = saturate( ( dot( geometryNormal, directLight.direction ) + CJ_WRAP ) / ( 1.0 + CJ_WRAP ) );
        reflectedLight.directDiffuse += max( cjWrap - dotNL, 0.0 ) * directLight.color * BRDF_Lambert( material.diffuseContribution ) * vec3( 1.0, 0.62, 0.4 );`))
      .replace('#include <color_fragment>', /* glsl */ `
        float cjB = vCjBake.x;
        float cjH = smoothstep(-0.4, 0.95, vCjDir.y);
        float cjN = cjNoise(vCjShape * 1.8);
        float cjF = cjNoise(vCjShape * 6.0);
        float cjBl = cjNoise(vCjShape * 16.0);
        float cjCrust = cjB * (0.32 + 0.82 * cjH) + 0.14 * cjN * cjB + 0.07 * cjF * cjB;
        vec3 cjCol = mix(uRaw, uPale, smoothstep(0.0, 0.55, cjB));
        cjCol = mix(cjCol, uGold, smoothstep(0.2, 0.78, cjCrust));
        cjCol = mix(cjCol, uBrown, smoothstep(0.68, 1.12, cjCrust) * 0.8);
        float cjRing = (1.0 - smoothstep(-0.93, -0.7, vCjDir.y)) * cjB;
        cjCol = mix(cjCol, uGold * 0.92, cjRing * 0.6);
        float cjSpot = smoothstep(0.62, 0.88, cjBl) * smoothstep(0.45, 1.0, cjCrust);
        cjCol = mix(cjCol, uBlister, cjSpot * 0.32);
        // Fissures: thin lines on the crown where the crust split, showing paler crumb.
        float cjRidge = 1.0 - abs(cjNoise(vCjDir * 1.6 + vCjSeed));
        float cjPatch = smoothstep(0.15, 0.55, cjNoise(vCjDir * 1.1 - vCjSeed));
        float cjCrack = smoothstep(0.972, 0.994, cjRidge) * cjPatch * smoothstep(0.3, 0.8, vCjDir.y) * smoothstep(0.6, 1.0, cjB);
        cjCol = mix(cjCol, mix(uPale, uRaw, 0.25), cjCrack * 0.55);
        cjCol *= (0.95 + 0.1 * vCjBake.z) * (1.0 + 0.05 * cjF * cjB);
        diffuseColor.rgb = cjCol;`)
      .replace('#include <roughnessmap_fragment>', /* glsl */ `
        float roughnessFactor = mix(0.52, 0.7, smoothstep(0.1, 0.8, cjB)) + cjN * 0.06 + cjSpot * 0.1 + cjCrack * 0.12;`)
      .replace('#include <normal_fragment_maps>', /* glsl */ `#include <normal_fragment_maps>
        float cjHeight = (cjNoise(vCjShape * 11.0) * 0.7 + cjNoise(vCjShape * 27.0) * 0.18 - cjCrack * 0.5) * mix(0.0012, 0.003, cjB);
        normal = cjPerturb(-vViewPosition, normal, cjHeight, faceDirection);`);
  };

  const breads = new InstancedMesh(breadGeometry, breadMaterial, BREADS);
  breads.frustumCulled = false;
  const shadowCount = BREADS + 2;
  const shadowDelays = new Float32Array(shadowCount * 2);
  const shadowKinds = new Float32Array(shadowCount * 2);
  const dummy = new Object3D();
  const spots: [number, number][] = [[0.05, 0.02]];
  for (let i = 0; i < BREADS - 1; i++) {
    const a = (i / (BREADS - 1)) * Math.PI * 2 + 0.35;
    spots.push([Math.cos(a) * 1.3, Math.sin(a) * 1.3]);
  }
  const shadowMatrices: Matrix4[] = [];
  spots.forEach(([x, z], i) => {
    const jx = x + (rand() - 0.5) * 0.14;
    const jz = z + (rand() - 0.5) * 0.14;
    const size = 0.92 + rand() * 0.16;
    seeds.set([rand() * 40, rand() * 40, rand() * 40, size], i * 4);
    // The back of the oven is hotter: breads at the back start first.
    const back = ((jz + 1.4) / 2.8) * 0.26;
    const delay = Math.min(0.4, Math.max(0, back + rand() * 0.14));
    delays.set([delay, rand()], i * 2);
    shadowDelays.set([delay, size], i * 2);
    shadowKinds.set([0, 0.75], i * 2);
    dummy.position.set(jx, PAN_FLOOR, jz);
    dummy.rotation.set(0, rand() * Math.PI * 2, 0);
    dummy.scale.setScalar(0.5);
    dummy.updateMatrix();
    breads.setMatrixAt(i, dummy.matrix);
    dummy.position.set(jx + 0.07, PAN_FLOOR + 0.004, jz + 0.09);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.set(1.12, 1, 1.22);
    dummy.updateMatrix();
    shadowMatrices.push(dummy.matrix.clone());
  });
  breadGeometry.setAttribute('aSeed', new InstancedBufferAttribute(seeds, 4));
  breadGeometry.setAttribute('aDelay', new InstancedBufferAttribute(delays, 2));
  scene.add(breads);

  // ---- Pan --------------------------------------------------------------------------------
  const R = 2.12;
  const panGeometry = lathe([
    [0, PAN_FLOOR], [R - 0.06, PAN_FLOOR], [R - 0.01, PAN_FLOOR + 0.03], [R + 0.05, 0.2], [R + 0.075, 0.235],
    [R + 0.11, 0.245], [R + 0.135, 0.225], [R + 0.12, 0.19], [R + 0.06, 0.02], [R, 0], [0, 0],
  ], 72);
  const panMaterial = new MeshStandardMaterial({ color: '#3a302b', roughness: 0.42, metalness: 0.3, side: DoubleSide });
  panMaterial.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vCjObj;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvCjObj = position;');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying vec3 vCjObj;\n${NOISE}`)
      .replace('#include <color_fragment>', /* glsl */ `#include <color_fragment>
        float cjPat = cjNoise(vCjObj * 1.7) * 0.6 + cjNoise(vCjObj * 7.0) * 0.4;
        diffuseColor.rgb *= 0.86 + 0.22 * cjPat;`)
      .replace('#include <roughnessmap_fragment>', /* glsl */ `#include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor + cjPat * 0.16, 0.25, 0.8);`);
  };
  const pan = new Mesh(panGeometry, panMaterial);
  scene.add(pan);

  // ---- Cup of coffee ---------------------------------------------------------------------
  const glaze = new MeshStandardMaterial({ color: '#2b1530', roughness: 0.12, metalness: 0, side: DoubleSide });
  const cupGeometry = lathe([
    [0, 0], [0.26, 0], [0.29, 0.025], [0.33, 0.17], [0.37, 0.38], [0.4, 0.56], [0.405, 0.6], [0.39, 0.608],
    [0.375, 0.57], [0.345, 0.38], [0.3, 0.17], [0.25, 0.075], [0, 0.075],
  ], 48);
  const saucerGeometry = lathe([
    [0, 0], [0.38, 0], [0.44, 0.018], [0.62, 0.06], [0.645, 0.074], [0.625, 0.082], [0.44, 0.045], [0.3, 0.035], [0, 0.035],
  ], 56);
  const handleGeometry = new TorusGeometry(0.15, 0.04, 10, 24, Math.PI * 1.25);
  handleGeometry.rotateZ(-Math.PI * 0.625);
  handleGeometry.translate(0.47, 0.33, 0);
  const cup = new Object3D();
  const body = new Mesh(cupGeometry, glaze);
  body.position.y = 0.035;
  const handle = new Mesh(handleGeometry, glaze);
  handle.position.y = 0.035;
  handle.rotation.y = -0.5;
  body.rotation.y = -0.5;
  const coffeeGeometry = new CircleGeometry(0.36, 40);
  coffeeGeometry.rotateX(-Math.PI / 2);
  const coffee = new Mesh(coffeeGeometry, new MeshStandardMaterial({ color: '#2a170d', roughness: 0.1, metalness: 0 }));
  coffee.position.y = COFFEE_Y;
  const porcelain = new MeshStandardMaterial({ color: '#f2e9da', roughness: 0.28, metalness: 0, side: DoubleSide });
  cup.add(new Mesh(saucerGeometry, porcelain), body, handle, coffee);
  cup.position.copy(CUP);
  cup.scale.setScalar(CUP_SCALE);
  scene.add(cup);

  // ---- Contact shadows (soft blobs, one draw call) -----------------------------------------
  dummy.position.set(0.12, 0.003, 0.16);
  dummy.scale.set(4.9, 1, 4.9);
  dummy.updateMatrix();
  shadowMatrices.push(dummy.matrix.clone());
  shadowDelays.set([-1, 1], BREADS * 2);
  shadowKinds.set([1, 0.5], BREADS * 2);
  dummy.position.set(CUP.x + 0.1, 0.003, CUP.z + 0.14);
  dummy.scale.set(1.55 * CUP_SCALE, 1, 1.55 * CUP_SCALE);
  dummy.updateMatrix();
  shadowMatrices.push(dummy.matrix.clone());
  shadowDelays.set([-1, 1], (BREADS + 1) * 2);
  shadowKinds.set([1, 0.55], (BREADS + 1) * 2);
  const shadowGeometry = new PlaneGeometry(1, 1);
  shadowGeometry.rotateX(-Math.PI / 2);
  shadowGeometry.setAttribute('aDelay', new InstancedBufferAttribute(shadowDelays, 2));
  shadowGeometry.setAttribute('aKind', new InstancedBufferAttribute(shadowKinds, 2));
  const shadowMaterial = new ShaderMaterial({
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
        float b = aKind.x > 0.5 ? 1.0 : smoothstep(aDelay.x, aDelay.x + 0.6, uBake);
        vec3 p = position;
        p.xz *= (aKind.x > 0.5 ? 1.0 : mix(0.8, 1.0, b) * aDelay.y);
        vUv = uv - 0.5;
        vKind = vec2(aKind.x, aKind.y);
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
  });
  const shadows = new InstancedMesh(shadowGeometry, shadowMaterial, shadowCount);
  shadowMatrices.forEach((m, i) => shadows.setMatrixAt(i, m));
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
        float sway = (cjNoise(vec3(y * 1.4 - t * 1.1, 2.3, 0.0)) * 0.2 + sin(y * 6.0 - t * 5.0) * 0.035) * smoothstep(0.0, 0.75, y);
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
  let width = 1;
  let height = 1;
  let progress = 0;
  let intro = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let fitDistance = 12;

  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const place = () => {
    const settle = 1 - ease(Math.min(intro, 1));
    const bake = progress;
    const elevation = (31 - 4 * bake + 5 * settle - pointer.y * 1.6) * (Math.PI / 180);
    const azimuth = (-6 + pointer.x * 3.2 - 3 * settle) * (Math.PI / 180);
    const distance = fitDistance * (1 - 0.07 * bake + 0.1 * settle);
    camera.position.set(
      target.x + Math.sin(azimuth) * Math.cos(elevation) * distance,
      target.y + Math.sin(elevation) * distance,
      target.z + Math.cos(azimuth) * Math.cos(elevation) * distance,
    );
    camera.lookAt(target);
    // Billboard the wisp around its vertical axis.
    steam.rotation.y = Math.atan2(camera.position.x - steam.position.x, camera.position.z - steam.position.z);
  };

  return {
    resize(w, h, dpr) {
      width = Math.max(1, w);
      height = Math.max(1, h);
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
    tick(dt) {
      intro = Math.min(1, intro + dt / 1.1);
      const k = 1 - Math.exp(-dt * 7);
      pointer.x += (pointer.tx - pointer.x) * k;
      pointer.y += (pointer.ty - pointer.y) * k;
      const settled = Math.abs(pointer.tx - pointer.x) < 1e-3 && Math.abs(pointer.ty - pointer.y) < 1e-3;
      if (settled) {
        pointer.x = pointer.tx;
        pointer.y = pointer.ty;
      }
      return intro < 1 || !settled;
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
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      environment.dispose();
      renderer.dispose();
    },
  };
}
