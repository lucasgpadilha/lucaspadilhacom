import { motion } from 'framer-motion';

const orbs = [
  { color: 'rgba(99, 102, 241, 0.15)', size: 600, x: [-100, 80], y: [-60, 40], duration: 20, delay: 0 },
  { color: 'rgba(6, 182, 212, 0.1)', size: 500, x: [60, -40], y: [30, -50], duration: 25, delay: 3 },
  { color: 'rgba(245, 158, 11, 0.08)', size: 400, x: [-50, 100], y: [20, -30], duration: 22, delay: 6 },
  { color: 'rgba(99, 102, 241, 0.1)', size: 350, x: [30, -60], y: [-40, 60], duration: 18, delay: 1 },
];

export default function GlowOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block" aria-hidden="true">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
            left: '50%',
            top: '50%',
            marginLeft: -orb.size / 2,
            marginTop: -orb.size / 2,
          }}
          animate={{
            x: orb.x.map((v) => `${v}%`),
            y: orb.y.map((v) => `${v}%`),
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
    </div>
  );
}
