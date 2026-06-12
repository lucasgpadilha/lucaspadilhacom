import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { pipelineStages } from '../data/pipeline';
import PipelineNode from './PipelineNode';
import PipelineConnector from './PipelineConnector';

export default function PipelineCanvas() {
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    setIsMounted(true);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full max-w-5xl mx-auto py-4">
        <div className="flex items-center justify-center">
          <div className="text-zinc-600 text-sm font-mono">initializing pipeline...</div>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="w-full px-4 flex flex-col items-center gap-0">
        {pipelineStages.map((stage, i) => (
          <div key={stage.id} className="flex flex-col items-center w-full max-w-xs">
            <PipelineNode stage={stage} index={i} isMobile={true} animateDelay={0.4 + i * 0.1} />
            {i < pipelineStages.length - 1 && (
              <PipelineConnector
                color={pipelineStages[i + 1].color}
                animateDelay={0.7 + i * 0.1}
                isMobile={true}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="flex flex-wrap items-start justify-center gap-x-0 gap-y-4">
        {pipelineStages.slice(0, 4).map((stage, i) => (
          <div key={stage.id} className="flex items-center">
            <PipelineNode stage={stage} index={i} isMobile={false} animateDelay={0.4 + i * 0.12} />
            {i < 3 && (
              <PipelineConnector
                color={pipelineStages[i + 1].color}
                animateDelay={0.8 + i * 0.12}
                isMobile={false}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center my-1">
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.5, delay: 1.2, ease: 'easeOut' }}
          className="w-32 h-px"
          style={{
            background: 'linear-gradient(to right, transparent, rgba(255,153,0,0.3), rgba(99,102,241,0.1), transparent)',
          }}
        />
      </div>

      <div className="flex flex-wrap items-start justify-center gap-x-0 gap-y-4">
        {pipelineStages.slice(4).map((stage, i) => (
          <div key={stage.id} className="flex items-center">
            <PipelineNode stage={stage} index={i + 4} isMobile={false} animateDelay={0.9 + i * 0.12} />
            {i < 3 && (
              <PipelineConnector
                color={pipelineStages[i + 5].color}
                animateDelay={1.3 + i * 0.12}
                isMobile={false}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
