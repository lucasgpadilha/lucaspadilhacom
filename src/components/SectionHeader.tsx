import { motion } from 'framer-motion';

interface SectionHeaderProps {
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ label, title, subtitle }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8 }}
    >
      <p className="text-xs font-mono text-accent-400 tracking-[0.3em] mb-4 uppercase">{label}</p>
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">{title}</h2>
      {subtitle && (
        <p className="text-zinc-400 text-lg font-light max-w-2xl">{subtitle}</p>
      )}
    </motion.div>
  );
}
