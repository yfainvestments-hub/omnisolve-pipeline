import React, { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
/* eslint-disable react-hooks/rules-of-hooks */

// ─── SUPABASE ────────────────────────────────────────────────────────
const SUPA_URL = "https://yzzdidevwtvrisgvtayo.supabase.co";
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6emRpZGV3d3R2cmlzZ3Z0YXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0OTczODEsImV4cCI6MjA5MDA3MzM4MX0.Mh5iLqxFTdDssjdF6FT0G0WMkA7Jgu1sd3uYMfpi45Q";
const db = createClient(SUPA_URL, SUPA_KEY);

// ─── PASSWORD ────────────────────────────────────────────────────────
const APP_PASSWORD = "omnisolve2025!!";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────
const BRAND = { name:"OmniSolve Systems", sub:"Prospect pipeline", primary:"#2563EB", dark:"#1D4ED8", bg:"#EFF4FF", border:"#BFCFFD" };
const C = {
  page:"#F8F9FB", surface:"#FFFFFF", surface2:"#F1F5F9", surface3:"#E8EDF4",
  border:"#DDE3ED", border2:"#C8D2E0",
  ink:"#111827", ink2:"#374151", ink3:"#6B7280", ink4:"#9CA3AF",
  green:"#047857", greenBg:"#ECFDF5", greenBdr:"#6EE7B7",
  amber:"#B45309", amberBg:"#FFFBEB", amberBdr:"#FCD34D",
  red:"#B91C1C", redBg:"#FFF1F1", redBdr:"#FCA5A5",
  purple:"#6D28D9", purpleBg:"#F5F3FF", purpleBdr:"#C4B5FD",
};
const sans = "system-ui, sans-serif";
const mono = "monospace";

// ─── BOARD COLUMNS ───────────────────────────────────────────────────
const BOARD_COLS = [
  { id:"backlog",   label:"Backlog",    color:"#6B7280", bg:"#F9FAFB" },
  { id:"contacted", label:"Contacted",  color:"#2563EB", bg:"#EFF4FF" },
  { id:"accepted",  label:"Accepted",   color:"#047857", bg:"#ECFDF5" },
  { id:"rejected",  label:"Rejected",   color:"#B91C1C", bg:"#FFF1F1" },
  { id:"inprogress",label:"In Progress",color:"#B45309", bg:"#FFFBEB" },
  { id:"done",      label:"Done",       color:"#6D28D9", bg:"#F5F3FF" },
];

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

// ─── PRICING ENGINE ──────────────────────────────────────────────────
const BASE_PRICING = {
  website:   { small:[1500,3000],   medium:[3000,6000],   large:[6000,15000]  },
  redesign:  { small:[800,2000],    medium:[2000,5000],   large:[5000,12000]  },
  cleaning:  { small:[500,1500],    medium:[1500,4000],   large:[4000,10000]  },
  etl:       { small:[3000,6000],   medium:[6000,15000],  large:[15000,40000] },
  dashboard: { small:[2000,4000],   medium:[4000,8000],   large:[8000,20000]  },
  reporting: { small:[1000,2500],   medium:[2500,6000],   large:[6000,15000]  },
  dba:       { small:[1500,3000],   medium:[3000,8000],   large:[8000,20000]  },
  api:       { small:[2000,4000],   medium:[4000,10000],  large:[10000,25000] },
  security:  { small:[1000,2500],   medium:[2500,6000],   large:[6000,15000]  },
};

const RETAINER_PRICING = {
  website:   { small:[200,400],     medium:[400,800],     large:[800,2000]    },
  redesign:  { small:[200,400],     medium:[400,800],     large:[800,2000]    },
  cleaning:  { small:[300,600],     medium:[600,1500],    large:[1500,4000]   },
  etl:       { small:[500,1000],    medium:[1000,2500],   large:[2500,6000]   },
  dashboard: { small:[300,600],     medium:[600,1500],    large:[1500,4000]   },
  reporting: { small:[300,500],     medium:[500,1200],    large:[1200,3000]   },
  dba:       { small:[400,800],     medium:[800,2000],    large:[2000,5000]   },
  api:       { small:[300,600],     medium:[600,1500],    large:[1500,3500]   },
  security:  { small:[400,800],     medium:[800,2000],    large:[2000,5000]   },
};

function getPricing(svcId, size, signals, isRetainer) {
  const table = isRetainer ? RETAINER_PRICING : BASE_PRICING;
  const base = table[svcId]?.[size] || table[svcId]?.medium || [1000,3000];
  const boost = signals >= 5 ? 1.25 : signals >= 4 ? 1.1 : 1;
  const lo = Math.round(base[0] * boost / 100) * 100;
  const hi = Math.round(base[1] * boost / 100) * 100;
  return [lo, hi];
}

function fmtPrice(lo, hi, mo) {
  const f = n => "$" + n.toLocaleString();
  return mo ? f(lo) + " - " + f(hi) + "/mo" : f(lo) + " - " + f(hi);
}

// ─── PITCH ENGINE ────────────────────────────────────────────────────
function dataServiceForIndustry(lead) {
  const ind = (lead.industry||"").toLowerCase();
  if (/health|medical|dental|clinic/.test(ind))            return { svc:"reporting", why:"HIPAA compliance pressure makes reporting an easy first win." };
  if (/gov|county|city|municipal/.test(ind))               return { svc:"reporting", why:"Government runs on mandated cycles. Automate one report to prove ROI." };
  if (/finance|bank|insurance|accounting|mortgage/.test(ind)) return { svc:"dba",    why:"Financial data needs clean schema and audit logs. DBA audit = fast wins." };
  if (/education|school|isd|university/.test(ind))         return { svc:"dashboard", why:"Districts have data but no visibility. A dashboard demo builds trust fast." };
  if (/retail|restaurant|food|liquor|store/.test(ind))     return { svc:"etl",       why:"Fragmented POS and inventory data. ETL delivers immediate operational value." };
  if (/energy|oil|construction|manufacturing/.test(ind))   return { svc:"etl",       why:"Siloed data across ERP and logistics. ETL connects everything." };
  if (lead.tech_stack>=4)   return { svc:"dba",       why:"Strong tech stack signals existing DBs. A DBA audit finds quick wins." };
  if (lead.data_signals>=4) return { svc:"cleaning",  why:"High data volume likely means messy records. A free sample proves value." };
  return { svc:"dashboard", why:"Dashboards create fast perceived ROI. Great first deliverable." };
}

function buildOpeningLine(svc, lead) {
  const n = lead.name, ind = lead.industry||"your industry";
  const lines = {
    website:   `"I noticed ${n} does not have a website yet. I put together a free mockup - mind if I send it over?"`,
    redesign:  `"I came across ${n}'s website and have a few ideas to modernize it. Want me to share the mockup?"`,
    dashboard: `"I built a sample dashboard for businesses like ${n} - the kind that takes 3 hours a week to update manually. Want to see it?"`,
    cleaning:  `"Most ${ind} businesses have inconsistent data and do not realize it. I found some patterns - mind if I share?"`,
    etl:       `"I noticed ${n} likely has data in multiple systems that do not talk. I can connect them - worth 15 minutes?"`,
    dba:       `"I did a quick analysis of database loads typical for ${ind} - usually 2-3 fixes cut query time significantly. Mind if I share?"`,
    reporting: `"I built a sample automated report for ${ind} businesses - the kind that takes 2 hours a week to pull manually. Want me to send it?"`,
    api:       `"I can connect ${n}'s systems so data flows automatically. I put together an integration map. Worth a look?"`,
    security:  `"I ran a quick data access audit on patterns typical for ${ind} - most businesses have 2-3 compliance gaps. I can walk you through it."`,
  };
  return lines[svc]||`"I looked at ${n}'s setup and have ideas that could save your team real time. Can I send a quick summary?"`;
}

function buildAuditHook(svc) {
  const hooks = {
    website:   "Build a 1-page homepage mockup with their branding. Send cold - show do not tell.",
    redesign:  "5-point site audit (mobile, speed, SSL, CTA, contact form) as a PDF before any call.",
    dashboard: "1-page mockup dashboard using their industry KPIs. Takes 30 min, opens every door.",
    cleaning:  "Ask for 50 rows of sample data. Return it cleaned with a written report of what was fixed.",
    etl:       "A simple before/after data flow diagram - fragmented state vs automated.",
    dba:       "Database health checklist PDF tailored to their industry. Positions you as the expert.",
    reporting: "Build one report they currently pull manually and send it done. Nothing sells automation like seeing it.",
    api:       "1-page integration map showing which systems could connect and what time that saves weekly.",
    security:  "Data risk assessment - 7 self-scoring questions. Follow up with your analysis.",
  };
  return hooks[svc]||"Lead with a free audit or sample deliverable. Give value before the ask.";
}

function buildPitchPlan(lead) {
  const hw = lead.has_website;
  const { svc, why } = dataServiceForIndustry(lead);
  const up  = ["dashboard","cleaning","etl","dba","reporting","api","security"].filter(s=>s!==svc);
  const ret = ["etl","dba","security","api","reporting"].filter(s=>s!==svc&&s!==up[0]);
  const size = lead.size||"medium";
  const sig  = lead.data_signals||3;

  const mkTier = (tier, tcls, svcId, whyTxt, isRet) => {
    const [lo,hi] = getPricing(svcId, size, sig, isRet);
    return { tier, tcls, ...SERVICES[svcId], why:whyTxt, ol:buildOpeningLine(svcId,lead), ah:buildAuditHook(svcId), priceLo:lo, priceHi:hi, isRetainer:isRet };
  };

  if (hw==="none") return [
    mkTier("LEAD WITH","lead","website","No web presence - lead with the website build. Do not mention data yet.",false),
    mkTier("UPSELL","up",svc,"Once the site is live they trust you. Now introduce data: "+why,false),
    mkTier("RETAINER","ret",ret[0]||"etl","Convert to recurring revenue with ongoing infrastructure support.",true),
  ];
  if (hw==="weak") return [
    mkTier("LEAD WITH","lead","redesign","Outdated site is a visible problem. Redesign opens the relationship.",false),
    mkTier("UPSELL","up",svc,why,false),
    mkTier("RETAINER","ret",up[0],"Ongoing data infrastructure keeps them on retainer after the redesign.",true),
  ];
  return [
    mkTier("LEAD WITH","lead",svc,why,false),
    mkTier("UPSELL","up",up[0],"First win delivered - now expand into "+SERVICES[up[0]].label+". Trust is established.",false),
    mkTier("RETAINER","ret",ret[0]||"api","Convert to a monthly retainer with ongoing support.",true),
  ];
}

function totalPriceRange(pitch) {
  const project = pitch.filter(p=>!p.isRetainer);
  const retainer = pitch.find(p=>p.isRetainer);
  const lo = project.reduce((a,p)=>a+p.priceLo,0);
  const hi = project.reduce((a,p)=>a+p.priceHi,0);
  return { projectLo:lo, projectHi:hi, retainerLo:retainer?.priceLo||0, retainerHi:retainer?.priceHi||0 };
}

// ─── SCORING ─────────────────────────────────────────────────────────
const sizeMap = { small:1, medium:3, large:5 };
function calcScore(l) {
  return Math.min(100, Math.round(
    ((sizeMap[l.size]||3)/5)*20+(l.data_signals/5)*25+(l.tech_stack/5)*15+
    (l.reachability/5)*15+(l.proximity/5)*10+
    (l.has_website==="none"?15:l.has_website==="weak"?8:0)+(l.web_data/5)*15
  ));
}
function grade(s) {
  if (s>=82) return { label:"A", color:C.green,       bg:C.greenBg };
  if (s>=66) return { label:"B", color:BRAND.primary, bg:BRAND.bg  };
  if (s>=50) return { label:"C", color:C.amber,       bg:C.amberBg };
  return           { label:"D", color:C.red,          bg:C.redBg   };
}
const WEB_OPTS = [
  { val:"none", label:"No website", emoji:"🚫", bdrColor:C.redBdr,   bgColor:C.redBg,   txtColor:C.red   },
  { val:"weak", label:"Weak site",  emoji:"⚠️", bdrColor:C.amberBdr, bgColor:C.amberBg, txtColor:C.amber },
  { val:"good", label:"Has site",   emoji:"✅", bdrColor:C.greenBdr, bgColor:C.greenBg, txtColor:C.green },
];
const SIZE_OPTS = [
  { val:"small",  label:"Small",  color:"#6B7280" },
  { val:"medium", label:"Medium", color:"#2563EB" },
  { val:"large",  label:"Large",  color:"#047857" },
];
const SIGNALS = [
  { k:"data_signals",  label:"Data signals",    color:"#2563EB" },
  { k:"tech_stack",    label:"Tech stack",      color:"#047857" },
  { k:"reachability",  label:"Reachability",    color:"#B45309" },
  { k:"proximity",     label:"Proximity",       color:"#6D28D9" },
  { k:"web_data",      label:"Web / data need", color:"#B91C1C" },
];
const TIER_BORDERS = { "LEAD WITH":C.greenBdr, "UPSELL":BRAND.border, "RETAINER":C.purpleBdr };
const TIER_ACTIVE  = {
  lead:{ border:C.greenBdr,   bg:C.greenBg,  color:C.green       },
  up:  { border:BRAND.border, bg:BRAND.bg,   color:BRAND.primary },
  ret: { border:C.purpleBdr,  bg:C.purpleBg, color:C.purple      },
};

function webPill(val) {
  const o = WEB_OPTS.find(x=>x.val===val)||WEB_OPTS[0];
  return { bg:o.bgColor, color:o.txtColor, border:"1px solid "+o.bdrColor, label:o.label };
}
function sizePill(val) {
  const o = SIZE_OPTS.find(x=>x.val===val)||SIZE_OPTS[1];
  return { color:o.color, label:o.label };
}

// ─── PASSWORD GATE ───────────────────────────────────────────────────
function PasswordGate({ onUnlock }) {
  const [input,setInput]=useState(""); const [error,setError]=useState(false); const [show,setShow]=useState(false);
  const tryUnlock=()=>{ if(input===APP_PASSWORD){localStorage.setItem("omni-auth",APP_PASSWORD);onUnlock();}else{setError(true);setTimeout(()=>setError(false),2000);} };
  return (
    <div style={{ minHeight:"100vh",background:"#F8F9FB",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:sans }}>
      <div style={{ background:"#fff",border:"1px solid #DDE3ED",borderRadius:16,padding:"40px 36px",width:"100%",maxWidth:400,textAlign:"center" }}>
        <div style={{ width:48,height:48,borderRadius:12,background:"#2563EB",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px" }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="1" y="1" width="9" height="9" rx="2" fill="white"/><rect x="12" y="1" width="9" height="9" rx="2" fill="white" opacity=".4"/><rect x="1" y="12" width="9" height="9" rx="2" fill="white" opacity=".4"/><rect x="12" y="12" width="9" height="9" rx="2" fill="white"/></svg>
        </div>
        <div style={{ fontSize:20,fontWeight:700,color:"#111827",marginBottom:6 }}>OmniSolve Systems</div>
        <div style={{ fontSize:14,color:"#6B7280",marginBottom:28 }}>Prospect Pipeline - Private Access</div>
        <div style={{ position:"relative",marginBottom:12 }}>
          <input type={show?"text":"password"} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryUnlock()} placeholder="Enter password"
            style={{ width:"100%",fontFamily:"inherit",fontSize:14,padding:"11px 44px 11px 14px",borderRadius:8,border:"1.5px solid "+(error?"#FCA5A5":"#DDE3ED"),background:error?"#FFF1F1":"#F8F9FB",color:"#111827",outline:"none",boxSizing:"border-box" }}/>
          <button onClick={()=>setShow(p=>!p)} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#9CA3AF",fontSize:13,fontFamily:"inherit" }}>{show?"Hide":"Show"}</button>
        </div>
        {error&&<div style={{ fontSize:12,color:"#B91C1C",marginBottom:10,fontWeight:500 }}>Incorrect password - try again</div>}
        <button onClick={tryUnlock} style={{ width:"100%",fontFamily:"inherit",fontSize:14,fontWeight:600,padding:"11px",borderRadius:8,border:"none",background:"#2563EB",color:"#fff",cursor:"pointer" }}>Unlock</button>
        <div style={{ fontSize:11,color:"#9CA3AF",marginTop:16 }}>Private tool - authorized access only</div>
      </div>
    </div>
  );
}

// ─── SIGNAL ROW ──────────────────────────────────────────────────────
function SignalRow({ label, color, value, onChange }) {
  return (
    <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:10 }}>
      <span style={{ fontFamily:sans,fontSize:12,fontWeight:500,color:C.ink2,width:106,flexShrink:0 }}>{label}</span>
      <div style={{ flex:1,height:6,background:C.surface3,borderRadius:3,overflow:"hidden" }}>
        <div style={{ height:"100%",width:((value/5)*100)+"%",background:color,borderRadius:3 }}/>
      </div>
      <div style={{ display:"flex",gap:4 }}>
        {[1,2,3,4,5].map(v=>(
          <button key={v} onClick={()=>onChange(v)} style={{ width:26,height:26,borderRadius:5,cursor:"pointer",fontFamily:mono,fontWeight:600,fontSize:11,display:"flex",alignItems:"center",justifyContent:"center",border:"1.5px solid "+(value>=v?color:C.border),background:value>=v?color+"18":C.surface2,color:value>=v?color:C.ink3 }}>{v}</button>
        ))}
      </div>
    </div>
  );
}

