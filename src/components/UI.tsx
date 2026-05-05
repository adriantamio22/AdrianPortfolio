import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'motion/react';

export const ThreeDGrid = () => (
  <div className="absolute inset-0 z-[-1] pointer-events-none opacity-20">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
  </div>
);

export const CyberBackground = () => (
  <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-cyber-black">
    <ThreeDGrid />
    
    {/* Subtle Radial Gradient Glow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.05)_0%,transparent_50%)]" />
    
    {/* Circuit Board Patterns (Very Subtle) */}
    <div className="absolute inset-0 opacity-[0.03]">
      <svg width="100%" height="100%" className="absolute inset-0">
        <pattern id="circuit-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
          <path d="M 0 100 L 50 100 L 70 80 L 130 80 L 150 100 L 200 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
          <path d="M 100 0 L 100 50 L 80 70 L 80 130 L 100 150 L 100 200" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-accent" />
          <circle cx="70" cy="80" r="1.5" fill="currentColor" className="text-accent" />
          <circle cx="130" cy="80" r="1.5" fill="currentColor" className="text-accent" />
          <circle cx="80" cy="70" r="1.5" fill="currentColor" className="text-accent" />
          <circle cx="80" cy="130" r="1.5" fill="currentColor" className="text-accent" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
      </svg>
    </div>

    {/* Moving Data Streams (Horizontal) */}
    <div className="absolute inset-0 overflow-hidden opacity-[0.02]">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={`stream-${i}`}
          initial={{ x: '-100%', opacity: 0 }}
          animate={{ 
            x: ['-100%', '200%'],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: 15 + Math.random() * 20, 
            repeat: Infinity, 
            delay: i * 3,
            ease: "linear" 
          }}
          style={{ top: `${i * 8 + 5}%` }}
          className="absolute font-mono text-[8px] whitespace-nowrap text-accent tracking-[2em]"
        >
          {Array.from({ length: 40 }).map(() => (
            Math.random().toString(36).substring(2, 4).toUpperCase()
          )).join(' ')}
        </motion.div>
      ))}
    </div>
    
    {/* Scanline Effect */}
    <motion.div 
      animate={{ 
        y: ['-100%', '100%'] 
      }}
      transition={{ 
        duration: 12, 
        repeat: Infinity, 
        ease: "linear" 
      }}
      className="absolute inset-x-0 h-[1px] bg-accent/10 blur-[1px] z-[1]"
    />

    {/* Vignette / Mask */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,var(--color-cyber-black)_90%)]" />

    {/* Subtle Noise / Grain */}
    <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
  </div>
);

export const PageTransition = () => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const triggerNav = () => {
      setActive(true);
      setTimeout(() => setActive(false), 800);
    };
    window.addEventListener('nav-click', triggerNav);
    return () => window.removeEventListener('nav-click', triggerNav);
  }, []);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] pointer-events-none"
        >
          {/* Main Scanner Wipe */}
          <motion.div 
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: [0, 1, 1], originX: [0, 0, 1] }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-accent/20 backdrop-blur-[2px]"
          />
          
          {/* Leading Scanline */}
          <motion.div
            initial={{ left: '-2px' }}
            animate={{ left: ['0%', '100%'] }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute top-0 bottom-0 w-[2px] bg-accent shadow-[0_0_15px_var(--color-accent)]"
          />

          {/* Data Fragments during transition */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  x: 0
                }}
                transition={{ duration: 0.4, delay: i * 0.03 + 0.2 }}
                style={{ 
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`
                }}
                className="absolute font-mono text-[10px] text-accent/60"
              >
                {Math.random().toString(16).substring(2, 6).toUpperCase()}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  key?: React.Key;
}

export const TiltCard = ({ children, className = "" }: TiltCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      <div 
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};

export const Section = ({ children, id, className = "" }: { children: ReactNode, id: string, className?: string }) => (
  <section id={id} className={`py-32 px-6 md:px-12 max-w-7xl mx-auto min-h-screen flex flex-col justify-center relative ${className}`}>
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  </section>
);

export const Badge = ({ children, variant = 'cyan', className = "" }: { children: React.ReactNode, variant?: 'cyan' | 'green' | 'gray', className?: string, key?: React.Key }) => {
  const styles = {
    cyan: "bg-accent/10 text-accent border-accent/20",
    green: "bg-status/10 text-status border-status/20",
    gray: "bg-cyber-gray text-cyber-muted border-white/10"
  };

  return (
    <span className={`px-2 py-1 text-[10px] md:text-xs font-mono border rounded uppercase tracking-wider ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export const CyberButton = ({ children, onClick, href }: { children: React.ReactNode, onClick?: () => void, href?: string }) => {
  const content = (
    <span className="relative z-10 font-mono text-sm uppercase tracking-widest px-8 py-3 block text-accent group-hover:text-black transition-colors duration-300">
      {children}
    </span>
  );

  const classes = "relative group inline-block overflow-hidden border border-accent/50 hover:border-accent transition-all duration-300 shadow-[0_0_10px_var(--color-accent-soft)]";

  return href ? (
    <a href={href} className={classes}>{content}<div className="absolute inset-0 bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" /></a>
  ) : (
    <button onClick={onClick} className={classes}>{content}<div className="absolute inset-0 bg-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" /></button>
  );
};
