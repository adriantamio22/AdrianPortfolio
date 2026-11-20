import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

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

const PREFERRED_MODELS = [
  "openai/gpt-oss-20b",
  "meta-llama/llama-4-scout-17b-16e-instruct",
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-120b",
  "meta-llama/llama-4-maverick-17b-128e-instruct",
  "qwen/qwen3-32b",
  "llama-3.1-8b-instant",
];

let cachedGroqModel: string | null = null;

interface GroqResult {
  ok: boolean;
  text?: string;
  status?: number;
  message?: string;
}

async function requestGroqCompletion(
  apiKey: string,
  model: string,
  message: string
): Promise<GroqResult> {
  const payload: Record<string, unknown> = {
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: message },
    ],
    max_completion_tokens: 1024,
    temperature: 0.5,
  };

  if (model.startsWith("openai/gpt-oss")) {
    payload.reasoning_effort = "low";
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      message: data?.error?.message || `API error ${res.status}`,
    };
  }

  const rawText: string = data?.choices?.[0]?.message?.content || "";
  const cleanedText = rawText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();
  return { ok: true, text: cleanedText || "PROTOCOL_ERROR: EMPTY_RESPONSE." };
}

async function fetchAvailableGroqModels(apiKey: string): Promise<string[]> {
  const res = await fetch("https://api.groq.com/openai/v1/models", {
    headers: { "Authorization": `Bearer ${apiKey}` },
  });
  if (!res.ok) return [];
  const data = await res.json().catch(() => ({}));
  const ids: string[] = Array.isArray(data?.data)
    ? data.data.map((m: { id?: string }) => m.id).filter((id: unknown): id is string => typeof id === "string")
    : [];

  const chatModels = ids.filter(
    (id) => !/whisper|guard|tts|orpheus|embed|playai|distil/i.test(id)
  );

  const prioritized = PREFERRED_MODELS.filter((m) => chatModels.includes(m));
  const remaining = chatModels.filter((m) => !prioritized.includes(m));
  return [...prioritized, ...remaining];
}

function isModelAccessError(status: number | undefined, message: string | undefined): boolean {
  if (status === 404) return true;
  return /model|does not exist|do not have access|decommissioned|deprecated|not found/i.test(message || "");
}

async function callGroq(apiKey: string, message: string): Promise<string> {
  const primaryModel = cachedGroqModel || PREFERRED_MODELS[0];
  const firstAttempt = await requestGroqCompletion(apiKey, primaryModel, message);
  if (firstAttempt.ok && firstAttempt.text) {
    cachedGroqModel = primaryModel;
    return firstAttempt.text;
  }

  if (!isModelAccessError(firstAttempt.status, firstAttempt.message)) {
    throw new Error(firstAttempt.message || "AI core failure");
  }

  cachedGroqModel = null;
  const availableModels = await fetchAvailableGroqModels(apiKey);
  const candidates = Array.from(
    new Set([
      ...availableModels,
      ...PREFERRED_MODELS,
    ])
  ).filter((m) => m !== primaryModel);

  let lastError = firstAttempt.message || "No accessible Groq model found";
  for (const model of candidates) {
    const attempt = await requestGroqCompletion(apiKey, model, message);
    if (attempt.ok && attempt.text) {
      cachedGroqModel = model;
      return attempt.text;
    }
    lastError = attempt.message || lastError;
    if (!isModelAccessError(attempt.status, attempt.message)) {
      throw new Error(lastError);
    }
  }

  throw new Error(lastError);
}

async function callGemini(apiKey: string, message: string): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  const response = await ai.models.generateContent({
    model: "gemini-4-hydrogen",
    contents: message,
    config: {
      systemInstruction: SYSTEM_PROMPT,
    },
  });

  const text = response.text?.trim();
  return text || "PROTOCOL_ERROR: EMPTY_RESPONSE.";
}

