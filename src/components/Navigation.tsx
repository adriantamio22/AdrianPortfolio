import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield, Terminal, Linkedin } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Root', href: '#home' },
    { name: 'Bio', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cyber-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 group">
          <Shield className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
          <span className="font-mono text-lg font-bold tracking-tighter uppercase">
            ADRIAN<span className="text-accent italic">.SOC</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs uppercase tracking-widest font-mono text-cyber-muted hover:text-accent transition-colors"
            >
              {link.name}
            </a>
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
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm uppercase tracking-widest font-mono"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Hero = () => {
  return (
    <div id="home" className="relative min-h-screen flex items-center pt-20 px-6">
      {/* Background Matrix Effect (Subtle) */}
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--color-accent),transparent)] w-full h-full" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            style={{ 
              transformStyle: "preserve-3d",
              transform: "perspective(1000px)"
            }}
          >
            <motion.div
              animate={{ 
                rotateY: [0, 5, -5, 0],
                rotateX: [0, -2, 2, 0]
              }}
              transition={{ 
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="flex items-center gap-2 mb-6 text-accent font-mono text-sm tracking-widest uppercase">
                <Terminal size={16} />
                <span>System Deployment Successful</span>
              </div>

              <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tighter leading-none uppercase" style={{ transform: "translateZ(50px)" }}>
                ADRIAN <span className="text-accent glow-cyan">TAMIO</span>
              </h1>
            </motion.div>

            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8" style={{ transform: "translateZ(30px)" }}>
              <h2 className="text-xl md:text-2xl font-mono text-cyber-muted italic">
                &gt; Cybersecurity Analyst
              </h2>
              <div className="hidden md:block w-2 h-2 rounded-full animate-pulse bg-status shadow-[0_0_8px_var(--color-status)]" />
              <h2 className="text-xl md:text-2xl font-mono text-cyber-muted">
                &gt; IT Operations & Support
              </h2>
            </div>

          <p className="max-w-2xl text-cyber-muted text-lg leading-relaxed mb-10 font-light">
            Defending digital environments while providing high-level technical support. 
            Specialized in Microsoft ecosystems, incident response, and proactive security infrastructure.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#contact" className="relative group overflow-hidden border border-accent px-8 py-3 bg-accent/10 hover:bg-accent transition-all duration-300">
              <span className="relative z-10 font-mono text-sm uppercase tracking-widest text-accent group-hover:text-black">
                Establish Connection
              </span>
            </a>
            <a href="#projects" className="border border-white/20 px-8 py-3 hover:border-white/50 transition-all font-mono text-sm uppercase tracking-widest">
              Project Logs
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-1 h-12 rounded-full bg-gradient-to-b from-accent to-transparent opacity-50" />
      </motion.div>
    </div>
  );
};
