import { motion } from 'framer-motion';
import {
  Activity,
  Box,
  Cloud,
  Code2,
  FileCode2,
  Settings2,
  Terminal,
  Workflow,
} from 'lucide-react';
import { stackCategoriesByLocale, type StackCategory } from '../../data/stack';
import { ToolLogo } from '../../lib/tool-meta';
import { useLocale, type Locale } from '../../lib/i18n';

const icons: Record<StackCategory['icon'], typeof Cloud> = {
  cloud: Cloud,
  code: Code2,
  settings: Settings2,
  box: Box,
  workflow: Workflow,
  terminal: Terminal,
  file: FileCode2,
  activity: Activity,
};

const copy: Record<Locale, { eyebrow: string; title: string; description: string }> = {
  en: {
    eyebrow: 'Stack',
    title: 'Operational stack',
    description:
      'Tools selected to build, version, provision, configure and observe infrastructure.',
  },
  pt: {
    eyebrow: 'Stack',
    title: 'Stack operacional',
    description:
      'Ferramentas escolhidas para construir, versionar, provisionar, configurar e observar infraestrutura.',
  },
};

export default function StackSection() {
  const { locale } = useLocale();
  const text = copy[locale];
  const stackCategories = stackCategoriesByLocale[locale];

  return (
    <section id="stack" className="blueprint relative px-5 py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
              {text.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-[var(--text-1)] sm:text-5xl">
              {text.title}
            </h2>
            <p className="mt-5 text-base leading-7 text-[var(--text-2)]">
              {text.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="divide-y divide-[var(--hairline)] overflow-hidden rounded-xl border border-[var(--hairline)] bg-[var(--surface)]"
          >
            {stackCategories.map((category) => {
              const Icon = icons[category.icon];

              return (
                <div
                  key={category.title}
                  className="flex flex-col gap-3 px-5 py-4 transition-colors duration-200 hover:bg-[#121315] sm:flex-row sm:items-center sm:gap-6"
                >
                  <div className="flex w-44 shrink-0 items-center gap-2.5">
                    <Icon size={15} strokeWidth={1.8} className="text-white/40" />
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/55">
                      {category.title}
                    </h3>
                  </div>
                  <div className="hidden h-6 w-px shrink-0 bg-[var(--hairline)] sm:block" aria-hidden="true" />
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
                    {category.items.map((item) => (
                      <ToolLogo key={item} name={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
