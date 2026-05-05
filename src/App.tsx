import { useState, useEffect } from 'react';
import { Navbar, Hero } from './components/Navigation';
import { AboutSection, ProjectSection, InterestsSection, ContactSection } from './components/Sections';
import { CyberBackground, PageTransition } from './components/UI';
import { TerminalConsole } from './components/Terminal';

export default function App() {
  return (
    <div className="relative overflow-x-hidden text-cyber-text">
      <CyberBackground />
      <PageTransition />
      <Navbar />
      
      <main>
        <Hero />
        <AboutSection />
        <ProjectSection />
        <InterestsSection />
        <ContactSection />
      </main>

      <TerminalConsole />

      <footer className="py-12 border-t border-white/5 bg-cyber-black flex flex-col items-center justify-center gap-4 text-cyber-muted">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em]">
          <span>&copy; 2026</span>
          <span className="text-accent">ADRIAN-TAMIO.COM</span>
          <span className="opacity-50">//</span>
          <span>SECURE_DEPLOYMENT</span>
        </div>
        <p className="text-[10px] font-mono opacity-50">
          Built with React & Cyber Resilience
        </p>
      </footer>
    </div>
  );
}
