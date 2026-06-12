import { motion } from 'framer-motion';
import { BriefcaseBusiness, GitBranch, Mail } from 'lucide-react';
import { useLocale, type Locale } from '../../lib/i18n';

const links = [
  { label: 'GitHub', href: 'https://github.com/lucasgpadilha', icon: GitBranch },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lucasgpadilha/', icon: BriefcaseBusiness },
  { label: 'Email', href: 'mailto:lucasgpadilhatec@gmail.com', icon: Mail },
];

const copy: Record<Locale, { eyebrow: string; title: string; description: string; footer: string }> = {
  en: {
    eyebrow: 'Contact',
    title: 'Let’s automate the next deploy?',
    description:
      'I am building practical Cloud, IaC and DevOps projects with a focus on reproducible infrastructure and real operations.',
    footer: '© 2026 Lucas Padilha. Static build with Astro, React and Tailwind.',
  },
  pt: {
    eyebrow: 'Contato',
    title: 'Vamos automatizar o próximo deploy?',
    description:
      'Estou construindo projetos práticos em Cloud, IaC e DevOps, com foco em infraestrutura reproduzível e operação real.',
    footer: '© 2026 Lucas Padilha. Build estático com Astro, React e Tailwind.',
  },
};

export default function FinalCTA() {
  const { locale } = useLocale();
  const text = copy[locale];

  return (
    <section id="contact" className="relative px-5 py-24 sm:py-32">
      <div className="absolute inset-x-0 bottom-0 h-64 bg-[radial-gradient(circle_at_50%_100%,rgba(103,232,249,0.10),transparent_55%)]" />
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="liquid-glass mx-auto max-w-4xl rounded-3xl p-6 text-center sm:p-10"
      >
        <div className="relative z-10">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-100/60">
            {text.eyebrow}
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-normal text-white sm:text-5xl">
            {text.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/62 sm:text-lg">
            {text.description}
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {links.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={label === 'Email' ? undefined : '_blank'}
                rel={label === 'Email' ? undefined : 'noreferrer'}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/78 transition hover:border-cyan-100/28 hover:text-white"
              >
                <Icon size={16} />
                {label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
      <p className="relative z-10 mt-10 text-center text-xs text-white/30">
        {text.footer}
      </p>
    </section>
  );
}
