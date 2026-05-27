import { useState } from "react";

const GMAIL_MCP_URL = "https://gmailmcp.googleapis.com/mcp/v1";

const SYSTEM_PROMPT = `You are an elite AI job analysis assistant. The user will send you a job-related email. Extract the job details and analyze the role.

Return ONLY this exact format:

📧 EMAIL TYPE: [Job Offer / Recruiter Outreach / Application Update / Interview Invite / Job Alert / Other]

💼 ROLE: [Job title if found, else "Not specified"]
🏢 COMPANY: [Company name if found, else "Not specified"]
📍 LOCATION: [Location if found, else "Not specified"]

⭐ Match Score: X/10

✅ Why this role fits me:
• [point 1]
• [point 2]

⚠️ Potential risks or red flags:
• [point 1]

📝 Best cover letter focus:
[2 sentences max]

🚀 Final recommendation: Should I apply? YES or NO — [one sentence reason]

If the email is NOT actually a job opportunity (e.g. rejection, status update with no action needed), still provide the email type but set Match Score to 0/10 and Final recommendation to NO with a brief explanation.`;

const USER_PROFILE = {
  country: "",
  experience: "",
  interests: "",
};

// ─── Tiny helpers ────────────────────────────────────────────────────────────

function tag(label, color = "#6366f1") {
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 100,
      fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
      textTransform: "uppercase", background: `${color}18`, color,
      border: `1px solid ${color}30`, fontFamily: "'DM Mono', monospace",
    }}>{label}</span>
  );
}

function Spinner({ label = "Working…" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#64748b", fontSize: 13 }}>
      <div className="spin" />
      {label}
    </div>
  );
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "#0f172a", border: "1px solid #1e293b",
      borderRadius: 14, padding: 24, ...style,
    }}>{children}</div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase", color: "#334155",
      fontFamily: "'DM Mono', monospace", marginBottom: 14,
    }}>{children}</div>
  );
}

// ─── Profile form ─────────────────────────────────────────────────────────────

