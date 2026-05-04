import { motion } from 'motion/react';
import { CERTIFICATIONS, SKILLS, PROJECTS, INTERESTS } from '../constants';
import { Section, Badge, TiltCard } from './UI';
import { ExternalLink, Database, Cpu, Lock, Send, ShieldCheck, Mail, Activity, Laptop } from 'lucide-react';
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4 text-accent">
            <div className="w-12 h-[1px] bg-accent" />
            <h2 className="text-sm font-mono uppercase tracking-widest">Active Operations</h2>
          </div>
          <h3 className="text-4xl font-bold tracking-tight">Project Database</h3>
        </div>
        <p className="max-w-md text-cyber-muted text-sm font-light">
          A selection of technical implementations, security optimizations, and support infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECTS.map((p) => (
          <TiltCard key={p.id}>
            <div className="group relative h-full bg-cyber-gray/20 border border-white/5 p-8 flex flex-col justify-between min-h-[300px] border-glow">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <Lock className="text-accent opacity-50 group-hover:opacity-100 transition-opacity" />
                  <ExternalLink size={18} className="text-cyber-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-xl font-bold mb-4 tracking-tight group-hover:text-accent transition-colors">{p.title}</h4>
                <p className="text-sm text-cyber-muted leading-relaxed font-light">{p.description}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {p.tags.map(tag => <Badge key={tag} variant="gray">{tag}</Badge>)}
              </div>
            </div>
          </TiltCard>
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
            <button 
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-black font-mono font-bold uppercase tracking-widest py-4 flex items-center justify-center gap-2 transition-all border border-accent shadow-[0_0_15px_var(--color-accent-soft)]"
            >
              <span>Transmit Protocol</span>
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </Section>
  );
};
