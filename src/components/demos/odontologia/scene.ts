/**
 * Aurora Odontologia: a dental arch that aligns as you scroll (the aligner metaphor).
 *
 * - 14 procedural crowns (5 shapes, one InstancedMesh each, one shared material),
 *   laid out by arc length along a parabolic arch.
 * - progress 0: crooked (rotated, displaced, a diastema). progress 1: aligned, and the coral
 *   aurora light warms the enamel (the page raises the Aurora sun behind the canvas in step).
 * - Soft contact shadows are instanced quads with an analytic falloff, not shadow maps.
 * - The canvas is transparent: the page's mint panel is the backdrop, so the live scene
 *   and the static fallback (a capture of this scene) sit on exactly the same colour.
 * - Renders on demand. tick() runs only for the short intro (≤ 1.2 s) and to damp the
 *   pointer parallax, and always settles: there is a hard deadline on both.
 */
import {
  BackSide,
  BufferAttribute,
  Color,
  DirectionalLight,
  DoubleSide,
  DynamicDrawUsage,
  Euler,
  Group,
  HemisphereLight,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Quaternion,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import type { SceneContext, SceneInstance } from '../../../lib/three/mount';

type Kind = 'central' | 'lateral' | 'canine' | 'premolar' | 'molar';

/** Half-widths (a: mesiodistal, b: buccolingual), crown height h, horizontal (n) and vertical (m) squareness. 1 unit ≈ 10 mm. */
const SPECS: Record<Kind, { a: number; b: number; h: number; n: number; m: number }> = {
  central: { a: 0.43, b: 0.34, h: 1.12, n: 3.1, m: 3.8 },
  lateral: { a: 0.33, b: 0.3, h: 0.98, n: 2.8, m: 3.5 },
  canine: { a: 0.38, b: 0.4, h: 1.08, n: 2.3, m: 2.7 },
  premolar: { a: 0.35, b: 0.45, h: 0.86, n: 2.6, m: 3.0 },
  molar: { a: 0.5, b: 0.54, h: 0.8, n: 3.3, m: 3.2 },
};

/** From the midline to the back: kind and a size factor (second premolar and second molar are a little smaller). */
const SIDE: { kind: Kind; scale: number }[] = [
  { kind: 'central', scale: 1 },
  { kind: 'lateral', scale: 1 },
  { kind: 'canine', scale: 1 },
  { kind: 'premolar', scale: 1 },
  { kind: 'premolar', scale: 0.96 },
  { kind: 'molar', scale: 1 },
  { kind: 'molar', scale: 0.92 },
];

/**
 * The crooked starting point, per tooth, in the tooth's own frame:
 * [distal shift, outward shift, lift, yaw°, mesiodistal tip°, labial tilt°].
 * Side -1 is screen left, side +1 screen right, k = 0 at the midline.
 */
const CROOKED: Record<string, number[]> = {
  '-1:0': [0.16, 0.02, 0, 13, 2, 0],
  '-1:1': [-0.04, -0.36, -0.04, -26, 5, -4],
  '-1:2': [-0.12, 0.42, 0.15, 12, -10, 7],
  '-1:3': [0.02, -0.08, 0, 34, 0, 0],
  '-1:4': [0.06, 0.14, -0.02, -24, 7, 0],
  '-1:5': [0.04, -0.08, 0, 15, 11, 0],
  '-1:6': [0.1, 0.06, 0, -12, 6, 0],
  '1:0': [0.14, 0.08, 0.02, -5, -8, 7],
  '1:1': [-0.02, 0.24, 0, 22, 3, 5],
  '1:2': [0.06, 0.12, 0, -16, 6, 0],
  '1:3': [0.02, 0.16, 0, -28, 0, 3],
  '1:4': [0.02, -0.2, -0.04, 20, 0, 0],
  '1:5': [0.03, 0.1, 0, -15, -6, 6],
  '1:6': [0.08, -0.06, 0, 11, -6, 0],
};

const ARCH_C = 0.56; // z = -C·x²
const GAP = 0.012; // contact gap between neighbours
const ELEVATION = { wide: (29 * Math.PI) / 180, tall: (43 * Math.PI) / 180 }; // tall canvases look down more
const FOV = 24;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const spow = (v: number, e: number) => Math.sign(v) * Math.abs(v) ** e;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const gauss = (u: number, v: number, cu: number, cv: number, su: number, sv: number) =>
  Math.exp(-((u - cu) ** 2) / su - (v - cv) ** 2 / sv);

/** Occlusal relief in normalised crown coordinates (u across the arch, v outward), as a fraction of crown height. */
function relief(kind: Kind, u: number, v: number): number {
  switch (kind) {
    case 'molar':
      return (
        0.13 * (gauss(u, v, -0.44, 0.42, 0.09, 0.09) + gauss(u, v, 0.44, 0.42, 0.09, 0.09)) +
        0.11 * (gauss(u, v, -0.44, -0.42, 0.09, 0.09) + gauss(u, v, 0.44, -0.42, 0.09, 0.09)) -
        0.05 * gauss(u, v, 0, 0, 0.08, 0.05) -
        0.035 * Math.exp(-(v * v) / 0.018)
      );
    case 'premolar':
      return 0.16 * gauss(u, v, 0, 0.44, 0.22, 0.08) + 0.11 * gauss(u, v, 0, -0.42, 0.22, 0.08) - 0.05 * Math.exp(-(v * v) / 0.02);
    case 'canine': {
      const d = Math.hypot(u, v * 1.1);
      return 0.2 * Math.max(0, 1 - d / 0.95) ** 1.6;
    }
    default:
      return 0.025 * (1 - u * u); // incisal edge: almost flat, a touch higher in the middle
  }
}

const TONE = {
  neck: new Color('#e3cfae'),
  body: new Color('#f3ece1'),
  edge: new Color('#dfe5e3'), // the bluish, translucent-looking incisal third
  cusp: new Color('#f8f3ea'),
};

/** A crown: a superellipsoid shaped by height profiles, cusps and a tone gradient (vertex colours). */
function toothGeometry(kind: Kind) {
  const s = SPECS[kind];
  const base = new SphereGeometry(1, 40, 30);
  base.deleteAttribute('uv');
  base.deleteAttribute('normal');
  const geometry = mergeVertices(base, 1e-5);
  base.dispose();
  const position = geometry.getAttribute('position');
  const colors = new Float32Array(position.count * 3);
  const p = new Vector3();
  const c = new Color();
  const e1 = 2 / s.m;
  const e2 = 2 / s.n;
  const incisor = kind === 'central' || kind === 'lateral';

  for (let i = 0; i < position.count; i++) {
    p.fromBufferAttribute(position, i).normalize();
    const lat = Math.atan2(p.y, Math.hypot(p.x, p.z));
    const lon = Math.atan2(p.z, p.x);
    const R = spow(Math.cos(lat), e1);
    const Y = spow(Math.sin(lat), e1);
    const t = (Y + 1) / 2; // 0 at the neck, 1 at the occlusal / incisal end
    let wa: number;
    let wb: number;
    let bulge = 0;
    if (incisor) {
      wa = mix(0.62, 1, smooth(0, 0.8, t)); // spade: widest at the edge
      wb = mix(1, 0.4, smooth(0.25, 1, t)) * mix(0.84, 1, smooth(0, 0.25, t)); // thin at the edge
      bulge = 0.07 * Math.sin(Math.PI * t * 0.9); // convex labial face
    } else if (kind === 'canine') {
      wa = mix(0.66, 1, smooth(0, 0.5, t)) * (1 - 0.46 * smooth(0.62, 1, t));
      wb = mix(0.8, 1, smooth(0, 0.4, t)) * (1 - 0.32 * smooth(0.6, 1, t));
      bulge = 0.04 * Math.sin(Math.PI * t);
    } else if (kind === 'premolar') {
      wa = mix(0.7, 1, smooth(0, 0.55, t)) * (1 - 0.08 * smooth(0.75, 1, t));
      wb = mix(0.72, 1, smooth(0, 0.5, t)) * (1 - 0.12 * smooth(0.7, 1, t));
    } else {
      wa = mix(0.76, 1, smooth(0, 0.5, t)) * (1 - 0.05 * smooth(0.8, 1, t));
      wb = mix(0.74, 1, smooth(0, 0.5, t)) * (1 - 0.1 * smooth(0.7, 1, t));
    }
    const u = R * spow(Math.cos(lon), e2);
    const v = R * spow(Math.sin(lon), e2);
    const cap = smooth(0.5, 0.95, Math.sin(lat));
    const r = relief(kind, u, v);
    const x = u * s.a * wa;
    const z = v * s.b * wb + bulge * s.h;
    const y = t * s.h + r * s.h * cap - 0.03; // sunk a hair into the floor
    position.setXYZ(i, x, y, z);

    c.copy(TONE.neck).lerp(TONE.body, smooth(0.05, 0.42, t));
    if (incisor || kind === 'canine') c.lerp(TONE.edge, smooth(0.78, 1, t) * (incisor ? 0.85 : 0.45));
    else c.lerp(TONE.cusp, clamp01(r * 6) * cap);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  geometry.setAttribute('color', new BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

/** Arc length → x on the parabola z = -C·x², by a dense lookup. */
function archLookup() {
  const step = 0.002;
  const xs: number[] = [0];
  const ls: number[] = [0];
  for (let x = step; x <= 5; x += step) {
    const slope = 2 * ARCH_C * (x - step / 2);
    xs.push(x);
    ls.push(ls[ls.length - 1] + step * Math.sqrt(1 + slope * slope));
  }
  return (length: number) => {
    let lo = 0;
    let hi = ls.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (ls[mid] < length) lo = mid;
      else hi = mid;
    }
    const f = (length - ls[lo]) / (ls[hi] - ls[lo] || 1);
    return xs[lo] + f * (xs[hi] - xs[lo]);
  };
}

interface Tooth {
  kind: Kind;
  index: number; // within its InstancedMesh
  scale: number;
  rank: number; // 0 at the midline … 6 at the back
  side: number;
  a: number;
  b: number;
  h: number;
  base: Vector3; // aligned position
  tangent: Vector3;
  normal: Vector3;
  basis: Quaternion;
  crooked: number[];
}

/** A small studio for image-based lighting: mint-tinted room, three softboxes. Rendered once into a PMREM. */
function studio() {
  const room = new Scene();
  const shell = new Mesh(
    new SphereGeometry(20, 24, 16),
    new MeshBasicMaterial({ side: BackSide, vertexColors: true }),
  );
  const pos = shell.geometry.getAttribute('position');
  const colors = new Float32Array(pos.count * 3);
  const top = new Color('#f6f8f6');
  const floor = new Color('#b9d6cf');
  const c = new Color();
  for (let i = 0; i < pos.count; i++) {
    c.copy(floor).lerp(top, smooth(-12, 10, pos.getY(i))).multiplyScalar(0.62);
    colors.set([c.r, c.g, c.b], i * 3);
  }
  shell.geometry.setAttribute('color', new BufferAttribute(colors, 3));
  room.add(shell);
  const box = (w: number, h: number, intensity: number, tint: string, at: [number, number, number]) => {
    const mesh = new Mesh(new PlaneGeometry(w, h), new MeshBasicMaterial({ color: new Color(tint).multiplyScalar(intensity), side: DoubleSide }));
    mesh.position.set(...at);
    mesh.lookAt(0, 0, 0);
    room.add(mesh);
  };
  box(14, 10, 2.6, '#fffaf2', [0, 12, 2]); // overhead
  box(7, 5, 2.2, '#ffffff', [-9, 5, 9]); // key, front left
  box(3, 9, 1.1, '#eef7f5', [11, 3, -2]); // strip, right
  return room;
}

const shadowVertex = /* glsl */ `
  attribute float aOpacity;
  varying vec2 vUv;
  varying float vOpacity;
  void main() {
    vUv = uv;
    vOpacity = aOpacity;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
`;
const shadowFragment = /* glsl */ `
  uniform vec3 uColor;
  varying vec2 vUv;
  varying float vOpacity;
  void main() {
    float d = length((vUv - 0.5) * 2.0);
    float core = exp(-d * d * 7.0);
    float soft = pow(max(0.0, 1.0 - d), 2.2);
    gl_FragColor = vec4(uColor, (0.55 * core + 0.3 * soft) * vOpacity);
    #include <colorspace_fragment>
  }
`;
export function create(canvas: HTMLCanvasElement, ctx: SceneContext): SceneInstance {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const room = studio();
  const envTarget = pmrem.fromScene(room, 0.035);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 1.05;
  room.traverse((o) => {
    const mesh = o as Mesh;
    if (mesh.isMesh) {
      mesh.geometry.dispose();
      (mesh.material as MeshBasicMaterial).dispose();
    }
  });
  pmrem.dispose();

  const camera = new PerspectiveCamera(FOV, 1, 0.5, 80);
  const arch = new Group(); // origin at the arch's centroid; pointer parallax yaws it
  scene.add(arch);

  // Lights: a soft key, a mint fill, and the coral aurora rim that grows at the end.
  const hemi = new HemisphereLight(0xffffff, 0xcfe6e0, 0.35);
  const key = new DirectionalLight(0xfff6ee, 1.35);
  key.position.set(-4, 8, 6);
  const fill = new DirectionalLight(0xe6f4f0, 0.35);
  fill.position.set(6, 3, 3);
  // the aurora comes from where the page's dawn glow rises: low, in front
  const aurora = new DirectionalLight(0xffc6a8, 0);
  aurora.position.set(0.5, 1.2, 8);
  const rim = new DirectionalLight(0xffe0cc, 0);
  rim.position.set(-2, 3, -7);
  scene.add(hemi, key, fill, aurora, rim);
  const keyCool = new Color(0xf6faf9);
  const keyWarm = new Color(0xfff3ea);
  const groundCool = new Color(0xcfe6e0);
  const groundWarm = new Color(0xf3e0d6);

  // Teeth
  const enamel = new MeshPhysicalMaterial({
    color: 0xffffff,
    vertexColors: true,
    roughness: 0.33,
    metalness: 0,
    clearcoat: 0.65,
    clearcoatRoughness: 0.2,
    sheen: 0.55,
    sheenRoughness: 0.45,
    sheenColor: new Color(0xfff2e2),
    specularIntensity: 0.55,
  });

  const lookup = archLookup();
  const teeth: Tooth[] = [];
  const counts: Record<Kind, number> = { central: 0, lateral: 0, canine: 0, premolar: 0, molar: 0 };
  const up = new Vector3(0, 1, 0);
  let minZ = 0;
  for (const side of [-1, 1]) {
    let along = -0.035; // the centrals lean on each other at the midline (their edges are the widest part)
    SIDE.forEach(({ kind, scale }, rank) => {
      const s = SPECS[kind];
      const width = 2 * s.a * scale;
      const centre = along + width / 2;
      along += width + GAP;
      const x = side * lookup(centre);
      const z = -ARCH_C * x * x;
      minZ = Math.min(minZ, z);
      const tangent = new Vector3(1, 0, -2 * ARCH_C * x).normalize();
      const normal = new Vector3().crossVectors(tangent, up).normalize();
      const basis = new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(tangent, up, normal));
      teeth.push({
        kind,
        index: counts[kind]++,
        scale,
        rank,
        side,
        a: s.a * scale,
        b: s.b * scale,
        h: s.h * scale,
        base: new Vector3(x, 0, z),
        tangent,
        normal,
        basis,
        crooked: CROOKED[`${side}:${rank}`],
      });
    });
  }
  // Centre the arch on its centroid so the parallax pivots in the middle.
  const centreZ = minZ / 2;
  for (const tooth of teeth) tooth.base.z -= centreZ;

  const meshes = {} as Record<Kind, InstancedMesh>;
  for (const kind of Object.keys(counts) as Kind[]) {
    const mesh = new InstancedMesh(toothGeometry(kind), enamel, counts[kind]);
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    mesh.frustumCulled = false;
    meshes[kind] = mesh;
    arch.add(mesh);
  }

  // Contact shadows: one soft quad per tooth.
  const shadowGeometry = new PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
  const shadowOpacity = new InstancedBufferAttribute(new Float32Array(teeth.length).fill(1), 1);
  shadowOpacity.setUsage(DynamicDrawUsage);
  shadowGeometry.setAttribute('aOpacity', shadowOpacity);
  const shadowMaterial = new ShaderMaterial({
    vertexShader: shadowVertex,
    fragmentShader: shadowFragment,
    uniforms: { uColor: { value: new Color('#1f4440') } },
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  const shadows = new InstancedMesh(shadowGeometry, shadowMaterial, teeth.length);
  shadows.instanceMatrix.setUsage(DynamicDrawUsage);
  shadows.frustumCulled = false;
  shadows.renderOrder = 2;
  arch.add(shadows);

  // State
  let progress = 0;
  let dirty = true;
  let introStart = -1;
  let intro = ctx.reducedMotion ? 1 : 0; // 0 → 1 over the intro
  const INTRO_MS = 1150;
  const pointer = { x: 0, tx: 0, last: 0, at: 0 };

  const m = new Matrix4();
  const q = new Quaternion();
  const qOffset = new Quaternion();
  const euler = new Euler(0, 0, 0, 'YZX');
  const pos = new Vector3();
  const scl = new Vector3();
  const shadowQ = new Quaternion();
  const axisX = new Vector3();
  const deg = Math.PI / 180;

  function layout() {
    // the crooked arch holds while the first beat reads, then aligns over the middle of the story
    const align = clamp01((progress - 0.12) / 0.72);
    const warm = smooth(0.68, 0.98, progress);
    for (let i = 0; i < teeth.length; i++) {
      const tooth = teeth[i];
      const delay = tooth.rank * 0.075 + (tooth.side > 0 ? 0.03 : 0);
      const local = easeInOut(clamp01((align - delay) / 0.52));
      const left = 1 - local; // how crooked it still is
      const [dt, dn, dy, yaw, tip, tilt] = tooth.crooked;
      // the intro sets each tooth down, from the midline outward
      const drop = 1 - easeOut(clamp01((intro * 1.15 - tooth.rank * 0.06) / 0.7));
      const glide = 0.07 * Math.sin(Math.PI * local) * Math.min(1, Math.abs(yaw) / 20 + Math.abs(dn) * 3);
      const lift = Math.max(0, dy * left) + glide + 0.3 * drop;

      pos.copy(tooth.base)
        .addScaledVector(tooth.tangent, tooth.side * dt * left)
        .addScaledVector(tooth.normal, dn * left)
        .addScaledVector(up, dy * left + glide + 0.3 * drop);
      euler.set(tilt * deg * left, yaw * deg * left, tip * deg * left * tooth.side);
      q.copy(tooth.basis).multiply(qOffset.setFromEuler(euler));
      scl.setScalar(tooth.scale);
      m.compose(pos, q, scl);
      meshes[tooth.kind].setMatrixAt(tooth.index, m);

      // shadow: on the floor under the crown, a little behind (key light is front left), softer when lifted
      axisX.set(1, 0, 0).applyQuaternion(q);
      shadowQ.setFromAxisAngle(up, Math.atan2(-axisX.z, axisX.x));
      const spread = 1 + lift * 1.6;
      pos.set(pos.x + 0.05, 0.002, pos.z - 0.06);
      scl.set(tooth.a * 2.5 * spread, 1, tooth.b * 2.6 * spread);
      m.compose(pos, shadowQ, scl);
      shadows.setMatrixAt(i, m);
      shadowOpacity.setX(i, 1 / (1 + lift * 4));
    }
    for (const mesh of Object.values(meshes)) mesh.instanceMatrix.needsUpdate = true;
    shadows.instanceMatrix.needsUpdate = true;
    shadowOpacity.needsUpdate = true;

    // the aurora
    aurora.intensity = 0.75 * warm;
    rim.intensity = 0.45 * warm;
    key.color.copy(keyCool).lerp(keyWarm, warm);
    hemi.groundColor.copy(groundCool).lerp(groundWarm, warm);
    arch.rotation.y = pointer.x * 0.11;
  }

  /** Fit the arch to the canvas, then shift the projection so it sits centred. */
  const target = new Vector3(0, 0.45, 0);
  const probe: Vector3[] = [];
  for (const tooth of teeth) {
    for (const k of [-1, 1]) {
      const reach = tooth.b + Math.abs(tooth.crooked[1]) + 0.1; // room for its own crooked offset
      probe.push(tooth.base.clone().addScaledVector(tooth.normal, k * reach).setY(0));
      probe.push(tooth.base.clone().addScaledVector(tooth.normal, k * reach).setY(tooth.h + 0.18));
    }
  }
  const projected = new Vector3();
  let fitShift = { x: 0, y: 0 };

  function frame(width: number, height: number) {
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
    const elevation = mix(ELEVATION.tall, ELEVATION.wide, smooth(0.75, 1.2, camera.aspect));
    const dir = new Vector3(0, Math.sin(elevation), Math.cos(elevation));
    const fill = width < 560 ? 0.92 : 0.86;
    // sit a little above centre, so the dawn glow has room to rise beneath the arch (more on tall canvases)
    const lift = mix(0.16, 0.05, smooth(0.75, 1.2, camera.aspect));
    const measure = (distance: number) => {
      camera.position.copy(target).addScaledVector(dir, distance);
      camera.lookAt(target);
      camera.updateMatrixWorld();
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const point of probe) {
        projected.copy(point).project(camera);
        x0 = Math.min(x0, projected.x); x1 = Math.max(x1, projected.x);
        y0 = Math.min(y0, projected.y); y1 = Math.max(y1, projected.y);
      }
      return { x0, x1, y0, y1 };
    };
    let lo = 4;
    let hi = 80;
    for (let i = 0; i < 28; i++) {
      const mid = (lo + hi) / 2;
      const b = measure(mid);
      if ((b.x1 - b.x0) / 2 <= fill && (b.y1 - b.y0) / 2 <= fill - lift) hi = mid;
      else lo = mid;
    }
    const b = measure(hi);
    fitShift = { x: (b.x0 + b.x1) / 2, y: (b.y0 + b.y1) / 2 - lift };
    applyShift();
  }
  function applyShift() {
    camera.updateProjectionMatrix();
    camera.projectionMatrix.elements[8] = fitShift.x;
    camera.projectionMatrix.elements[9] = fitShift.y;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  }

  return {
    resize(width, height, dpr) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)), false);
      frame(width, height);
      dirty = true;
    },
    setProgress(value) {
      const next = clamp01(value);
      if (next !== progress) {
        progress = next;
        dirty = true;
      }
    },
    setPointer(x) {
      pointer.tx = Math.max(-1, Math.min(1, x));
      pointer.at = performance.now();
    },
    tick() {
      const now = performance.now();
      let more = false;
      if (intro < 1) {
        if (introStart < 0) introStart = now;
        intro = clamp01((now - introStart) / INTRO_MS);
        dirty = true;
        more = intro < 1;
      }
      if (pointer.x !== pointer.tx) {
        const dt = pointer.last ? Math.min(0.1, (now - pointer.last) / 1000) : 1 / 60;
        pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 5));
        // hard stop: never more than 0.9 s of easing after the last pointer event
        if (Math.abs(pointer.tx - pointer.x) < 0.002 || now - pointer.at > 900) pointer.x = pointer.tx;
        dirty = true;
        more = more || pointer.x !== pointer.tx;
      }
      pointer.last = more ? now : 0;
      return more;
    },
    render() {
      if (dirty) {
        layout();
        dirty = false;
      }
      renderer.render(scene, camera);
    },
    dispose() {
      for (const mesh of Object.values(meshes)) {
        mesh.geometry.dispose();
        mesh.dispose();
      }
      enamel.dispose();
      shadowGeometry.dispose();
      shadowMaterial.dispose();
      shadows.dispose();
      envTarget.dispose();
      renderer.dispose();
    },
  };
}
