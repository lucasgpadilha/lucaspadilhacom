import { motion } from 'framer-motion';

const projects = [
  {
    title: 'AWS Infrastructure',
    description: 'IaC com Terraform + Ansible para deploy automatizado na AWS.',
    tags: ['Terraform', 'AWS', 'Ansible', 'GitHub Actions'],
    link: 'https://github.com/lucasgpadilha/aws-terraform',
  },
  {
    title: 'Portfolio',
    description: 'Este site — Astro, React, Framer Motion, Tailwind e GSAP.',
    tags: ['Astro', 'React', 'Framer Motion', 'GSAP'],
    link: 'https://github.com/lucasgpadilha/lucaspadilhacom',
  },
  {
    title: 'Em breve',
    description: 'Próximo projeto incrível em desenvolvimento.',
    tags: ['???'],
    link: '#',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 px-6 max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-sm font-mono text-accent mb-16 tracking-wider uppercase"
      >
        Projetos
      </motion.h2>

      <div className="space-y-6">
        {projects.map((project, i) => (
          <motion.a
            key={project.title}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
            whileHover={{ x: 12 }}
            className="block group p-8 rounded-2xl border border-gray-800 hover:border-accent/30 hover:bg-accent/5 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-white group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 mt-2">{project.description}</p>
              </div>
              <motion.span
                className="text-2xl text-gray-600 group-hover:text-accent transition-colors"
                whileHover={{ rotate: -45 }}
              >
                ↗
              </motion.span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {project.tags.map((tag) => (
                <span key={tag} className="text-xs font-mono text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