function answerFromPortfolio(message: string): string {
  const q = message.toLowerCase();

  if (/^(hi|hello|hey|yo|sup|greetings)\b/.test(q.trim())) {
    return "SYSTEM_ONLINE: ADRIAN TAMIO PORTFOLIO CORE READY. ASK ABOUT SKILLS, TOOLS, CERTIFICATIONS, PROJECTS, OR CONTACT.";
  }
  if (/cert|qualys|fortinet|sc-200|az-900|aws|proofpoint|google/.test(q)) {
    return "CERTIFICATIONS: GOOGLE CYBERSECURITY PROFESSIONAL, MICROSOFT SC-200, AWS CLOUD PRACTITIONER ESSENTIALS, QUALYS EDR, FORTINET FCA CYBERSECURITY, PROOFPOINT AI DATA SECURITY SPECIALIST 2025, MICROSOFT AZ-900.";
  }
  if (/project|scam|scanner|virustotal|abuseipdb|mailbox|work|build|built/.test(q)) {
    return "PROJECT: SCAM SCANNER — MULTI-VECTOR THREAT ANALYZER WITH URL ANALYSIS, MAILBOX FORENSICS, IP REPUTATION, MALWARE CHECKING & PHISHING DETECTION. BUILT WITH REACT, MAILBOXVALIDATOR, VIRUSTOTAL API, ABUSEIPDB. LIVE: https://scam-scanner1.vercel.app/";
  }
  if (/tool|wazuh|sentinel|defender|intune|entra|active directory|abnormal|jira|siem|edr|stack|tech/.test(q)) {
    return "TOOLS: WAZUH SIEM, SENTINELONE, MICROSOFT DEFENDER, MS INTUNE, ENTRA ID / ACTIVE DIRECTORY, ABNORMAL AI, JIRA PROJECT ADMIN, REMOTE SUPPORT TOOLS.";
  }
  if (/skill|security|support|it |incident|phishing|threat|hunt|vulnerab|ticket|microsoft|m365/.test(q)) {
    return "SKILLS: CYBERSECURITY ANALYST (INCIDENT RESPONSE, PHISHING DEFENSE, DEFENSIVE MONITORING, THREAT HUNTING, VULNERABILITY MANAGEMENT, EDR) & IT SUPPORT (MICROSOFT ECOSYSTEM, TICKETING, EMAIL SUPPORT, ENTRA ID/AD, REMOTE DESKTOP).";
  }
  if (/contact|email|mail|linkedin|hire|reach|connect|social/.test(q)) {
    return "CONTACT: ADRIANTAMIO@GMAIL.COM | LINKEDIN: https://www.linkedin.com/in/adrian-t-41019727b/";
  }
  if (/who|adrian|about|bio|role|job|title|name|background|experience/.test(q)) {
    return "IDENTITY: ADRIAN TAMIO — CYBERSECURITY ANALYST & IT SUPPORT SPECIALIZING IN DEFENSIVE MONITORING, INCIDENT RESPONSE, AND MICROSOFT ENTERPRISE OPERATIONS. CONTACT: ADRIANTAMIO@GMAIL.COM";
  }

  return "INFO: ADRIAN TAMIO IS A CYBERSECURITY ANALYST & IT SUPPORT SPECIALIST. ASK ABOUT SKILLS, TOOLS, CERTIFICATIONS, OR SCAM SCANNER — OR REACH OUT AT ADRIANTAMIO@GMAIL.COM.";
}

async function generateReply(message: string): Promise<string> {
  const groqKey = (process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || "").trim();
  const geminiKey = (process.env.GEMINI_API_KEY || "").trim();

  if (groqKey) {
    try {
      return await callGroq(groqKey, message);
    } catch (groqErr) {
      console.error("Groq error, checking fallback:", groqErr);
      if (geminiKey) {
        return await callGemini(geminiKey, message);
      }
      return answerFromPortfolio(message);
    }
  }

  if (geminiKey) {
    try {
      return await callGemini(geminiKey, message);
    } catch (geminiErr) {
      console.error("Gemini error, using portfolio index:", geminiErr);
      return answerFromPortfolio(message);
    }
  }

  return answerFromPortfolio(message);
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/chat", async (req, res) => {
    const { message } = req.body ?? {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "No message provided" });
    }

    try {
      const reply = await generateReply(message);
      return res.json({ reply });
    } catch (err: any) {
      console.error("Chat error:", err);
      return res.status(500).json({ error: err.message || "AI core failure" });
    }
  });

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
