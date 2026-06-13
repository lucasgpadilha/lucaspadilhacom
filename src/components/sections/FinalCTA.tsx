import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../devops/brand-icons';
import { useLocale, type Locale } from '../../lib/i18n';

type CtaLink = {
  label: string;
  href: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  primary?: boolean;
};

const links: CtaLink[] = [
  { label: 'Email', href: 'mailto:lucasgpadilhatec@gmail.com', icon: Mail, primary: true },
  { label: 'GitHub', href: 'https://github.com/lucasgpadilha', icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lucasgpadilha/', icon: LinkedinIcon },
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
    <section id="contact" className="blueprint relative px-5 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="surface-card relative z-10 mx-auto max-w-4xl p-8 text-center sm:p-12"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40">
          {text.eyebrow}
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold text-[var(--text-1)] sm:text-5xl">
          {text.title}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[var(--text-2)] sm:text-lg">
          {text.description}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {links.map(({ label, href, icon: Icon, primary }) => (
            <a
              key={label}
              href={href}
              target={label === 'Email' ? undefined : '_blank'}
              rel={label === 'Email' ? undefined : 'noreferrer'}
              className={
                primary
                  ? 'inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--signal)] px-6 py-3 text-sm font-semibold text-[#1a1204] transition hover:brightness-105 sm:w-auto'
                  : 'inline-flex w-full items-center justify-center gap-2 rounded-md border border-[var(--hairline-strong)] px-6 py-3 text-sm font-medium text-[var(--text-2)] transition hover:border-[var(--hairline-hover)] hover:text-white sm:w-auto'
              }
            >
              <Icon size={16} />
              {label}
            </a>
          ))}
        </div>
      </motion.div>
      <p className="relative z-10 mt-10 text-center font-mono text-[11px] text-white/30">
        {text.footer}
      </p>
    </section>
  );
}
