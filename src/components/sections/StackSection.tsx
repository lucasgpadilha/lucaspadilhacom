import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Boxes,
  Cloud,
  Code2,
  Container,
  FileCode2,
  KeyRound,
  Network,
  Package,
  Server,
  Settings2,
  ShieldCheck,
  Workflow,
} from 'lucide-react';
import { levelLabels, stackCategories, type StackIcon, type ToolLevel } from '../../data/stack';
import { useLocale, type Locale } from '../../lib/i18n';

const icons: Record<StackIcon, ComponentType<{ size?: number; className?: string; strokeWidth?: number }>> = {
  cloud: Cloud,
  iac: Code2,
  config: Settings2,
  containers: Container,
  kubernetes: Boxes,
  cicd: Workflow,
  security: ShieldCheck,
  secrets: KeyRound,
  observability: Activity,
  systems: Server,
  networking: Network,
  registry: Package,
  scripting: FileCode2,
};

const levelText: Record<ToolLevel, string> = {
  core: 'text-white/90',
  'hands-on': 'text-white/60',
  lab: 'text-white/38',
};

const copy: Record<Locale, { eyebrow: string; title: string; description: string }> = {
  en: {
    eyebrow: 'Stack',
    title: 'Operational Stack',
    description: 'Tools I use to provision, configure, deploy and observe infrastructure.',
  },
  pt: {
    eyebrow: 'Stack',
    title: 'Operational Stack',
    description: 'Ferramentas que uso para provisionar, configurar, fazer deploy e observar infraestrutura.',
  },
};

export default function StackSection() {
  const { locale } = useLocale();
  const text = copy[locale];

  return (
    <section id="stack" className="blueprint relative px-5 py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
            {text.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-[var(--text-1)] sm:text-5xl">
            {text.title}
          </h2>
          <p className="mt-5 text-base leading-7 text-[var(--text-2)]">{text.description}</p>

          {/* Legend — the single amber accent marks Core; the rest read by weight. */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-white/45">
            <span className="inline-flex items-center gap-1.5 text-white/85">
              <span className="h-1 w-1 rounded-full bg-[var(--signal)]" />
              {levelLabels.core[locale]}
            </span>
            <span className="text-white/55">{levelLabels['hands-on'][locale]}</span>
            <span className="text-white/38">{levelLabels.lab[locale]}</span>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-3 md:grid-cols-2">
          {stackCategories.map((category, index) => {
            const Icon = icons[category.icon];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: (index % 2) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="surface-card p-5"
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} strokeWidth={1.8} className="shrink-0 text-white/45" />
                  <h3 className="text-sm font-semibold text-[var(--text-1)]">{category.title}</h3>
                </div>
                <p className="mt-2 text-[13px] leading-5 text-white/45">
                  {category.description[locale]}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {category.tools.map((tool) => (
                    <span
                      key={tool.name}
                      className={`inline-flex items-center gap-1.5 rounded border border-[var(--hairline)] bg-white/[0.02] px-2 py-0.5 font-mono text-[11px] ${levelText[tool.level]}`}
                    >
                      {tool.level === 'core' && (
                        <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--signal)]" />
                      )}
                      {tool.name}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
