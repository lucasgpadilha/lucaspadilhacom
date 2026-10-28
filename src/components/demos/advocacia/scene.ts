/**
 * Lacerda & Viana: ink diffusing in water, behind the hero headline.
 *
 * One WebGL2 fragment shader on a full-bleed triangle, no library. Domain-warped fbm shapes a
 * bloom of the page's ink (#14231D) on the ivory paper, with fibrous, feathered edges.
 *
 * Layout comes from the DOM, so CSS decides the composition per breakpoint:
 * - `[data-ink-stage]` is a square whose centre and half-width define "stage units" for the bloom;
 *   its `--ink-ox` / `--ink-oy` give the point (behind the headline) the bloom starts from.
 * - `[data-ink-calm="cap"]` boxes are kept clear: `0` means no ink (small text), a fraction is the
 *   most ink allowed (the headline, measured line by line, so the ink follows the rag).
 *
 * Motion: a bounded intro (the bloom, INTRO_MS), then only input. The pointer pulls the warp toward
 * the cursor with a damped ease that always settles POINTER_MS after the last move; scroll thins
 * the ink and draws it back toward the corner. With no input the frame is identical forever.
 */
import type { SceneContext, SceneInstance } from '../../../lib/three/mount';

const INTRO_MS = 1200;
const POINTER_MS = 900;
/** Two frames slower than this in a row: the device cannot animate the shader, so jump to the end. */
const SLOW_FRAME_MS = 120;
const MAX_CALM = 12;

const VERT = /* glsl */ `#version 300 es
void main() {
  vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `#version 300 es
precision highp float;
precision highp int;

uniform vec2 uView;      // drawing buffer, device px
uniform float uScale;    // device px per CSS px
uniform vec3 uStage;     // stage centre (CSS px, y down) and half-width
uniform vec2 uOrigin;    // where the bloom starts, stage units
uniform float uBloom;    // intro, 0..1
uniform float uFade;     // scroll, 0..1
uniform vec3 uPtr;       // damped pointer (stage units) and its weight
uniform vec4 uCalm[${MAX_CALM}];
uniform float uCap[${MAX_CALM}];
uniform int uCalmN;

out vec4 outColor;

const vec3 INK = vec3(20.0, 35.0, 29.0) / 255.0;
const vec3 WASH = vec3(34.0, 62.0, 54.0) / 255.0;
const mat2 ROT = mat2(0.80, 0.60, -0.60, 0.80);

