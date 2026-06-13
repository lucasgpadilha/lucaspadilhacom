import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { projectsByLocale } from '../../data/projects';
import { ToolChip } from '../../lib/tool-meta';
import { useLocale, type Locale } from '../../lib/i18n';

// Only the live project earns the single amber signal; the rest stay neutral.
const isLive = (index: number, total: number) => index === total - 1;

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
    <section id="projects" className="blueprint relative px-5 py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={reveal}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
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

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {projects.map((project, index) => {
            const live = isLive(index, projects.length);

            return (
              <motion.article
                key={project.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={reveal}
                transition={{ duration: 0.6, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="surface-card group p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                    <span
                      className={`h-1.5 w-1.5 ${live ? 'bg-[var(--signal)]' : 'bg-white/30'}`}
                    />
                    {project.status}
                  </span>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${text.repo} — ${project.title}`}
                    className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-md text-white/45 transition-colors hover:bg-white/[0.05] hover:text-white"
                  >
                    <ArrowUpRight size={17} />
                  </a>
                </div>

                <h3 className="mt-5 text-xl font-semibold text-[var(--text-1)]">{project.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--text-2)]">{project.description}</p>

                <div className="mt-6">
                  <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
                    {text.demonstrates}
                  </p>
                  <ul className="space-y-2">
                    {project.demonstrates.map((item) => (
                      <li key={item} className="flex gap-2.5 text-sm text-[var(--text-2)]">
                        <span className="mt-2 h-px w-3 shrink-0 bg-white/25" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex flex-wrap gap-1.5">
                  {project.stack.map((item) => (
                    <ToolChip key={item} name={item} />
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
