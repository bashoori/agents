import { useState } from "react";

// ── Pre-fetched & pre-analyzed data (fetched by Claude, not the browser) ──────
const EMAILS = [
  {
    id: "19e6a88a5f181c15",
    subject: "Anton just messaged you",
    sender: "LinkedIn",
    senderEmail: "messaging-digest-noreply@linkedin.com",
    date: "2026-05-27T17:43:18Z",
    snippet: "1 new message awaits your response from Anton on LinkedIn.",
    category: "🔥 Job Search",
    importance: "HIGH",
    summary: "Someone named Anton sent you a message on LinkedIn — likely a recruiter or professional contact worth responding to quickly.",
    action: "Open LinkedIn and reply to Anton's message today.",
    reason: "LinkedIn messages are high-value job search touchpoints — fast replies increase connection rates.",
    draftReply: null,
  },
  {
    id: "19e6a02f836cf2ef",
    subject: "Security alert",
    sender: "Google",
    senderEmail: "no-reply@accounts.google.com",
    date: "2026-05-27T15:17:18Z",
    snippet: "You allowed Claude for Gmail access to your Google Account data.",
    category: "⚠️ Security",
    importance: "HIGH",
    summary: "Google notified you that Claude was granted Gmail access — this is expected since you just connected it, but worth verifying.",
    action: "Confirm this was you. If unexpected, revoke access at myaccount.google.com/permissions.",
    reason: "Security alerts always warrant a quick review even when expected.",
    draftReply: null,
  },
  {
    id: "19e6a273687e97f3",
    subject: "Bita, your password was successfully reset",
    sender: "LinkedIn Security",
    senderEmail: "security-noreply@linkedin.com",
    date: "2026-05-27T15:56:54Z",
    snippet: "Your LinkedIn password was successfully reset.",
    category: "⚠️ Security",
    importance: "HIGH",
    summary: "LinkedIn confirmed your password was reset successfully.",
    action: "Verify you initiated this reset. If not, secure your account immediately at linkedin.com/help.",
    reason: "Password reset confirmations are critical — if you didn't do this, account may be compromised.",
    draftReply: null,
  },
  {
    id: "19e69f5c2eba9d6e",
    subject: "Update Regarding a Mortgage Service Fee",
    sender: "RMG Mortgages",
    senderEmail: "mortgagesupport@email.rmgmortgages.ca",
    date: "2026-05-27T15:01:52Z",
    snippet: "Effective July 6, 2026, a Government Charge for Discharge fee will apply if you payout your mortgage. BC fee: $40.37.",
    category: "🏠 Finance & Personal",
    importance: "MEDIUM",
    summary: "RMG Mortgages is informing you of a new Government Charge for Discharge fee ($40.37 in BC) effective July 6, 2026 — only applies if you pay out your mortgage.",
    action: "No action needed now. Keep for reference if you plan to sell or pay out your mortgage before/after July 6.",
    reason: "Important financial info to be aware of, but no immediate action required.",
    draftReply: null,
  },
  {
    id: "19e65e169c34fd82",
    subject: "Yoga for Beginners Registration Confirmation",
    sender: "Isha USA / Sadhguru",
    senderEmail: "info@mail.ishausa.org",
    date: "2026-05-26T20:02:11Z",
    snippet: "Thank you for registering for Yoga for Beginners / Upa Yoga. Venue: Room 136, Coquitlam City Centre Library.",
    category: "🤝 Volunteering & Community",
    importance: "MEDIUM",
    summary: "Registration confirmed for a community Yoga for Beginners session at Coquitlam City Centre Library — a wellness/community event.",
    action: "Save the venue details: Room 136, Coquitlam City Centre Library. Add to calendar.",
    reason: "Community engagement and wellness activities are relevant to your volunteering interests.",
    draftReply: null,
  },
  {
    id: "19e65d2e71b1280f",
    subject: "Order Confirmation for Yoga for Beginners / Upa Yoga",
    sender: "Eventbrite",
    senderEmail: "noreply@order.eventbrite.com",
    date: "2026-05-26T19:46:19Z",
    snippet: "Your Eventbrite ticket is confirmed for Yoga for Beginners / Upa Yoga.",
    category: "🧾 Receipts & Orders",
    importance: "LOW",
    summary: "Ticket purchase receipt from Eventbrite for the Yoga for Beginners event.",
    action: "Save your ticket. No reply needed.",
    reason: "Automated receipt — low priority, just keep for reference.",
    draftReply: null,
  },
  {
    id: "19e6a6f861268b81",
    subject: "Bita, save up to 20% – your latest deals are here",
    sender: "RBC Avion Rewards",
    senderEmail: "rbcrewards@newsletters.rbc.com",
    date: "2026-05-27T17:14:08Z",
    snippet: "Spring catalogue deals + cash back on your favourite eats. 76,434 Avion pts as of April 30.",
    category: "📣 Marketing & Newsletters",
    importance: "LOW",
    summary: "RBC Avion Rewards newsletter with spring deals and your current point balance (76,434 pts).",
    action: "Skim for deals if interested, otherwise archive.",
    reason: "Marketing email — not relevant to job search or volunteering.",
    draftReply: null,
  },
];

