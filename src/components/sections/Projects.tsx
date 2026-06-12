import { motion } from 'framer-motion';
import { CheckCircle2, ExternalLink, GitBranch } from 'lucide-react';
import { projectsByLocale } from '../../data/projects';
import { useLocale, type Locale } from '../../lib/i18n';

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const copy: Record<Locale, { eyebrow: string; title: string; description: string; demonstrates: string; repo: string }> = {
  en: {
    eyebrow: 'Projects',
    title: 'Infrastructure in practice',
    description:
      'Projects that show provisioning, configuration, tests and deploy as parts of the same operational flow.',
    demonstrates: 'Demonstrates',
    repo: 'View repository',
  },
  pt: {
    eyebrow: 'Projetos',
    title: 'Infraestrutura em prática',
    description:
      'Projetos que mostram provisionamento, configuração, testes e deploy como partes do mesmo fluxo operacional.',
    demonstrates: 'Demonstra',
    repo: 'Ver repositório',
  },
};

export default function Projects() {
  const { locale } = useLocale();
  const text = copy[locale];
  const projects = projectsByLocale[locale];

  return (
    <section id="projects" className="relative px-5 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={reveal}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-cyan-100/60">
            {text.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal text-white sm:text-5xl">
            {text.title}
          </h2>
          <p className="mt-5 text-base leading-7 text-white/58 sm:text-lg">
            {text.description}
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {projects.map((project, index) => (
            <motion.article
              key={project.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={reveal}
              transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="liquid-glass rounded-3xl p-5 sm:p-6"
            >
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full border border-emerald-200/15 bg-emerald-200/[0.06] px-3 py-1 font-mono text-[11px] text-emerald-100/78">
                    {project.status}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-white">{project.title}</h3>
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Abrir ${project.title} no GitHub`}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:border-cyan-100/30 hover:text-white"
                >
                  <GitBranch size={17} />
                </a>
              </div>

              <p className="relative z-10 mt-4 text-sm leading-6 text-white/62">{project.description}</p>

              <div className="relative z-10 mt-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                  {text.demonstrates}
                </p>
                <ul className="space-y-2">
                  {project.demonstrates.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-white/65">
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-cyan-100/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative z-10 mt-6 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-white/56"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="relative z-10 mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-100/78 transition hover:text-cyan-50"
              >
                {text.repo}
                <ExternalLink size={14} />
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
