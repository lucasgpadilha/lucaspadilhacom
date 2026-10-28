// Isometric drawing at build time: world points (x, y, z) become SVG paths, and the
// drawing's bounds become the viewBox. Scenes are authored back to front, so painter's
// order is simply the order shapes are added.
//
// Axes: +x runs to the lower right, +y to the lower left, +z up. A box shows its top,
// its +x face (lower right) and its +y face (lower left).

export type P3 = readonly [number, number, number];
export type P2 = readonly [number, number];

const COS30 = Math.cos(Math.PI / 6);
const SIN30 = 0.5;

const r2 = (n: number) => Math.round(n * 100) / 100;

export class Iso {
  private minX = Infinity;
  private minY = Infinity;
  private maxX = -Infinity;
  private maxY = -Infinity;

  /** @param unit SVG units per world unit. */
  constructor(readonly unit = 20) {}

  /** Projects without touching the bounds (for labels and animation targets). */
  at([x, y, z]: P3): P2 {
    return [r2((x - y) * COS30 * this.unit), r2(((x + y) * SIN30 - z) * this.unit)];
  }

  /** Projects and grows the bounds: every drawn point goes through here. */
  p(pt: P3): P2 {
    const [sx, sy] = this.at(pt);
    if (sx < this.minX) this.minX = sx;
    if (sx > this.maxX) this.maxX = sx;
    if (sy < this.minY) this.minY = sy;
    if (sy > this.maxY) this.maxY = sy;
    return [sx, sy];
  }

  /** Open polyline. */
  line(pts: readonly P3[]): string {
    return pts.map((pt, i) => `${i ? 'L' : 'M'}${this.p(pt).join(' ')}`).join('');
  }

  /** Closed polygon. */
  poly(pts: readonly P3[]): string {
    return `${this.line(pts)}Z`;
  }

  /** Axis-aligned box from (x, y, z), extending w along x, d along y and h up. */
  box(x: number, y: number, z: number, w: number, d: number, h: number) {
    const t = z + h;
    return {
      top: this.poly([[x, y, t], [x + w, y, t], [x + w, y + d, t], [x, y + d, t]]),
      right: this.poly([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, t], [x + w, y, t]]),
      left: this.poly([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, t], [x, y + d, t]]),
    };
  }

  /** Box centred on (cx, cy) on the plane z. */
  boxAt(cx: number, cy: number, z: number, w: number, d: number, h: number) {
    return this.box(cx - w / 2, cy - d / 2, z, w, d, h);
  }

  /** Flat rectangle on the plane z (an outline or a floor plate). */
  rect(x: number, y: number, z: number, w: number, d: number): string {
    return this.poly([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]]);
  }

  /** Circle on the plane z, drawn as a polygon (an ellipse on screen). */
  circle(cx: number, cy: number, z: number, r: number, segments = 48): string {
    const pts: P3[] = Array.from({ length: segments }, (_, i) => {
      const a = (i / segments) * Math.PI * 2;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, z];
    });
    return this.poly(pts);
  }

  /** Hexagonal prism: its top and the three sides that face the viewer. */
  hex(cx: number, cy: number, z: number, r: number, h: number) {
    const corner = (i: number, zz: number): P3 => {
      const a = (Math.PI / 3) * i + Math.PI / 6;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r, zz];
    };
    const t = z + h;
    const top = this.poly(Array.from({ length: 6 }, (_, i) => corner(i, t)));
    // Corners 5→0→1→2 face +x/+y, the sides the camera sees.
    const sides = [[5, 0], [0, 1], [1, 2]].map(([a, b]) =>
      this.poly([corner(a, z), corner(b, z), corner(b, t), corner(a, t)]),
    );
    return { top, sides };
  }

  /** Grid of floor lines over [x0, x1] × [y0, y1] every `step` units. */
  grid(x0: number, x1: number, y0: number, y1: number, step = 1, z = 0): string {
    let d = '';
    for (let x = x0; x <= x1 + 1e-9; x += step) d += this.line([[x, y0, z], [x, y1, z]]);
    for (let y = y0; y <= y1 + 1e-9; y += step) d += this.line([[x0, y, z], [x1, y, z]]);
    return d;
  }

  /** viewBox covering everything drawn so far, plus padding (in SVG units). */
  viewBox(pad = 12) {
    const x = r2(this.minX - pad);
    const y = r2(this.minY - pad);
    const w = r2(this.maxX - this.minX + pad * 2);
    const h = r2(this.maxY - this.minY + pad * 2);
    return { x, y, w, h, attr: `${x} ${y} ${w} ${h}` };
  }
}

/** Position of a world point as percentages of a viewBox, for HTML labels over the SVG. */
export function percent(iso: Iso, box: { x: number; y: number; w: number; h: number }, pt: P3) {
  const [sx, sy] = iso.at(pt);
  return { left: `${r2(((sx - box.x) / box.w) * 100)}%`, top: `${r2(((sy - box.y) / box.h) * 100)}%` };
}
