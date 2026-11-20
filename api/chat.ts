import { GoogleGenAI } from "@google/genai";

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

  const models = ["gemini-4-hydrogen", "gemini-2.5-flash"];
  let lastErr: unknown;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: message,
        config: {
          systemInstruction: SYSTEM_PROMPT,
        },
      });
      const text = response.text?.trim();
      return text || "PROTOCOL_ERROR: EMPTY_RESPONSE.";
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error("Gemini request failed");
}

function answerFromPortfolio(message: string): string {
  const q = message.toLowerCase().trim();

  if (/^(hi|hello|hey|yo|sup|greetings|good\s+(morning|afternoon|evening))\b/.test(q)) {
    return "SYSTEM_ONLINE: ADRIAN TAMIO PORTFOLIO CORE READY. ASK ABOUT HIS ROLE, SKILLS, TOOLS, CERTIFICATIONS, SCAM SCANNER, OR CONTACT INFO.";
  }
  if (/thank|thanks|thx|appreciate/.test(q)) {
    return "ACKNOWLEDGED. STANDING BY FOR FURTHER QUERIES — OR REACH ADRIAN AT ADRIANTAMIO@GMAIL.COM.";
  }
  if (/scam\s*scanner|virustotal|abuseipdb|mailboxvalidator|mailbox|url\s*analysis|ip\s*reputation/.test(q)) {
    return "PROJECT [SCAM SCANNER]: MULTI-VECTOR THREAT ANALYZER WITH REAL-TIME URL ANALYSIS, MAILBOX FORENSICS, IP REPUTATION CHECKING, MALWARE CHECKING, AND PHISHING PATTERN DETECTION. BUILT WITH REACT, MAILBOXVALIDATOR, VIRUSTOTAL API, AND ABUSEIPDB. LIVE: https://scam-scanner1.vercel.app/";
  }
  if (/project|portfolio|built|build|app|work\b/.test(q)) {
    return "FEATURED_PROJECT: SCAM SCANNER — AN ADVANCED MULTI-VECTOR THREAT ANALYZER (URL, MAILBOX, IP, MALWARE & PHISHING ANALYSIS) BUILT WITH REACT, MAILBOXVALIDATOR, VIRUSTOTAL API & ABUSEIPDB. LIVE AT: https://scam-scanner1.vercel.app/";
  }
  if (/cert|qualys|fortinet|sc-200|az-900|proofpoint|validation|credential|license/.test(q)) {
    return "CERTIFICATIONS: GOOGLE CYBERSECURITY PROFESSIONAL CERTIFICATE, MICROSOFT SECURITY OPERATIONS ANALYST (SC-200), AWS CLOUD PRACTITIONER ESSENTIALS, QUALYS ENDPOINT DETECTION AND RESPONSE, FORTINET CERTIFIED ASSOCIATE (CYBERSECURITY), PROOFPOINT CERTIFIED AI DATA SECURITY SPECIALIST 2025, MICROSOFT AZURE FUNDAMENTALS (AZ-900).";
  }
  if (/wazuh|sentinelone|sentinel|defender|intune|entra|active directory|abnormal|jira|siem|edr|ticket/.test(q)) {
    return "OPERATIONAL_TOOLKIT: WAZUH SIEM, SENTINELONE (EDR), MICROSOFT DEFENDER, MS INTUNE, ENTRA ID / ACTIVE DIRECTORY, ABNORMAL AI, JIRA PROJECT ADMIN, AND REMOTE SUPPORT TOOLS — USED DAILY FOR DEFENSIVE MONITORING, INCIDENT TRIAGE, AND MICROSOFT ECOSYSTEM SUPPORT.";
  }
  if (/microsoft|m365|365|azure|aws|cloud/.test(q)) {
    return "CLOUD & MICROSOFT: EXPERIENCED IN MICROSOFT 365 TROUBLESHOOTING, ENTRA ID / ACTIVE DIRECTORY ADMIN, MS INTUNE, MICROSOFT DEFENDER, AZURE (AZ-900 & SC-200 CERTIFIED), AND AWS (CLOUD PRACTITIONER ESSENTIALS).";
  }
  if (/interest|hobby|hobbies|ctf|beyond|outside|free time|fun/.test(q)) {
    return "EXPLORATION: CTF CHALLENGES, OPEN SOURCE SECURITY TOOLS, CLOUD ARCHITECTURE, AND AI ETHICS IN SECURITY.";
  }
  if (/skill|security|support|it\b|incident|phishing|threat|hunt|vulnerab|monitor|defens|desktop|remote/.test(q)) {
    return "SKILLS: [SECURITY] INCIDENT RESPONSE & PHISHING DEFENSE, DEFENSIVE MONITORING, THREAT HUNTING, VULNERABILITY MANAGEMENT, EDR | [IT SUPPORT] MICROSOFT ENVIRONMENT TROUBLESHOOTING, TICKETING & INCIDENT MANAGEMENT, EMAIL TECH SUPPORT, ENTRA ID/AD ADMIN, REMOTE DESKTOP SUPPORT.";
  }
  if (/tool|stack|tech|software|platform/.test(q)) {
    return "TOOLS: WAZUH SIEM, SENTINELONE, MICROSOFT DEFENDER, MS INTUNE, ENTRA ID / ACTIVE DIRECTORY, ABNORMAL AI, JIRA PROJECT ADMIN, REMOTE SUPPORT TOOLS.";
  }
  if (/available|hire|hiring|open to|freelance|collaborat|opportunity|resume|cv/.test(q)) {
    return "AVAILABILITY: AVAILABLE FOR COLLABORATIONS ON SECURITY INFRASTRUCTURE, THREAT HUNTING, OR ENTERPRISE TECHNICAL SUPPORT. REACH OUT AT ADRIANTAMIO@GMAIL.COM OR https://www.linkedin.com/in/adrian-t-41019727b/";
  }
  if (/contact|email|mail|linkedin|reach|connect|social|message/.test(q)) {
    return "CONTACT: ADRIANTAMIO@GMAIL.COM | LINKEDIN: https://www.linkedin.com/in/adrian-t-41019727b/";
  }
  if (/who|adrian|about|bio|role|job|title|name|background|experience|summary|tell me/.test(q)) {
    return "IDENTITY: ADRIAN TAMIO — CYBERSECURITY ANALYST & IT SUPPORT SPECIALIZING IN DEFENSIVE MONITORING (WAZUH, SENTINELONE), INCIDENT RESPONSE, AND MICROSOFT ENTERPRISE OPERATIONS (M365, ENTRA ID, INTUNE, JIRA).";
  }

  return "DATA_NOT_IN_INDEX: THAT DETAIL IS NOT LISTED IN THE PORTFOLIO ARCHIVE. CONTACT ADRIAN AT ADRIANTAMIO@GMAIL.COM — OR ASK ABOUT HIS SKILLS, TOOLS, CERTIFICATIONS, OR SCAM SCANNER.";
}

async function generateReply(message: string): Promise<{ reply: string; provider: string }> {
  const groqKey = (process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || "").trim();
  const geminiKey = (process.env.GEMINI_API_KEY || "").trim();

  if (groqKey) {
    try {
      return { reply: await callGroq(groqKey, message), provider: "groq" };
    } catch (groqErr) {
      if (geminiKey) {
        return { reply: await callGemini(geminiKey, message), provider: "gemini" };
      }
      throw groqErr;
    }
  }

  if (geminiKey) {
    return { reply: await callGemini(geminiKey, message), provider: "gemini" };
  }

  return { reply: answerFromPortfolio(message), provider: "local-index" };
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body: any = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
  } catch {
    return res.status(400).json({ error: "Invalid JSON body" });
  }

  const { message } = body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const { reply, provider } = await generateReply(message);
    res.setHeader("X-AI-Provider", provider);
    return res.status(200).json({ reply });
  } catch (err: any) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: err.message || "AI core failure" });
  }
}
