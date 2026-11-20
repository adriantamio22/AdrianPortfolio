import "dotenv/config";
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

async function callGroq(message: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");

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