uvec2 pcg(uvec2 v) {
  v = v * 1664525u + 1013904223u;
  v.x += v.y * 1664525u; v.y += v.x * 1664525u;
  v ^= v >> 16u;
  v.x += v.y * 1664525u; v.y += v.x * 1664525u;
  v ^= v >> 16u;
  return v;
}
vec2 grad(vec2 i) {
  return vec2(pcg(uvec2(ivec2(i) + 65536))) * (2.0 / 4294967295.0) - 1.0;
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = dot(grad(i), f);
  float b = dot(grad(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
  float c = dot(grad(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
  float d = dot(grad(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p, int oct) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++) {
    if (i >= oct) break;
    s += a * noise(p);
    p = ROT * p * 2.03 + vec2(17.13, 9.71);
    a *= 0.5;
  }
  return s;
}

void main() {
  vec2 css = vec2(gl_FragCoord.x, uView.y - gl_FragCoord.y) / uScale;
  vec2 u = (css - uStage.xy) / uStage.z;
  // Cheap bound: distance to the plume's axis, from its origin to where it comes to rest.
  vec2 rest = vec2(0.12, -0.12);
  vec2 ba = rest - uOrigin;
  float seg = length(u - uOrigin - ba * clamp(dot(u - uOrigin, ba) / dot(ba, ba), 0.0, 1.0));
  if (seg > 1.4) { outColor = vec4(0.0); return; }

  // Pointer: the warp leans toward the cursor, strongest close to it.
  vec2 toPtr = uPtr.xy - u;
  float pull = uPtr.z * exp(-dot(toPtr, toPtr) * 1.6);
  vec2 uu = u - toPtr * pull * 0.14;
  vec2 phase = uPtr.xy * uPtr.z * 0.06;

  float b = uBloom;
  float f = uFade;
  float unfurl = 1.0 - b;

  // Big forms first: a slow, low-frequency warp bends the cloud into a few lobes.
  vec2 p = uu * 0.9 + vec2(3.1, 7.7);
  vec2 q = vec2(fbm(p, 3), fbm(p + vec2(5.2, 1.3), 3));
  vec2 s = vec2(fbm(p + 2.6 * q + vec2(1.7, 9.2) + phase + unfurl * 0.5, 4),
                fbm(p + 2.6 * q + vec2(8.3, 2.8) - phase - unfurl * 0.35, 4));
  // Flow field: few octaves and a large warp, so filaments come out long, smooth and curling.
  float n = fbm(p * 1.5 + 3.6 * s + vec2(4.4, 0.6) + f * 0.3, 4);

  // The bloom is a plume: its head travels from the origin (behind the headline) to its resting
  // place, and the stem it leaves behind points back at the words.
  vec2 home = rest + vec2(0.22, -0.26) * f;
  vec2 centre = mix(uOrigin, home, smoothstep(0.0, 0.8, b));
  float grow = mix(0.08, 1.0, b) * (1.0 - 0.3 * f);
  vec2 axis = normalize(home - uOrigin);
  vec2 perp = vec2(-axis.y, axis.x);
  vec2 rel = (uu - centre) + 0.55 * s;
  float al = dot(rel, axis);
  float ac = dot(rel, perp);
  float stem = smoothstep(0.05, -0.9, al);
  float d = length(vec2(al * mix(0.92, 0.56, stem), ac * mix(1.12, 2.3, stem))) / grow;

  // Paper at the front: random, wriggly hairs where the ink wicks into the fibres.
  // Each patch of fibres lies along the local flow, so they read as hairs, not grain.
  float ang = 3.1 * (q.x + s.y);
  mat2 along = mat2(cos(ang), sin(ang), -sin(ang), cos(ang));
  float hair = pow(1.0 - abs(noise(along * u * vec2(9.0, 64.0) + 3.0 * s)), 8.0)
             + 0.7 * pow(1.0 - abs(noise(along * u * vec2(6.0, 38.0) + 7.0)), 8.0);
  float fine = fbm(u * 12.0 + s * 3.0, 2);
  float front = d + 0.12 * n + 0.05 * fine - 0.09 * hair * smoothstep(0.55, 0.95, d) + 0.3 * f;

  // Tone: water-side and ink-side of the flow field, thin tendrils along its zero line, a deep
  // heart, and a soft veil that the fibres feather out.
  float body = 1.0 - smoothstep(0.2, 0.95, front);
  float vol = smoothstep(0.0, 0.14, n);
  float micro = fbm(p * 3.2 + 4.0 * s + 2.0, 3);
  float tend = exp(-n * n * 140.0);
  float reach = 1.0 - smoothstep(0.75, 1.12, front);
  float veil = 1.0 - smoothstep(0.8, 1.0, front);

  float dens = veil * 0.05 + pow(body, 1.4) * mix(0.05, 0.92, vol) * (0.8 + 0.5 * micro)
             + tend * reach * (0.1 + 0.42 * body);
  dens *= 1.0 - 0.88 * f;
  dens *= smoothstep(0.0, 0.18, b);
  dens *= 1.0 - smoothstep(1.0, 1.38, seg);
  // Never a hard cut where the hero starts or ends.
  float hostH = uView.y / uScale;
  dens *= smoothstep(0.0, 64.0, css.y + fine * 40.0) * smoothstep(0.0, 64.0, hostH - css.y + fine * 40.0);

  // Keep the copy clear.
  float allow = 1.0;
  for (int i = 0; i < ${MAX_CALM}; i++) {
    if (i >= uCalmN) break;
    vec4 bx = uCalm[i];
    vec2 e = abs(css - (bx.xy + bx.zw * 0.5)) - bx.zw * 0.5;
    float sd = length(max(e, 0.0)) + min(max(e.x, e.y), 0.0);
    bool text = uCap[i] < 0.001;
    float inner = text ? 14.0 : 4.0;
    float soft = text ? 56.0 : 22.0;
    float m = 1.0 - smoothstep(inner, inner + soft, sd + fine * 24.0);
    allow = min(allow, mix(1.0, uCap[i], m));
  }
  float a = clamp(dens, 0.0, 1.0) * allow;

  vec3 col = mix(WASH, INK, smoothstep(0.12, 0.8, a));
  if (a > 0.004) {
    float dither = (float(pcg(uvec2(gl_FragCoord.xy)).x) / 4294967295.0 - 0.5) / 255.0;
    a = clamp(a + dither, 0.0, 1.0);
  } else {
    a = 0.0;
  }
  outColor = vec4(col * a, a);
}`;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const bloomEase = (t: number) => 1 - Math.pow(1 - t, 3.4);

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('ink: no shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(`ink: ${gl.getShaderInfoLog(shader)}`);
  return shader;
}

export function create(canvas: HTMLCanvasElement, _ctx: SceneContext): SceneInstance {
  const gl = canvas.getContext('webgl2', {
    alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: 'low-power',
  });
  if (!gl) throw new Error('ink: WebGL2 unavailable');

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!program) throw new Error('ink: no program');
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(`ink: ${gl.getProgramInfoLog(program)}`);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  const vao = gl.createVertexArray();

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const loc = {
    view: uniform('uView'), scale: uniform('uScale'), stage: uniform('uStage'), origin: uniform('uOrigin'),
    bloom: uniform('uBloom'), fade: uniform('uFade'), ptr: uniform('uPtr'),
    calm: uniform('uCalm'), cap: uniform('uCap'), calmN: uniform('uCalmN'),
  };

  const host = canvas.parentElement as HTMLElement;
  const stageEl = host.querySelector<HTMLElement>('[data-ink-stage]');

  let width = 1;
  let height = 1;
  const stage = [0, 0, 1];
  const origin = [-0.6, 0.6];
  const calm = new Float32Array(MAX_CALM * 4);
  const cap = new Float32Array(MAX_CALM);
  let calmN = 0;

  /** Read the composition from the layout (relative to the host, CSS px). */
  const measure = () => {
    const box = host.getBoundingClientRect();
    if (stageEl) {
      const r = stageEl.getBoundingClientRect();
      stage[0] = r.left - box.left + r.width / 2;
      stage[1] = r.top - box.top + r.height / 2;
      stage[2] = Math.max(1, r.width / 2);
      const style = getComputedStyle(stageEl);
      origin[0] = parseFloat(style.getPropertyValue('--ink-ox')) || -0.6;
      origin[1] = parseFloat(style.getPropertyValue('--ink-oy')) || 0.6;
    }
    calmN = 0;
    const push = (r: DOMRect | { left: number; top: number; width: number; height: number }, limit: number) => {
      if (calmN >= MAX_CALM || r.width <= 0 || r.height <= 0) return;
      calm.set([r.left - box.left, r.top - box.top, r.width, r.height], calmN * 4);
      cap[calmN] = limit;
      calmN += 1;
    };
    host.querySelectorAll<HTMLElement>('[data-ink-calm]').forEach((el) => {
      const limit = parseFloat(el.dataset.inkCalm || '0') || 0;
      if (limit === 0) return push(el.getBoundingClientRect(), 0);
      // Large type: one box per line, so the ink can come close to the ragged right edge.
      const range = document.createRange();
      range.selectNodeContents(el);
      const lines: { left: number; top: number; right: number; bottom: number }[] = [];
      for (const r of range.getClientRects()) {
        if (r.width < 1) continue;
        const line = lines.find((l) => Math.abs(l.top - r.top) < r.height * 0.5);
        if (line) {
          line.left = Math.min(line.left, r.left); line.right = Math.max(line.right, r.right);
          line.top = Math.min(line.top, r.top); line.bottom = Math.max(line.bottom, r.bottom);
        } else lines.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
      }
      range.detach();
      for (const l of lines) push({ left: l.left, top: l.top, width: l.right - l.left, height: l.bottom - l.top }, limit);
    });
  };

  // Intro and damped pointer, both on the wall clock so slow frames cannot stretch them. Where the
  // GPU cannot keep up (software rendering, old phones) both finish at once instead of stuttering.
  let introStart: number | null = null;
  let lastTick = 0;
  let slowFrames = 0;
  let bloom = 0;
  let fade = 0;
  const ptr = { x: 0, y: 0, w: 0 };
  let from = { ...ptr };
  let to = { ...ptr };
  let ptrStart = -Infinity;

  const pointerAt = (now: number) => {
    const k = easeOut(clamp01((now - ptrStart) / POINTER_MS));
    ptr.x = from.x + (to.x - from.x) * k;
    ptr.y = from.y + (to.y - from.y) * k;
    ptr.w = from.w + (to.w - from.w) * k;
    return k < 1;
  };

  return {
    resize(w, h, dpr) {
      width = Math.max(1, w);
      height = Math.max(1, h);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      measure();
    },
    setProgress(progress) {
      fade = clamp01(progress);
    },
    setPointer(x, y) {
      const now = performance.now();
      pointerAt(now);
      // Full pull inside the hero, none at or beyond its edges.
      const inside = 1 - clamp01((Math.max(Math.abs(x), Math.abs(y)) - 0.84) / 0.14);
      const px = ((x + 1) / 2) * width;
      const py = ((y + 1) / 2) * height;
      const target = { x: (px - stage[0]) / stage[2], y: (py - stage[1]) / stage[2], w: inside };
      // Outside the hero with no pull left: nothing would change, so start nothing.
      if (target.w < 0.001 && ptr.w < 0.001) {
        from = { ...target };
        to = { ...target };
        return;
      }
      // Entering from nowhere: fade the pull in where the cursor is instead of sweeping across.
      from = ptr.w < 0.02 ? { x: target.x, y: target.y, w: ptr.w } : { ...ptr };
      to = target;
      ptrStart = now;
    },
    tick() {
      const now = performance.now();
      introStart ??= now;
      slowFrames = lastTick && now - lastTick > SLOW_FRAME_MS ? slowFrames + 1 : 0;
      lastTick = now;
      if (slowFrames >= 2) {
        introStart = now - INTRO_MS;
        ptrStart = now - POINTER_MS;
      }
      const t = clamp01((now - introStart) / INTRO_MS);
      bloom = bloomEase(t);
      const moving = pointerAt(now);
      const more = t < 1 || moving;
      if (!more) lastTick = 0;
      return more;
    },
    render() {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.bindVertexArray(vao);
      gl.uniform2f(loc.view, canvas.width, canvas.height);
      gl.uniform1f(loc.scale, canvas.width / width);
      gl.uniform3f(loc.stage, stage[0], stage[1], stage[2]);
      gl.uniform2f(loc.origin, origin[0], origin[1]);
      gl.uniform1f(loc.bloom, bloom);
      gl.uniform1f(loc.fade, fade);
      gl.uniform3f(loc.ptr, ptr.x, ptr.y, ptr.w);
      gl.uniform4fv(loc.calm, calm);
      gl.uniform1fv(loc.cap, cap);
      gl.uniform1i(loc.calmN, calmN);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    dispose() {
      gl.deleteVertexArray(vao);
      gl.deleteProgram(program);
    },
  };
}
