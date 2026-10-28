import { wantsStatic } from '../motion';

/**
 * Shared runtime for every WebGL scene on the site.
 *
 * - Loads the scene module only when its host gets near the viewport.
 * - Renders on demand: nothing runs unless progress, pointer or size changed,
 *   or the scene's own tick() asks for more frames (bounded intros only).
 * - Pauses while the host is off screen and falls back to the host's
 *   [data-fallback] content when WebGL is unwanted or fails.
 *
 * The host gets data-scene="pending" | "live" | "fallback" (tests rely on it).
 */

export interface SceneContext {
  reducedMotion: boolean;
}

export interface SceneInstance {
  resize(width: number, height: number, dpr: number): void;
  render(): void;
  dispose(): void;
  setProgress?(progress: number): void;
  setPointer?(x: number, y: number): void;
  /** Advance time-based motion; return true while more frames are needed. Must settle within 5 s. */
  tick?(dt: number): boolean;
}

export interface SceneModule {
  create(canvas: HTMLCanvasElement, ctx: SceneContext): SceneInstance | Promise<SceneInstance>;
}

export interface SceneHandle {
  setProgress(progress: number): void;
  dispose(): void;
}

interface MountOptions {
  /** Forward pointer position (-1..1) to the scene. */
  pointer?: boolean;
  /** How early to load, as an IntersectionObserver rootMargin. */
  rootMargin?: string;
}

const NOOP: SceneHandle = { setProgress() {}, dispose() {} };

export function mountScene(host: HTMLElement, load: () => Promise<SceneModule>, options: MountOptions = {}): SceneHandle {
  if (wantsStatic()) {
    host.dataset.scene = 'fallback';
    return NOOP;
  }
  host.dataset.scene = 'pending';

  let instance: SceneInstance | null = null;
  let canvas: HTMLCanvasElement | null = null;
  let visible = false;
  let frame = 0;
  let last = 0;
  let pendingProgress: number | null = null;
  let disposed = false;
  const cleanups: (() => void)[] = [];

  const dprFor = (width: number) => Math.min(window.devicePixelRatio || 1, width < 700 ? 1 : 1.5);

  const loop = (now: number) => {
    frame = 0;
    if (!instance || !visible) return;
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    const more = instance.tick ? instance.tick(dt) : false;
    instance.render();
    if (more) frame = requestAnimationFrame(loop);
    else last = 0;
  };
  const request = () => {
    if (!frame && instance && visible) frame = requestAnimationFrame(loop);
  };

  const fail = () => {
    instance?.dispose();
    instance = null;
    canvas?.remove();
    canvas = null;
    host.dataset.scene = 'fallback';
    const fallback = host.querySelector<HTMLElement>('[data-fallback]');
    if (fallback) {
      fallback.hidden = false;
      fallback.style.removeProperty('display');
    }
  };

  const start = async () => {
    try {
      const module = await load();
      if (disposed) return;
      canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      canvas.className = 'scene-canvas';
      Object.assign(canvas.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
      canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); fail(); }, { once: true });
      host.append(canvas);
      instance = await module.create(canvas, { reducedMotion: false });
      const { width, height } = host.getBoundingClientRect();
      instance.resize(width, height, dprFor(width));
      if (pendingProgress !== null) instance.setProgress?.(pendingProgress);
      instance.render();
      host.dataset.scene = 'live';
      const fallback = host.querySelector<HTMLElement>('[data-fallback]');
      if (fallback) {
        // hidden alone loses to author CSS such as display: grid
        fallback.hidden = true;
        fallback.style.display = 'none';
      }

      const resize = new ResizeObserver(([entry]) => {
        const { width: w, height: h } = entry.contentRect;
        instance?.resize(w, h, dprFor(w));
        request();
      });
      resize.observe(host);
      cleanups.push(() => resize.disconnect());

      if (options.pointer) {
        const move = (event: PointerEvent) => {
          const rect = host.getBoundingClientRect();
          instance?.setPointer?.(((event.clientX - rect.left) / rect.width) * 2 - 1, ((event.clientY - rect.top) / rect.height) * 2 - 1);
          request();
        };
        window.addEventListener('pointermove', move, { passive: true });
        cleanups.push(() => window.removeEventListener('pointermove', move));
      }
      request();
    } catch {
      fail();
    }
  };

  let started = false;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !started) {
      started = true;
      void start();
    }
    if (visible) request();
  }, { rootMargin: options.rootMargin ?? '50% 0px' });
  io.observe(host);
  cleanups.push(() => io.disconnect());

  return {
    setProgress(progress: number) {
      pendingProgress = progress;
      if (instance) {
        instance.setProgress?.(progress);
        request();
      }
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      cleanups.forEach((fn) => fn());
      instance?.dispose();
      instance = null;
    },
  };
}
