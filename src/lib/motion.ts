// Capability checks shared by every animated surface.

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export const saveData = () =>
  Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

export function canUseWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    // three r186 and the custom shaders need WebGL2; WebGL1-only devices get the static version.
    const gl = canvas.getContext('webgl2');
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** Static alternative instead of WebGL: reduced motion, Save-Data or no WebGL. */
export const wantsStatic = () => prefersReducedMotion() || saveData() || !canUseWebGL();
