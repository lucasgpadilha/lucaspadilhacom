import { motion } from 'framer-motion';

const skills = [
  'TypeScript', 'React', 'Node.js', 'Python',
  'AWS', 'Docker', 'Terraform', 'PostgreSQL',
];

export default function About() {
  return (
    <section id="about" className="py-32 px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-sm font-mono text-accent mb-4 tracking-wider uppercase">Sobre</h2>
        <p className="text-3xl md:text-4xl font-light text-gray-200 leading-relaxed mb-12">
          Desenvolvedor apaixonado por criar experiências digitais que combinam{' '}
          <span className="text-white font-medium">design</span>,{' '}
          <span className="text-white font-medium">performance</span> e{' '}
          <span className="text-white font-medium">código limpo</span>.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap gap-3"
      >
        {skills.map((skill, i) => (
          <motion.span
            key={skill}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(99, 102, 241, 0.15)' }}
            className="px-4 py-2 border border-gray-700 rounded-full text-sm text-gray-300 cursor-default transition-colors"
          >
            {skill}
          </motion.span>
        ))}
      </motion.div>
    </section>
  );
}
