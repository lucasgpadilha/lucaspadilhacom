import { motion } from 'framer-motion';
import { statusColors } from '../data/pipeline';

interface HealthIndicatorProps {
  status: 'success' | 'running' | 'pending';
  label: string;
}

export default function HealthIndicator({ status, label }: HealthIndicatorProps) {
  const colors = statusColors[status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-2"
    >
      <div className="relative">
        <div
          className="w-2 h-2 rounded-full animate-pulse-status"
          style={{ color: colors.fill }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundColor: colors.fill,
            opacity: 0.3,
            filter: 'blur(4px)',
          }}
        />
      </div>
      <span className="text-xs text-zinc-400 font-mono">{label}</span>
    </motion.div>
  );
}
