import { useState, useMemo, useEffect, useCallback } from "react";

// ─── PASSWORD GATE ───────────────────────────────────────────────────
const APP_PASSWORD = "omnisolve2025!"; // ← change this to whatever you want

function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [show,  setShow]  = useState(false);

  const tryUnlock = () => {
    if (input === APP_PASSWORD) {
      localStorage.setItem("omni-auth", APP_PASSWORD);
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div style={{ minHeight:"100vh", background:"#F8F9FB", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
      <div style={{ background:"#fff", border:"1px solid #DDE3ED", borderRadius:16, padding:"40px 36px", width:"100%", maxWidth:400, textAlign:"center", boxShadow:"0 4px 24px rgba(0,0,0,.06)" }}>
        <div style={{ width:48, height:48, borderRadius:12, background:"#2563EB", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="1" y="1" width="9" height="9" rx="2" fill="white"/>
            <rect x="12" y="1" width="9" height="9" rx="2" fill="white" opacity=".4"/>
            <rect x="1" y="12" width="9" height="9" rx="2" fill="white" opacity=".4"/>
            <rect x="12" y="12" width="9" height="9" rx="2" fill="white"/>
          </svg>
        </div>
        <div style={{ fontSize:20, fontWeight:700, color:"#111827", marginBottom:6, letterSpacing:"-.3px" }}>OmniSolve Systems</div>
        <div style={{ fontSize:14, color:"#6B7280", marginBottom:28 }}>Prospect Pipeline — Private Access</div>
        <div style={{ position:"relative", marginBottom:12 }}>
          <input
            type={show ? "text" : "password"}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && tryUnlock()}
            placeholder="Enter password"
            style={{ width:"100%", fontFamily:"inherit", fontSize:14, padding:"11px 44px 11px 14px", borderRadius:8, border:`1.5px solid ${error ? "#FCA5A5" : "#DDE3ED"}`, background:error ? "#FFF1F1" : "#F8F9FB", color:"#111827", outline:"none", boxSizing:"border-box", transition:"border .15s" }}
          />
          <button onClick={() => setShow(p => !p)} style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:13, fontFamily:"inherit" }}>
            {show ? "Hide" : "Show"}
          </button>
        </div>
        {error && <div style={{ fontSize:12, color:"#B91C1C", marginBottom:10, fontWeight:500 }}>Incorrect password — try again</div>}
        <button onClick={tryUnlock} style={{ width:"100%", fontFamily:"inherit", fontSize:14, fontWeight:600, padding:"11px", borderRadius:8, border:"none", background:"#2563EB", color:"#fff", cursor:"pointer" }}>
          Unlock
        </button>
        <div style={{ fontSize:11, color:"#9CA3AF", marginTop:16 }}>Private tool — authorized access only</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// WHITE-LABEL TOKENS — change only this block to rebrand
// ─────────────────────────────────────────────────────────────────────
const BRAND = {
  name:    "OmniSolve Systems",
  sub:     "Prospect pipeline",
  primary: "#2563EB",
  dark:    "#1D4ED8",
  bg:      "#EFF4FF",
  border:  "#BFCFFD",
};

// ─── DESIGN TOKENS ───────────────────────────────────────────────────
const C = {
  page:      "#F8F9FB",
  surface:   "#FFFFFF",
  surface2:  "#F1F5F9",
  surface3:  "#E8EDF4",
  border:    "#DDE3ED",
  border2:   "#C8D2E0",
  ink:       "#111827",
  ink2:      "#374151",
  ink3:      "#6B7280",
  ink4:      "#9CA3AF",
  green:     "#047857", greenBg: "#ECFDF5", greenBdr: "#6EE7B7",
  amber:     "#B45309", amberBg: "#FFFBEB", amberBdr: "#FCD34D",
  red:       "#B91C1C", redBg:   "#FFF1F1", redBdr:   "#FCA5A5",
  purple:    "#6D28D9", purpleBg:"#F5F3FF", purpleBdr:"#C4B5FD",
};

const sans = "'Plus Jakarta Sans', system-ui, sans-serif";
const mono = "'JetBrains Mono', monospace";

// ─── SERVICES ────────────────────────────────────────────────────────
const SERVICES = {
  website:   { id:"website",   label:"Website build",   icon:"🌐" },
  redesign:  { id:"redesign",  label:"Site redesign",   icon:"🎨" },
  cleaning:  { id:"cleaning",  label:"Data cleaning",   icon:"🧹" },
  etl:       { id:"etl",       label:"ETL / SSIS",      icon:"⚙️" },
  dashboard: { id:"dashboard", label:"Dashboards",      icon:"📊" },
  reporting: { id:"reporting", label:"Reporting",       icon:"📋" },
  dba:       { id:"dba",       label:"DBA / SQL",       icon:"🗄️" },
  api:       { id:"api",       label:"API integration", icon:"🔌" },
  security:  { id:"security",  label:"Data security",   icon:"🔒" },
};

// ─── PITCH ENGINE ────────────────────────────────────────────────────
function dataServiceForIndustry(lead) {
  const ind = (lead.industry || "").toLowerCase();
  if (/health|medical|dental|clinic/.test(ind))    return { svc:"reporting", why:"Healthcare faces HIPAA compliance pressure — automating reporting removes manual risk and proves immediate ROI." };
  if (/gov|county|city|municipal/.test(ind))        return { svc:"reporting", why:"Government entities run on mandated reporting cycles. Automating one manual report is a clear, measurable win." };
  if (/finance|bank|insurance|accounting|mortgage/.test(ind)) return { svc:"dba", why:"Financial data demands clean schema, fast queries, and audit logs. A DBA audit surfaces quick wins immediately." };
  if (/education|school|isd|university/.test(ind))  return { svc:"dashboard", why:"Districts sit on student and performance data with no visibility. A dashboard demo is a fast trust-builder." };
  if (/retail|restaurant|food|liquor|store/.test(ind)) return { svc:"etl", why:"Multi-location retail has fragmented POS and inventory data. ETL pipelines deliver immediate operational value." };
  if (/energy|oil|construction|manufacturing/.test(ind)) return { svc:"etl", why:"Ops-heavy businesses have siloed data across ERP, logistics, and equipment. ETL connects them." };
  if (lead.techStack >= 4)   return { svc:"dba",      why:"Strong tech stack signals existing databases. A DBA audit finds optimization wins fast." };
  if (lead.dataSignals >= 4) return { svc:"cleaning", why:"High data volume signals messy records. A free cleaning sample proves value before any commitment." };
  return { svc:"dashboard", why:"Dashboards create fast perceived ROI and are easy to demo. Ideal first deliverable to establish trust." };
}

function buildOpeningLine(svc, lead) {
  const n = lead.name, ind = lead.industry || "your industry";
  const lines = {
    website:   `"I noticed ${n} doesn't have a website yet. I put together a free mockup — mind if I send it over?"`,
    redesign:  `"I came across ${n}'s website and put together a few ideas to modernize it. Want me to share the mockup?"`,
    dashboard: `"I built a sample dashboard for businesses like ${n} — the kind that takes 3 hours a week to update manually. Want to see it for your numbers?"`,
    cleaning:  `"Most ${ind} businesses are working off inconsistent data and don't realize it. I found some patterns — mind if I share what I found?"`,
    etl:       `"I noticed ${n} likely has data in multiple systems that don't talk. I can connect them automatically — worth 15 minutes?"`,
    dba:       `"I did a quick analysis of database loads typical for ${ind} — there are usually 2–3 fixes that cut query time significantly. Mind if I share the findings?"`,
    reporting: `"I built a sample automated report for ${ind} businesses — the kind that usually takes 2 hours every week to pull manually. Want me to send it over?"`,
    api:       `"I can connect ${n}'s systems so data flows automatically — no manual exports, no copy-pasting. I put together an integration map. Worth a look?"`,
    security:  `"I ran a quick data access audit on patterns typical for ${ind} — most businesses have 2–3 compliance gaps. I can walk you through what to look for."`,
  };
  return lines[svc] || `"I looked at ${n}'s setup and have ideas that could save your team real time. Can I send a quick summary?"`;
}

function buildAuditHook(svc) {
  const hooks = {
    website:   "Build a 1-page homepage mockup with their branding. Send it cold — show, don't tell.",
    redesign:  "5-point site audit (mobile, speed, SSL, CTA, contact form) delivered as a PDF before any call.",
    dashboard: "1-page mockup dashboard using their industry's KPIs. Takes 30 min, opens every door.",
    cleaning:  "Ask for 50 rows of sample data. Return it cleaned with a written report of what was fixed and why.",
    etl:       "A simple before/after data flow diagram — current fragmented state vs. what automated looks like.",
    dba:       "'Database health checklist' PDF tailored to their industry. Positions you as the expert before the meeting.",
    reporting: "Build one report they currently pull manually and send it completed. Nothing sells automation like seeing it done.",
    api:       "1-page integration map showing which systems could connect and what time that saves weekly.",
    security:  "'Data risk assessment' — 7 self-scoring questions. Follow up with your analysis of their answers.",
  };
  return hooks[svc] || "Lead with a free audit or sample deliverable. Give value before the ask.";
}

function buildPitchPlan(lead) {
  const { hasWebsite } = lead;
  const { svc, why } = dataServiceForIndustry(lead);
  const up  = ["dashboard","cleaning","etl","dba","reporting","api","security"].filter(s => s !== svc);
  const ret = ["etl","dba","security","api","reporting"].filter(s => s !== svc && s !== up[0]);

  if (hasWebsite === "none") return [
    { tier:"LEAD WITH", tcls:"lead", ...SERVICES.website,          why:"No web presence — lead with the website build. Don't mention data yet. Establish trust first.",   ol:buildOpeningLine("website",lead),      ah:buildAuditHook("website") },
    { tier:"UPSELL",    tcls:"up",   ...SERVICES[svc],             why:`Once the site is live, they trust you. Now introduce data: ${why}`,                               ol:buildOpeningLine(svc,lead),            ah:buildAuditHook(svc) },
    { tier:"RETAINER",  tcls:"ret",  ...SERVICES[ret[0]||"etl"],   why:"Convert the project into recurring revenue with ongoing infrastructure support.",                  ol:buildOpeningLine(ret[0]||"etl",lead), ah:buildAuditHook(ret[0]||"etl") },
  ];
  if (hasWebsite === "weak") return [
    { tier:"LEAD WITH", tcls:"lead", ...SERVICES.redesign,         why:"Outdated site is a visible problem they already know about. Redesign opens the relationship.",     ol:buildOpeningLine("redesign",lead),     ah:buildAuditHook("redesign") },
    { tier:"UPSELL",    tcls:"up",   ...SERVICES[svc],             why,                                                                                                    ol:buildOpeningLine(svc,lead),            ah:buildAuditHook(svc) },
    { tier:"RETAINER",  tcls:"ret",  ...SERVICES[up[0]],           why:"Ongoing data infrastructure keeps them on retainer long after the redesign.",                      ol:buildOpeningLine(up[0],lead),          ah:buildAuditHook(up[0]) },
  ];
  return [
    { tier:"LEAD WITH", tcls:"lead", ...SERVICES[svc],             why,                                                                                                    ol:buildOpeningLine(svc,lead),             ah:buildAuditHook(svc) },
    { tier:"UPSELL",    tcls:"up",   ...SERVICES[up[0]],           why:`First win delivered — now expand into ${SERVICES[up[0]].label}. Trust is established.`,           ol:buildOpeningLine(up[0],lead),           ah:buildAuditHook(up[0]) },
    { tier:"RETAINER",  tcls:"ret",  ...SERVICES[ret[0]||"api"],   why:"Convert to a monthly retainer with ongoing support and infrastructure ownership.",                 ol:buildOpeningLine(ret[0]||"api",lead),   ah:buildAuditHook(ret[0]||"api") },
  ];
}

// ─── SCORING ─────────────────────────────────────────────────────────
const sizeMap = { small:1, medium:3, large:5 };
function calcScore(l) {
  return Math.min(100, Math.round(
    ((sizeMap[l.size]||3)/5)*20 + (l.dataSignals/5)*25 + (l.techStack/5)*15 +
    (l.reachability/5)*15 + (l.proximity/5)*10 +
    (l.hasWebsite==="none"?15:l.hasWebsite==="weak"?8:0) + (l.webData/5)*15
  ));
}
function grade(s) {
  if (s >= 82) return { label:"A", color:C.green,        bg:C.greenBg  };
  if (s >= 66) return { label:"B", color:BRAND.primary,  bg:BRAND.bg   };
  if (s >= 50) return { label:"C", color:C.amber,        bg:C.amberBg  };
  return              { label:"D", color:C.red,          bg:C.redBg    };
}

// ─── SEED DATA ────────────────────────────────────────────────────────
const SEED = [
  { id:1, name:"Forney ISD",         industry:"Education",  city:"Forney, TX",   address:"600 S Bois d'Arc St, Forney, TX 75126",     phone:"972-552-6400", website:"forneyisd.net",       hasWebsite:"good", size:"large",  dataSignals:5,techStack:3,reachability:3,proximity:5,webData:3, status:"new",       notes:"", auditDone:false },
  { id:2, name:"Kaufman County",      industry:"Government", city:"Kaufman, TX",  address:"100 W Mulberry St, Kaufman, TX 75142",      phone:"972-932-4331", website:"",                   hasWebsite:"none", size:"medium", dataSignals:5,techStack:2,reachability:3,proximity:5,webData:2, status:"new",       notes:"", auditDone:false },
  { id:3, name:"CrossFirst Bank",     industry:"Finance",    city:"Dallas, TX",   address:"2911 Turtle Creek Blvd, Dallas, TX 75219",  phone:"",             website:"crossfirstbank.com",  hasWebsite:"good", size:"medium", dataSignals:4,techStack:4,reachability:4,proximity:4,webData:4, status:"contacted", notes:"", auditDone:false },
  { id:4, name:"Forney Medical Ctr",  industry:"Healthcare", city:"Forney, TX",   address:"701 E US-80, Forney, TX 75126",             phone:"972-552-3100", website:"",                   hasWebsite:"none", size:"medium", dataSignals:5,techStack:3,reachability:3,proximity:5,webData:2, status:"new",       notes:"", auditDone:false },
  { id:5, name:"Mesquite ISD",        industry:"Education",  city:"Mesquite, TX", address:"405 E Davis St, Mesquite, TX 75149",        phone:"972-288-6411", website:"mesquiteisd.org",     hasWebsite:"good", size:"large",  dataSignals:4,techStack:3,reachability:3,proximity:4,webData:3, status:"audit",     notes:"", auditDone:true  },
  { id:6, name:"Landmark Industries", industry:"Energy",     city:"Forney, TX",   address:"13850 TX-205, Forney, TX 75126",            phone:"",             website:"",                   hasWebsite:"none", size:"medium", dataSignals:3,techStack:3,reachability:3,proximity:5,webData:1, status:"new",       notes:"", auditDone:false },
  { id:7, name:"ProPath Services",    industry:"Healthcare", city:"Dallas, TX",   address:"1717 Main St, Dallas, TX 75201",            phone:"",             website:"propathservices.com", hasWebsite:"weak", size:"small",  dataSignals:4,techStack:4,reachability:4,proximity:3,webData:3, status:"talking",   notes:"", auditDone:true  },
  { id:8, name:"CrossCountry Mtg",    industry:"Finance",    city:"Forney, TX",   address:"100 Gateway Blvd, Forney, TX 75126",        phone:"",             website:"",                   hasWebsite:"none", size:"small",  dataSignals:3,techStack:2,reachability:4,proximity:5,webData:2, status:"new",       notes:"", auditDone:false },
];

const STATUSES = {
  new:       { label:"New",        dot:"#9CA3AF"       },
  contacted: { label:"Contacted",  dot:BRAND.primary   },
  audit:     { label:"Audit sent", dot:C.amber         },
  talking:   { label:"In talks",   dot:C.green         },
  won:       { label:"Won",        dot:C.green         },
  lost:      { label:"Passed",     dot:C.red           },
};
const WEB_OPTS = [
  { val:"none", label:"No website", emoji:"🚫", bdrColor:C.redBdr,    bgColor:C.redBg,    txtColor:C.red    },
  { val:"weak", label:"Weak site",  emoji:"⚠️", bdrColor:C.amberBdr,  bgColor:C.amberBg,  txtColor:C.amber  },
  { val:"good", label:"Has site",   emoji:"✅", bdrColor:C.greenBdr,  bgColor:C.greenBg,  txtColor:C.green  },
];
const SIGNALS = [
  { k:"dataSignals",  label:"Data signals",     color:"#2563EB" },
  { k:"techStack",    label:"Tech stack",       color:"#047857" },
  { k:"reachability", label:"Reachability",     color:"#B45309" },
  { k:"proximity",    label:"Proximity",        color:"#6D28D9" },
  { k:"webData",      label:"Web / data need",  color:"#B91C1C" },
];
const TIER_BORDERS = {
  "LEAD WITH": C.greenBdr,
  "UPSELL":    BRAND.border,
  "RETAINER":  C.purpleBdr,
};
const TIER_ACTIVE = {
  lead: { border:C.greenBdr,   bg:C.greenBg,   color:C.green       },
  up:   { border:BRAND.border, bg:BRAND.bg,    color:BRAND.primary },
  ret:  { border:C.purpleBdr,  bg:C.purpleBg,  color:C.purple      },
};

const STORAGE_KEY = "omnisolve-v7";

const webPill = (val) => {
  const o = WEB_OPTS.find(x => x.val === val);
  return { bg:o.bgColor, color:o.txtColor, border:`1px solid ${o.bdrColor}`, label:o.label };
};

function SignalRow({ label, color, value, onChange }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
      <span style={{ fontFamily:sans, fontSize:12, fontWeight:500, color:C.ink2, width:106, flexShrink:0 }}>{label}</span>
      <div style={{ flex:1, height:6, background:C.surface3, borderRadius:3, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${(value/5)*100}%`, background:color, borderRadius:3, transition:"width .15s" }}/>
      </div>
      <div style={{ display:"flex", gap:5 }}>
        {[1,2,3,4,5].map(v => (
          <button key={v} onClick={() => onChange(v)} style={{
            width:28, height:28, borderRadius:5, cursor:"pointer", fontFamily:mono, fontWeight:600, fontSize:11,
            display:"flex", alignItems:"center", justifyContent:"center",
            border:`1.5px solid ${value >= v ? color : C.border}`,
            background: value >= v ? color+"18" : C.surface2,
            color: value >= v ? color : C.ink3, transition:"all .12s",
          }}>{v}</button>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────
export default function App() {
  const [unlocked, setUnlocked] = useState(
    () => localStorage.getItem("omni-auth") === APP_PASSWORD
  );
  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  const [leads,     setLeads]     = useState(() => { try { const x = localStorage.getItem(STORAGE_KEY); return x ? JSON.parse(x) : SEED; } catch { return SEED; } });
  const [selId,     setSelId]     = useState(null);
  const [tab,       setTab]       = useState("pipeline");
  const [filter,    setFilter]    = useState("all");
  const [search,    setSearch]    = useState("");
  const [pitchTab,  setPitchTab]  = useState(0);
  const [apiKey,    setApiKey]    = useState(() => { try { return localStorage.getItem(STORAGE_KEY+"-key") || ""; } catch { return ""; } });
  const [searchQ,   setSearchQ]   = useState("");
  const [searching, setSearching] = useState(false);
  const [results,   setResults]   = useState([]);
  const [searchErr, setSearchErr] = useState("");
  const [csvRaw,    setCsvRaw]    = useState("");

  const blankForm = { name:"", industry:"", city:"", address:"", phone:"", website:"", hasWebsite:"none", size:"medium", dataSignals:3, techStack:3, reachability:3, proximity:3, webData:3, notes:"" };
  const [form, setForm] = useState(blankForm);

  useEffect(() => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(leads)); } catch {} }, [leads]);
  const saveKey = k => { setApiKey(k); try { localStorage.setItem(STORAGE_KEY+"-key", k); } catch {} };

  const scored  = useMemo(() => leads.map(l => ({ ...l, score:calcScore(l) })).sort((a,b) => b.score - a.score), [leads]);
  const visible = scored.filter(l =>
    (filter === "all" || l.status === filter) &&
    [l.name, l.industry, l.address, l.city].some(f => (f||"").toLowerCase().includes(search.toLowerCase()))
  );
  const sel   = scored.find(l => l.id === selId) || null;
  const pitch = sel ? buildPitchPlan(sel) : [];

  const upd = (id, ch) => setLeads(p => p.map(l => l.id === id ? { ...l, ...ch } : l));
  const add = data => setLeads(p => [...p, { ...data, id:Date.now(), status:"new", auditDone:false }]);

  const stats = {
    total: scored.length,
    hot:   scored.filter(l => l.score >= 75).length,
    noWeb: scored.filter(l => l.hasWebsite === "none").length,
    won:   scored.filter(l => l.status === "won").length,
  };

  const runSearch = useCallback(async () => {
    if (!apiKey.trim()) { setSearchErr("Add your Google Places API key first."); return; }
    if (!searchQ.trim()) { setSearchErr("Enter a search query."); return; }
    setSearching(true); setSearchErr(""); setResults([]);
    try {
      const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: { "Content-Type":"application/json", "X-Goog-Api-Key":apiKey.trim(), "X-Goog-FieldMask":"places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.types,places.rating,places.userRatingCount" },
        body: JSON.stringify({ textQuery:searchQ, maxResultCount:20 }),
      });
      const data = await res.json();
      if (data.error) { setSearchErr(`API error: ${data.error.message}`); return; }
      setResults((data.places||[]).map((p,i) => ({
        _id:i, name:p.displayName?.text||"", address:p.formattedAddress||"",
        city:(p.formattedAddress||"").split(",").slice(-3,-1).join(",").trim(),
        phone:p.nationalPhoneNumber||"", website:(p.websiteUri||"").replace(/\/$/,""),
        hasWebsite:p.websiteUri?"good":"none", industry:guessIndustry(p.types||[],searchQ),
        rating:p.rating||0, size:"medium", dataSignals:3, techStack:3, reachability:3, proximity:3, webData:3,
        notes:`Rating: ${p.rating||"—"} · ${p.userRatingCount||0} reviews`,
      })));
    } catch(e) { setSearchErr(`Error: ${e.message}`); }
    finally { setSearching(false); }
  }, [apiKey, searchQ]);

  function guessIndustry(types, q) {
    const map = { Healthcare:["health","clinic","dental","doctor","medical"], Finance:["bank","finance","accounting","mortgage","insurance"], Education:["school","university","isd"], Government:["gov","county"], Energy:["energy","oil","construction"], Food:["restaurant","food","cafe"] };
    const ql = q.toLowerCase();
    for (const [k,kw] of Object.entries(map)) if (kw.some(w => ql.includes(w))) return k;
    for (const [k,kw] of Object.entries(map)) if (types.some(t => kw.some(w => t.includes(w)))) return k;
    return (types[0]||"").replace(/_/g," ");
  }

  const importCsv = () => {
    const lines = csvRaw.trim().split("\n"); if (lines.length < 2) return;
    const h = lines[0].split(",").map(x => x.trim().replace(/"/g,"").toLowerCase());
    const g = (row, keys) => { for (const k of keys) { const i = h.findIndex(x => x.includes(k)); if (i >= 0 && row[i]) return row[i].replace(/"/g,"").trim(); } return ""; };
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(","); const name = g(row,["name","title","business"]); if (!name) continue;
      const website = g(row,["website","site","url"]);
      add({ name, industry:g(row,["category","type","industry"]), city:g(row,["city","state"]), address:g(row,["address","street","location"]), phone:g(row,["phone","telephone"]), website, hasWebsite:website?"good":"none", size:"medium", dataSignals:3,techStack:3,reachability:3,proximity:3,webData:3,notes:"" });
    }
    setCsvRaw(""); setTab("pipeline");
  };

  const fieldInput = { fontFamily:sans, fontSize:14, background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:6, padding:"10px 13px", color:C.ink, outline:"none", width:"100%", boxSizing:"border-box" };
  const btnPrimary = { fontFamily:sans, fontSize:14, fontWeight:600, cursor:"pointer", borderRadius:6, padding:"11px 26px", border:"none", background:BRAND.primary, color:"#fff" };
  const btnGhost   = { fontFamily:sans, fontSize:14, fontWeight:500, cursor:"pointer", borderRadius:6, padding:"11px 26px", border:`1.5px solid ${C.border}`, background:"transparent", color:C.ink2 };
  const secCard    = { background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:12, padding:"18px 20px", marginBottom:14 };
  const secLabel   = { fontFamily:sans, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:".8px", color:C.ink3, marginBottom:14 };

  return (
    <div style={{ fontFamily:sans, background:C.page, minHeight:"100vh", color:C.ink, fontSize:14 }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet"/>

      {/* HEADER */}
      <header style={{ height:60, background:C.surface, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px", gap:16, position:"sticky", top:0, zIndex:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:BRAND.primary, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="1" width="7" height="7" rx="2" fill="white"/>
              <rect x="10" y="1" width="7" height="7" rx="2" fill="white" opacity=".4"/>
              <rect x="1" y="10" width="7" height="7" rx="2" fill="white" opacity=".4"/>
              <rect x="10" y="10" width="7" height="7" rx="2" fill="white"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:C.ink, letterSpacing:"-.3px", lineHeight:1.1 }}>{BRAND.name}</div>
            <div style={{ fontSize:12, color:C.ink3, marginTop:1 }}>{BRAND.sub}</div>
          </div>
        </div>
        <nav style={{ display:"flex", gap:2, background:C.surface2, borderRadius:9, padding:4 }}>
          {[["pipeline","Pipeline"],["live","Live search"],["add","Add lead"],["import","CSV import"]].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)} style={{ fontFamily:sans, fontSize:13, fontWeight:tab===t?600:500, cursor:"pointer", borderRadius:7, padding:"7px 16px", border:"none", background:tab===t?C.surface:"transparent", color:tab===t?BRAND.primary:C.ink3, boxShadow:tab===t?"0 1px 4px rgba(0,0,0,.09)":"none", transition:"all .15s" }}>
              {t === "live" && <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:"#EF4444", marginRight:6, verticalAlign:"middle" }}/>}
              {l}
            </button>
          ))}
        </nav>
        <div style={{ display:"flex", gap:8, flexShrink:0 }}>
          {[
            [stats.total, "Leads",      C.ink,        C.surface,  C.border     ],
            [stats.hot,   "Hot leads",  BRAND.primary, BRAND.bg,  BRAND.border ],
            [stats.noWeb, "No website", C.amber,       C.amberBg, C.amberBdr   ],
            [stats.won,   "Won",        C.green,       C.greenBg, C.greenBdr   ],
          ].map(([v,l,col,bg,bdr]) => (
            <div key={l} style={{ padding:"7px 16px", borderRadius:8, textAlign:"center", border:`1px solid ${bdr}`, background:bg, minWidth:72 }}>
              <div style={{ fontFamily:mono, fontSize:20, fontWeight:700, color:col, lineHeight:1 }}>{v}</div>
              <div style={{ fontFamily:sans, fontSize:10, color:col, marginTop:2, textTransform:"uppercase", letterSpacing:".5px", opacity:.75 }}>{l}</div>
            </div>
          ))}
        </div>
      </header>

      {/* LIVE SEARCH */}
      {tab === "live" && (
        <div style={{ maxWidth:860, margin:"0 auto", padding:"32px 28px" }}>
          <h2 style={{ fontSize:20, fontWeight:700, color:C.ink, marginBottom:6, letterSpacing:"-.4px" }}>Live business search</h2>
          <p style={{ fontSize:14, color:C.ink3, lineHeight:1.7, marginBottom:28 }}>
            Search Google Maps in real time. Requires a free Places API key —{" "}
            <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" style={{ color:BRAND.primary, textDecoration:"none" }}>console.cloud.google.com</a>.
            Free $200/mo credit covers ~5,000 searches.
          </p>
          <div style={{ ...secCard, marginBottom:20 }}>
            <div style={secLabel}>Google Places API key</div>
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              <input type="password" value={apiKey} onChange={e => saveKey(e.target.value)} placeholder="AIzaSy…" style={{ ...fieldInput, flex:1 }}/>
              <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:apiKey ? C.green : C.border2 }}/>
                <span style={{ fontSize:13, fontWeight:500, color:apiKey ? C.green : C.ink3 }}>{apiKey ? "Connected" : "Not set"}</span>
              </div>
            </div>
            <div style={{ fontSize:12, color:C.ink4, marginTop:8 }}>Saved locally in your browser only. Never transmitted.</div>
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:12 }}>
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key==="Enter" && runSearch()}
              placeholder={`"medical clinic Forney TX"  or  "accounting firm 75126"`}
              style={{ ...fieldInput, flex:1, padding:"11px 14px" }}/>
            <button onClick={runSearch} disabled={searching} style={{ ...btnPrimary, flexShrink:0, minWidth:110, opacity:searching?.7:1 }}>
              {searching ? "Searching…" : "Search"}
            </button>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:22 }}>
            {["medical clinic Forney TX","accounting firm Forney TX","dental office 75126","law firm Kaufman TX","construction Forney TX","school Kaufman County TX"].map(q => (
              <button key={q} onClick={() => setSearchQ(q)} style={{ fontFamily:sans, fontSize:12, background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:6, padding:"5px 12px", color:C.ink3, cursor:"pointer" }}>{q}</button>
            ))}
          </div>
          {searchErr && <div style={{ background:C.redBg, border:`1.5px solid ${C.redBdr}`, borderRadius:8, padding:"12px 16px", fontSize:13, color:C.red, marginBottom:16 }}>{searchErr}</div>}
          {results.length > 0 && (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <span style={{ fontSize:14, color:C.ink3, fontWeight:500 }}>{results.length} results found</span>
                <button onClick={() => { results.forEach(r => add({...r,_id:undefined})); setResults([]); setTab("pipeline"); }} style={{ ...btnPrimary, background:C.green, padding:"8px 20px", fontSize:13 }}>Import all ({results.length})</button>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
                {results.map(r => {
                  const g = grade(calcScore(r)); const wp = webPill(r.hasWebsite);
                  return (
                    <div key={r._id} style={{ background:C.surface, border:`1.5px solid ${C.border}`, borderRadius:11, padding:"13px 16px", display:"flex", alignItems:"center", gap:12 }}>
                      <div style={{ width:36, height:36, borderRadius:8, background:g.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:700, color:g.color, fontFamily:mono, flexShrink:0 }}>{g.label}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:600, color:C.ink }}>{r.name}</div>
                        <div style={{ fontSize:12, color:C.ink3, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.address}</div>
                        {r.phone && <div style={{ fontSize:12, color:C.ink3, marginTop:1 }}>{r.phone}</div>}
                      </div>
                      <span style={{ fontSize:11, fontWeight:600, borderRadius:5, padding:"3px 9px", background:wp.bg, color:wp.color, border:wp.border, flexShrink:0 }}>{wp.label}</span>
                      {r.rating > 0 && <span style={{ fontSize:13, color:C.amber, fontWeight:600, flexShrink:0 }}>★ {r.rating}</span>}
                      <span style={{ fontFamily:mono, fontSize:18, fontWeight:700, color:g.color, minWidth:34, textAlign:"right", flexShrink:0 }}>{calcScore(r)}</span>
                      <button onClick={() => { add({...r,_id:undefined}); setResults(p => p.filter(x => x._id !== r._id)); }} style={{ fontFamily:sans, fontSize:12, fontWeight:600, cursor:"pointer", borderRadius:6, padding:"7px 14px", border:`1.5px solid ${BRAND.border}`, background:BRAND.bg, color:BRAND.primary, flexShrink:0 }}>+ Add</button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {!searching && results.length === 0 && !searchErr && (
            <div style={{ textAlign:"center", padding:"56px 24px", color:C.ink4, fontSize:14 }}>Enter a search above to pull live data from Google Maps.</div>
          )}
        </div>
      )}

      {/* ADD LEAD */}
      {tab === "add" && (
        <div style={{ maxWidth:660, margin:"0 auto", padding:"32px 28px" }}>
          <h2 style={{ fontSize:20, fontWeight:700, color:C.ink, marginBottom:24, letterSpacing:"-.4px" }}>Add lead manually</h2>
          <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)", gap:16, marginBottom:18 }}>
            {[["name","Business name",true],["industry","Industry",false],["address","Street address",true],["city","City / area",false],["phone","Phone",false],["website","Website",false]].map(([k,l,full]) => (
              <div key={k} style={{ gridColumn:full?"1/3":"auto" }}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:".6px", color:C.ink3, marginBottom:7 }}>{l}</label>
                <input value={form[k]} onChange={e => setForm(p=>({...p,[k]:e.target.value}))} style={fieldInput}/>
              </div>
            ))}
          </div>
          <div style={{ marginBottom:18 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:".6px", color:C.ink3, marginBottom:7 }}>Website presence</label>
            <div style={{ display:"flex", gap:8 }}>
              {WEB_OPTS.map(o => {
                const active = form.hasWebsite === o.val;
                return (
                  <button key={o.val} onClick={() => setForm(p=>({...p,hasWebsite:o.val}))} style={{ flex:1, padding:"12px 8px", borderRadius:10, cursor:"pointer", textAlign:"center", fontFamily:sans, border:`1.5px solid ${active ? o.bdrColor : C.border}`, background:active ? o.bgColor : C.surface2, transition:"all .15s" }}>
                    <div style={{ fontSize:18, marginBottom:5 }}>{o.emoji}</div>
                    <div style={{ fontSize:13, fontWeight:600, color:active ? o.txtColor : C.ink2 }}>{o.label}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(0,1fr)", gap:16, marginBottom:18 }}>
            {SIGNALS.map(sig => (
              <div key={sig.k}>
                <label style={{ display:"block", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:".6px", color:C.ink3, marginBottom:7 }}>{sig.label}</label>
                <div style={{ display:"flex", gap:5 }}>
                  {[1,2,3,4,5].map(v => (
                    <button key={v} onClick={() => setForm(p=>({...p,[sig.k]:v}))} style={{ flex:1, height:34, borderRadius:6, cursor:"pointer", fontFamily:mono, fontWeight:700, fontSize:12, border:`1.5px solid ${form[sig.k]>=v ? sig.color : C.border}`, background:form[sig.k]>=v ? sig.color+"18" : C.surface2, color:form[sig.k]>=v ? sig.color : C.ink3, transition:"all .12s" }}>{v}</button>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:".6px", color:C.ink3, marginBottom:7 }}>Company size</label>
              <div style={{ display:"flex", gap:6 }}>
                {["small","medium","large"].map(v => (
                  <button key={v} onClick={() => setForm(p=>({...p,size:v}))} style={{ flex:1, padding:"9px", borderRadius:7, cursor:"pointer", fontFamily:sans, fontSize:12, fontWeight:600, border:`1.5px solid ${form.size===v ? BRAND.border : C.border}`, background:form.size===v ? BRAND.bg : C.surface2, color:form.size===v ? BRAND.primary : C.ink2, textTransform:"capitalize", transition:"all .12s" }}>{v}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ marginBottom:20 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:".6px", color:C.ink3, marginBottom:7 }}>Notes</label>
            <textarea value={form.notes} onChange={e => setForm(p=>({...p,notes:e.target.value}))} rows={3} placeholder="Pain points, context, key contacts…" style={{ ...fieldInput, resize:"none", lineHeight:1.65 }}/>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => { add(form); setForm(blankForm); setTab("pipeline"); }} style={btnPrimary}>Add to pipeline</button>
            <button onClick={() => setTab("pipeline")} style={btnGhost}>Cancel</button>
          </div>
        </div>
      )}

      {/* CSV IMPORT */}
      {tab === "import" && (
        <div style={{ maxWidth:740, margin:"0 auto", padding:"32px 28px" }}>
          <h2 style={{ fontSize:20, fontWeight:700, color:C.ink, marginBottom:6, letterSpacing:"-.4px" }}>Import from CSV</h2>
          <p style={{ fontSize:14, color:C.ink3, lineHeight:1.7, marginBottom:28 }}>
            Export from <strong style={{ color:C.ink }}>Outscraper</strong> (free 500 records/month at outscraper.com) and paste below. Column names are auto-detected.
          </p>
          <label style={{ display:"block", fontSize:12, fontWeight:600, textTransform:"uppercase", letterSpacing:".6px", color:C.ink3, marginBottom:7 }}>CSV data</label>
          <textarea value={csvRaw} onChange={e => setCsvRaw(e.target.value)} rows={12}
            placeholder={"name,phone,website,address,city,category\nForney Animal Hospital,(972) 564-3400,forneyanimal.com,1103 S Bois d'Arc St,Forney TX,Veterinarian"}
            style={{ ...fieldInput, resize:"vertical", fontFamily:mono, fontSize:12, lineHeight:1.7, marginBottom:20 }}/>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={importCsv} style={btnPrimary}>Import leads</button>
            <button onClick={() => setTab("pipeline")} style={btnGhost}>Cancel</button>
          </div>
        </div>
      )}

      {/* PIPELINE */}
      {tab === "pipeline" && (
        <div style={{ display:"flex", height:"calc(100vh - 60px)" }}>
          <div style={{ width:sel?"44%":"100%", transition:"width .2s", overflowY:"auto", borderRight:`1px solid ${C.border}`, background:C.page }}>
            <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.border}`, display:"flex", gap:10, alignItems:"center", background:C.surface, position:"sticky", top:0, zIndex:10 }}>
              <input placeholder="Search by name, address, or industry…" value={search} onChange={e => setSearch(e.target.value)}
                style={{ fontFamily:sans, fontSize:13, background:C.surface2, border:`1.5px solid ${C.border}`, borderRadius:6, padding:"8px 12px", color:C.ink, outline:"none", flex:1 }}/>
              <select value={filter} onChange={e => setFilter(e.target.value)}
                style={{ fontFamily:sans, fontSize:13, background:C.surface2, border:`1.5px solid ${C.border}`, borderRadius:6, padding:"8px 12px", color:C.ink, outline:"none" }}>
                <option value="all">All statuses</option>
                {Object.entries(STATUSES).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <span style={{ fontFamily:mono, fontSize:12, color:C.ink4, flexShrink:0 }}>{visible.length} leads</span>
            </div>
            <div style={{ padding:12, display:"flex", flexDirection:"column", gap:6 }}>
              {visible.length === 0 && <div style={{ textAlign:"center", padding:"56px 24px", color:C.ink4, fontSize:14 }}>No leads match your filter.</div>}
              {visible.map((l, i) => {
                const g = grade(l.score);
                const isAct = sel?.id === l.id;
                const plan = buildPitchPlan(l);
                const wp = webPill(l.hasWebsite);
                const stripBdr = TIER_BORDERS[plan[0].tier];
                return (
                  <div key={l.id} onClick={() => { setSelId(isAct ? null : l.id); setPitchTab(0); }}
                    style={{ background:isAct ? BRAND.bg : C.surface, border:`1.5px solid ${isAct ? BRAND.primary : C.border}`, borderRadius:12, padding:"14px 16px", cursor:"pointer", transition:"all .15s" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontFamily:mono, fontSize:11, color:C.ink4, width:20, textAlign:"center", flexShrink:0 }}>{i+1}</span>
                      <div style={{ width:36, height:36, borderRadius:8, background:g.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, fontWeight:700, color:g.color, fontFamily:mono, flexShrink:0 }}>{g.label}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:600, color:C.ink, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{l.name}</div>
                        <div style={{ fontSize:12, color:C.ink3, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{l.industry ? `${l.industry} · ` : ""}{l.address || l.city}</div>
                      </div>
                      <span style={{ fontSize:11, fontWeight:600, borderRadius:5, padding:"3px 9px", background:wp.bg, color:wp.color, border:wp.border, flexShrink:0 }}>{wp.label}</span>
                      <span style={{ fontFamily:mono, fontSize:18, fontWeight:700, color:g.color, width:34, textAlign:"right", flexShrink:0 }}>{l.score}</span>
                      <div style={{ width:8, height:8, borderRadius:"50%", background:STATUSES[l.status]?.dot||C.ink4, flexShrink:0 }}/>
                    </div>
                    <div style={{ marginTop:10, display:"flex", alignItems:"center", gap:8, padding:"7px 10px", background:isAct ? "#fff" : C.surface2, borderRadius:6, borderLeft:`3px solid ${stripBdr}` }}>
                      <span style={{ fontSize:14 }}>{plan[0].icon}</span>
                      <span style={{ fontSize:11, color:C.ink3 }}>Lead with</span>
                      <span style={{ fontSize:12, fontWeight:600, color:C.ink2 }}>{plan[0].label}</span>
                      <span style={{ fontSize:11, color:C.ink4, marginLeft:"auto", whiteSpace:"nowrap" }}>then {plan[1]?.icon} {plan[1]?.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DETAIL PANEL */}
          {sel && (() => {
            const p = pitch[pitchTab] || pitch[0];
            const g = grade(sel.score);
            const selWo = WEB_OPTS.find(o => o.val === sel.hasWebsite);
            return (
              <div style={{ width:"56%", overflowY:"auto", background:C.surface }}>
                <div style={{ padding:"24px 26px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:22, gap:16 }}>
                    <div style={{ minWidth:0 }}>
                      <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:BRAND.primary, color:"#fff", fontSize:11, fontWeight:700, letterSpacing:".5px", padding:"4px 10px", borderRadius:5, marginBottom:10 }}>
                        <span style={{ fontSize:13 }}>{selWo.emoji}</span>
                        Score {sel.score} · Grade {g.label}
                      </div>
                      <div style={{ fontSize:20, fontWeight:700, color:C.ink, letterSpacing:"-.4px", marginBottom:4, lineHeight:1.2 }}>{sel.name}</div>
                      <div style={{ fontSize:13, color:C.ink3, marginBottom:6 }}>{sel.industry}{sel.city ? ` · ${sel.city}` : ""}</div>
                      {sel.address && (
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(sel.address)}`} target="_blank" rel="noreferrer"
                          style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:12, color:BRAND.primary, textDecoration:"none", marginBottom:5 }}>
                          <svg width="10" height="13" viewBox="0 0 10 13" fill="none"><path d="M5 0C2.79 0 1 1.79 1 4c0 3 4 9 4 9s4-6 4-9c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 115 2.5 1.5 1.5 0 015 5.5z" fill="currentColor"/></svg>
                          {sel.address}
                        </a>
                      )}
                      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                        {sel.phone && <span style={{ fontSize:12, color:C.ink3 }}>📞 {sel.phone}</span>}
                        {sel.website
                          ? <a href={`https://${sel.website.replace(/^https?:\/\//,"")}`} target="_blank" rel="noreferrer" style={{ fontSize:12, color:BRAND.primary, textDecoration:"none" }}>🌐 {sel.website}</a>
                          : <span style={{ fontSize:12, color:C.red, fontWeight:600 }}>No website — web dev opportunity</span>
                        }
                      </div>
                    </div>
                    <button onClick={() => setSelId(null)} style={{ ...btnGhost, padding:"7px 14px", fontSize:13, flexShrink:0 }}>✕ Close</button>
                  </div>

                  <div style={secCard}>
                    <div style={secLabel}>Approach strategy</div>
                    <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                      {pitch.map((pt, i) => {
                        const ta = TIER_ACTIVE[pt.tcls];
                        const isActive = i === pitchTab;
                        return (
                          <div key={i} onClick={() => setPitchTab(i)} style={{ flex:1, padding:"12px 8px", borderRadius:10, cursor:"pointer", textAlign:"center", border:`1.5px solid ${isActive ? ta.border : C.border}`, background:isActive ? ta.bg : C.surface2, transition:"all .15s" }}>
                            <div style={{ fontSize:16, marginBottom:4 }}>{pt.icon}</div>
                            <div style={{ fontFamily:sans, fontSize:9, fontWeight:700, letterSpacing:".6px", textTransform:"uppercase", color:isActive ? ta.color : C.ink3, marginBottom:3 }}>{pt.tier}</div>
                            <div style={{ fontFamily:sans, fontSize:12, fontWeight:600, color:isActive ? ta.color : C.ink2 }}>{pt.label}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ background:C.surface2, borderRadius:9, padding:16 }}>
                      <p style={{ fontSize:13, color:C.ink2, lineHeight:1.7, marginBottom:14 }}>{p.why}</p>
                      <div style={{ marginBottom:12, paddingLeft:14, borderLeft:`3px solid ${TIER_BORDERS[p.tier]}`, borderRadius:0 }}>
                        <div style={{ fontSize:10, fontWeight:700, letterSpacing:".7px", textTransform:"uppercase", color:C.ink3, marginBottom:5 }}>Opening line</div>
                        <p style={{ fontSize:13, color:C.ink2, lineHeight:1.65, fontStyle:"italic", margin:0 }}>{p.ol}</p>
                      </div>
                      <div style={{ background:C.amberBg, border:`1.5px solid ${C.amberBdr}`, borderRadius:8, padding:"12px 14px" }}>
                        <div style={{ fontSize:10, fontWeight:700, letterSpacing:".7px", textTransform:"uppercase", color:C.amber, marginBottom:5 }}>Free audit hook</div>
                        <p style={{ fontSize:13, color:C.amber, lineHeight:1.6, margin:0 }}>{p.ah}</p>
                      </div>
                    </div>
                  </div>

                  <div style={secCard}>
                    <div style={secLabel}>Pipeline status</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                      {Object.entries(STATUSES).map(([k,v]) => {
                        const isOn = sel.status === k;
                        const colorMap = { new:[C.surface2,C.border2,C.ink], contacted:[BRAND.bg,BRAND.border,BRAND.primary], audit:[C.amberBg,C.amberBdr,C.amber], talking:[C.greenBg,C.greenBdr,C.green], won:[C.greenBg,C.greenBdr,C.green], lost:[C.redBg,C.redBdr,C.red] };
                        const [bg,bdr,txt] = colorMap[k]||[C.surface2,C.border2,C.ink];
                        return (
                          <button key={k} onClick={() => upd(sel.id,{status:k})} style={{ fontFamily:sans, fontSize:12, fontWeight:500, cursor:"pointer", borderRadius:6, padding:"6px 13px", border:`1.5px solid ${isOn ? bdr : C.border}`, background:isOn ? bg : "transparent", color:isOn ? txt : C.ink2, transition:"all .12s" }}>{v.label}</button>
                        );
                      })}
                    </div>
                    <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }} onClick={() => upd(sel.id,{auditDone:!sel.auditDone})}>
                      <div style={{ width:18, height:18, borderRadius:5, border:`1.5px solid ${sel.auditDone ? C.green : C.border2}`, background:sel.auditDone ? C.greenBg : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        {sel.auditDone && <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4.5l3.5 3.5 5.5-7" stroke={C.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <span style={{ fontSize:13, color:sel.auditDone ? C.green : C.ink2, fontWeight:sel.auditDone?500:400 }}>Free audit or deliverable has been sent</span>
                    </label>
                  </div>

                  <div style={secCard}>
                    <div style={secLabel}>Website presence <span style={{ textTransform:"none", letterSpacing:0, fontSize:11, fontWeight:400, color:C.ink4 }}>— updates pitch strategy above</span></div>
                    <div style={{ display:"flex", gap:8, marginBottom:18 }}>
                      {WEB_OPTS.map(o => {
                        const active = sel.hasWebsite === o.val;
                        return (
                          <button key={o.val} onClick={() => { upd(sel.id,{hasWebsite:o.val}); setPitchTab(0); }} style={{ flex:1, padding:"12px 8px", borderRadius:10, cursor:"pointer", textAlign:"center", fontFamily:sans, border:`1.5px solid ${active ? o.bdrColor : C.border}`, background:active ? o.bgColor : C.surface2, transition:"all .15s" }}>
                            <div style={{ fontSize:16, marginBottom:4 }}>{o.emoji}</div>
                            <div style={{ fontSize:12, fontWeight:600, color:active ? o.txtColor : C.ink2 }}>{o.label}</div>
                          </button>
                        );
                      })}
                    </div>
                    <div style={secLabel}>Lead signals</div>
                    {SIGNALS.map(sig => (
                      <SignalRow key={sig.k} label={sig.label} color={sig.color} value={sel[sig.k]} onChange={v => upd(sel.id,{[sig.k]:v})}/>
                    ))}
                    <div style={{ display:"flex", gap:6, marginTop:12 }}>
                      {["small","medium","large"].map(v => (
                        <button key={v} onClick={() => upd(sel.id,{size:v})} style={{ flex:1, padding:"9px", borderRadius:7, cursor:"pointer", fontFamily:sans, fontSize:12, fontWeight:600, border:`1.5px solid ${sel.size===v ? BRAND.border : C.border}`, background:sel.size===v ? BRAND.bg : C.surface2, color:sel.size===v ? BRAND.primary : C.ink2, textTransform:"capitalize", transition:"all .12s" }}>{v}</button>
                      ))}
                    </div>
                  </div>

                  <div style={secCard}>
                    <div style={secLabel}>Notes</div>
                    <textarea value={sel.notes} onChange={e => upd(sel.id,{notes:e.target.value})} rows={4}
                      placeholder="Pain points, decision maker name, audit findings, pricing notes…"
                      style={{ fontFamily:sans, fontSize:13, background:C.surface2, border:`1.5px solid ${C.border}`, borderRadius:6, padding:"11px 13px", color:C.ink, outline:"none", width:"100%", resize:"vertical", lineHeight:1.65, boxSizing:"border-box" }}/>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}