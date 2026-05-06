import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield, Terminal, Linkedin } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleNavClick = () => {
    window.dispatchEvent(new CustomEvent('nav-click'));
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Root', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cyber-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#home" onClick={handleNavClick} className="flex items-center gap-2 group">
          <Shield className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
          <span className="font-mono text-lg font-bold tracking-tighter uppercase">
            ADRIAN<span className="text-accent">.SOC</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              onClick={handleNavClick}
              whileHover={{ x: 2, color: 'var(--color-accent)' }}
              whileTap={{ scale: 0.95, x: -1 }}
              className="text-xs uppercase tracking-widest font-mono text-cyber-muted transition-colors relative group"
            >
              <span className="relative z-10">{link.name}</span>
              <motion.span 
                className="absolute -bottom-1 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300"
              />
            </motion.a>
          ))}

          <div className="h-4 w-[1px] bg-white/10 mx-2" />

          <a href="https://www.linkedin.com/in/adrian-t-41019727b/" target="_blank" rel="noopener noreferrer" className="text-cyber-muted hover:text-accent transition-colors ml-4">
            <Linkedin className="w-5 h-5" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button className="text-accent" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cyber-gray border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  whileTap={{ scale: 0.95, x: 5 }}
                  className="text-sm uppercase tracking-widest font-mono text-cyber-text hover:text-accent flex items-center gap-3"
                  onClick={() => {
                    handleNavClick();
                    setIsOpen(false);
                  }}
                >
                  <span className="text-accent/50">0{i + 1}</span>
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Hero = () => {
  const handleNavClick = () => {
    window.dispatchEvent(new CustomEvent('nav-click'));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div id="home" className="relative min-h-screen flex items-center pt-20 px-6 overflow-hidden">
      {/* Background Matrix/Data Effect (Subtle) */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.03] pointer-events-none select-none font-mono text-[10px]">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -100, opacity: 0 }}
            animate={{ 
              y: [null, 1000],
              opacity: [0, 1, 1, 0]
            }}
            transition={{ 
              duration: 20 + Math.random() * 20, 
              repeat: Infinity, 
              delay: i * 2,
              ease: "linear" 
            }}
            style={{ left: `${i * 15}%` }}
            className="absolute top-0 whitespace-nowrap writing-mode-vertical"
          >
            {Array.from({ length: 20 }).map(() => (
              Math.random().toString(16).substring(2, 8).toUpperCase() + " "
            ))}
          </motion.div>
        ))}
      </div>

      {/* Decorative Frame Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-40 left-10 w-24 h-[1px] bg-gradient-to-r from-accent/50 to-transparent" />
        <div className="absolute bottom-40 right-10 w-24 h-[1px] bg-gradient-to-l from-accent/50 to-transparent" />
        <div className="absolute top-60 right-20 w-[1px] h-32 bg-gradient-to-b from-accent/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 px-4 md:px-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative"
        >
          {/* Decorative Corner Brackets for Content Area */}
          <div className="absolute -top-12 -left-8 w-12 h-12 border-t border-l border-accent/30 hidden md:block" />
          <div className="absolute -bottom-12 -right-8 w-12 h-12 border-b border-r border-accent/30 hidden md:block" />

          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6 text-accent font-mono text-sm tracking-[0.4em] uppercase">
            <Shield size={16} className="animate-pulse" />
            <span className="relative">
              Work Portfolio
              <span className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-[1px] bg-accent/50" />
            </span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-bold mb-6 tracking-tighter leading-tight uppercase">
            ADRIAN <span className="text-accent glow-cyan relative inline-block">
              TAMIO
              <motion.span 
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5 }}
                className="absolute inset-0 text-white blur-sm -z-10"
              >
                TAMIO
              </motion.span>
            </span>
          </motion.h1>

          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-mono text-cyber-text tracking-tight uppercase">
                &gt; Cybersecurity Analyst
              </h2>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full animate-pulse bg-status shadow-[0_0_8px_var(--color-status)]" />
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-mono text-cyber-muted tracking-tight uppercase">
                &gt; IT Support
              </h2>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            <a 
              href="#projects" 
              onClick={handleNavClick}
              className="bg-accent text-black px-12 py-5 font-mono text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#22d3ee] transition-all relative overflow-hidden group shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <span className="relative z-10">Explore Work</span>
              <motion.div 
                className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" 
              />
            </a>
            <a 
              href="#contact" 
              onClick={handleNavClick}
              className="border border-white/10 text-white px-12 py-5 font-mono text-xs font-bold uppercase tracking-[0.3em] hover:border-accent hover:text-accent transition-all relative overflow-hidden group">
              <span className="relative z-10">Connect with me</span>
              <motion.div 
                className="absolute inset-0 bg-accent/5 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" 
              />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[8px] uppercase tracking-widest text-cyber-muted/50 [writing-mode:vertical-lr]">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-accent to-transparent opacity-50" />
      </motion.div>
    </div>
  );
};
