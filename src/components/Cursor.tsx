import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

export default function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 400, damping: 25 });
  const springY = useSpring(cursorY, { stiffness: 400, damping: 25 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[100] hidden md:block"
        style={{
          translateX: springX,
          translateY: springY,
          border: '1px solid rgba(99, 102, 241, 0.3)',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.2), 0 0 60px rgba(99, 102, 241, 0.05)',
          mixBlendMode: 'difference' as const,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent-400 pointer-events-none z-[101] hidden md:block"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          boxShadow: '0 0 8px rgba(129, 140, 248, 0.6)',
        }}
      />
    </>
  );
}
