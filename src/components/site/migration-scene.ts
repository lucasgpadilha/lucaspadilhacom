// The migration, as a technical drawing in the dark: five VMs hand ~250 containers
// to a Kubernetes cluster, switch off, the cluster gets rightsized and a network
// boundary is drawn around it. Every frame is a pure function of one progress value.
import {
  AmbientLight,
  BoxGeometry,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  Line,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  OrthographicCamera,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three';
import type { SceneContext, SceneInstance } from '../../lib/three/mount';
import { ALREADY_ON_CLUSTER, MIGRATED, easeInOut, easeOut, flight, stepProgress } from './migration-timeline';

const C = {
  face: 0x1b1a18,
  line: 0x5c5952,
  lineHot: 0xece9e1,
  signal: 0xff6b35,
  signalSoft: 0xffa27a,
  node: 0x22201d,
};

const VM_COUNT = 5;
const CLUSTER = new Vector3(4.4, 0, 0.2);
const HEX = 0.98; // hex size (center to corner)

// Deterministic "random" so every visitor sees the same drawing.
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export function create(canvas: HTMLCanvasElement, _ctx: SceneContext): SceneInstance {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  const focus = new Vector3();
  const OFFSET = new Vector3(11, 10.5, 12);

  scene.add(new AmbientLight(0xffffff, 0.6));
  const key = new DirectionalLight(0xffffff, 1.15);
  key.position.set(4, 10, 6);
  scene.add(key);

  // --- VMs ---------------------------------------------------------------
  const vmGeo = new BoxGeometry(2.7, 0.42, 1.45);
  const vmEdgeGeo = new EdgesGeometry(vmGeo);
  const vms = Array.from({ length: VM_COUNT }, (_, i) => {
    const group = new Group();
    group.position.set(-5.4, 0, -4 + i * 2);
    const face = new MeshLambertMaterial({ color: C.face, transparent: true });
    const edge = new LineBasicMaterial({ color: C.line, transparent: true });
    group.add(new Mesh(vmGeo, face), new LineSegments(vmEdgeGeo, edge));
    scene.add(group);
    return { group, face, edge };
  });

  // --- cluster nodes (hex grid, two rings) -------------------------------
  const axial: [number, number][] = [];
  for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) if (Math.abs(q + r) <= 2) axial.push([q, r]);
  const nodeGeo = new CylinderGeometry(HEX * 0.9, HEX * 0.9, 0.3, 6);
  const nodeEdgeGeo = new EdgesGeometry(nodeGeo);
  const nodeFace = new MeshLambertMaterial({ color: C.node });
  const nodeEdge = new LineBasicMaterial({ color: C.line });
  const nodeHome = axial.map(([q, r]) => new Vector3(HEX * Math.sqrt(3) * (q + r / 2), 0, HEX * 1.5 * r));
  const nodes = nodeHome.map((home) => {
    const group = new Group();
    group.add(new Mesh(nodeGeo, nodeFace), new LineSegments(nodeEdgeGeo, nodeEdge));
    group.position.copy(CLUSTER).add(home);
    scene.add(group);
    return group;
  });

  // Slots on top of each node, filled round-robin so the cluster grows evenly.
  const local: Vector3[] = [];
  for (let x = -1.5; x <= 1.5; x++) for (let z = -1.5; z <= 1.5; z++) local.push(new Vector3(x * 0.27, 0, z * 0.27));
  local.sort((a, b) => a.lengthSq() - b.lengthSq());
  const perNode = 14;
  const slots: { node: number; offset: Vector3 }[] = [];
  for (let k = 0; k < perNode; k++) for (let n = 0; n < nodes.length; n++) slots.push({ node: n, offset: local[k] });

  // --- containers ---------------------------------------------------------
  const total = ALREADY_ON_CLUSTER + MIGRATED;
  const boxGeo = new BoxGeometry(0.15, 0.15, 0.15);
  const boxMat = new MeshLambertMaterial({ color: 0xffffff });
  const boxes = new InstancedMesh(boxGeo, boxMat, total);
  const tint = new Color();
  for (let i = 0; i < total; i++) boxes.setColorAt(i, tint.set(C.signal).lerp(new Color(C.signalSoft), rand(i) * 0.45));
  scene.add(boxes);

  // Start positions: 10 already on the cluster, the rest packed on the VMs (10 × 5 per VM).
  const starts: Vector3[] = [];
  for (let j = 0; j < MIGRATED; j++) {
    const vm = j % VM_COUNT;
    const k = Math.floor(j / VM_COUNT);
    const base = vms[vm].group.position;
    starts.push(new Vector3(base.x - 1.08 + (k % 10) * 0.24, 0.29, base.z - 0.48 + Math.floor(k / 10) * 0.24));
  }
  const lift = Array.from({ length: MIGRATED }, (_, j) => 2.1 + rand(j + 7) * 1.4);

  // --- network boundary (VCN) + subnet lines (NSG) + WAF gate ------------
  const ring: Vector3[] = [];
  const rx = 4.1, rz = 3.8, corner = 0.9;
  const pts = [
    [-rx + corner, -rz], [rx - corner, -rz], [rx, -rz + corner], [rx, rz - corner],
    [rx - corner, rz], [-rx + corner, rz], [-rx, rz - corner], [-rx, -rz + corner], [-rx + corner, -rz],
  ];
  for (let i = 0; i < pts.length - 1; i++) {
    for (let s = 0; s < 24; s++) {
      const t = s / 24;
      ring.push(new Vector3(CLUSTER.x + pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, -0.2, CLUSTER.z + pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t));
    }
  }
  ring.push(ring[0].clone());
  const ringGeo = new BufferGeometry().setFromPoints(ring);
  const ringMat = new LineBasicMaterial({ color: C.lineHot, transparent: true, opacity: 0.85 });
  const boundary = new Line(ringGeo, ringMat);
  scene.add(boundary);

  const subnetPos: number[] = [];
  for (const z of [-1.3, 1.3]) subnetPos.push(CLUSTER.x - rx, -0.2, CLUSTER.z + z, CLUSTER.x + rx, -0.2, CLUSTER.z + z);
  const subnetGeo = new BufferGeometry();
  subnetGeo.setAttribute('position', new Float32BufferAttribute(subnetPos, 3));
  const subnetMat = new LineBasicMaterial({ color: C.line, transparent: true, opacity: 0 });
  scene.add(new LineSegments(subnetGeo, subnetMat));

  const gateGeo = new BoxGeometry(0.18, 0.9, 1.6);
  const gate = new Group();
  gate.add(new LineSegments(new EdgesGeometry(gateGeo), new LineBasicMaterial({ color: C.signal, transparent: true })));
  gate.position.set(CLUSTER.x - rx, 0.25, CLUSTER.z);
  scene.add(gate);

  // --- state --------------------------------------------------------------
  const dummy = new Object3D();
  const target = new Vector3();
  const mid = new Vector3();
  const pos = new Vector3();
  const lineCold = new Color(C.line);
  const lineHot = new Color(C.lineHot);
  let width = 1;
  let height = 1;

  // Everything the drawing can occupy, including the top of the flight arcs.
  const bounds = [
    [-7, 0, -5], [-7, 0, 5.2], [-3.9, 0, -5], [-3.9, 0, 5.2], [-3.9, 0.6, -5],
    [CLUSTER.x - 4.3, 0, CLUSTER.z - 4], [CLUSTER.x + 4.3, 0, CLUSTER.z - 4],
    [CLUSTER.x - 4.3, 0, CLUSTER.z + 4], [CLUSTER.x + 4.3, 0, CLUSTER.z + 4],
    [-0.5, 3.6, -1], [0.5, 3.6, 1],
  ].map(([x, y, z]) => new Vector3(x, y, z));
  focus.set(0.6, 0, 0);
  camera.position.copy(focus).add(OFFSET);
  camera.lookAt(focus);
  camera.updateMatrixWorld();

  function frame(aspect: number) {
    // Fit the projected bounds with a margin, centred, whatever the aspect.
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const point of bounds) {
      const v = point.clone().applyMatrix4(camera.matrixWorldInverse);
      minX = Math.min(minX, v.x); maxX = Math.max(maxX, v.x);
      minY = Math.min(minY, v.y); maxY = Math.max(maxY, v.y);
    }
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const halfW = Math.max((maxX - minX) / 2, ((maxY - minY) / 2) * aspect) * 1.06;
    const halfH = halfW / aspect;
    camera.left = cx - halfW;
    camera.right = cx + halfW;
    camera.top = cy + halfH;
    camera.bottom = cy - halfH;
    camera.updateProjectionMatrix();
  }

  function setProgress(p: number) {
    const s0 = stepProgress(p, 0); // VMs light up
    const m = stepProgress(p, 1); // containers fly
    const off = stepProgress(p, 2); // VMs switch off
    const fin = easeInOut(stepProgress(p, 3)); // rightsizing
    const net = stepProgress(p, 4); // boundary drawn


    // VMs: brighten, then switch off one after another.
    vms.forEach((vm, i) => {
      const fade = easeOut(Math.min(1, Math.max(0, off * VM_COUNT - i)));
      vm.edge.color.copy(lineCold).lerp(lineHot, easeOut(s0) * (1 - fade));
      vm.edge.opacity = 1 - fade * 0.7;
      vm.face.opacity = 1 - fade * 0.75;
      vm.group.scale.set(1, 1 - fade * 0.7, 1);
      vm.group.position.y = -fade * 0.12;
    });

    // Cluster: rightsized during FinOps (nodes shrink and pull together).
    const squeeze = 1 - 0.24 * fin;
    nodes.forEach((node, n) => {
      node.position.copy(nodeHome[n]).multiplyScalar(squeeze).add(CLUSTER);
      const scale = 1 - 0.18 * fin;
      node.scale.set(scale, 1, scale);
    });

    // Containers.
    for (let i = 0; i < total; i++) {
      const slot = slots[i];
      target.copy(slot.offset).multiplyScalar(1 - 0.18 * fin).add(nodes[slot.node].position);
      target.y = 0.24;
      if (i < ALREADY_ON_CLUSTER) {
        pos.copy(target);
      } else {
        const j = i - ALREADY_ON_CLUSTER;
        const t = easeInOut(flight(m, j));
        const start = starts[j];
        // Quadratic arc: start → raised midpoint → slot.
        mid.copy(start).lerp(target, 0.5);
        mid.y += lift[j];
        const u = 1 - t;
        pos.set(
          u * u * start.x + 2 * u * t * mid.x + t * t * target.x,
          u * u * start.y + 2 * u * t * mid.y + t * t * target.y,
          u * u * start.z + 2 * u * t * mid.z + t * t * target.z,
        );
        // VMs flatten when switched off; containers still sitting on them go down too.
        if (t === 0) pos.y -= Math.min(1, Math.max(0, off * VM_COUNT - (j % VM_COUNT))) * 0.3;
      }
      dummy.position.copy(pos);
      dummy.updateMatrix();
      boxes.setMatrixAt(i, dummy.matrix);
    }
    boxes.instanceMatrix.needsUpdate = true;

    // Network: boundary drawn as a line, then subnets and the WAF gate appear.
    boundary.geometry.setDrawRange(0, Math.floor(ring.length * easeOut(net)));
    subnetMat.opacity = easeOut(Math.max(0, net * 2 - 1)) * 0.9;
    gate.visible = net > 0.55;
  }

  setProgress(0);

  return {
    setProgress,
    resize(w, h, dpr) {
      width = Math.max(1, w);
      height = Math.max(1, h);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      frame(width / height);
    },
    render() {
      renderer.render(scene, camera);
    },
    dispose() {
      scene.traverse((object) => {
        const mesh = object as Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as { dispose?: () => void } | { dispose?: () => void }[] | undefined;
        if (Array.isArray(material)) material.forEach((mat) => mat.dispose?.());
        else material?.dispose?.();
      });
      renderer.dispose();
    },
  };
}
