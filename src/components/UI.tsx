import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'motion/react';

export const TiltCard = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
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
  <section id={id} className={`py-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen flex flex-col justify-center relative ${className}`}>
    <div className="absolute inset-0 pointer-events-none -z-10 opacity-5">
      <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,var(--color-accent),transparent_70%)]" />
    </div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  </section>
);

export const Badge = ({ children, variant = 'cyan' }: { children: React.ReactNode, variant?: 'cyan' | 'green' | 'gray', key?: any }) => {
  const styles = {
    cyan: "bg-accent/10 text-accent border-accent/20",
    green: "bg-status/10 text-status border-status/20",
    gray: "bg-cyber-gray text-cyber-muted border-white/10"
  };

  return (
    <span className={`px-2 py-1 text-[10px] md:text-xs font-mono border rounded uppercase tracking-wider ${styles[variant]}`}>
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
