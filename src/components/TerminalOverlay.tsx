import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { terminalLines, type TerminalLine } from '../data/terminal';

export default function TerminalOverlay() {
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
  const [typingLine, setTypingLine] = useState<string>('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((v) => !v);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const run = () => {
      if (typingIndex >= terminalLines.length) {
        timerRef.current = setTimeout(() => {
          setVisibleLines([]);
          setTypingIndex(0);
          setCharIndex(0);
          setTypingLine('');
        }, 4000);
        return;
      }

      const current = terminalLines[typingIndex];

      if (charIndex === 0) {
        timerRef.current = setTimeout(() => {
          setCharIndex(1);
        }, current.delay);
        return;
      }

      if (charIndex <= current.text.length) {
        setTypingLine(current.text.slice(0, charIndex));
        const speed = Math.random() * 40 + 20;
        timerRef.current = setTimeout(() => {
          setCharIndex((c) => c + 1);
        }, speed);
        return;
      }

      setVisibleLines((prev) => [...prev, current]);
      setTypingLine('');
      setTypingIndex((i) => i + 1);
      setCharIndex(0);
    };

    timerRef.current = setTimeout(run, 100);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [typingIndex, charIndex]);

  const maxVisible = 8;
  const displayLines = visibleLines.slice(-maxVisible);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.6 }}
      className="glass rounded-xl overflow-hidden w-full max-w-md border border-white/[0.06]"
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.04] bg-white/[0.02]">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        <span className="ml-3 text-[10px] text-zinc-500 font-mono">pipeline-deploy — bash</span>
      </div>

      <div className="p-4 font-mono text-[11px] leading-relaxed overflow-hidden" style={{ minHeight: 160 }}>
        {displayLines.map((line, i) => (
          <div key={`${typingIndex}-${i}`} className="flex">
            {line.prefix && (
              <span className="text-zinc-600 select-none shrink-0">{line.prefix}</span>
            )}
            <span
              className="inline"
              style={{
                color: line.color || '#a1a1aa',
                textShadow: line.color === '#22c55e' ? '0 0 8px rgba(34,197,94,0.3)' : undefined,
              }}
            >
              {line.text || '\u00A0'}
            </span>
          </div>
        ))}

        {typingLine && (
          <div className="flex">
            {terminalLines[typingIndex]?.prefix && (
              <span className="text-zinc-600 select-none shrink-0">
                {terminalLines[typingIndex].prefix}
              </span>
            )}
            <span
              style={{ color: terminalLines[typingIndex]?.color || '#a1a1aa' }}
            >
              {typingLine}
              <span
                className={`inline-block w-1.5 h-3.5 ml-0.5 bg-zinc-400 ${showCursor ? 'opacity-100' : 'opacity-0'}`}
              />
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
