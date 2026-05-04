import { motion } from 'motion/react';
import { CERTIFICATIONS, SKILLS, PROJECTS, INTERESTS } from '../constants';
import { Section, Badge, TiltCard } from './UI';
import { ExternalLink, Database, Cpu, Lock, Send, ShieldCheck, Mail, Activity, Laptop, Shield } from 'lucide-react';
import React from 'react';

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SKILLS.security.map(s => (
                  <div key={s} className="flex items-center gap-2 text-sm">
                    <ShieldCheck size={14} className="text-status" />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-mono text-xs uppercase tracking-widest text-accent mb-6">IT Support & Ops</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SKILLS.support.map(s => (
                  <div key={s} className="flex items-center gap-2 text-sm">
                    <Laptop size={14} className="text-accent" />
                    <span>{s}</span>
                  </div>
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

export const ProjectSection = () => {
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

      <div className="max-w-6xl mx-auto">
        {PROJECTS.map((p) => (
          <div key={p.id} className="group relative">
            <div className="grid grid-cols-1 lg:grid-cols-5 border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:border-accent/30">
              {/* Main Image */}
              <div className="lg:col-span-3 relative h-64 lg:h-auto overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                <img 
                  src={p.image} 
                  alt={p.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-8 left-8 flex items-center gap-4">
                  <div className="bg-accent/10 backdrop-blur-md border border-accent/20 p-2.5 rounded-lg">
                    <ShieldCheck className="text-accent" size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-accent uppercase tracking-[0.2em] leading-tight font-bold">System_Interface</span>
                    <span className="text-xs font-mono text-white/50 uppercase tracking-widest font-light">SECURE_CORE_V4</span>
                  </div>
                </div>
              </div>

              {/* Content Panel */}
              <div className="lg:col-span-2 p-8 md:p-12 flex flex-col justify-between space-y-12 bg-cyber-black/40">
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-status shadow-[0_0_10px_var(--color-status)]" />
                    <span className="text-[10px] font-mono text-accent uppercase tracking-[0.4em] font-medium">Monitoring_Active</span>
                  </div>
                  
                  <h4 className="text-2xl md:text-4xl font-bold tracking-tighter uppercase text-white leading-tight">
                    {p.title}
                  </h4>

                  <p className="text-sm text-cyber-muted leading-relaxed font-light line-clamp-4">
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {p.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] font-mono text-cyber-muted uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <a 
                  href={p.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group/link flex items-center justify-between p-5 bg-accent text-black font-mono text-xs font-bold uppercase tracking-[0.3em] hover:bg-white transition-all"
                >
                  <span>Launch Protocol</span>
                  <ExternalLink size={14} className="group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
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
              <span>Transmit Protocol</span>
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
