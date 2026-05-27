import { useState, useRef } from "react";

const SYSTEM_PROMPT = `You are an elite AI job analysis assistant. Analyze job postings with precision, honesty, and strategic insight.

The user will provide their profile and a job posting. Return your analysis in EXACTLY this format (use the exact emoji and labels):

⭐ Match Score: X/10

✅ Why this role fits me:
• [point 1]
• [point 2]
• [point 3]

⚠️ Potential risks or red flags:
• [point 1]
• [point 2]

📝 Best cover letter focus:
[Write exactly 2 sentences focused on their strongest angle]

🚀 Final recommendation: Should I apply? [YES or NO] — [one sentence reason]

Be direct, specific, and genuinely helpful. Do not pad the response.`;

const FIELDS = [
  { key: "country", label: "Your Country", placeholder: "e.g. Germany, Portugal, Netherlands…", type: "input" },
  { key: "experience", label: "Your Background", placeholder: "e.g. 6 years in digital transformation, BPMN, process optimization, automation, IT process management…", type: "textarea" },
  { key: "interests", label: "Target Roles", placeholder: "e.g. Project Manager, Business Analyst, Digitalization Lead, Process Consultant…", type: "input" },
  { key: "jobPosting", label: "Job Posting", placeholder: "Paste the full job description here…", type: "textarea", large: true },
];

function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#94a3b8", fontSize: 14 }}>
      <div className="spinner" />
      Claude is analyzing the role…
    </div>
  );
}

function ScoreBadge({ score }) {
  const color = score >= 7 ? "#22c55e" : score >= 5 ? "#f59e0b" : "#ef4444";
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: `${color}18`, border: `1.5px solid ${color}40`,
      borderRadius: 100, padding: "4px 16px", marginBottom: 20,
    }}>
      <span style={{ fontSize: 22 }}>⭐</span>
      <span style={{ fontSize: 18, fontWeight: 700, color, fontFamily: "'DM Mono', monospace" }}>
        {score}/10
      </span>
    </div>
  );
}

