import { motion } from 'framer-motion';
import ParticleField from './ParticleField';
import GridBackground from './GridBackground';
import GlowOrbs from './GlowOrbs';
import PipelineCanvas from './PipelineCanvas';
import TerminalOverlay from './TerminalOverlay';
import AwsMiniMap from './AwsMiniMap';

const nameLetters = 'Lucas Padilha'.split('');

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Layer 0: Background */}
      <div className="absolute inset-0 bg-dark" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-dark/80 to-dark" />
      <GridBackground />
      <ParticleField />
      <GlowOrbs />

      {/* Layer 1 & 2: Pipeline + Side Panels */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col items-center">
        <div className="w-full mb-6 md:mb-8">
          <PipelineCanvas />
        </div>

        <div className="flex flex-col lg:flex-row items-start justify-center gap-6 w-full">
          <div className="hidden lg:block lg:w-64 shrink-0">
            <AwsMiniMap />
          </div>

          <div className="flex-1 flex justify-center">
            <TerminalOverlay />
          </div>
        </div>
      </div>

      {/* Layer 3: Content — positioned absolutely to overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
        <div className="text-center px-4 -mt-8 md:-mt-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.1 }}
            className="text-xs md:text-sm font-mono text-accent-400 tracking-[0.3em] mb-6 md:mb-8"
          >
            CLOUD &amp; DEVOPS ENGINEER
          </motion.p>

          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none mb-4">
            {nameLetters.map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.0 + i * 0.04, ease: 'easeOut' }}
                className="inline-block text-white"
                style={{
                  textShadow: '0 0 40px rgba(99,102,241,0.2)',
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
            className="text-base md:text-xl text-zinc-400 font-light mb-10"
          >
            <span className="text-terminal-cyan">Infrastructure as Code</span>
            {' • '}
            <span className="text-aws-orange">AWS</span>
            {' • '}
            <span className="text-indigo-400">Kubernetes</span>
            {' • '}
            <span className="text-terminal-green">Automation</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 2.8 }}
            className="pointer-events-auto"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block px-8 py-3.5 rounded-full font-medium text-sm bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] hover:border-accent-500/40 transition-colors duration-300 backdrop-blur-sm"
              style={{
                boxShadow: '0 0 30px rgba(99,102,241,0.1)',
              }}
            >
              Ver projetos
              <motion.span
                className="inline-block ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2 }}
        className="absolute bottom-8 z-20"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-5 h-8 border border-zinc-700 rounded-full flex justify-center pt-1.5"
        >
          <div className="w-1 h-2 bg-zinc-500 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
