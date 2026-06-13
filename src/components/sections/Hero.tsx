import type { ComponentType } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket } from 'lucide-react';
import Navbar from '../layout/Navbar';
import DeploymentScene from '../devops/DeploymentScene';
import { AnsibleIcon, GithubIcon, TerraformIcon } from '../devops/brand-icons';
import { useLocale, type Locale } from '../../lib/i18n';

export const HERO_VIDEO_URL = 'https://pub-cee283bbed284d29826195df8d5a2571.r2.dev/202606121059.mp4';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

type Indicator = {
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  iconClass: string;
};

const copy: Record<Locale, {
  eyebrow: string;
  available: string;
  headline: string;
  description: string;
  projects: string;
  github: string;
  indicators: Indicator[];
}> = {
  en: {
    eyebrow: 'DevOps • Cloud • Infrastructure Automation',
    available: 'Available for opportunities',
    headline: 'Infrastructure that moves from commit to production.',
    description:
      'I build labs and automations with Terraform, Ansible, Docker and CI/CD pipelines, turning provisioning, configuration and deploy into reproducible flows.',
    projects: 'View projects',
    github: 'View GitHub',
    indicators: [
      { label: 'IaC with Terraform', icon: TerraformIcon, iconClass: 'text-violet-300' },
      { label: 'Configuration with Ansible', icon: AnsibleIcon, iconClass: 'text-white/90' },
      { label: 'Automated deploy', icon: Rocket, iconClass: 'text-cyan-100' },
    ],
  },
  pt: {
    eyebrow: 'DevOps • Cloud • Infrastructure Automation',
    available: 'Disponível para oportunidades',
    headline: 'Infraestrutura que sai do commit e chega em produção.',
    description:
      'Construo laboratórios e automações com Terraform, Ansible, Docker e pipelines CI/CD, transformando provisionamento, configuração e deploy em fluxos reproduzíveis.',
    projects: 'Ver projetos',
    github: 'Ver GitHub',
    indicators: [
      { label: 'IaC com Terraform', icon: TerraformIcon, iconClass: 'text-violet-300' },
      { label: 'Configuração com Ansible', icon: AnsibleIcon, iconClass: 'text-white/90' },
      { label: 'Deploy automatizado', icon: Rocket, iconClass: 'text-cyan-100' },
    ],
  },
};

export default function Hero() {
  const { locale } = useLocale();
  const text = copy[locale];

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#05080d]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#051018_0%,#071a24_38%,#05080d_100%)]" />

      <video
        className="hero-video-filter absolute inset-0 h-full w-full object-cover"
        src={HERO_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.62)_0%,rgba(0,0,0,0.34)_34%,rgba(0,0,0,0.10)_68%,rgba(0,0,0,0.22)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(5,8,13,0.88)_0%,rgba(5,8,13,0.32)_30%,rgba(5,8,13,0.04)_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_51%,rgba(0,0,0,0.30),transparent_34%),radial-gradient(circle_at_center,transparent_52%,rgba(0,0,0,0.50)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent via-[#05080d]/78 to-[#05080d]" />

      <Navbar />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[88rem] items-center gap-10 px-5 pb-20 pt-32 md:grid-cols-[0.78fr_1.22fr] md:px-8 md:pt-32 lg:gap-14">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.11, delayChildren: 0.12 }}
          className="relative mx-auto max-w-3xl text-center md:mx-0 md:text-left"
        >
          <div className="pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 hidden rounded-[48px] bg-black/18 blur-3xl md:block" />
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] px-3 py-1 backdrop-blur-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--signal)] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--signal)]" />
            </span>
            <span className="font-mono text-[11px] tracking-tight text-white/70">{text.available}</span>
          </motion.div>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-white/40"
          >
            {text.eyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-semibold leading-[0.92] tracking-[-0.03em] text-white sm:text-6xl md:whitespace-nowrap lg:text-6xl xl:text-7xl"
          >
            Lucas Padilha
          </motion.h1>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-2xl text-2xl font-medium leading-tight text-white/92 sm:text-3xl"
          >
            {text.headline}
          </motion.p>

          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 max-w-2xl text-base leading-7 text-white/74 sm:text-lg"
          >
            {text.description}
          </motion.p>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start"
          >
            <a
              href="#projects"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--signal)] px-5 py-3 text-sm font-semibold text-[#1a1204] transition hover:brightness-105 sm:w-auto"
            >
              {text.projects}
              <ArrowRight size={16} />
            </a>
            <a
              href="https://github.com/lucasgpadilha"
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/15 bg-white/[0.03] px-5 py-3 text-sm font-medium text-white/85 backdrop-blur-sm transition hover:border-white/25 hover:text-white sm:w-auto"
            >
              <GithubIcon size={16} />
              <span>{text.github}</span>
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2.5 md:justify-start"
          >
            {text.indicators.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-md border border-white/12 bg-white/[0.03] px-3 py-1.5 backdrop-blur-sm"
              >
                <Icon size={12} className="shrink-0 text-white/55" />
                <span className="whitespace-nowrap font-mono text-[11px] text-white/65">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="mx-auto w-full min-w-0 max-w-none md:mx-0">
          <DeploymentScene />
        </div>
      </div>
    </section>
  );
}
