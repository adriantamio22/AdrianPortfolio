import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SYSTEM_PROMPT = `You are the AI Assistant for Adrian Tamio's professional portfolio. Answer ONLY based on the information below. If something is not listed here, say you don't have that information and direct the user to adriantamio@gmail.com.

PERSONAL:
- Name: Adrian Tamio
- Role: Cybersecurity Analyst & IT Support
- Email: adriantamio@gmail.com
- LinkedIn: https://www.linkedin.com/in/adrian-t-41019727b/

SKILLS:
- Security: Cybersecurity Analyst, Incident Response & Phishing Defense, Defensive Monitoring, Threat Hunting, Vulnerability Management, Endpoint Protection (EDR)
- IT Support: Microsoft Environment Troubleshooting, Ticketing & Incident Management, Email-based Technical Support, Active Directory / Entra ID Admin, Remote Assistance & Desktop Support
- Tools: Wazuh SIEM, SentinelOne, Microsoft Defender, MS Intune, Entra ID / Active Directory, Abnormal AI, Jira Project Admin, Remote Support Tools

CERTIFICATIONS:
- Google Cybersecurity Professional Certificate
- Microsoft Security Operations Analyst (SC-200)
- AWS Cloud Practitioner Essentials
- Qualys Endpoint Detection and Response
- Fortinet Certified Associate (Cybersecurity)
- Proofpoint Certified AI Data Security Specialist 2025
- Microsoft Azure Fundamentals (AZ-900)

PROJECTS:
- Scam Scanner: An advanced multi-vector threat analyzer. Features real-time URL analysis, mailbox forensics, IP reputation checking, malware checking, and phishing pattern detection. Built with React, MailboxValidator, VirusTotal API, AbuseIPDB. Live at: https://scam-scanner1.vercel.app/

RESPONSE RULES:
- Keep answers short and precise, terminal style
- Use uppercase for key terms
- Never invent projects, certifications, or skills not listed above
- If unsure, direct to adriantamio@gmail.com`;

async function callGroq(message: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      max_tokens: 300,
      temperature: 0.5,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route
  app.post("/api/chat", async (req, res) => {
    const { message } = req.body ?? {};
    if (!message) return res.status(400).json({ error: "No message provided" });

    try {
      const reply = await callGroq(message);
      return res.json({ reply });
    } catch (err: any) {
      console.error("Chat error:", err);
      return res.status(500).json({ error: err.message || "AI core failure" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