function ResultBlock({ text }) {
  const lines = text.split("\n").filter(l => l.trim());
  let score = null;
  const scoreMatch = text.match(/Match Score:\s*(\d+)/i);
  if (scoreMatch) score = parseInt(scoreMatch[1]);

  const recommendMatch = text.match(/Final recommendation.*?(YES|NO)/i);
  const recommend = recommendMatch ? recommendMatch[1] : null;
  const recColor = recommend === "YES" ? "#22c55e" : "#ef4444";

  const sections = [];
  let current = null;
  for (const line of lines) {
    if (line.startsWith("⭐")) {
      sections.push({ type: "score", text: line });
    } else if (line.startsWith("✅") || line.startsWith("⚠️") || line.startsWith("📝") || line.startsWith("🚀")) {
      if (current) sections.push(current);
      current = { type: "section", header: line, bullets: [] };
    } else if (line.startsWith("•") && current) {
      current.bullets.push(line.slice(1).trim());
    } else if (current) {
      current.bullets.push(line);
    }
  }
  if (current) sections.push(current);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {score !== null && <ScoreBadge score={score} />}
      {sections.filter(s => s.type === "section").map((s, i) => {
        const isRec = s.header.includes("🚀");
        return (
          <div key={i} style={{
            padding: "16px 0",
            borderBottom: i < sections.filter(x => x.type === "section").length - 1 ? "1px solid #1e293b" : "none",
          }}>
            <div style={{
              fontWeight: 700, fontSize: 13, letterSpacing: "0.04em",
              textTransform: "uppercase", color: isRec ? recColor : "#cbd5e1",
              marginBottom: 10, fontFamily: "'DM Mono', monospace",
            }}>
              {s.header}
            </div>
            {s.bullets.map((b, j) => (
              <div key={j} style={{
                fontSize: 14, color: isRec ? recColor : "#94a3b8",
                lineHeight: 1.7, paddingLeft: s.bullets.length > 1 ? 12 : 0,
                fontWeight: isRec ? 600 : 400,
              }}>
                {s.bullets.length > 1 ? `→ ${b}` : b}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function JobAgent() {
  const [form, setForm] = useState({ country: "", experience: "", interests: "", jobPosting: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const filled = Object.values(form).every(v => v.trim().length > 10);

  const analyze = async () => {
    setLoading(true); setError(null); setResult(null);
    try {
      const userPrompt = `My profile:
• Based in: ${form.country}
• Experience: ${form.experience}
• Target roles: ${form.interests}

Job posting:
${form.jobPosting}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: userPrompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "";
      setResult(text);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #020817; }
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid #1e293b;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .field-input:focus { outline: none; border-color: #6366f1 !important; }
        .analyze-btn:hover:not(:disabled) { background: #4f46e5 !important; transform: translateY(-1px); }
        .analyze-btn:disabled { opacity: 0.45; cursor: not-allowed; }
        .analyze-btn { transition: all 0.15s ease; }
        .tag { 
          display: inline-block; padding: 2px 10px; border-radius: 100px;
          font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; background: #6366f118; color: #818cf8;
          border: 1px solid #6366f130; font-family: 'DM Mono', monospace;
        }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "#020817",
        fontFamily: "'Sora', sans-serif", color: "#e2e8f0",
        padding: "40px 20px",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ marginBottom: 12 }}>
              <span className="tag">AI-powered</span>
            </div>
            <h1 style={{
              fontSize: 32, fontWeight: 700, letterSpacing: "-0.02em",
              background: "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: 8,
            }}>
              Job Match Agent
            </h1>
            <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.6 }}>
              Paste any job posting. Get an instant fit analysis, red flags, and a cover letter angle — powered by Claude.
            </p>
          </div>

          {/* Form */}
          <div style={{
            background: "#0f172a", border: "1px solid #1e293b",
            borderRadius: 16, padding: "28px", marginBottom: 16,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {FIELDS.map(f => (
                <div key={f.key}>
                  <label style={{
                    display: "block", fontSize: 12, fontWeight: 600,
                    letterSpacing: "0.06em", textTransform: "uppercase",
                    color: "#64748b", marginBottom: 8,
                    fontFamily: "'DM Mono', monospace",
                  }}>{f.label}</label>
                  {f.type === "input" ? (
                    <input
                      className="field-input"
                      value={form[f.key]}
                      onChange={e => update(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      style={{
                        width: "100%", background: "#020817",
                        border: "1px solid #1e293b", borderRadius: 10,
                        padding: "10px 14px", fontSize: 14, color: "#e2e8f0",
                        fontFamily: "'Sora', sans-serif",
                      }}
                    />
                  ) : (
                    <textarea
                      className="field-input"
                      value={form[f.key]}
                      onChange={e => update(f.key, e.target.value)}
                      placeholder={f.placeholder}
                      rows={f.large ? 10 : 3}
                      style={{
                        width: "100%", background: "#020817",
                        border: "1px solid #1e293b", borderRadius: 10,
                        padding: "10px 14px", fontSize: 14, color: "#e2e8f0",
                        fontFamily: "'Sora', sans-serif", resize: "vertical",
                        lineHeight: 1.6,
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            className="analyze-btn"
            onClick={analyze}
            disabled={!filled || loading}
            style={{
              width: "100%", background: "#6366f1", border: "none",
              borderRadius: 10, padding: "14px", fontSize: 15, fontWeight: 600,
              color: "#fff", cursor: "pointer", marginBottom: 32,
              fontFamily: "'Sora', sans-serif", letterSpacing: "-0.01em",
            }}
          >
            {loading ? "Analyzing…" : "⚡ Analyze This Role"}
          </button>

          {/* Result */}
          {(loading || result || error) && (
            <div ref={resultRef} style={{
              background: "#0f172a", border: "1px solid #1e293b",
              borderRadius: 16, padding: "28px",
              animation: "fadeIn 0.3s ease",
            }}>
              <div style={{
                fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "#334155",
                fontFamily: "'DM Mono', monospace", marginBottom: 20,
              }}>Analysis Result</div>

              {loading && <Spinner />}
              {error && <div style={{ color: "#ef4444", fontSize: 14 }}>{error}</div>}
              {result && <ResultBlock text={result} />}
            </div>
          )}

        </div>
      </div>
    </>
  );
}
