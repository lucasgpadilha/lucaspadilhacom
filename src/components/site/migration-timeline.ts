// Pure timeline math shared by the page script (counter, active step) and the 3D scene.
// One progress value (0..1) from the scroll drives everything, so both always agree.

export const STEPS = 3;
export const ALREADY_ON_CLUSTER = 10;
export const MIGRATED = 248; // 10 + 248 = 258 workloads at the end

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
/** Local progress of p inside [a, b]. */
export const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Step i owns [i/STEPS, (i+1)/STEPS]. */
export const stepIndex = (p: number) => Math.min(STEPS - 1, Math.floor(clamp01(p) * STEPS));
export const stepProgress = (p: number, i: number) => span(p, i / STEPS, (i + 1) / STEPS);

// Container j leaves at FLIGHT_STAGGER * j / MIGRATED and lands FLIGHT_TIME later (in migrate-step time).
export const FLIGHT_STAGGER = 0.7;
export const FLIGHT_TIME = 0.3;
export const flight = (m: number, j: number) => span(m, (FLIGHT_STAGGER * j) / MIGRATED, (FLIGHT_STAGGER * j) / MIGRATED + FLIGHT_TIME);

/** Containers that already landed on the cluster at overall progress p. */
export function landed(p: number): number {
  const m = stepProgress(p, 1);
  if (m < FLIGHT_TIME) return 0;
  return Math.min(MIGRATED, Math.floor(((m - FLIGHT_TIME) / FLIGHT_STAGGER) * MIGRATED) + 1);
}