const CAT_CONFIG = {
  "🔥 Job Search":           { color: "#f97316", bg: "#f9731612", border: "#f9731635" },
  "⚠️ Security":             { color: "#ef4444", bg: "#ef444412", border: "#ef444435" },
  "🤝 Volunteering & Community": { color: "#22c55e", bg: "#22c55e12", border: "#22c55e35" },
  "🏠 Finance & Personal":   { color: "#3b82f6", bg: "#3b82f612", border: "#3b82f635" },
  "🧾 Receipts & Orders":    { color: "#64748b", bg: "#64748b12", border: "#64748b35" },
  "📣 Marketing & Newsletters": { color: "#475569", bg: "#47556912", border: "#47556935" },
};

const IMP = {
  HIGH:   { dot: "🔴", label: "High",   color: "#ef4444" },
  MEDIUM: { dot: "🟡", label: "Medium", color: "#f59e0b" },
  LOW:    { dot: "⚪", label: "Low",    color: "#64748b" },
};

const IMP_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

function timeAgo(d) {
  const s = (Date.now() - new Date(d)) / 1000;
  if (s < 3600) return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  return `${Math.floor(s/86400)}d ago`;
}

function EmailCard({ email, idx }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const cat = CAT_CONFIG[email.category] || { color: "#94a3b8", bg: "#94a3b812", border: "#94a3b835" };
  const imp = IMP[email.importance];

  return (
    <div style={{
      background: "#0d1117",
      border: `1px solid ${open ? cat.border : "#1e293b"}`,
      borderLeft: `3px solid ${cat.color}`,
      borderRadius: 12, marginBottom: 10, overflow: "hidden",
      transition: "border-color 0.2s",
      animation: `fadeUp 0.3s ease ${idx * 0.06}s both`,
    }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: "14px 18px", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, marginTop: 2, flexShrink: 0 }}>{imp.dot}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 5, alignItems: "center" }}>
            <span style={{
              fontSize: 10, fontWeight: 700, color: cat.color,
              background: cat.bg, border: `1px solid ${cat.border}`,
              borderRadius: 100, padding: "2px 9px", fontFamily: "monospace", whiteSpace: "nowrap",
            }}>{email.category}</span>
            {email.importance === "HIGH" && (
              <span style={{
                fontSize: 10, fontWeight: 700, color: "#ef4444",
                background: "#ef444412", border: "1px solid #ef444435",
                borderRadius: 100, padding: "2px 9px", fontFamily: "monospace",
              }}>URGENT</span>
            )}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.4, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {email.subject}
          </div>
          <div style={{ fontSize: 12, color: "#475569", fontFamily: "monospace" }}>
            {email.sender} · {timeAgo(email.date)}
          </div>
        </div>
        <span style={{ color: "#334155", fontSize: 11, flexShrink: 0, marginTop: 4, transition: "transform 0.2s", display: "inline-block", transform: open ? "rotate(180deg)" : "none" }}>▼</span>
      </div>

      {open && (
        <div style={{ padding: "0 18px 18px", borderTop: "1px solid #1a2332" }}>
          <div style={{ marginTop: 14, fontSize: 13, color: "#94a3b8", lineHeight: 1.7, marginBottom: 12 }}>
            {email.snippet}
          </div>

          <div style={{ padding: "10px 13px", background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: 9, marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: cat.color, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>
              Why {imp.label} Priority
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{email.reason}</div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Summary</div>
            <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7 }}>{email.summary}</div>
          </div>

          <div style={{ padding: "10px 13px", background: "#020817", border: "1px solid #1e293b", borderRadius: 9 }}>
            <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5 }}>Recommended Action</div>
            <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500, lineHeight: 1.6 }}>→ {email.action}</div>
          </div>

          {email.draftReply && (
            <div style={{ marginTop: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 10, color: "#334155", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>Draft Reply</div>
                <button onClick={() => { navigator.clipboard.writeText(email.draftReply); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  style={{ background: copied ? "#22c55e18" : "#1e293b", border: `1px solid ${copied ? "#22c55e40" : "#334155"}`, borderRadius: 6, padding: "3px 10px", fontSize: 11, color: copied ? "#22c55e" : "#94a3b8", cursor: "pointer", fontFamily: "monospace" }}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <div style={{ background: "#020817", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 13px", fontSize: 12, color: "#94a3b8", lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>
                {email.draftReply}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DailyDigest() {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("priority");

  const categories = ["All", ...Object.keys(CAT_CONFIG)];

  const sorted = [...EMAILS]
    .filter(e => filter === "All" || e.category === filter)
    .sort((a, b) => {
      if (sort === "priority") return IMP_ORDER[a.importance] - IMP_ORDER[b.importance];
      return new Date(b.date) - new Date(a.date);
    });

  const high = EMAILS.filter(e => e.importance === "HIGH").length;
  const jobCount = EMAILS.filter(e => e.category === "🔥 Job Search").length;
  const volCount = EMAILS.filter(e => e.category === "🤝 Volunteering & Community").length;
  const secCount = EMAILS.filter(e => e.category === "⚠️ Security").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        body{background:#020817}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        .fbtn{cursor:pointer;transition:all 0.15s;font-family:'Geist Mono',monospace;background:none;border:none}
        .fbtn:hover{opacity:0.75}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
      `}</style>

      <div style={{ minHeight: "100vh", background: "#020817", color: "#e2e8f0", padding: "32px 18px", fontFamily: "'Geist Mono', monospace" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: 28, animation: "fadeUp 0.4s ease both" }}>
            <div style={{ fontSize: 10, color: "#1e3a5f", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>
              Wednesday, May 27 · ashoori.bita@gmail.com
            </div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 30, fontWeight: 400, color: "#e2e8f0", letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 4 }}>
              Daily Email Digest
            </h1>
            <p style={{ fontSize: 11, color: "#334155" }}>Fetched & analyzed by Claude · {EMAILS.length} emails today</p>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", animation: "fadeUp 0.4s ease 0.1s both" }}>
            {[
              { label: "Total", value: EMAILS.length, color: "#94a3b8" },
              { label: "Urgent", value: high, color: "#ef4444" },
              { label: "Security", value: secCount, color: "#ef4444" },
              { label: "Job Search", value: jobCount, color: "#f97316" },
              { label: "Community", value: volCount, color: "#22c55e" },
            ].map(s => (
              <div key={s.label} style={{ flex: "1 1 70px", minWidth: 70, background: "#0d1117", border: "1px solid #1e293b", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 9, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div style={{ marginBottom: 16, animation: "fadeUp 0.4s ease 0.15s both" }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {categories.map(cat => {
                const cfg = CAT_CONFIG[cat];
                const active = filter === cat;
                return (
                  <button key={cat} onClick={() => setFilter(cat)} className="fbtn"
                    style={{
                      padding: "5px 11px", borderRadius: 100, fontSize: 10,
                      background: active ? (cfg ? cfg.bg : "#1e293b") : "transparent",
                      color: active ? (cfg ? cfg.color : "#e2e8f0") : "#334155",
                      border: `1px solid ${active ? (cfg ? cfg.border : "#334155") : "#1e293b"}`,
                      fontWeight: active ? 700 : 400,
                    }}>{cat}</button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 9, color: "#334155", textTransform: "uppercase", letterSpacing: "0.1em" }}>Sort:</span>
              {["priority", "time"].map(s => (
                <button key={s} onClick={() => setSort(s)} className="fbtn"
                  style={{
                    padding: "3px 9px", borderRadius: 6, fontSize: 9,
                    background: sort === s ? "#1e293b" : "transparent",
                    color: sort === s ? "#e2e8f0" : "#334155",
                    border: `1px solid ${sort === s ? "#334155" : "#1e293b"}`,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                  }}>{s}</button>
              ))}
              <span style={{ marginLeft: "auto", fontSize: 9, color: "#1e3a5f" }}>{sorted.length} shown</span>
            </div>
          </div>

          {/* Email list */}
          {sorted.map((email, i) => <EmailCard key={email.id} email={email} idx={i} />)}

          <div style={{ textAlign: "center", marginTop: 28, fontSize: 9, color: "#1a2535", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Claude reads your Gmail · analyzes with AI · you decide what to send
          </div>
        </div>
      </div>
    </>
  );
}
