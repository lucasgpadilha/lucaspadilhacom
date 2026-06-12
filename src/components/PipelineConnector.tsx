import { motion } from 'framer-motion';

interface PipelineConnectorProps {
  color: string;
  animateDelay: number;
  isMobile: boolean;
  reverse?: boolean;
}

export default function PipelineConnector({ color, animateDelay, isMobile, reverse }: PipelineConnectorProps) {
  if (isMobile) {
    return (
      <div className="flex justify-center py-1">
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 20, opacity: 1 }}
          transition={{ duration: 0.4, delay: animateDelay, ease: 'easeOut' }}
          className="w-px"
          style={{
            background: `linear-gradient(to bottom, transparent, ${color}40, ${color}20, transparent)`,
          }}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 36, opacity: 1 }}
      transition={{ duration: 0.4, delay: animateDelay, ease: 'easeOut' }}
      className="flex items-center self-center relative"
      style={{ height: 2 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, transparent, ${color}60, ${color}20, transparent)`,
          filter: `blur(2px)`,
        }}
      />
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 36 }}
        transition={{ duration: 0.6, delay: animateDelay + 0.3, ease: 'easeOut' }}
        className="h-px absolute left-0"
        style={{
          background: `linear-gradient(to right, ${color}80, ${color}40)`,
          boxShadow: `0 0 8px ${color}40`,
        }}
      />
      {reverse && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 36 }}
          transition={{ duration: 0.6, delay: animateDelay + 0.3, ease: 'easeOut' }}
          className="h-px absolute right-0"
          style={{
            background: `linear-gradient(to left, ${color}80, ${color}40)`,
            boxShadow: `0 0 8px ${color}40`,
          }}
        />
      )}
    </motion.div>
  );
}
