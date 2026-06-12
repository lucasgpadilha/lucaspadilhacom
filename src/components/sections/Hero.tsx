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
  headline: string;
  description: string;
  projects: string;
  github: string;
  indicators: Indicator[];
}> = {
  en: {
    eyebrow: 'DevOps • Cloud • Infrastructure Automation',
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

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-5 pb-20 pt-32 md:grid-cols-[0.9fr_1.1fr] md:px-8 md:pt-28 lg:gap-12">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.11, delayChildren: 0.12 }}
          className="relative mx-auto max-w-3xl text-center md:mx-0 md:text-left"
        >
          <div className="pointer-events-none absolute -inset-x-10 -inset-y-8 -z-10 hidden rounded-[48px] bg-black/18 blur-3xl md:block" />
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 font-mono text-xs uppercase tracking-[0.26em] text-cyan-100/78"
          >
            {text.eyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-semibold leading-[0.94] tracking-normal text-white sm:text-6xl md:whitespace-nowrap lg:text-6xl xl:text-7xl"
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#061018] transition hover:bg-cyan-50 sm:w-auto"
            >
              {text.projects}
              <ArrowRight size={16} />
            </a>
            <a
              href="https://github.com/lucasgpadilha"
              target="_blank"
              rel="noreferrer"
              className="liquid-glass inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white/88 transition hover:text-white sm:w-auto"
            >
              <GithubIcon size={16} className="relative z-10" />
              <span className="relative z-10">{text.github}</span>
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex flex-wrap items-center justify-center gap-2.5 md:justify-start"
          >
            {text.indicators.map(({ label, icon: Icon, iconClass }) => (
              <div
                key={label}
                className="liquid-glass inline-flex items-center gap-2 rounded-full px-3 py-1.5"
              >
                <Icon size={12} className={`relative z-10 shrink-0 ${iconClass}`} />
                <span className="relative z-10 whitespace-nowrap text-[11px] font-medium text-white/80">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <div className="mx-auto w-full min-w-0 max-w-3xl md:mx-0">
          <DeploymentScene />
        </div>
      </div>
    </section>
  );
}
