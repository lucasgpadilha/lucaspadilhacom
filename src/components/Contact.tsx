import { motion } from 'framer-motion';

const links = [
  { label: 'GitHub', href: 'https://github.com/lucasgpadilha' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/lucasgpadilha' },
  { label: 'Email', href: 'mailto:contato@lucaspadilha.com' },
];

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 max-w-5xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-sm font-mono text-accent mb-6 tracking-wider uppercase">Contato</h2>
        <p className="text-4xl md:text-5xl font-bold mb-12">
          Vamos trabalhar juntos?
        </p>

        <div className="flex justify-center gap-8 flex-wrap">
          {links.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.1 }}
              whileHover={{ y: -4 }}
              className="px-6 py-3 border border-gray-700 rounded-full text-gray-300 hover:text-accent hover:border-accent/50 transition-all duration-300"
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="mt-24 text-gray-600 text-sm font-mono"
      >
        © 2026 Lucas Padilha
      </motion.p>
    </section>
  );
}