function ProfileForm({ profile, onChange }) {
  return (
    <Card style={{ marginBottom: 16 }}>
      <SectionLabel>Your Profile (used in every analysis)</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          { key: "country", label: "Country", placeholder: "e.g. Portugal, Germany…" },
          { key: "experience", label: "Background", placeholder: "e.g. Digital transformation, BPMN, process optimization, automation…", big: true },
          { key: "interests", label: "Target Roles", placeholder: "e.g. Project Manager, Business Analyst, Digitalization Lead…" },
        ].map(f => (
          <div key={f.key}>
            <label style={{
              display: "block", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.05em", textTransform: "uppercase",
              color: "#475569", marginBottom: 6,
              fontFamily: "'DM Mono', monospace",
            }}>{f.label}</label>
            {f.big ? (
              <textarea
                className="fi"
                rows={2}
                value={profile[f.key]}
                onChange={e => onChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={inputStyle}
              />
            ) : (
              <input
                className="fi"
                value={profile[f.key]}
                onChange={e => onChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                style={inputStyle}
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

const inputStyle = {
  width: "100%", background: "#020817",
  border: "1px solid #1e293b", borderRadius: 8,
  padding: "9px 13px", fontSize: 13, color: "#e2e8f0",
  fontFamily: "'Sora', sans-serif", resize: "vertical",
};

// ─── Email card ───────────────────────────────────────────────────────────────

function EmailCard({ email, profile, idx }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const prompt = `My profile:
• Country: ${profile.country || "Not specified"}
• Experience: ${profile.experience || "Not specified"}
• Target roles: ${profile.interests || "Not specified"}

Email subject: ${email.subject}
From: ${email.sender}
Date: ${new Date(email.date).toLocaleDateString()}

Email content:
${email.body || email.snippet}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      setAnalysis(data.content?.find(b => b.type === "text")?.text || "No analysis returned.");
    } catch {
      setAnalysis("Error during analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreMatch = analysis?.match(/Match Score:\s*(\d+)/i);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : null;
  const recMatch = analysis?.match(/Final recommendation.*?(YES|NO)/i);
  const rec = recMatch ? recMatch[1] : null;
  const recColor = rec === "YES" ? "#22c55e" : "#ef4444";
  const scoreColor = score >= 7 ? "#22c55e" : score >= 5 ? "#f59e0b" : "#ef4444";

  return (
    <Card style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 4, lineHeight: 1.4 }}>
            {email.subject || "(No subject)"}
          </div>
          <div style={{ fontSize: 12, color: "#475569", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>
            {email.sender} · {new Date(email.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </div>
          <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
            {email.snippet?.slice(0, 120)}{email.snippet?.length > 120 ? "…" : ""}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
          {score !== null && (
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700,
              color: scoreColor, background: `${scoreColor}15`,
              border: `1px solid ${scoreColor}30`, borderRadius: 100,
              padding: "3px 12px",
            }}>⭐ {score}/10</span>
          )}
          {rec && (
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700,
              color: recColor, background: `${recColor}12`,
              border: `1px solid ${recColor}25`, borderRadius: 100,
              padding: "2px 10px", textTransform: "uppercase",
            }}>{rec === "YES" ? "✓ Apply" : "✗ Skip"}</span>
          )}
        </div>
      </div>

      {!analysis && (
        <button
          onClick={analyze}
          disabled={loading}
          className="abtn"
          style={{
            marginTop: 14, width: "100%",
            background: "#6366f108", border: "1px solid #6366f130",
            borderRadius: 8, padding: "9px", fontSize: 13,
            color: "#818cf8", cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "'Sora', sans-serif", fontWeight: 600,
            opacity: loading ? 0.6 : 1, transition: "all 0.15s",
          }}
        >
          {loading ? <Spinner label="Claude is analyzing…" /> : "⚡ Analyze with Claude"}
        </button>
      )}

      {analysis && (
        <div style={{
          marginTop: 16, padding: 16, background: "#020817",
          borderRadius: 10, border: "1px solid #1e293b",
          fontSize: 13, color: "#94a3b8", lineHeight: 1.8,
          whiteSpace: "pre-wrap", fontFamily: "'Sora', sans-serif",
        }}>
          {analysis}
        </div>
      )}
    </Card>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function GmailJobAgent() {
  const [profile, setProfile] = useState({ country: "", experience: "", interests: "" });
  const [emails, setEmails] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState(null);
  const [daysBack, setDaysBack] = useState(7);
  const [tab, setTab] = useState("scan"); // "scan" | "manual"
  const [manualText, setManualText] = useState("");
  const [manualResult, setManualResult] = useState(null);
  const [manualLoading, setManualLoading] = useState(false);

  const updateProfile = (k, v) => setProfile(p => ({ ...p, [k]: v }));

  const scanEmails = async () => {
    setScanning(true); setScanError(null); setEmails(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a Gmail assistant. Use the Gmail MCP tools to search for job-related emails. Return ONLY a JSON array of objects with fields: id, subject, sender, date, snippet, body. Search for emails with keywords: job, position, opportunity, hiring, recruiter, application, vacancy, interview, offer. Filter by newer_than:" + daysBack + "d. Return at most 10 results. If no results, return []. Return ONLY valid JSON, no markdown.",
          messages: [{ role: "user", content: "Search my Gmail for job-related emails from the last " + daysBack + " days and return the results as a JSON array." }],
          mcp_servers: [{ type: "url", url: GMAIL_MCP_URL, name: "gmail" }],
        }),
      });
      const data = await res.json();

      // Extract tool results or text
      let found = [];
      const toolResults = data.content?.filter(b => b.type === "mcp_tool_result") || [];
      const textBlocks = data.content?.filter(b => b.type === "text") || [];

      if (toolResults.length > 0) {
        // Parse threads from MCP tool result
        for (const block of toolResults) {
          try {
            const raw = block.content?.[0]?.text || "{}";
            const parsed = JSON.parse(raw);
            const threads = parsed.threads || [];
            for (const t of threads) {
              const msg = t.messages?.[0];
              if (msg) {
                found.push({
                  id: msg.id,
                  subject: msg.subject || "(No subject)",
                  sender: msg.sender || "",
                  date: msg.date || new Date().toISOString(),
                  snippet: msg.snippet || "",
                  body: msg.plaintext_body || msg.snippet || "",
                });
              }
            }
          } catch {}
        }
      }

      // Fallback: try parsing text block as JSON
      if (found.length === 0 && textBlocks.length > 0) {
        for (const block of textBlocks) {
          try {
            const clean = block.text.replace(/```json|```/g, "").trim();
            const arr = JSON.parse(clean);
            if (Array.isArray(arr)) { found = arr; break; }
          } catch {}
        }
      }

      setEmails(found);
    } catch (e) {
      setScanError("Failed to scan Gmail. Make sure Gmail is connected and try again.");
    } finally {
      setScanning(false);
    }
  };

  const analyzeManual = async () => {
    setManualLoading(true); setManualResult(null);
    try {
      const prompt = `My profile:
• Country: ${profile.country || "Not specified"}
• Experience: ${profile.experience || "Not specified"}
• Target roles: ${profile.interests || "Not specified"}

Job posting / Email:
${manualText}`;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      setManualResult(data.content?.find(b => b.type === "text")?.text || "No result.");
    } catch {
      setManualResult("Error. Please try again.");
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;600&family=Sora:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020817; }
        .spin {
          width: 14px; height: 14px; flex-shrink: 0;
          border: 2px solid #1e293b; border-top-color: #6366f1;
          border-radius: 50%; animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fi:focus { outline: none; border-color: #6366f1 !important; }
        .abtn:hover:not(:disabled) { background: #6366f115 !important; border-color: #6366f160 !important; }
        .tab { cursor: pointer; transition: all 0.15s; border-bottom: 2px solid transparent; }
        .tab.active { border-bottom-color: #6366f1; color: #818cf8 !important; }
        select { appearance: none; }
        select:focus { outline: none; border-color: #6366f1 !important; }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#020817",
        fontFamily: "'Sora', sans-serif", color: "#e2e8f0", padding: "36px 20px",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ marginBottom: 10, display: "flex", gap: 8, alignItems: "center" }}>
              {tag("Gmail Connected", "#22c55e")}
              {tag("Claude Powered", "#6366f1")}
            </div>
            <h1 style={{
              fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: 6,
            }}>Job Email Agent</h1>
            <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.6 }}>
              Scans your Gmail for job opportunities and analyzes each one with Claude — match score, red flags, and apply/skip recommendation.
            </p>
          </div>

          {/* Profile */}
          <ProfileForm profile={profile} onChange={updateProfile} />

          {/* Tabs */}
          <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #1e293b", marginBottom: 20 }}>
            {[["scan", "📥 Scan Gmail"], ["manual", "✍️ Manual Analysis"]].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={`tab${tab === k ? " active" : ""}`}
                style={{
                  background: "none", border: "none", color: tab === k ? "#818cf8" : "#475569",
                  fontSize: 13, fontWeight: 600, padding: "10px 0", cursor: "pointer",
                  fontFamily: "'Sora', sans-serif",
                }}>
                {l}
              </button>
            ))}
          </div>

          {/* Scan tab */}
          {tab === "scan" && (
            <>
              <Card style={{ marginBottom: 16 }}>
                <SectionLabel>Scan Settings</SectionLabel>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <label style={{ display: "block", fontSize: 11, color: "#475569", marginBottom: 6, fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                      Look back
                    </label>
                    <select
                      value={daysBack}
                      onChange={e => setDaysBack(Number(e.target.value))}
                      className="fi"
                      style={{ ...inputStyle, width: "auto", minWidth: 140 }}
                    >
                      {[1, 3, 7, 14, 30].map(d => (
                        <option key={d} value={d}>Last {d} day{d > 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={scanEmails}
                    disabled={scanning}
                    style={{
                      background: "#6366f1", border: "none", borderRadius: 9,
                      padding: "10px 22px", fontSize: 13, fontWeight: 600,
                      color: "#fff", cursor: scanning ? "not-allowed" : "pointer",
                      opacity: scanning ? 0.6 : 1, fontFamily: "'Sora', sans-serif",
                      marginTop: 20, transition: "all 0.15s",
                    }}
                  >
                    {scanning ? "Scanning…" : "🔍 Scan Now"}
                  </button>
                </div>
              </Card>

              {scanning && (
                <Card style={{ marginBottom: 16 }}>
                  <Spinner label="Scanning Gmail for job emails…" />
                </Card>
              )}
              {scanError && (
                <Card style={{ marginBottom: 16 }}>
                  <div style={{ color: "#ef4444", fontSize: 13 }}>{scanError}</div>
                </Card>
              )}
              {emails !== null && !scanning && (
                <>
                  <div style={{
                    fontSize: 12, color: "#475569", marginBottom: 14,
                    fontFamily: "'DM Mono', monospace",
                  }}>
                    {emails.length === 0
                      ? "No job-related emails found in this period."
                      : `Found ${emails.length} job-related email${emails.length > 1 ? "s" : ""}`}
                  </div>
                  {emails.map((email, i) => (
                    <EmailCard key={email.id || i} email={email} profile={profile} idx={i} />
                  ))}
                </>
              )}
            </>
          )}

          {/* Manual tab */}
          {tab === "manual" && (
            <Card>
              <SectionLabel>Paste Job Posting or Email</SectionLabel>
              <textarea
                className="fi"
                value={manualText}
                onChange={e => setManualText(e.target.value)}
                placeholder="Paste the full job description or recruiter email here…"
                rows={10}
                style={{ ...inputStyle, width: "100%", marginBottom: 14 }}
              />
              <button
                onClick={analyzeManual}
                disabled={manualLoading || !manualText.trim()}
                style={{
                  width: "100%", background: "#6366f1", border: "none",
                  borderRadius: 9, padding: "11px", fontSize: 14,
                  fontWeight: 600, color: "#fff",
                  cursor: manualLoading || !manualText.trim() ? "not-allowed" : "pointer",
                  opacity: manualLoading || !manualText.trim() ? 0.5 : 1,
                  fontFamily: "'Sora', sans-serif", transition: "all 0.15s",
                }}
              >
                {manualLoading ? "Analyzing…" : "⚡ Analyze with Claude"}
              </button>
              {manualLoading && <div style={{ marginTop: 16 }}><Spinner label="Claude is analyzing…" /></div>}
              {manualResult && (
                <div style={{
                  marginTop: 16, padding: 16, background: "#020817",
                  borderRadius: 10, border: "1px solid #1e293b",
                  fontSize: 13, color: "#94a3b8", lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                }}>
                  {manualResult}
                </div>
              )}
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
