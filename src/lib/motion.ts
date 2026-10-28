// Capability checks shared by every animated surface.

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export const saveData = () =>
  Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

export function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** Static alternative instead of WebGL: reduced motion, Save-Data or no WebGL. */
export const wantsStatic = () => prefersReducedMotion() || saveData() || !canUseWebGL();
