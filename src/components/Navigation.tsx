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
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-cyber-black/80 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2 group">
          <Shield className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
          <span className="font-mono text-lg font-bold tracking-tighter uppercase">
            ADRIAN<span className="text-accent">.SOC</span>
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
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--color-accent),transparent)] w-full h-full opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 px-4 md:px-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-2 mb-6 text-accent font-mono text-sm tracking-[0.4em] uppercase">
              <Shield size={16} />
              <span>Work Portfolio // Operations_Active</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-bold mb-6 tracking-tighter leading-tight uppercase">
              ADRIAN <span className="text-accent glow-cyan">TAMIO</span>
            </h1>

            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
              <h2 className="text-xl md:text-2xl font-mono text-cyber-text tracking-tight uppercase">
                &gt; Security Operations Analyst
              </h2>
              <div className="hidden md:block w-1.5 h-1.5 rounded-full animate-pulse bg-status shadow-[0_0_8px_var(--color-status)]" />
              <h2 className="text-xl md:text-2xl font-mono text-cyber-muted tracking-tight uppercase">
                &gt; IT Specialist
              </h2>
            </div>

          <div className="flex flex-wrap gap-4">
            <a href="#projects" className="bg-accent text-black px-12 py-5 font-mono text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#22d3ee] transition-all relative overflow-hidden group shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <span className="relative z-10">Explore Work</span>
              <motion.div 
                className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" 
              />
            </a>
            <a href="#contact" className="border border-white/10 text-white px-12 py-5 font-mono text-xs font-bold uppercase tracking-[0.3em] hover:border-accent hover:text-accent transition-all relative overflow-hidden group">
              <span className="relative z-10">Connect with me</span>
              <motion.div 
                className="absolute inset-0 bg-accent/5 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" 
              />
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
        <div className="w-[1px] h-16 bg-gradient-to-b from-accent to-transparent opacity-50" />
      </motion.div>
    </div>
  );
};
