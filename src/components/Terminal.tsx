import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Minimize2, X, Sparkles } from 'lucide-react';

export const TerminalConsole = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [history, setHistory] = useState<string[]>(['SYSTEM_CORE_ONLINE: HOW CAN I ASSIST YOU TODAY?']);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const COMMANDS = ['status', 'scan', 'help', 'clear', 'exit', 'about', 'projects', 'contact'];

  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    const cleanInput = input.trim().toLowerCase();
    if (cleanInput) {
      setSuggestions(COMMANDS.filter(cmd => cmd.startsWith(cleanInput) && cmd !== cleanInput));
    } else {
      setSuggestions([]);
    }
  }, [input]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isOpen, isMinimized, isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && suggestions.length > 0) {
      e.preventDefault();
      setInput(suggestions[0]);
      setSuggestions([]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(commandHistory[commandHistory.length - 1 - nextIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = input.trim();
    if (!query) return;

    setCommandHistory(prev => [query, ...prev.filter(c => c !== query)].slice(0, 50));
    setHistoryIndex(-1);
    setSuggestions([]);

    const lowerQuery = query.toLowerCase();

    if (lowerQuery === 'clear') {
      setHistory(['SYSTEM_CORE_ONLINE: HOW CAN I ASSIST YOU TODAY?']);
      setInput('');
      return;
    }
    if (lowerQuery === 'exit') { setIsOpen(false); setInput(''); return; }

    setHistory(prev => [...prev, `> ${query}`]);
    setInput('');

    if (lowerQuery === 'status') {
      setHistory(prev => [...prev, "SYSTEM_REPORT: ALL_MODULES_OPERATIONAL", "THREAT_LEVEL: MINIMAL", "ENCLAVE_ENCRYPTION: ACTIVE"]);
      return;
    }
    if (lowerQuery.startsWith('scan')) {
      setIsTyping(true);
      setTimeout(() => {
        setHistory(prev => [...prev, "SCANNING_ENVIRONMENT...", "INTEGRITY_CHECK: 100% SECURE", "NO_MALWARE_DETECTED."]);
        setIsTyping(false);
      }, 1500);
      return;
    }
    if (lowerQuery === 'help') {
      setHistory(prev => [...prev, "AVAILABLE_COMMANDS: [status], [scan], [clear], [exit], [help], [about], [projects], [contact], or ask anything."]);
      return;
    }
    if (lowerQuery === 'about') {
      setHistory(prev => [...prev, "INFO: ADRIAN TAMIO — CYBERSECURITY ANALYST & JIRA PROJECT ADMINISTRATOR."]);
      return;
    }
    if (lowerQuery === 'projects') {
      setHistory(prev => [...prev, "INFO: FEATURED PROJECT: SCAM SCANNER — ADVANCED THREAT ANALYZER."]);
      return;
    }
    if (lowerQuery === 'contact') {
      setHistory(prev => [...prev, "INFO: ADRIANTAMIO@GMAIL.COM"]);
      return;
    }

    setIsTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();
      setHistory(prev => [...prev, data.reply || "PROTOCOL_ERROR: NO_RESPONSE."]);
    } catch {
      setHistory(prev => [...prev, "SYSTEM_FAILURE: CONNECTION TO AI CORE INTERRUPTED."]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (isOpen && isMinimized) setIsMinimized(false);
          else setIsOpen(!isOpen);
        }}
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
            <div className="bg-accent/10 border-b border-accent/20 p-2 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent">
                <TerminalIcon size={14} />
                <span className="font-bold tracking-tighter uppercase">AI_PORTFOLIO_CONSOLE</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-accent/20 rounded transition-colors text-cyber-muted hover:text-accent"><Minimize2 size={14} /></button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-accent/20 rounded transition-colors text-cyber-muted hover:text-accent"><X size={14} /></button>
              </div>
            </div>

            <div ref={scrollRef} className="h-72 p-4 overflow-y-auto space-y-3 bg-cyber-black/50">
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

            <form onSubmit={handleSubmit} className="p-3 bg-accent/5 border-t border-accent/20 flex flex-col gap-2">
              {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1">
                  <span className="text-[10px] text-accent/50 uppercase tracking-tighter self-center">Suggested:</span>
                  {suggestions.map(s => (
                    <button key={s} type="button" onClick={() => { setInput(s); setSuggestions([]); inputRef.current?.focus(); }}
                      className="text-[10px] px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent hover:bg-accent/20 transition-colors uppercase">
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex gap-3 items-center">
                <span className="text-accent font-bold">λ</span>
                <input ref={inputRef} autoFocus
                  className="bg-transparent border-none outline-none flex-1 text-cyber-text placeholder:text-cyber-muted/50"
                  value={input} onKeyDown={handleKeyDown} onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask intelligence core..." />
              </div>
            </form>
          </motion.div>
        )}
        {isOpen && isMinimized && (
          <motion.button initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-24 right-6 bg-cyber-black border border-accent p-3 px-6 rounded text-accent font-mono text-[10px] uppercase tracking-widest z-[70] shadow-glow">
            Shell Minimized <span className="animate-pulse">_</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
