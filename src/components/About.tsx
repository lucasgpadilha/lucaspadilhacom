import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';

const principles = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-terminal-cyan">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: 'Automação',
    description:
      'Automatize o que é repetitivo. Pipelines locais com Makefile, scripts de auditoria e workflows que eliminam tarefas manuais.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent-500">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'Infraestrutura como Código',
    description:
      'Terraform para provisionamento versionado e revisável. Infraestrutura tratada com o mesmo rigor do código de aplicação.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-terminal-amber">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Segurança por padrão',
    description:
      'Sem credenciais reais em dev. Guardrails que previnem deploys acidentais. Safe defaults em todos os ambientes.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-terminal-green">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    title: 'Observabilidade',
    description:
      'Logs, métricas, health checks e auditoria. Infraestrutura que mostra seu estado sem depender de um ping manual.',
  },
];

const stackCategories = [
  {
    label: 'Cloud & IaC',
    items: [
      { name: 'AWS', color: '#FF9900' },
      { name: 'Terraform', color: '#818cf8' },
      { name: 'Floci', color: '#8b5cf6' },
    ],
  },
  {
    label: 'Containers & Linux',
    items: [
      { name: 'Docker', color: '#527FFF' },
      { name: 'Kubernetes', color: '#326CE5' },
      { name: 'Linux', color: '#f59e0b' },
    ],
  },
  {
    label: 'Automação & Testes',
    items: [
      { name: 'Python', color: '#06b6d4' },
      { name: 'Ansible', color: '#ef4444' },
      { name: 'pytest', color: '#22c55e' },
    ],
  },
  {
    label: 'CI/CD & Observabilidade',
    items: [
      { name: 'GitHub Actions', color: '#8b5cf6' },
      { name: 'Makefile', color: '#a855f7' },
      { name: 'CloudWatch', color: '#ef4444' },
    ],
  },
];

export default function About() {
  return (
    <section id="about" className="py-32 px-6 max-w-5xl mx-auto">
      <SectionHeader
        label="Engenharia"
        title="Buildo infraestrutura confiável"
        subtitle="Meu foco não é apenas fazer rodar — é entender como infraestrutura real é projetada, testada, documentada e operada."
      />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-zinc-300 text-lg leading-relaxed max-w-3xl mt-8 mb-20"
      >
        Cloud & DevOps Engineer focado em cloud engineering, automação, ambientes Linux, containers, Kubernetes
        e Infrastructure as Code. Construo projetos que simulam pensamento de produção: provisionamento de
        infraestrutura, pipelines CI/CD, observabilidade, guardrails de segurança e documentação de operações.
        <span className="block mt-4 text-zinc-500 text-base">
          Graduando em Análise e Desenvolvimento de Sistemas na UTFPR.
        </span>
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-24">
        {principles.map((principle, i) => (
          <motion.div
            key={principle.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            className="glass p-6 rounded-2xl border border-white/[0.05] hover:border-white/[0.1] transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center mb-4">
              {principle.icon}
            </div>
            <h3 className="text-sm font-semibold text-white mb-2">{principle.title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{principle.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="text-xs font-mono text-zinc-600 tracking-[0.2em] mb-8 uppercase">
          Stack
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stackCategories.map((cat) => (
            <div key={cat.label}>
              <p className="text-[10px] text-zinc-500 font-mono mb-3 uppercase tracking-wider">{cat.label}</p>
              <div className="flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <motion.span
                    key={item.name}
                    whileHover={{ scale: 1.05, borderColor: `${item.color}40`, backgroundColor: `${item.color}10` }}
                    className="px-3 py-1.5 border border-white/[0.06] rounded-lg text-xs text-zinc-300 cursor-default transition-colors"
                  >
                    {item.name}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
