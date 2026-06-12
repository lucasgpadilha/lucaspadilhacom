import { motion } from 'framer-motion';
import type { Project } from '../data/projects';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const statusConfig: Record<string, { label: string; color: string; glow: string }> = {
  production: { label: 'Production', color: '#22c55e', glow: 'rgba(34,197,94,0.3)' },
  development: { label: 'Active Development', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
  live: { label: 'Live', color: '#06b6d4', glow: 'rgba(6,182,212,0.3)' },
};

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const status = statusConfig[project.status];

  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      whileHover={{ x: 6, borderColor: 'rgba(99, 102, 241, 0.3)' }}
      className="block glass-strong rounded-2xl p-6 md:p-8 border border-white/[0.06] group cursor-pointer transition-colors duration-300"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-accent-400 transition-colors">
              {project.title}
            </h3>
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono"
              style={{
                backgroundColor: `${status.color}10`,
                border: `1px solid ${status.color}30`,
                color: status.color,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: status.color, boxShadow: `0 0 6px ${status.glow}` }}
              />
              {status.label}
            </span>
          </div>
          <p className="text-zinc-300 text-sm md:text-base leading-relaxed max-w-2xl">
            {project.longDescription}
          </p>
        </div>
        <motion.span
          className="text-2xl text-zinc-600 group-hover:text-accent-400 transition-colors hidden md:block shrink-0 mt-1"
          whileHover={{ rotate: -45 }}
        >
          ↗
        </motion.span>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag.label}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono"
            style={{
              backgroundColor: `${tag.color}12`,
              color: tag.color,
              border: `1px solid ${tag.color}20`,
            }}
          >
            {tag.label}
          </span>
        ))}
      </div>

      {project.architecture && (
        <div className="mt-4 pt-4 border-t border-white/[0.04]">
          <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-wider mb-2">Architecture</p>
          <p className="text-xs text-zinc-500 font-mono">{project.architecture}</p>
        </div>
      )}
    </motion.a>
  );
}
