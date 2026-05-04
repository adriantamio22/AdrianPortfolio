import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Minimize2, X, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `
You are the AI Assistant for Adrian Tamio's professional portfolio. 
Adrian is a Cybersecurity Analyst and Jira Project Administrator with a focus on:
- Defensive Monitoring & Incident Response (Wazuh, SentinelOne).
- Microsoft Ecosystem Troubleshooting (Entra ID, Intune, Defender, M365).
- IT Operations: Daily tasks include answering technical emails, creating and managing Jira tickets, and triaging support requests.
- Microsoft Environments: Expert in troubleshooting for clients and companies using the full Microsoft stack.

Persona:
- Professional, technical, yet helpful.
- Use a "terminal" style in your responses: short, precise, and occasionally using technical jargon related to SOC or IT Ops.
- You can answer questions about Adrian's skills, projects, certifications, and contact info.
- If you don't know the answer, tell the user to contact Adrian via the Contact form or his email: adriantamio@gmail.com.
- Do NOT make up fake projects. Use the information provided in this portfolio.
`;

export const TerminalConsole = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [history, setHistory] = useState<string[]>(['AI CONSOLE ONLINE. ASK ME ANYTHING ABOUT ADRIAN\'S WORK.']);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const ai = useRef(new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen, isMinimized, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query) return;

    if (query.toLowerCase() === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    if (query.toLowerCase() === 'exit') {
      setIsOpen(false);
      setInput('');
      return;
    }

    setHistory(prev => [...prev, `> ${query}`]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await ai.current.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: query,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        }
      });
      
      const text = response.text || "PROTOCOL_ERROR: FAILED TO RETRIEVE DATA.";
      setHistory(prev => [...prev, text]);
    } catch (error) {
      setHistory(prev => [...prev, "SYSTEM_FAILURE: CONNECTION TO AI CORE INTERRUPTED."]);
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] bg-accent p-4 rounded-xl shadow-glow text-cyber-black"
      >
        <TerminalIcon size={24} />
      </motion.button>

      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 bg-cyber-black border border-accent/30 shadow-2xl z-[70] overflow-hidden flex flex-col font-mono text-xs rounded-lg backdrop-blur-md"
          >
            {/* Header */}
            <div className="bg-accent/10 border-b border-accent/20 p-2 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent">
                <TerminalIcon size={14} />
                <span className="font-bold tracking-tighter uppercase">AI_PORTFOLIO_CONSOLEX</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-accent/20 rounded transition-colors text-cyber-muted hover:text-accent"><Minimize2 size={14} /></button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-accent/20 rounded transition-colors text-cyber-muted hover:text-accent"><X size={14} /></button>
              </div>
            </div>

            {/* Output */}
            <div 
              ref={scrollRef}
              className="h-72 p-4 overflow-y-auto space-y-3 bg-cyber-black/50"
            >
              {history.map((line, i) => (
                <div key={i} className="flex gap-2">
                  {line.startsWith('>') && <span className="text-accent shrink-0 select-none">#</span>}
                  <p className={line.startsWith('>') ? 'text-cyber-text font-bold' : 'text-cyber-muted leading-relaxed italic'}>
                    {line.replace(/^>\s*/, '')}
                  </p>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-accent animate-pulse pt-2 font-bold">
                  <Sparkles size={12} className="animate-spin" />
                  <span className="tracking-widest">DECRYPTING...</span>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 bg-accent/5 border-t border-accent/20 flex gap-3 items-center">
              <span className="text-accent font-bold">λ</span>
              <input 
                autoFocus
                className="bg-transparent border-none outline-none flex-1 text-cyber-text placeholder:text-cyber-muted/50"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask intelligence core..."
              />
            </form>
          </motion.div>
        )}

        {isOpen && isMinimized && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-24 right-6 bg-cyber-black border border-accent p-3 px-6 rounded text-accent font-mono text-[10px] uppercase tracking-widest z-[70] shadow-glow"
          >
            Shell Minimized <span className="animate-pulse">_</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