// ─── INSTRUCTIONS ────────────────────────────────────────────────────
function InstructionsTab() {
  const sec = (title,items) => (
    <div style={{ marginBottom:28 }}>
      <div style={{ fontSize:15,fontWeight:700,color:C.ink,marginBottom:12,paddingBottom:8,borderBottom:"1.5px solid "+C.border }}>{title}</div>
      {items.map((item,i)=>(
        <div key={i} style={{ display:"flex",gap:12,marginBottom:10 }}>
          <div style={{ width:24,height:24,borderRadius:"50%",background:BRAND.bg,border:"1.5px solid "+BRAND.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:BRAND.primary,flexShrink:0,marginTop:1 }}>{i+1}</div>
          <div style={{ fontSize:13,color:C.ink2,lineHeight:1.7 }} dangerouslySetInnerHTML={{ __html:item }}/>
        </div>
      ))}
    </div>
  );
  return (
    <div style={{ maxWidth:760,margin:"0 auto",padding:"32px 28px" }}>
      <h2 style={{ fontSize:22,fontWeight:700,color:C.ink,marginBottom:4,letterSpacing:"-.4px" }}>How to use this tool</h2>
      <p style={{ fontSize:14,color:C.ink3,lineHeight:1.7,marginBottom:32 }}>OmniSolve Prospect Pipeline - your end-to-end system for finding, scoring, and closing data services clients in the DFW area.</p>
      {sec("Step 1 - Find leads with Live Search",[
        'Click <strong>Live Search</strong> in the top nav. Paste your Google Places API key if not already set.',
        'Search for businesses by type and location. Examples: <strong>"medical clinic Forney TX"</strong>, <strong>"accounting firm 75126"</strong>, <strong>"school Kaufman County TX"</strong>.',
        'Results appear with a score (0-100), grade (A/B/C/D), website status, company size, and estimated project value.',
        'Click <strong>+ Add to Board</strong> on any result. It goes straight into the Backlog column of your project board.',
        'Focus on Grade A and B leads first. Leads with no website are flagged in amber - those are your easiest opens because you have two services to offer.',
      ])}
      {sec("Step 2 - Work your board",[
        'Click <strong>Board</strong> in the top nav. All leads you added are in Backlog.',
        'When you reach out to a lead, drag or move them to <strong>Contacted</strong>.',
        'Once they respond, click <strong>Accept</strong> to move them to In Progress, or <strong>Reject</strong> to move them to Rejected.',
        'Accepted leads move through <strong>In Progress</strong> then <strong>Done</strong> when the deal closes.',
        'Each card shows the recommended first service, pricing range, and company size at a glance.',
      ])}
      {sec("Step 3 - Use the approach strategy",[
        'Click any lead card to open the detail panel on the right.',
        'The <strong>Approach Strategy</strong> section shows three tiers: Lead With, Upsell, and Retainer.',
        'Each tier has a ready-to-use <strong>Opening Line</strong> - copy it directly for email or LinkedIn outreach.',
        'The <strong>Free Audit Hook</strong> tells you exactly what to build and send before any sales call. This is your door-opener.',
        'Pricing ranges update automatically based on company size and data signals. Large companies with high signals get pushed to the top of the range.',
      ])}
      {sec("Step 4 - Manage tasks per lead",[
        'In the detail panel scroll to <strong>Tasks</strong>. Add follow-up tasks like "Send mockup", "Follow up call", "Deliver audit".',
        'Set priority (High / Medium / Low) and due dates so nothing falls through the cracks.',
        'Tasks sync to the cloud via Supabase - they persist across devices and browsers.',
      ])}
      {sec("Step 5 - Get consistent leads with Outscraper (backup)",[
        'Sign up free at <strong>outscraper.com</strong> - 500 records/month free, no credit card.',
        'Search an industry + ZIP code, download as CSV, use the <strong>CSV Import</strong> tab to bulk-load leads.',
        'Run searches by ZIP code to work around Google Maps 120-result cap. Example: run "clinic 75126", "clinic 75142", "clinic 75149" separately.',
      ])}
      {sec("Scoring guide",[
        '<strong>Grade A (82-100)</strong> - High priority. Large company, strong data signals, reachable decision maker. Reach out this week.',
        '<strong>Grade B (66-81)</strong> - Good lead. Solid signals, worth pursuing. Put in Backlog and work through.',
        '<strong>Grade C (50-65)</strong> - Moderate. May need more research. Add and revisit.',
        '<strong>Grade D (below 50)</strong> - Low priority. Only pursue if you have capacity.',
        '<strong>No Website bonus</strong> - Adds 15 points to score. These leads get web dev + data services = higher total contract value.',
      ])}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────
export default function App() {
  const [unlocked,  setUnlocked]  = useState(()=>localStorage.getItem("omni-auth")===APP_PASSWORD);
  const [leads,     setLeads]     = useState([]);
  const [tasks,     setTasks]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [selId,     setSelId]     = useState(null);
  const [tab,       setTab]       = useState("search");
  const [filter,    setFilter]    = useState("all");
  const [search,    setSearch]    = useState("");

  const [apiKey,    setApiKey]    = useState(()=>localStorage.getItem("omni-gkey")||"");
  const [searchQ,   setSearchQ]   = useState("");
  const [searching, setSearching] = useState(false);
  const [results,   setResults]   = useState([]);
  const [searchErr, setSearchErr] = useState("");
  const [csvRaw,    setCsvRaw]    = useState("");
  const [newTask,   setNewTask]   = useState({ title:"", priority:"medium", due_date:"" });
  const [boardSel,  setBoardSel]  = useState(null);

  const saveKey = useCallback(k=>{setApiKey(k);localStorage.setItem("omni-gkey",k);},[]);

  // ── Supabase load ──────────────────────────────────────────────────
  useEffect(()=>{
    if(!unlocked) return;
    async function load(){
      setLoading(true);
      const { data:ld } = await db.from("leads").select("*").order("created_at",{ascending:false});
      const { data:td } = await db.from("tasks").select("*").order("created_at",{ascending:true});
      setLeads(ld||[]);
      setTasks(td||[]);
      setLoading(false);
    }
    load();
  },[unlocked]);

  const scored = useMemo(()=>leads.map(l=>({...l,score:calcScore(l)})).sort((a,b)=>b.score-a.score),[leads]);
  const visible = useMemo(()=>scored.filter(l=>(filter==="all"||l.status===filter)&&[l.name,l.industry,l.address,l.city].some(f=>(f||"").toLowerCase().includes(search.toLowerCase()))),[scored,filter,search]);
  const sel = useMemo(()=>scored.find(l=>l.id===selId)||null,[scored,selId]);
  const pitch = useMemo(()=>sel?buildPitchPlan(sel):[],[sel]);
  const boardSelled = useMemo(()=>scored.find(l=>l.id===boardSel)||null,[scored,boardSel]);
  const boardPitch = useMemo(()=>boardSelled?buildPitchPlan(boardSelled):[],[boardSelled]);

  const updLead = useCallback(async(id,ch)=>{
    setLeads(p=>p.map(l=>l.id===id?{...l,...ch}:l));
    await db.from("leads").update(ch).eq("id",id);
  },[]);

  const addLeadFromResult = useCallback(async(r)=>{
    const newLead = {
      name:r.name, industry:r.industry, city:r.city, address:r.address,
      phone:r.phone, website:r.website, has_website:r.hasWebsite,
      size:"medium", data_signals:3, tech_stack:3, reachability:3, proximity:3, web_data:3,
      status:"backlog", notes:"Rating: "+(r.rating||"?")+" - "+(r.reviews||0)+" reviews",
      audit_done:false, assigned_to:"Yared",
    };
    const { data } = await db.from("leads").insert(newLead).select().single();
    if(data){ setLeads(p=>[data,...p]); setResults(prev=>prev.filter(x=>x._id!==r._id)); }
  },[]);

  const addTask = useCallback(async(leadId)=>{
    if(!newTask.title.trim()) return;
    const t = { lead_id:leadId, title:newTask.title, priority:newTask.priority, due_date:newTask.due_date||null, assigned_to:"Yared", status:"todo" };
    const { data } = await db.from("tasks").insert(t).select().single();
    if(data){ setTasks(p=>[...p,data]); setNewTask({ title:"",priority:"medium",due_date:"" }); }
  },[newTask]);

  const updTask = useCallback(async(id,ch)=>{
    setTasks(p=>p.map(t=>t.id===id?{...t,...ch}:t));
    await db.from("tasks").update(ch).eq("id",id);
  },[]);

  const delTask = useCallback(async(id)=>{
    setTasks(p=>p.filter(t=>t.id!==id));
    await db.from("tasks").delete().eq("id",id);
  },[]);

  // ── Live search ────────────────────────────────────────────────────
  const runSearch = useCallback(async()=>{
    if(!apiKey.trim()){setSearchErr("Add your Google Places API key first.");return;}
    if(!searchQ.trim()){setSearchErr("Enter a search query.");return;}
    setSearching(true);setSearchErr("");setResults([]);
    try{
      const res=await fetch("https://places.googleapis.com/v1/places:searchText",{
        method:"POST",
        headers:{"Content-Type":"application/json","X-Goog-Api-Key":apiKey.trim(),"X-Goog-FieldMask":"places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.types,places.rating,places.userRatingCount"},
        body:JSON.stringify({textQuery:searchQ,maxResultCount:20}),
      });
      const data=await res.json();
      if(data.error){setSearchErr("API error: "+data.error.message);return;}
      const gI=(types,q)=>{
        const m={Healthcare:["health","clinic","dental","doctor","medical"],Finance:["bank","finance","accounting","mortgage","insurance"],Education:["school","university","isd"],Government:["gov","county"],Energy:["energy","oil","construction"],Food:["restaurant","food","cafe"]};
        const ql=q.toLowerCase();
        for(const[k,kw]of Object.entries(m))if(kw.some(w=>ql.includes(w)))return k;
        for(const[k,kw]of Object.entries(m))if(types.some(t=>kw.some(w=>t.includes(w))))return k;
        return(types[0]||"").replace(/_/g," ");
      };
      setResults((data.places||[]).map((p,i)=>({
        _id:i,name:p.displayName?.text||"",address:p.formattedAddress||"",
        city:(p.formattedAddress||"").split(",").slice(-3,-1).join(",").trim(),
        phone:p.nationalPhoneNumber||"",website:(p.websiteUri||"").replace(/\/$/,""),
        hasWebsite:p.websiteUri?"good":"none",industry:gI(p.types||[],searchQ),
        rating:p.rating||0,reviews:p.userRatingCount||0,size:"medium",
        data_signals:3,tech_stack:3,reachability:3,proximity:3,web_data:3,
      })));
    }catch(e){setSearchErr("Error: "+e.message);}
    finally{setSearching(false);}
  },[apiKey,searchQ]);

  const importCsv = useCallback(async()=>{
    const lines=csvRaw.trim().split("\n");if(lines.length<2)return;
    const h=lines[0].split(",").map(x=>x.trim().replace(/"/g,"").toLowerCase());
    const g=(row,keys)=>{for(const k of keys){const i=h.findIndex(x=>x.includes(k));if(i>=0&&row[i])return row[i].replace(/"/g,"").trim();}return "";};
    const batch=[];
    for(let i=1;i<lines.length;i++){
      const row=lines[i].split(",");const name=g(row,["name","title","business"]);if(!name)continue;
      const website=g(row,["website","site","url"]);
      batch.push({name,industry:g(row,["category","type","industry"]),city:g(row,["city","state"]),address:g(row,["address","street","location"]),phone:g(row,["phone","telephone"]),website,has_website:website?"good":"none",size:"medium",data_signals:3,tech_stack:3,reachability:3,proximity:3,web_data:3,status:"backlog",notes:"",audit_done:false,assigned_to:"Yared"});
    }
    if(batch.length){
      const{data}=await db.from("leads").insert(batch).select();
      if(data)setLeads(p=>[...data,...p]);
    }
    setCsvRaw("");setTab("board");
  },[csvRaw]);

  // ─── SHARED STYLES ────────────────────────────────────────────────
  const fi={fontFamily:sans,fontSize:14,background:C.surface,border:"1.5px solid "+C.border,borderRadius:6,padding:"10px 13px",color:C.ink,outline:"none",width:"100%",boxSizing:"border-box"};
  const bp={fontFamily:sans,fontSize:14,fontWeight:600,cursor:"pointer",borderRadius:6,padding:"11px 26px",border:"none",background:BRAND.primary,color:"#fff"};
  const bgh={fontFamily:sans,fontSize:14,fontWeight:500,cursor:"pointer",borderRadius:6,padding:"11px 26px",border:"1.5px solid "+C.border,background:"transparent",color:C.ink2};
  const sc={background:C.surface,border:"1.5px solid "+C.border,borderRadius:12,padding:"18px 20px",marginBottom:14};
  const sl={fontFamily:sans,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".8px",color:C.ink3,marginBottom:14};

  useEffect(()=>{if(!unlocked)return;},[]); // eslint-disable-line

  if(!unlocked) return <PasswordGate onUnlock={()=>setUnlocked(true)}/>;

  const stats={
    total:leads.length,
    backlog:leads.filter(l=>l.status==="backlog").length,
    inprogress:leads.filter(l=>l.status==="inprogress").length,
    done:leads.filter(l=>l.status==="done").length,
  };

  // ─── DETAIL PANEL (shared between pipeline and board) ─────────────
  function DetailPanel({ lead, pitchPlan, onClose, tasks:allTasks, updLead:updLeadFn, tasks2, newTask2, setNewTask2, addTask2, updTask2, delTask2 }) {
    if(!lead) return null;
    const g=grade(calcScore(lead));
    const wo=WEB_OPTS.find(o=>o.val===lead.has_website)||WEB_OPTS[0];
    const sp=sizePill(lead.size);
    const totals=totalPriceRange(pitchPlan);
    const leadTasks=(allTasks||[]).filter(t=>t.lead_id===lead.id);
    const [localPitchTab,setLocalPitchTab]=useState(0); // eslint-disable-line
    const p=pitchPlan[localPitchTab]||pitchPlan[0];

    return (
      <div style={{ width:"54%",overflowY:"auto",background:C.surface,borderLeft:"1px solid "+C.border }}>
        <div style={{ padding:"22px 24px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20,gap:16 }}>
            <div style={{ minWidth:0 }}>
              <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:8,flexWrap:"wrap" }}>
                <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:BRAND.primary,color:"#fff",fontSize:11,fontWeight:700,letterSpacing:".5px",padding:"4px 10px",borderRadius:5 }}>
                  {wo.emoji} Score {calcScore(lead)} - Grade {g.label}
                </div>
                <div style={{ fontSize:11,fontWeight:600,padding:"3px 9px",borderRadius:5,background:C.surface2,border:"1.5px solid "+C.border,color:sp.color }}>{sp.label}</div>
              </div>
              <div style={{ fontSize:19,fontWeight:700,color:C.ink,marginBottom:3,letterSpacing:"-.3px" }}>{lead.name}</div>
              <div style={{ fontSize:13,color:C.ink3,marginBottom:5 }}>{lead.industry}{lead.city?" - "+lead.city:""}</div>
              {lead.address&&<a href={"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(lead.address)} target="_blank" rel="noreferrer" style={{ display:"inline-flex",alignItems:"center",gap:4,fontSize:12,color:BRAND.primary,textDecoration:"none",marginBottom:5 }}><svg width="10" height="13" viewBox="0 0 10 13" fill="none"><path d="M5 0C2.79 0 1 1.79 1 4c0 3 4 9 4 9s4-6 4-9c0-2.21-1.79-4-4-4zm0 5.5A1.5 1.5 0 115 2.5 1.5 1.5 0 015 5.5z" fill="currentColor"/></svg>{lead.address}</a>}
              <div style={{ display:"flex",gap:14,flexWrap:"wrap" }}>
                {lead.phone&&<span style={{ fontSize:12,color:C.ink3 }}>📞 {lead.phone}</span>}
                {lead.website?<a href={"https://"+lead.website.replace(/^https?:\/\//,"")} target="_blank" rel="noreferrer" style={{ fontSize:12,color:BRAND.primary,textDecoration:"none" }}>🌐 {lead.website}</a>:<span style={{ fontSize:12,color:C.red,fontWeight:600 }}>No website - web dev opportunity</span>}
              </div>
            </div>
            <button onClick={onClose} style={{ ...bgh,padding:"6px 12px",fontSize:12,flexShrink:0 }}>Close</button>
          </div>

          {/* TOTAL PRICE SUMMARY */}
          <div style={{ background:"linear-gradient(135deg, #EFF4FF, #F5F3FF)",border:"1.5px solid "+BRAND.border,borderRadius:12,padding:"14px 18px",marginBottom:14 }}>
            <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".8px",color:C.ink3,marginBottom:8 }}>Estimated contract value</div>
            <div style={{ display:"flex",gap:20,flexWrap:"wrap" }}>
              <div>
                <div style={{ fontSize:18,fontWeight:700,color:BRAND.primary }}>{"$"+totals.projectLo.toLocaleString()+" - $"+totals.projectHi.toLocaleString()}</div>
                <div style={{ fontSize:11,color:C.ink3,marginTop:2 }}>Project total</div>
              </div>
              <div>
                <div style={{ fontSize:18,fontWeight:700,color:C.purple }}>{"$"+totals.retainerLo.toLocaleString()+" - $"+totals.retainerHi.toLocaleString()+"/mo"}</div>
                <div style={{ fontSize:11,color:C.ink3,marginTop:2 }}>Monthly retainer</div>
              </div>
            </div>
          </div>

          {/* APPROACH STRATEGY */}
          <div style={sc}>
            <div style={sl}>Approach strategy</div>
            <div style={{ display:"flex",gap:6,marginBottom:14 }}>
              {pitchPlan.map((pt,i)=>{
                const ta=TIER_ACTIVE[pt.tcls];const isActive=i===localPitchTab;
                return (
                  <div key={i} onClick={()=>setLocalPitchTab(i)} style={{ flex:1,padding:"10px 6px",borderRadius:9,cursor:"pointer",textAlign:"center",border:"1.5px solid "+(isActive?ta.border:C.border),background:isActive?ta.bg:C.surface2 }}>
                    <div style={{ fontSize:14,marginBottom:3 }}>{pt.icon}</div>
                    <div style={{ fontFamily:sans,fontSize:8,fontWeight:700,letterSpacing:".6px",textTransform:"uppercase",color:isActive?ta.color:C.ink3,marginBottom:2 }}>{pt.tier}</div>
                    <div style={{ fontFamily:sans,fontSize:11,fontWeight:600,color:isActive?ta.color:C.ink2,marginBottom:3 }}>{pt.label}</div>
                    <div style={{ fontFamily:sans,fontSize:11,fontWeight:700,color:isActive?ta.color:C.ink3 }}>{fmtPrice(pt.priceLo,pt.priceHi,pt.isRetainer)}</div>
                  </div>
                );
              })}
            </div>
            {p&&(
              <div style={{ background:C.surface2,borderRadius:9,padding:14 }}>
                <p style={{ fontSize:13,color:C.ink2,lineHeight:1.7,marginBottom:12 }}>{p.why}</p>
                <div style={{ marginBottom:10,paddingLeft:12,borderLeft:"3px solid "+TIER_BORDERS[p.tier] }}>
                  <div style={{ fontSize:9,fontWeight:700,letterSpacing:".7px",textTransform:"uppercase",color:C.ink3,marginBottom:4 }}>Opening line</div>
                  <p style={{ fontSize:12,color:C.ink2,lineHeight:1.65,fontStyle:"italic",margin:0 }}>{p.ol}</p>
                </div>
                <div style={{ background:C.amberBg,border:"1.5px solid "+C.amberBdr,borderRadius:7,padding:"10px 12px" }}>
                  <div style={{ fontSize:9,fontWeight:700,letterSpacing:".7px",textTransform:"uppercase",color:C.amber,marginBottom:4 }}>Free audit hook</div>
                  <p style={{ fontSize:12,color:C.amber,lineHeight:1.6,margin:0 }}>{p.ah}</p>
                </div>
              </div>
            )}
          </div>

          {/* WEBSITE + SIGNALS */}
          <div style={sc}>
            <div style={sl}>Website presence</div>
            <div style={{ display:"flex",gap:7,marginBottom:16 }}>
              {WEB_OPTS.map(o=>{const active=lead.has_website===o.val;return(
                <button key={o.val} onClick={()=>updLead(lead.id,{has_website:o.val})} style={{ flex:1,padding:"10px 6px",borderRadius:9,cursor:"pointer",textAlign:"center",fontFamily:sans,border:"1.5px solid "+(active?o.bdrColor:C.border),background:active?o.bgColor:C.surface2 }}>
                  <div style={{ fontSize:14,marginBottom:3 }}>{o.emoji}</div>
                  <div style={{ fontSize:11,fontWeight:600,color:active?o.txtColor:C.ink2 }}>{o.label}</div>
                </button>
              );})}
            </div>
            <div style={sl}>Company size</div>
            <div style={{ display:"flex",gap:7,marginBottom:16 }}>
              {SIZE_OPTS.map(o=>{const active=lead.size===o.val;return(
                <button key={o.val} onClick={()=>updLead(lead.id,{size:o.val})} style={{ flex:1,padding:"9px",borderRadius:7,cursor:"pointer",fontFamily:sans,fontSize:12,fontWeight:600,border:"1.5px solid "+(active?o.color:C.border),background:active?o.color+"18":C.surface2,color:active?o.color:C.ink2 }}>{o.label}</button>
              );})}
            </div>
            <div style={sl}>Lead signals</div>
            {SIGNALS.map(sig=><SignalRow key={sig.k} label={sig.label} color={sig.color} value={lead[sig.k]||3} onChange={v=>updLead(lead.id,{[sig.k]:v})}/>)}
          </div>

          {/* TASKS */}
          <div style={sc}>
            <div style={sl}>Tasks</div>
            {leadTasks.length===0&&<div style={{ fontSize:13,color:C.ink4,marginBottom:12 }}>No tasks yet - add one below.</div>}
            {leadTasks.map(t=>(
              <div key={t.id} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 12px",border:"1px solid "+C.border,borderRadius:8,marginBottom:7,background:t.status==="done"?C.greenBg:C.surface2 }}>
                <input type="checkbox" checked={t.status==="done"} onChange={e=>updTask(t.id,{status:e.target.checked?"done":"todo"})} style={{ width:16,height:16,cursor:"pointer",flexShrink:0 }}/>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:13,color:t.status==="done"?C.ink3:C.ink,textDecoration:t.status==="done"?"line-through":"none",fontWeight:500 }}>{t.title}</div>
                  {t.due_date&&<div style={{ fontSize:11,color:C.ink3,marginTop:2 }}>Due: {t.due_date}</div>}
                </div>
                <div style={{ fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:4,background:t.priority==="high"?C.redBg:t.priority==="low"?C.greenBg:C.amberBg,color:t.priority==="high"?C.red:t.priority==="low"?C.green:C.amber,flexShrink:0 }}>{t.priority}</div>
                <button onClick={()=>delTask(t.id)} style={{ background:"none",border:"none",cursor:"pointer",color:C.ink4,fontSize:16,flexShrink:0,padding:"0 4px" }}>×</button>
              </div>
            ))}
            <div style={{ display:"flex",gap:8,marginTop:10,flexWrap:"wrap" }}>
              <input value={newTask.title} onChange={e=>setNewTask(p=>({...p,title:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&addTask(lead.id)} placeholder="Add a task..." style={{ ...fi,flex:1,minWidth:120,padding:"8px 11px",fontSize:12 }}/>
              <select value={newTask.priority} onChange={e=>setNewTask(p=>({...p,priority:e.target.value}))} style={{ fontFamily:sans,fontSize:12,background:C.surface2,border:"1.5px solid "+C.border,borderRadius:6,padding:"8px 10px",color:C.ink,outline:"none" }}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input type="date" value={newTask.due_date} onChange={e=>setNewTask(p=>({...p,due_date:e.target.value}))} style={{ fontFamily:sans,fontSize:12,background:C.surface2,border:"1.5px solid "+C.border,borderRadius:6,padding:"8px 10px",color:C.ink,outline:"none" }}/>
              <button onClick={()=>addTask(lead.id)} style={{ ...bp,padding:"8px 16px",fontSize:12 }}>Add</button>
            </div>
          </div>

          {/* NOTES */}
          <div style={sc}>
            <div style={sl}>Notes</div>
            <textarea value={lead.notes||""} onChange={e=>updLead(lead.id,{notes:e.target.value})} rows={3} placeholder="Pain points, decision maker, audit findings, pricing notes..."
              style={{ fontFamily:sans,fontSize:13,background:C.surface2,border:"1.5px solid "+C.border,borderRadius:6,padding:"10px 12px",color:C.ink,outline:"none",width:"100%",resize:"vertical",lineHeight:1.65,boxSizing:"border-box" }}/>
          </div>
        </div>
      </div>
    );
  }

  // ─── BOARD TAB ────────────────────────────────────────────────────
  function BoardTab() {
    return (
      <div style={{ display:"flex",height:"calc(100vh - 60px)" }}>
        <div style={{ flex:1,overflowX:"auto",overflowY:"hidden",padding:"20px 20px 0" }}>
          <div style={{ display:"flex",gap:14,height:"100%",minWidth:"max-content" }}>
            {BOARD_COLS.map(col=>{
              const colLeads=scored.filter(l=>l.status===col.id);
              return (
                <div key={col.id} style={{ width:260,display:"flex",flexDirection:"column",height:"calc(100vh - 100px)" }}>
                  <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 12px",background:col.bg,border:"1.5px solid "+C.border,borderRadius:"10px 10px 0 0",flexShrink:0 }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <div style={{ width:10,height:10,borderRadius:"50%",background:col.color }}/>
                      <span style={{ fontSize:13,fontWeight:700,color:C.ink }}>{col.label}</span>
                    </div>
                    <span style={{ fontSize:12,fontWeight:600,color:col.color,background:col.bg,border:"1px solid "+col.color+"44",borderRadius:10,padding:"1px 8px" }}>{colLeads.length}</span>
                  </div>
                  <div style={{ flex:1,overflowY:"auto",border:"1.5px solid "+C.border,borderTop:"none",borderRadius:"0 0 10px 10px",background:C.page,padding:8,display:"flex",flexDirection:"column",gap:7 }}>
                    {colLeads.length===0&&<div style={{ fontSize:12,color:C.ink4,textAlign:"center",padding:"24px 8px" }}>No leads</div>}
                    {colLeads.map(l=>{
                      const g=grade(l.score);
                      const plan=buildPitchPlan(l);
                      const leadWith=plan[0];
                      const wp=webPill(l.has_website);
                      const sp=sizePill(l.size);
                      const ltasks=tasks.filter(t=>t.lead_id===l.id);
                      const isSelected=boardSel===l.id;
                      return (
                        <div key={l.id} onClick={()=>setBoardSel(isSelected?null:l.id)} style={{ background:isSelected?BRAND.bg:C.surface,border:"1.5px solid "+(isSelected?BRAND.primary:C.border),borderRadius:9,padding:"11px 12px",cursor:"pointer",transition:"all .12s" }}>
                          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:7 }}>
                            <div style={{ width:28,height:28,borderRadius:6,background:g.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:g.color,fontFamily:mono,flexShrink:0 }}>{g.label}</div>
                            <div style={{ flex:1,minWidth:0 }}>
                              <div style={{ fontSize:12,fontWeight:600,color:C.ink,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{l.name}</div>
                              <div style={{ fontSize:10,color:C.ink3,marginTop:1 }}>{l.industry||""}</div>
                            </div>
                          </div>
                          <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginBottom:7 }}>
                            <span style={{ fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:wp.bg,color:wp.color,border:wp.border }}>{wp.label}</span>
                            <span style={{ fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:C.surface2,border:"1px solid "+C.border,color:sp.color }}>{sp.label}</span>
                            {ltasks.length>0&&<span style={{ fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:C.purpleBg,color:C.purple,border:"1px solid "+C.purpleBdr }}>{ltasks.filter(t=>t.status==="done").length}/{ltasks.length} tasks</span>}
                          </div>
                          <div style={{ display:"flex",alignItems:"center",gap:5,padding:"5px 8px",background:C.surface2,borderRadius:5,borderLeft:"2px solid "+leadWith.color||C.border2,marginBottom:7 }}>
                            <span style={{ fontSize:12 }}>{leadWith.icon}</span>
                            <span style={{ fontSize:10,color:C.ink3 }}>Lead: </span>
                            <span style={{ fontSize:10,fontWeight:600,color:C.ink2 }}>{leadWith.label}</span>
                          </div>
                          <div style={{ fontSize:11,fontWeight:700,color:BRAND.primary,marginBottom:8 }}>{"$"+leadWith.priceLo.toLocaleString()+" - $"+leadWith.priceHi.toLocaleString()}</div>
                          {/* Action buttons */}
                          <div style={{ display:"flex",gap:5,flexWrap:"wrap" }}>
                            {col.id==="backlog"&&<button onClick={e=>{e.stopPropagation();updLead(l.id,{status:"contacted"});}} style={{ fontFamily:sans,fontSize:10,fontWeight:600,cursor:"pointer",borderRadius:5,padding:"4px 9px",border:"1px solid "+BRAND.border,background:BRAND.bg,color:BRAND.primary }}>Contacted</button>}
                            {col.id==="contacted"&&<><button onClick={e=>{e.stopPropagation();updLead(l.id,{status:"accepted"});}} style={{ fontFamily:sans,fontSize:10,fontWeight:600,cursor:"pointer",borderRadius:5,padding:"4px 9px",border:"1px solid "+C.greenBdr,background:C.greenBg,color:C.green }}>Accept</button><button onClick={e=>{e.stopPropagation();updLead(l.id,{status:"rejected"});}} style={{ fontFamily:sans,fontSize:10,fontWeight:600,cursor:"pointer",borderRadius:5,padding:"4px 9px",border:"1px solid "+C.redBdr,background:C.redBg,color:C.red }}>Reject</button></>}
                            {col.id==="accepted"&&<button onClick={e=>{e.stopPropagation();updLead(l.id,{status:"inprogress"});}} style={{ fontFamily:sans,fontSize:10,fontWeight:600,cursor:"pointer",borderRadius:5,padding:"4px 9px",border:"1px solid "+C.amberBdr,background:C.amberBg,color:C.amber }}>Start Work</button>}
                            {col.id==="inprogress"&&<button onClick={e=>{e.stopPropagation();updLead(l.id,{status:"done"});}} style={{ fontFamily:sans,fontSize:10,fontWeight:600,cursor:"pointer",borderRadius:5,padding:"4px 9px",border:"1px solid "+C.purpleBdr,background:C.purpleBg,color:C.purple }}>Mark Done</button>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {boardSelled&&<DetailPanel lead={boardSelled} pitchPlan={boardPitch} onClose={()=>setBoardSel(null)}/>}
      </div>
    );
  }

  // ─── RENDER ───────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily:sans,background:C.page,minHeight:"100vh",color:C.ink,fontSize:14 }}>
      <header style={{ height:60,background:C.surface,borderBottom:"1px solid "+C.border,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px",gap:16,position:"sticky",top:0,zIndex:20 }}>
        <div style={{ display:"flex",alignItems:"center",gap:12,flexShrink:0 }}>
          <div style={{ width:36,height:36,borderRadius:9,background:BRAND.primary,display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1" y="1" width="7" height="7" rx="2" fill="white"/><rect x="10" y="1" width="7" height="7" rx="2" fill="white" opacity=".4"/><rect x="1" y="10" width="7" height="7" rx="2" fill="white" opacity=".4"/><rect x="10" y="10" width="7" height="7" rx="2" fill="white"/></svg>
          </div>
          <div>
            <div style={{ fontSize:15,fontWeight:700,color:C.ink,lineHeight:1.1 }}>{BRAND.name}</div>
            <div style={{ fontSize:12,color:C.ink3,marginTop:1 }}>{BRAND.sub}</div>
          </div>
        </div>
        <nav style={{ display:"flex",gap:2,background:C.surface2,borderRadius:9,padding:4 }}>
          {[["search","Live Search"],["board","Board"],["pipeline","Pipeline"],["csv","CSV Import"],["instructions","Instructions"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{ fontFamily:sans,fontSize:13,fontWeight:tab===t?600:500,cursor:"pointer",borderRadius:7,padding:"7px 16px",border:"none",background:tab===t?C.surface:"transparent",color:tab===t?BRAND.primary:C.ink3,transition:"all .15s" }}>
              {t==="search"&&<span style={{ display:"inline-block",width:7,height:7,borderRadius:"50%",background:"#EF4444",marginRight:6,verticalAlign:"middle" }}/>}
              {l}
            </button>
          ))}
        </nav>
        <div style={{ display:"flex",gap:8,flexShrink:0 }}>
          {[[stats.total,"Total",C.ink,C.surface,C.border],[stats.backlog,"Backlog",C.amber,C.amberBg,C.amberBdr],[stats.inprogress,"Active",BRAND.primary,BRAND.bg,BRAND.border],[stats.done,"Done",C.green,C.greenBg,C.greenBdr]].map(([v,l,col,bg2,bdr])=>(
            <div key={l} style={{ padding:"6px 14px",borderRadius:8,textAlign:"center",border:"1px solid "+bdr,background:bg2,minWidth:64 }}>
              <div style={{ fontFamily:mono,fontSize:18,fontWeight:700,color:col,lineHeight:1 }}>{v}</div>
              <div style={{ fontFamily:sans,fontSize:10,color:col,marginTop:2,textTransform:"uppercase",letterSpacing:".5px",opacity:.75 }}>{l}</div>
            </div>
          ))}
        </div>
      </header>

      {loading&&unlocked&&(
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"calc(100vh - 60px)",flexDirection:"column",gap:12 }}>
          <div style={{ width:40,height:40,border:"3px solid "+C.border,borderTop:"3px solid "+BRAND.primary,borderRadius:"50%",animation:"spin 0.8s linear infinite" }}/>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <div style={{ fontSize:14,color:C.ink3 }}>Loading your leads...</div>
        </div>
      )}

      {!loading&&tab==="instructions"&&<InstructionsTab/>}

      {!loading&&tab==="board"&&<BoardTab/>}

      {!loading&&tab==="csv"&&(
        <div style={{ maxWidth:740,margin:"0 auto",padding:"32px 28px" }}>
          <h2 style={{ fontSize:20,fontWeight:700,color:C.ink,marginBottom:6 }}>Import from CSV</h2>
          <p style={{ fontSize:14,color:C.ink3,lineHeight:1.7,marginBottom:28 }}>Export from <strong style={{ color:C.ink }}>Outscraper</strong> (free 500 records/month at outscraper.com) and paste below. Imported leads go straight to Backlog.</p>
          <label style={{ display:"block",fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:".6px",color:C.ink3,marginBottom:7 }}>CSV data</label>
          <textarea value={csvRaw} onChange={e=>setCsvRaw(e.target.value)} rows={12} placeholder={"name,phone,website,address,city,category\nForney Animal Hospital,(972) 564-3400,forneyanimal.com,1103 S Bois d'Arc,Forney TX,Veterinarian"} style={{ ...fi,resize:"vertical",fontFamily:mono,fontSize:12,lineHeight:1.7,marginBottom:20 }}/>
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={importCsv} style={bp}>Import to Board</button>
            <button onClick={()=>setTab("board")} style={bgh}>Cancel</button>
          </div>
        </div>
      )}

      {!loading&&tab==="search"&&(
        <div style={{ display:"flex",height:"calc(100vh - 60px)" }}>
          <div style={{ flex:1,overflowY:"auto",padding:"28px" }}>
            <h2 style={{ fontSize:20,fontWeight:700,color:C.ink,marginBottom:6 }}>Live business search</h2>
            <p style={{ fontSize:14,color:C.ink3,lineHeight:1.7,marginBottom:24 }}>Search Google Maps in real time. Results show score, pricing range, and website status. Click <strong style={{ color:C.ink }}>+ Add to Board</strong> to send a lead to your Backlog.</p>
            <div style={{ background:C.surface,border:"1.5px solid "+C.border,borderRadius:12,padding:"16px 18px",marginBottom:18 }}>
              <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:".8px",color:C.ink3,marginBottom:10 }}>Google Places API key</div>
              <div style={{ display:"flex",gap:12,alignItems:"center" }}>
                <input type="password" value={apiKey} onChange={e=>saveKey(e.target.value)} placeholder="AIzaSy..." style={{ ...fi,flex:1 }}/>
                <div style={{ display:"flex",alignItems:"center",gap:6,flexShrink:0 }}>
                  <div style={{ width:8,height:8,borderRadius:"50%",background:apiKey?C.green:C.border2 }}/>
                  <span style={{ fontSize:13,fontWeight:500,color:apiKey?C.green:C.ink3 }}>{apiKey?"Connected":"Not set"}</span>
                </div>
              </div>
              <div style={{ fontSize:12,color:C.ink4,marginTop:7 }}>Saved locally in your browser only.</div>
            </div>
            <div style={{ display:"flex",gap:10,marginBottom:10 }}>
              <input value={searchQ} onChange={e=>setSearchQ(e.target.value)} onKeyDown={e=>e.key==="Enter"&&runSearch()} placeholder={'"medical clinic Forney TX" or "accounting firm 75126"'} style={{ ...fi,flex:1,padding:"11px 14px" }}/>
              <button onClick={runSearch} disabled={searching} style={{ ...bp,flexShrink:0,minWidth:110,opacity:searching?0.7:1 }}>{searching?"Searching...":"Search"}</button>
            </div>
            <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:20 }}>
              {["medical clinic Forney TX","accounting firm Forney TX","dental office 75126","law firm Kaufman TX","construction Forney TX","school Kaufman County TX"].map(q=>(
                <button key={q} onClick={()=>setSearchQ(q)} style={{ fontFamily:sans,fontSize:11,background:C.surface,border:"1.5px solid "+C.border,borderRadius:6,padding:"5px 12px",color:C.ink3,cursor:"pointer" }}>{q}</button>
              ))}
            </div>
            {searchErr&&<div style={{ background:C.redBg,border:"1.5px solid "+C.redBdr,borderRadius:8,padding:"12px 16px",fontSize:13,color:C.red,marginBottom:16 }}>{searchErr}</div>}
            {results.length>0&&(
              <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                {results.map(r=>{
                  const tempLead={...r,has_website:r.hasWebsite,data_signals:r.data_signals||3,tech_stack:r.tech_stack||3,reachability:r.reachability||3,proximity:r.proximity||3,web_data:r.web_data||3};
                  const g=grade(calcScore(tempLead));
                  const plan=buildPitchPlan(tempLead);
                  const leadWith=plan[0];
                  const wp=webPill(r.hasWebsite);
                  const alreadyAdded=leads.some(l=>l.name===r.name&&l.address===r.address);
                  return (
                    <div key={r._id} style={{ background:C.surface,border:"1.5px solid "+C.border,borderRadius:11,padding:"14px 16px" }}>
                      <div style={{ display:"flex",alignItems:"flex-start",gap:12 }}>
                        <div style={{ width:36,height:36,borderRadius:8,background:g.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:g.color,fontFamily:mono,flexShrink:0 }}>{g.label}</div>
                        <div style={{ flex:1,minWidth:0 }}>
                          <div style={{ fontSize:14,fontWeight:600,color:C.ink }}>{r.name}</div>
                          <div style={{ fontSize:12,color:C.ink3,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{r.address}</div>
                          {r.phone&&<div style={{ fontSize:12,color:C.ink3,marginTop:1 }}>{r.phone}</div>}
                          <div style={{ display:"flex",gap:6,marginTop:7,flexWrap:"wrap",alignItems:"center" }}>
                            <span style={{ fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:4,background:wp.bg,color:wp.color,border:wp.border }}>{wp.label}</span>
                            <span style={{ fontSize:10,fontWeight:600,padding:"2px 7px",borderRadius:4,background:C.surface2,border:"1px solid "+C.border,color:C.ink3 }}>Score: {calcScore(tempLead)}</span>
                            {r.rating>0&&<span style={{ fontSize:11,color:C.amber,fontWeight:600 }}>★ {r.rating}</span>}
                          </div>
                        </div>
                        <div style={{ textAlign:"right",flexShrink:0 }}>
                          <button
                            onClick={()=>!alreadyAdded&&addLeadFromResult(r)}
                            style={{ fontFamily:sans,fontSize:12,fontWeight:700,cursor:alreadyAdded?"default":"pointer",borderRadius:7,padding:"8px 16px",border:"1.5px solid "+(alreadyAdded?C.border:BRAND.border),background:alreadyAdded?C.surface2:BRAND.bg,color:alreadyAdded?C.ink4:BRAND.primary,marginBottom:8,whiteSpace:"nowrap" }}>
                            {alreadyAdded?"Added":"+ Add to Board"}
                          </button>
                        </div>
                      </div>
                      <div style={{ display:"flex",alignItems:"center",gap:7,padding:"7px 10px",background:C.surface2,borderRadius:6,borderLeft:"2px solid "+(TIER_BORDERS[leadWith.tier]||C.border2),marginTop:10 }}>
                        <span style={{ fontSize:13 }}>{leadWith.icon}</span>
                        <span style={{ fontSize:11,color:C.ink3 }}>Lead with:</span>
                        <span style={{ fontSize:11,fontWeight:600,color:C.ink2 }}>{leadWith.label}</span>
                        <span style={{ fontSize:11,fontWeight:700,color:BRAND.primary,marginLeft:"auto" }}>{fmtPrice(leadWith.priceLo,leadWith.priceHi,false)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {!searching&&results.length===0&&!searchErr&&<div style={{ textAlign:"center",padding:"56px 24px",color:C.ink4,fontSize:14 }}>Enter a search above to pull live data from Google Maps.</div>}
          </div>
        </div>
      )}

      {!loading&&tab==="pipeline"&&(
        <div style={{ display:"flex",height:"calc(100vh - 60px)" }}>
          <div style={{ width:sel?"44%":"100%",transition:"width .2s",overflowY:"auto",borderRight:"1px solid "+C.border,background:C.page }}>
            <div style={{ padding:"12px 16px",borderBottom:"1px solid "+C.border,display:"flex",gap:10,alignItems:"center",background:C.surface,position:"sticky",top:0,zIndex:10 }}>
              <input placeholder="Search by name, address, or industry..." value={search} onChange={e=>setSearch(e.target.value)} style={{ fontFamily:sans,fontSize:13,background:C.surface2,border:"1.5px solid "+C.border,borderRadius:6,padding:"8px 12px",color:C.ink,outline:"none",flex:1 }}/>
              <select value={filter} onChange={e=>setFilter(e.target.value)} style={{ fontFamily:sans,fontSize:13,background:C.surface2,border:"1.5px solid "+C.border,borderRadius:6,padding:"8px 12px",color:C.ink,outline:"none" }}>
                <option value="all">All</option>
                {BOARD_COLS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
              <span style={{ fontFamily:mono,fontSize:12,color:C.ink4,flexShrink:0 }}>{visible.length}</span>
            </div>
            <div style={{ padding:12,display:"flex",flexDirection:"column",gap:6 }}>
              {visible.length===0&&<div style={{ textAlign:"center",padding:"56px 24px",color:C.ink4,fontSize:14 }}>No leads match your filter.</div>}
              {visible.map((l,i)=>{
                const g=grade(l.score);const isAct=sel?.id===l.id;
                const plan=buildPitchPlan(l);const leadWith=plan[0];
                const wp=webPill(l.has_website);const sp=sizePill(l.size);
                const col=BOARD_COLS.find(c=>c.id===l.status)||BOARD_COLS[0];
                return (
                  <div key={l.id} onClick={()=>{setSelId(isAct?null:l.id);}} style={{ background:isAct?BRAND.bg:C.surface,border:"1.5px solid "+(isAct?BRAND.primary:C.border),borderRadius:12,padding:"13px 15px",cursor:"pointer" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:9 }}>
                      <span style={{ fontFamily:mono,fontSize:11,color:C.ink4,width:20,textAlign:"center",flexShrink:0 }}>{i+1}</span>
                      <div style={{ width:34,height:34,borderRadius:7,background:g.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:g.color,fontFamily:mono,flexShrink:0 }}>{g.label}</div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontSize:13,fontWeight:600,color:C.ink,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{l.name}</div>
                        <div style={{ fontSize:11,color:C.ink3,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{l.industry?l.industry+" - ":""}{l.address||l.city}</div>
                      </div>
                      <div style={{ display:"flex",gap:5,alignItems:"center",flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end" }}>
                        <span style={{ fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:wp.bg,color:wp.color,border:wp.border }}>{wp.label}</span>
                        <span style={{ fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:C.surface2,border:"1px solid "+C.border,color:sp.color }}>{sp.label}</span>
                        <span style={{ fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:col.bg,border:"1px solid "+col.color+"44",color:col.color }}>{col.label}</span>
                      </div>
                      <span style={{ fontFamily:mono,fontSize:17,fontWeight:700,color:g.color,width:30,textAlign:"right",flexShrink:0 }}>{l.score}</span>
                    </div>
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:8,padding:"6px 9px",background:isAct?"#fff":C.surface2,borderRadius:5,borderLeft:"2px solid "+(TIER_BORDERS[leadWith.tier]||C.border2) }}>
                      <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                        <span style={{ fontSize:12 }}>{leadWith.icon}</span>
                        <span style={{ fontSize:10,color:C.ink3 }}>Lead with</span>
                        <span style={{ fontSize:11,fontWeight:600,color:C.ink2 }}>{leadWith.label}</span>
                      </div>
                      <span style={{ fontSize:11,fontWeight:700,color:BRAND.primary }}>{fmtPrice(leadWith.priceLo,leadWith.priceHi,false)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {sel&&<DetailPanel lead={sel} pitchPlan={pitch} onClose={()=>setSelId(null)}/>}
        </div>
      )}
    </div>
  );
}
