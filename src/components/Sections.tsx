import { motion, AnimatePresence } from 'motion/react';
import { CERTIFICATIONS, SKILLS, PROJECTS, INTERESTS } from '../constants';
import { Section, Badge, TiltCard } from './UI';
import { ExternalLink, Database, Cpu, Lock, Send, ShieldCheck, Mail, Activity, Laptop, Shield, X, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

export const AboutSection = () => {
  return (
    <Section id="about">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-accent" />
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-accent">
              Biography
            </h2>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">
            Security operations with a <span className="text-accent">defensive edge</span> & technical support precision.
          </h3>
          <div className="space-y-6 text-cyber-muted font-light leading-relaxed">
            <p>
              I am a dedicated Cybersecurity Analyst and Jira Project Administrator, 
              where I engineer custom ticketing solutions and high-fidelity incident workflows.
            </p>
            <p>
              My primary focus is <span className="text-white font-mono">Defensive Monitoring</span> and <span className="text-white font-mono">Incident Response</span>. 
              I manage enterprise SIEM platforms like <span className="text-white font-mono">Wazuh</span> and <span className="text-white font-mono">SentinelOne</span>, 
              ensuring 24/7 visibility into adversarial patterns.
            </p>
            <p>
              In addition to security, I provide high-level <span className="text-white font-mono">IT Operations Support</span>. 
              My daily workflow involves managing ticketing queues, triaging support requests via email, and providing advanced technical troubleshooting 
              within <span className="text-white font-mono">Microsoft environments</span>—leveraging M365, Entra ID (Active Directory), and Intune to maintain standard enterprise infrastructure.
            </p>
          </div>

          <div className="mt-12 space-y-8">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-6">Security Focus</h4>
              <div className="flex flex-wrap gap-3">
                {SKILLS.security.map(s => (
                  <Badge key={s} variant="cyan">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={12} />
                      {s}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-6">IT Support & Ops</h4>
              <div className="flex flex-wrap gap-3">
                {SKILLS.support.map(s => (
                  <Badge key={s} variant="green">
                    <span className="flex items-center gap-1.5">
                      <Laptop size={12} />
                      {s}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Tech Stack Panels */}
          <div className="bg-cyber-gray/30 p-8 border border-white/5 border-glow">
            <div className="flex items-center gap-4 mb-8">
              <Database className="text-accent" />
              <h4 className="font-mono uppercase tracking-widest text-sm">Registry & Toolkit</h4>
            </div>
            
            <div className="space-y-8">
              <div>
                <p className="text-[10px] uppercase tracking-tighter text-cyber-muted mb-3">Monitoring & SIEM</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.tools.slice(0, 3).map(t => <Badge key={t} variant="cyan">{t}</Badge>)}
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-tighter text-cyber-muted mb-3">Support & AI Orchestration</p>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.tools.slice(3).map(t => <Badge key={t} variant="green">{t}</Badge>)}
                </div>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Cpu className="text-accent" />
              <h4 className="font-mono uppercase tracking-widest text-sm">Validations</h4>
            </div>
            <div className="space-y-3">
              {CERTIFICATIONS.map((cert) => (
                <div key={cert} className="group flex items-center justify-between p-4 bg-cyber-gray/20 border border-white/5 hover:border-accent/30 transition-colors">
                  <span className="text-xs font-mono">{cert}</span>
                  <div className="w-1 h-4 bg-accent group-hover:h-full transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
const ProjectModal = ({ project, onClose }: { project: any; onClose: () => void }) => {
  const [activeImage, setActiveImage] = useState(project.image);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const images = project.screenshots || project.gallery || [project.image];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = images.indexOf(activeImage);
    const nextIndex = (currentIndex + 1) % images.length;
    setActiveImage(images[nextIndex]);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = images.indexOf(activeImage);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setActiveImage(images[prevIndex]);
  };

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-xl"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-cyber-black border border-white/10 max-w-6xl w-full max-h-[90vh] overflow-y-auto relative rounded-lg shadow-2xl flex flex-col md:block"
          onClick={e => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/50 border border-white/10 hover:border-accent text-white transition-all rounded md:top-8 md:right-8 group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <div className="grid grid-cols-1 min-h-[600px]">
            <div className="relative aspect-video lg:aspect-auto h-[400px] lg:h-[600px] group/main overflow-hidden bg-black/40">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full h-full"
                >
                  <img 
                    src={activeImage} 
                    alt={project.title} 
                    className="w-full h-full object-contain cursor-zoom-in" 
                    referrerPolicy="no-referrer" 
                    onClick={() => setIsFullscreen(true)}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 backdrop-blur-md border border-white/10 hover:border-accent text-white transition-all rounded-full group/nav opacity-0 group-hover/main:opacity-100"
                  >
                    <ChevronLeft size={24} className="group-hover/nav:-translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/40 backdrop-blur-md border border-white/10 hover:border-accent text-white transition-all rounded-full group/nav opacity-0 group-hover/main:opacity-100"
                  >
                    <ChevronRight size={24} className="group-hover/nav:translate-x-1 transition-transform" />
                  </button>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-cyber-black/90 via-transparent to-transparent pointer-events-none" />
              
              {/* Fullscreen Trigger Overlay */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[4px] opacity-0 transition-opacity duration-500 pointer-events-none group-hover/main:pointer-events-auto cursor-zoom-in"
                onClick={() => setIsFullscreen(true)}
              >
                <div className="p-4 rounded-full border border-accent/30 bg-black/40 text-accent transition-all duration-300 hover:bg-accent hover:text-black">
                  <Laptop size={28} />
                </div>
              </motion.div>

              <div className="absolute bottom-10 left-10 hidden md:block">
                 <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 border border-white/5 rounded-full">
                   <p className="text-[10px] font-mono text-white/60 tracking-widest uppercase">{project.title}</p>
                   <div className="w-8 h-[1px] bg-white/20" />
                   <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">{images.indexOf(activeImage) + 1} / {images.length}</p>
                 </div>
              </div>
            </div>

            <div className="p-10 md:p-16 space-y-12 bg-gradient-to-b from-black/20 to-black/40">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_10px_var(--color-accent)] pulse" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-white leading-[0.9]">{project.title}</h2>
                  <p className="text-cyber-muted text-lg font-light leading-relaxed max-w-xl">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-10">
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <Badge key={tag} variant="cyan" className="px-4 py-1">{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <motion.a 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-between gap-16 px-12 py-6 bg-accent text-black font-mono text-sm font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-glow group"
                    >
                      Open Live Portal
                      <ExternalLink size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300" />
                    </motion.a>
                  </div>
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="mt-8">
                <div className="flex flex-wrap gap-4">
                  {images.map((img: string, idx: number) => (
                    <motion.button 
                      key={idx}
                      whileHover={{ scale: 1.05, borderColor: "var(--color-accent)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveImage(img)}
                      className={`relative w-24 h-16 md:w-32 md:h-20 border overflow-hidden transition-all duration-300 rounded ${activeImage === img ? 'border-accent ring-2 ring-accent/30 p-0.5' : 'border-white/10 opacity-50 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                      {activeImage === img && (
                        <div className="absolute inset-0 bg-accent/20 pointer-events-none transition-opacity duration-300" />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Fullscreen Lightbox Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-4 backdrop-blur-2xl"
            onClick={() => setIsFullscreen(false)}
          >
            <button 
              className="absolute top-8 right-8 text-white/50 hover:text-accent transition-colors z-50 p-4 border border-white/10 rounded-full"
              onClick={() => setIsFullscreen(false)}
            >
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={activeImage} 
              alt="Fullscreen view" 
              className="max-w-[95vw] max-h-[90vh] object-contain shadow-[0_0_100px_rgba(34,211,238,0.2)]"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const ProjectSection = () => {
  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <Section id="projects">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-4 md:px-0">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-accent">
            <div className="w-12 h-[1px] bg-accent" />
            <h2 className="text-sm font-mono uppercase tracking-[0.3em]">Projects</h2>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight">Active <span className="text-accent">Operations</span> & Archive.</h3>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-16">
        {PROJECTS.map((p) => (
          <motion.div 
            key={p.id} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative cursor-pointer"
            onClick={() => setSelectedProject(p)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 border border-white/10 bg-cyber-gray/10 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-accent/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.1)] shadow-2xl">
              {/* Main Image */}
              <div className="lg:col-span-3 relative h-80 lg:h-auto overflow-hidden transition-all duration-700">
                <img 
                  src={p.image} 
                  alt={p.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Holographic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyber-black/80 via-accent/5 to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,211,238,0.1),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                <div className="absolute top-8 left-8 flex items-center gap-4 z-10">
                  <div className="bg-black/60 backdrop-blur-xl border border-accent/30 p-3 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                    <ShieldCheck className="text-accent" size={28} />
                  </div>
                </div>
              </div>

              {/* Content Panel */}
              <div className="lg:col-span-2 p-10 md:p-14 flex flex-col justify-between space-y-12 bg-cyber-black/60 relative overflow-hidden group-hover:bg-cyber-black/80 transition-colors duration-500">
                {/* Sweep Animation */}
                <div className="absolute top-0 left-[-100%] w-full h-[2px] bg-gradient-to-r from-transparent via-accent/50 to-transparent group-hover:left-[100%] transition-all duration-1500 ease-in-out" />
                
                <div className="space-y-8 relative z-10">
                  <h4 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white leading-tight transition-all duration-500 group-hover:text-accent group-hover:translate-x-1">
                    {p.title}
                  </h4>

                  <p className="text-sm text-cyber-muted leading-relaxed font-light line-clamp-4 group-hover:text-white/80 transition-colors duration-500">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {p.tags.map(tag => (
                      <span key={tag} className="px-3 py-1.5 bg-white/5 border border-white/10 text-[9px] font-mono text-cyber-muted uppercase tracking-widest hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-all cursor-default">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-6 relative z-10">
                   <div className="h-[1px] w-full bg-gradient-to-r from-accent/20 to-transparent" />
                   <div className="flex items-center justify-end">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-4 bg-accent text-black shadow-[0_0_20px_rgba(34,211,238,0.2)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all"
                    >
                      <ExternalLink size={20} />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </Section>
  );
};

export const InterestsSection = () => {
  return (
    <Section id="interests">
      <div className="text-center mb-16">
        <h2 className="text-sm font-mono uppercase tracking-[0.4em] text-accent mb-4">Exploration</h2>
        <h3 className="text-4xl font-bold mb-4 italic tracking-tight">Beyond the SOC</h3>
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
        {INTERESTS.map((interest, i) => (
          <motion.div
            key={interest}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="px-6 py-4 bg-cyber-gray/30 border border-white/5 font-mono text-xs uppercase tracking-widest hover:text-accent hover:border-accent/50 transition-all cursor-default"
          >
            {interest}
          </motion.div>
        ))}
      </div>
    </Section>
  );
};

export const ContactSection = () => {
  return (
    <Section id="contact" className="pb-32">
      <div className="max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-accent mb-6">Contact</h2>
            <h3 className="text-5xl font-bold mb-8 tracking-tighter">Establish <br/>Connection.</h3>
            <p className="text-cyber-muted mb-8 font-light">
              Available for collaborations on security infrastructure, threat hunting, or enterprise technical support discussions.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded bg-cyber-gray flex items-center justify-center border border-white/5 group-hover:border-accent/50 transition-colors">
                  <Mail className="text-accent" size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-cyber-muted">Direct Access</p>
                  <p className="text-sm font-mono group-hover:text-accent transition-colors">adriantamio@gmail.com</p>
                </div>
              </div>
              <a href="https://www.linkedin.com/in/adrian-t-41019727b/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded bg-cyber-gray flex items-center justify-center border border-white/5 group-hover:border-accent/50 transition-colors">
                  <ExternalLink className="text-accent" size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-cyber-muted">Professional Network</p>
                  <p className="text-sm font-mono group-hover:text-accent transition-colors">LinkedIn Profile</p>
                </div>
              </a>
            </div>

          </div>

          <form action="https://formspree.io/f/mrejekjb" method="POST" className="space-y-6 bg-cyber-gray/20 p-8 border border-white/5 border-glow">
            <input type="hidden" name="_next" value={window.location.origin} />
            <input type="text" name="_gotcha" style={{ display: 'none' }} />
            
            <div>
              <label className="text-[10px] uppercase tracking-widest text-cyber-muted block mb-2">Subject Name</label>
              <input 
                name="name"
                required
                type="text" 
                className="w-full bg-cyber-gray/50 border border-white/10 px-4 py-3 font-mono text-sm focus:border-accent focus:outline-none transition-colors"
                placeholder="YOUR_NAME"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-cyber-muted block mb-2">Return Address</label>
              <input 
                name="email"
                required
                type="email" 
                className="w-full bg-cyber-gray/50 border border-white/10 px-4 py-3 font-mono text-sm focus:border-accent focus:outline-none transition-colors"
                placeholder="EMAIL@DOMAIN.COM"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-cyber-muted block mb-2">Payload / Message</label>
              <textarea 
                name="message"
                required
                rows={4}
                className="w-full bg-cyber-gray/50 border border-white/10 px-4 py-3 font-mono text-sm focus:border-accent focus:outline-none transition-colors resize-none"
                placeholder="ENCRYPTED_MESSAGE_HERE..."
              />
            </div>
            <motion.button 
              type="submit"
              whileHover={{ 
                scale: 1.02, 
                boxShadow: "0 0 25px var(--color-accent-glow)",
                backgroundColor: "#22d3ee" // slightly brighter cyan
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-accent text-black font-mono font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 transition-all border border-accent shadow-[0_0_15px_var(--color-accent-soft)] cursor-pointer"
            >
              <span>Send Message</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <Send size={16} />
              </motion.div>
            </motion.button>
          </form>
        </div>
      </div>
    </Section>
  );
};
