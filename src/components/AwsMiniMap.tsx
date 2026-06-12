import { motion } from 'framer-motion';
import { awsServices, awsConnections } from '../data/aws-services';
import type { AwsService } from '../data/aws-services';

function servicePos(svc: AwsService, width: number, height: number) {
  return {
    x: (svc.x / 100) * width,
    y: (svc.y / 100) * height,
  };
}

export default function AwsMiniMap() {
  const width = 260;
  const height = 180;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 2.4 }}
      className="glass rounded-xl p-4 border border-white/[0.06] hidden lg:block"
    >
      <div className="flex items-center gap-2 mb-3">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#FF9900">
          <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
        </svg>
        <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">Infra AWS</span>
      </div>

      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {awsConnections.map((conn, i) => {
          const fromSvc = awsServices.find((s) => s.id === conn.from);
          const toSvc = awsServices.find((s) => s.id === conn.to);
          if (!fromSvc || !toSvc) return null;
          const from = servicePos(fromSvc, width, height);
          const to = servicePos(toSvc, width, height);
          return (
            <motion.line
              key={`conn-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(99,102,241,0.15)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 2.6 + i * 0.1 }}
            />
          );
        })}

        {awsServices.map((svc) => {
          const pos = servicePos(svc, width, height);
          return (
            <motion.g
              key={svc.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 2.5 }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r="10"
                fill={`${svc.color}15`}
                stroke={svc.color}
                strokeWidth="1"
                strokeOpacity="0.4"
              />
              <rect
                x={pos.x - 3}
                y={pos.y - 3}
                width="6"
                height="6"
                rx="1"
                fill={svc.color}
                opacity="0.6"
              />
              <text
                x={pos.x}
                y={pos.y + 18}
                textAnchor="middle"
                fill="#71717a"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
              >
                {svc.label}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </motion.div>
  );
}
