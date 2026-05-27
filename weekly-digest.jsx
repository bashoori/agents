import { useState } from "react";

const EMAILS = [
  {
    id: "19e50d9a57a23183",
    subject: "RE - BI Reporting with SSRS and SSAS",
    sender: "Bill @ Rephers",
    senderEmail: "bill@rephers.com",
    date: "2026-05-22T18:01:39Z",
    category: "🔥 Job Search",
    importance: "HIGH",
    summary: "Recruiter Bill sent you a direct job lead for a BI Reporting role using SSRS and SSAS with a Quick Apply link at kloudhire.com.",
    action: "Review the JD at kloudhire.com/jobs/view/14616/1093446 and apply via Quick Apply if relevant.",
    reason: "Direct recruiter outreach with a specific job link — highest job search priority, needs action today.",
    draftReply: "Hi Bill,\n\nThank you for reaching out! I've reviewed the job description and I'm very interested in the BI Reporting role. I'll go ahead and apply through the Quick Apply link.\n\nPlease feel free to reach out if you need anything further from my end.\n\nBest regards,\nBita Ashoori",
  },
  {
    id: "19e52e414f9e587b",
    subject: "Bita, please verify your new device",
    sender: "LinkedIn Security",
    senderEmail: "security-noreply@linkedin.com",
    date: "2026-05-23T03:32:19Z",
    category: "⚠️ Security",
    importance: "HIGH",
    summary: "LinkedIn sent a new device verification request — someone (likely you) logged in from a new device and needs to verify it.",
    action: "If this was you logging in from a new device, verify it in LinkedIn. If not, change your password immediately.",
    reason: "Security verification on your job search platform must not be ignored — unverified devices can lock you out.",
    draftReply: null,
  },
  {
    id: "19e52ee9d3134523",
    subject: "Your Glassdoor and Indeed profiles are now synced",
    sender: "Glassdoor",
    senderEmail: "noreply@glassdoor.com",
    date: "2026-05-23T03:43:49Z",
    category: "🔥 Job Search",
    importance: "HIGH",
    summary: "Your Glassdoor and Indeed profiles have been successfully synced — your job search profile is now visible on both platforms simultaneously.",
    action: "Review your synced profile on both Glassdoor and Indeed to make sure all information is current and accurate.",
    reason: "Profile sync means recruiters on both platforms can now find you — ensure it looks polished.",
    draftReply: null,
  },
  {
    id: "19e64d21cd40943a",
    subject: "Invitation: Applied AI - system design club @ Thu May 28",
    sender: "ELTF (Vancouveranalyticsboard)",
    senderEmail: "eltf@vancouveranalyticsboard.com",
    date: "2026-05-26T15:05:51Z",
    category: "📅 Events & Networking",
    importance: "HIGH",
    summary: "You've been invited to an Applied AI / System Design Club session THIS THURSDAY May 28, 6:30–7:30 PM PDT — from the Vancouver Analytics community.",
    action: "URGENT — decide by today: accept or decline the calendar invite for tomorrow Thu May 28 at 6:30 PM PDT.",
    reason: "Event is TOMORROW — networking in AI/tech directly supports your job search and is time-sensitive.",
    draftReply: "Hi,\n\nThank you for the invitation to the Applied AI – System Design Club session! I'd love to join this Thursday.\n\nLooking forward to connecting with the team.\n\nBest,\nBita",
  },
  {
    id: "19e64fbe97937558",
    subject: "Your Volunteer Details @WomenWhoCode Summit",
    sender: "WomenWhoCode Summit",
    senderEmail: "registrations@bizzabo.com",
    date: "2026-05-26T15:51:29Z",
    category: "🤝 Volunteering",
    importance: "HIGH",
    summary: "WomenWhoCode Summit confirmed you're on the volunteer list for next week (June 2-4). You need to pick your timing slot. Your role is social media volunteer — capturing sessions and speakers.",
    action: "Pick your volunteer timing slot NOW using the link in the email. Also consider sharing the invite with your network.",
    reason: "Action required before the summit — timing slot not picked yet, and the event is next week.",
    draftReply: null,
  },
  {
    id: "19e604b9fe52f2e9",
    subject: "Your Volunteer Timing @WomenWhoCode Summit",
    sender: "WomenWhoCode Summit",
    senderEmail: "registrations@bizzabo.com",
    date: "2026-05-25T18:00:27Z",
    category: "🤝 Volunteering",
    importance: "HIGH",
    summary: "First reminder from WomenWhoCode to select your volunteer timing slot for the summit. You're confirmed as a volunteer but haven't picked your slot yet.",
    action: "Select your timing slot immediately — this is the second reminder and the event is next week.",
    reason: "Repeated reminders mean this is time-sensitive. Not selecting a slot may remove you from the volunteer roster.",
    draftReply: null,
  },
  {
    id: "19e6a273687e97f3",
    subject: "Bita, your password was successfully reset",
    sender: "LinkedIn Security",
    senderEmail: "security-noreply@linkedin.com",
    date: "2026-05-27T15:56:54Z",
    category: "⚠️ Security",
    importance: "HIGH",
    summary: "LinkedIn confirmed a password reset was completed on your account.",
    action: "Verify this was you. If unexpected, contact LinkedIn support immediately at linkedin.com/help.",
    reason: "Password resets on your primary job search platform are critical security events.",
    draftReply: null,
  },
  {
    id: "19e6a02f836cf2ef",
    subject: "Security alert — Claude for Gmail access granted",
    sender: "Google",
    senderEmail: "no-reply@accounts.google.com",
    date: "2026-05-27T15:17:18Z",
    category: "⚠️ Security",
    importance: "MEDIUM",
    summary: "Google notified you that Claude was granted access to your Gmail account — this is expected from today's setup.",
    action: "No action needed if you authorized this. You can review permissions anytime at myaccount.google.com/permissions.",
    reason: "Expected from your Claude Gmail setup today — medium priority just to keep on record.",
    draftReply: null,
  },
  {
    id: "19e6a88a5f181c15",
    subject: "Anton just messaged you",
    sender: "LinkedIn",
    senderEmail: "messaging-digest-noreply@linkedin.com",
    date: "2026-05-27T17:43:18Z",
    category: "🔥 Job Search",
    importance: "HIGH",
    summary: "Someone named Anton sent you a LinkedIn message — likely a recruiter or professional contact.",
    action: "Open LinkedIn and reply to Anton today. Fast replies to recruiters increase your chances significantly.",
    reason: "Unread LinkedIn messages from unknown contacts during an active job search are almost always opportunities.",
    draftReply: null,
  },
  {
    id: "19e5c438086880f5",
    subject: "Your Canoo Verification Week Has Started",
    sender: "Canoo",
    senderEmail: "canoo@newsletter.canoo.ca",
    date: "2026-05-24T23:13:08Z",
    category: "🔥 Job Search",
    importance: "MEDIUM",
    summary: "Canoo opened your dedicated verification window starting May 25 — you may need to verify your profile or application.",
    action: "Log in to Canoo and complete any required verification steps before the window closes.",
    reason: "Job platform verification windows are time-limited — missing it could affect your application visibility.",
    draftReply: null,
  },
  {
    id: "19e65e169c34fd82",
    subject: "Yoga for Beginners Registration Confirmation",
    sender: "Isha USA",
    senderEmail: "info@mail.ishausa.org",
    date: "2026-05-26T20:02:11Z",
    category: "🤝 Volunteering & Community",
    importance: "MEDIUM",
    summary: "Confirmed registration for Yoga for Beginners / Upa Yoga at Room 136, Coquitlam City Centre Library.",
    action: "Add to calendar. Venue: Room 136, Coquitlam City Centre Library.",
    reason: "Community wellness event relevant to your personal well-being and community engagement.",
    draftReply: null,
  },
  {
    id: "19e69f5c2eba9d6e",
    subject: "Update Regarding a Mortgage Service Fee",
    sender: "RMG Mortgages",
    senderEmail: "mortgagesupport@email.rmgmortgages.ca",
    date: "2026-05-27T15:01:52Z",
    category: "🏠 Finance & Personal",
    importance: "MEDIUM",
    summary: "New Government Charge for Discharge fee ($40.37 in BC) applies from July 6, 2026 if you pay out your mortgage.",
    action: "No action needed now. Keep for reference if selling or refinancing.",
    reason: "Important financial notice to be aware of but no immediate action required.",
    draftReply: null,
  },
  {
    id: "19e587bbfde43834",
    subject: "Your RBC Royal Bank eStatement is ready",
    sender: "RBC",
    senderEmail: "ibanking@ib.rbc.com",
    date: "2026-05-24T05:36:02Z",
    category: "🏠 Finance & Personal",
    importance: "MEDIUM",
    summary: "Your RBC Visa statement ending in 9495 is available online.",
    action: "Log in to RBC Online Banking to review your statement.",
    reason: "Monthly statement review is good financial hygiene, especially while managing finances during job search.",
    draftReply: null,
  },
];

