import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Activity, Cloud, Container, LifeBuoy, Workflow } from 'lucide-react';
import { useLocale, type Locale } from '../../lib/i18n';

const stepIcons: ComponentType<{ size?: number; className?: string }>[] = [
  LifeBuoy,
  Container,
  Activity,
  Cloud,
  Workflow,
];

const copy: Record<Locale, { eyebrow: string; title: string; description: string; items: string[] }> = {
  en: {
    eyebrow: 'Path',
    title: 'From infrastructure to deploy',
    description:
      'My path comes from real support, Docker, automation and observability environments. Today I focus my projects on Cloud, IaC and pipelines to create environments that are more predictable, documented and easier to operate.',
    items: [
      'Infrastructure / technical support',
      'Docker and application environments',
      'Observability and dashboards',
      'AWS, Terraform and Ansible',
      'CI/CD and deploy automation',
    ],
  },
  pt: {
    eyebrow: 'Trajetória',
    title: 'Da infraestrutura ao deploy',
    description:
      'Minha trajetória vem de ambientes reais de suporte, Docker, automação e observabilidade. Hoje concentro meus projetos em Cloud, IaC e pipelines para criar ambientes mais previsíveis, documentados e fáceis de operar.',
    items: [
      'Infra / suporte técnico',
      'Docker e ambientes de aplicação',
      'Observabilidade e dashboards',
      'AWS, Terraform e Ansible',
      'CI/CD e automação de deploy',
    ],
  },
};

export default function Timeline() {
  const { locale } = useLocale();
  const text = copy[locale];

  return (
    <section className="blueprint relative px-5 py-24 sm:py-32">
      <div className="relative z-10 mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
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
          <p className="mt-5 text-base leading-7 text-[var(--text-2)] sm:text-lg">
            {text.description}
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute bottom-4 left-[5px] top-4 w-px bg-white/10" aria-hidden="true" />
          <div className="space-y-3">
            {text.items.map((item, index) => {
              const Icon = stepIcons[index % stepIcons.length];
              const last = index === text.items.length - 1;

              return (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex gap-5"
                >
                  <span
                    className={`relative z-10 mt-[18px] h-[11px] w-[11px] shrink-0 rounded-[2px] border ${
                      last ? 'border-[var(--signal)] bg-[var(--signal)]' : 'border-white/25 bg-[var(--bg)]'
                    }`}
                    aria-hidden="true"
                  />
                  <div className="surface-card flex flex-1 items-center gap-3 px-4 py-3.5">
                    <span className="font-mono text-[10px] text-white/35">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <Icon size={15} className="shrink-0 text-white/40" />
                    <span className="text-sm text-[var(--text-1)]">{item}</span>
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
