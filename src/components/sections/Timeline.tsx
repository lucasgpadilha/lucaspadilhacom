import { motion } from 'framer-motion';
import { useLocale, type Locale } from '../../lib/i18n';

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
    <section className="relative px-5 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
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
          <p className="mt-5 text-base leading-7 text-white/60 sm:text-lg">
            {text.description}
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute bottom-5 left-[17px] top-5 w-px bg-gradient-to-b from-cyan-100/40 via-white/12 to-transparent" />
          <div className="space-y-4">
            {text.items.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex gap-4"
              >
                <div className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-cyan-100/18 bg-[#07131b] text-xs font-semibold text-cyan-50">
                  {index + 1}
                </div>
                <div className="liquid-glass flex min-h-14 flex-1 items-center rounded-2xl px-4 py-3 text-sm text-white/72">
                  <span className="relative z-10">{item}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