const CAT = {
  "🔥 Job Search":              { color: "#f97316", bg: "#f9731610", border: "#f9731635" },
  "⚠️ Security":                { color: "#ef4444", bg: "#ef444410", border: "#ef444435" },
  "🤝 Volunteering":            { color: "#22c55e", bg: "#22c55e10", border: "#22c55e35" },
  "🤝 Volunteering & Community":{ color: "#22c55e", bg: "#22c55e10", border: "#22c55e35" },
  "📅 Events & Networking":     { color: "#3b82f6", bg: "#3b82f610", border: "#3b82f635" },
  "🏠 Finance & Personal":      { color: "#6366f1", bg: "#6366f110", border: "#6366f135" },
};
const IMP = { HIGH: "🔴", MEDIUM: "🟡", LOW: "⚪" };
const IMP_ORDER = { HIGH: 0, MEDIUM: 1, LOW: 2 };

function fmt(d) {
  return new Date(d).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

function EmailCard({ e, idx }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const c = CAT[e.category] || { color: "#94a3b8", bg: "#94a3b810", border: "#94a3b830" };
  return (
    <div style={{
      background: "#0d1117", border: `1px solid ${open ? c.border : "#1e293b"}`,
      borderLeft: `3px solid ${c.color}`, borderRadius: 12, marginBottom: 9,
      overflow: "hidden", transition: "border-color 0.2s",
      animation: `up 0.3s ease ${idx * 0.05}s both`,
    }}>
      <div onClick={() => setOpen(o => !o)} style={{ padding: "13px 16px", cursor: "pointer", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 11, marginTop: 1, flexShrink: 0 }}>{IMP[e.importance]}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 4, alignItems: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: c.color, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 100, padding: "2px 8px", whiteSpace: "nowrap" }}>
              {e.category}
            </span>
            {e.importance === "HIGH" && (
              <span style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", background: "#ef444410", border: "1px solid #ef444430", borderRadius: 100, padding: "2px 8px" }}>URGENT</span>
            )}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", lineHeight: 1.4, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.subject}</div>
          <div style={{ fontSize: 11, color: "#475569", fontFamily: "monospace" }}>{e.sender} · {fmt(e.date)}</div>
        </div>
        <span style={{ color: "#334155", fontSize: 10, flexShrink: 0, marginTop: 3, transition: "transform 0.2s", display: "inline-block", transform: open ? "rotate(180deg)" : "none" }}>▼</span>
      </div>

      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1a2332" }}>
          <div style={{ marginTop: 12, fontSize: 13, color: "#94a3b8", lineHeight: 1.7, marginBottom: 12 }}>{e.summary}</div>
          <div style={{ padding: "9px 12px", background: c.bg, border: `1px solid ${c.border}`, borderRadius: 8, marginBottom: 10 }}>
            <div style={{ fontSize: 9, color: c.color, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Why {e.importance} Priority</div>
            <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6 }}>{e.reason}</div>
          </div>
          <div style={{ padding: "9px 12px", background: "#020817", border: "1px solid #1e293b", borderRadius: 8, marginBottom: e.draftReply ? 10 : 0 }}>
            <div style={{ fontSize: 9, color: "#334155", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Action</div>
            <div style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500, lineHeight: 1.6 }}>→ {e.action}</div>
          </div>
          {e.draftReply && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ fontSize: 9, color: "#334155", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em" }}>Draft Reply</div>
                <button onClick={() => { navigator.clipboard.writeText(e.draftReply); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  style={{ background: copied ? "#22c55e18" : "#1e293b", border: `1px solid ${copied ? "#22c55e40" : "#334155"}`, borderRadius: 5, padding: "3px 9px", fontSize: 10, color: copied ? "#22c55e" : "#94a3b8", cursor: "pointer", fontFamily: "monospace" }}>
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
              <div style={{ background: "#020817", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#94a3b8", lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{e.draftReply}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function WeeklyDigest() {
  const [filter, setFilter] = useState("All");
  const [impFilter, setImpFilter] = useState("All");

  const cats = ["All", ...Object.keys(CAT)];
  const imps = ["All", "HIGH", "MEDIUM"];

  const filtered = [...EMAILS]
    .filter(e => (filter === "All" || e.category === filter) && (impFilter === "All" || e.importance === impFilter))
    .sort((a, b) => IMP_ORDER[a.importance] - IMP_ORDER[b.importance] || new Date(b.date) - new Date(a.date));

  const counts = {
    job: EMAILS.filter(e => e.category === "🔥 Job Search").length,
    vol: EMAILS.filter(e => e.category.includes("Volunteer")).length,
    sec: EMAILS.filter(e => e.category === "⚠️ Security").length,
    events: EMAILS.filter(e => e.category === "📅 Events & Networking").length,
    high: EMAILS.filter(e => e.importance === "HIGH").length,
    drafts: EMAILS.filter(e => e.draftReply).length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0} body{background:#020817}
        @keyframes up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fb{cursor:pointer;transition:all 0.15s;font-family:'Geist Mono',monospace;background:none}
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:#1e293b;border-radius:2px}
      `}</style>
      <div style={{ minHeight: "100vh", background: "#020817", color: "#e2e8f0", padding: "30px 16px", fontFamily: "'Geist Mono', monospace" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>

          {/* Header */}
          <div style={{ marginBottom: 24, animation: "up 0.4s ease both" }}>
            <div style={{ fontSize: 9, color: "#1e3a5f", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8 }}>
              May 21 – May 27, 2026 · ashoori.bita@gmail.com
            </div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: 28, fontWeight: 400, color: "#e2e8f0", lineHeight: 1.1, marginBottom: 4 }}>
              7-Day Important Emails
            </h1>
            <p style={{ fontSize: 10, color: "#334155" }}>{EMAILS.length} important emails · filtered & analyzed by Claude</p>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 7, marginBottom: 22, flexWrap: "wrap", animation: "up 0.4s ease 0.08s both" }}>
            {[
              { label: "Urgent", value: counts.high, color: "#ef4444" },
              { label: "Job Search", value: counts.job, color: "#f97316" },
              { label: "Volunteering", value: counts.vol, color: "#22c55e" },
              { label: "Networking", value: counts.events, color: "#3b82f6" },
              { label: "Security", value: counts.sec, color: "#ef4444" },
              { label: "Drafts Ready", value: counts.drafts, color: "#6366f1" },
            ].map(s => (
              <div key={s.label} style={{ flex: "1 1 65px", minWidth: 65, background: "#0d1117", border: "1px solid #1e293b", borderRadius: 10, padding: "9px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 19, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 8, color: "#334155", textTransform: "uppercase", letterSpacing: "0.07em", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* ⚡ Action banner */}
          <div style={{ background: "#f9731608", border: "1px solid #f9731625", borderRadius: 10, padding: "12px 14px", marginBottom: 18, animation: "up 0.4s ease 0.12s both" }}>
            <div style={{ fontSize: 10, color: "#f97316", fontFamily: "monospace", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8, fontWeight: 700 }}>⚡ This Week's Top 3 Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                "🔥 Reply to Bill @ Rephers about the BI Reporting role — apply today",
                "🔴 Pick your WomenWhoCode Summit volunteer timing slot — event is next week",
                "📅 Decide on Applied AI System Design Club — TOMORROW Thu May 28, 6:30 PM",
              ].map((a, i) => (
                <div key={i} style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.5 }}>→ {a}</div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div style={{ marginBottom: 14, animation: "up 0.4s ease 0.15s both" }}>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
              {cats.map(cat => {
                const cfg = CAT[cat];
                const active = filter === cat;
                return (
                  <button key={cat} onClick={() => setFilter(cat)} className="fb"
                    style={{ padding: "4px 10px", borderRadius: 100, fontSize: 9, background: active ? (cfg ? cfg.bg : "#1e293b") : "transparent", color: active ? (cfg ? cfg.color : "#e2e8f0") : "#334155", border: `1px solid ${active ? (cfg ? cfg.border : "#334155") : "#1e293b"}`, fontWeight: active ? 700 : 400 }}>
                    {cat}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              <span style={{ fontSize: 9, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em" }}>Priority:</span>
              {imps.map(imp => (
                <button key={imp} onClick={() => setImpFilter(imp)} className="fb"
                  style={{ padding: "3px 8px", borderRadius: 6, fontSize: 9, background: impFilter === imp ? "#1e293b" : "transparent", color: impFilter === imp ? "#e2e8f0" : "#334155", border: `1px solid ${impFilter === imp ? "#334155" : "#1e293b"}`, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {imp === "HIGH" ? "🔴 High" : imp === "MEDIUM" ? "🟡 Medium" : "All"}
                </button>
              ))}
              <span style={{ marginLeft: "auto", fontSize: 9, color: "#1e3a5f" }}>{filtered.length} shown</span>
            </div>
          </div>

          {filtered.map((e, i) => <EmailCard key={e.id} e={e} idx={i} />)}

          <div style={{ textAlign: "center", marginTop: 24, fontSize: 9, color: "#1a2535", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Claude · Gmail · May 21–27, 2026
          </div>
        </div>
      </div>
    </>
  );
}
