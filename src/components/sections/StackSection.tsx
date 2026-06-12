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
    <section id="stack" className="relative px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-100/60">
              {text.eyebrow}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-normal text-white sm:text-5xl">
              {text.title}
            </h2>
            <p className="mt-5 text-base leading-7 text-white/58">
              {text.description}
            </p>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-2">
            {stackCategories.map((category, index) => {
              const Icon = icons[category.icon];

              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="liquid-glass rounded-2xl p-4"
                >
                  <div className="relative z-10 flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-cyan-100/14 bg-cyan-100/[0.055] text-cyan-50/80">
                      <Icon size={18} strokeWidth={1.7} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white/86">{category.title}</h3>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {category.items.map((item) => (
                          <span key={item} className="rounded-full bg-white/[0.04] px-3 py-1 text-xs text-white/56">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
