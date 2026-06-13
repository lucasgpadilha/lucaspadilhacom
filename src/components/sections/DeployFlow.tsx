import { motion } from 'framer-motion';
import { useLocale, type Locale } from '../../lib/i18n';

// Technical steps stay in English; only the framing copy is localized.
const steps = [
  'Push to main',
  'GitHub Actions',
  'Build static site',
  'Upload via SSH/SCP',
  'EC2',
  'Nginx',
  'Healthcheck',
];

const copy: Record<Locale, { eyebrow: string; title: string; description: string }> = {
  en: {
    eyebrow: 'How this site is deployed',
    title: 'The portfolio ships itself',
    description: 'A small CI/CD pipeline takes every push from commit to a live, health-checked server.',
  },
  pt: {
    eyebrow: 'Como este site é publicado',
    title: 'O portfólio se publica sozinho',
    description: 'Um pequeno pipeline CI/CD leva cada push do commit a um servidor no ar e com healthcheck.',
  },
};

export default function DeployFlow() {
  const { locale } = useLocale();
  const text = copy[locale];

  return (
    <section className="blueprint relative px-5 pb-8 pt-4">
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="surface-card p-6 sm:p-7"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
            {text.eyebrow}
          </p>
          <h3 className="mt-3 text-xl font-semibold text-[var(--text-1)] sm:text-2xl">
            {text.title}
          </h3>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-2)]">{text.description}</p>

          <div className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-2">
            {steps.map((step, index) => {
              const last = index === steps.length - 1;

              return (
                <span key={step} className="inline-flex items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[11px] ${
                      last
                        ? 'border-[rgba(245,165,36,0.3)] bg-[rgba(245,165,36,0.08)] text-[var(--text-1)]'
                        : 'border-[var(--hairline)] bg-white/[0.02] text-white/70'
                    }`}
                  >
                    {last && <span className="h-1 w-1 rounded-full bg-[var(--signal)]" />}
                    {step}
                  </span>
                  {!last && <span className="font-mono text-white/25">→</span>}
                </span>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
