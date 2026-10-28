/**
 * Casa Jabuticaba motion, in three parts and nothing else:
 *  1. the headline arrives line by line, once (SplitText);
 *  2. the oven: the hero holds still for a short stretch of scroll while the breads bake (the authored moment);
 *  3. the menu prices tick into place once when the menu comes into view.
 * Under reduced motion only the static page remains: the runtime shows the photo and nothing animates.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { mountScene } from '../../../lib/three/mount';
import { prefersReducedMotion } from '../../../lib/motion';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = prefersReducedMotion();
const show = (el: Element | null) => el && gsap.set(el, { visibility: 'visible' });

/* 1. Headline ------------------------------------------------------------------------------- */
const title = document.querySelector<HTMLElement>('.hero-title');
if (title && !reduced) {
  document.fonts.ready.then(() => {
    const split = SplitText.create(title, { type: 'lines', mask: 'lines', tag: 'span', linesClass: 'hero-line' });
    gsap.set(split.lines, { yPercent: 108 });
    show(title);
    gsap.to(split.lines, {
      yPercent: 0,
      duration: 1.05,
      ease: 'expo.out',
      stagger: 0.11,
      onComplete: () => split.revert(),
    });
  });
} else {
  show(title);
}

/* 2. The oven ------------------------------------------------------------------------------- */
const hero = document.querySelector<HTMLElement>('.hero');
const oven = document.querySelector<HTMLElement>('[data-oven]');
if (hero && oven) {
  const handle = mountScene(oven, () => import('./scene'), { pointer: true });
  if (oven.dataset.scene !== 'fallback') {
    // Hold the hero still while the tray bakes, from the moment its bottom (where the oven sits
    // on phones) reaches the bottom of the screen. On desktop the hero fills the first screen,
    // so the hold starts right away and the first screen simply stays put.
    const hold = ScrollTrigger.create({
      trigger: hero,
      start: 'clamp(bottom bottom)',
      end: () => `+=${Math.round(window.innerHeight * 0.8)}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });
    const bake = { p: 0 };
    const tween = gsap.to(bake, {
      p: 1,
      ease: 'none',
      onUpdate: () => handle.setProgress(bake.p),
      scrollTrigger: { trigger: hero, start: 0, end: () => hold.end, scrub: 0.8, invalidateOnRefresh: true },
    });
    // If WebGL gives up after mounting, the photo comes back and the page should scroll normally.
    new MutationObserver((_, observer) => {
      if (oven.dataset.scene !== 'fallback') return;
      observer.disconnect();
      tween.scrollTrigger?.kill();
      tween.kill();
      hold.kill(true);
      ScrollTrigger.refresh();
    }).observe(oven, { attributes: true, attributeFilter: ['data-scene'] });
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }
}

/* 3. Prices tick into place ----------------------------------------------------------------- */
const menu = document.querySelector<HTMLElement>('#cardapio');
if (menu && !reduced) {
  const nums = [...menu.querySelectorAll<HTMLElement>('.cj-num')];
  const below = nums.filter((el) => el.getBoundingClientRect().top > window.innerHeight);
  const rolls = new Map<HTMLElement, () => void>();

  for (const el of below) {
    const text = el.textContent?.trim() ?? '';
    if (!/^\d+$/.test(text)) continue;
    // The real number stays in place (transparent) for layout, selection and screen readers;
    // an aria-hidden strip of digits rolls over it and is removed when it lands.
    const strip = document.createElement('span');
    strip.className = 'odo';
    strip.setAttribute('aria-hidden', 'true');
    const columns = [...text].map((ch, i) => {
      const digit = Number(ch);
      const steps = 3 + i * 3;
      const cell = document.createElement('span');
      cell.className = 'odo-d';
      const column = document.createElement('span');
      column.className = 'odo-c';
      // A blank first cell: at rest the price reads empty, never as a wrong number.
      for (let k = steps; k >= 0; k--) {
        const n = document.createElement('span');
        n.textContent = k === steps ? '\u00a0' : String((digit - k + 30) % 10);
        column.append(n);
      }
      cell.append(column);
      strip.append(cell);
      return { column, steps };
    });
    el.classList.add('is-rolling');
    el.append(strip);
    rolls.set(el, () => {
      columns.forEach(({ column, steps }, i) => {
        gsap.to(column, {
          yPercent: (-100 * steps) / (steps + 1),
          duration: 0.7 + i * 0.12,
          ease: 'power3.out',
          onComplete: i === columns.length - 1 ? () => { strip.remove(); el.classList.remove('is-rolling'); } : undefined,
        });
      });
    });
  }

  ScrollTrigger.batch([...rolls.keys()], {
    start: 'top bottom',
    once: true,
    interval: 0.08,
    onEnter: (batch) => batch.forEach((el, i) => gsap.delayedCall(i * 0.045, rolls.get(el as HTMLElement)!)),
  });
}
