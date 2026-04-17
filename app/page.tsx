"use client";

import { useState, useRef, useEffect } from "react";

/* ─── Scroll-reveal hook ──────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function reveal(visible: boolean, delayMs = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px) scale(1)" : "translateY(36px) scale(0.97)",
    transition: `opacity 0.7s ease ${delayMs}ms, transform 0.7s ease ${delayMs}ms`,
    willChange: "transform, opacity",
  };
}

/* ─── Cinematic report-journey animation ─────────────────────────── */
function HeroAnimation() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const labRef     = useRef<HTMLDivElement>(null);
  const doctorRef  = useRef<HTMLDivElement>(null);
  const patientRef = useRef<HTMLDivElement>(null);
  const statusRef  = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const W = 420, H = 420;
    canvas.width = W*dpr; canvas.height = H*dpr;
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const LAB = { x: 90,  y: 160 };
    const DOC = { x: 330, y: 160 };
    const PAT = { x: 210, y: 330 };
    const HUB = { x: 210, y: 230 };

    const DP = {
      p0: { x: LAB.x+22, y: LAB.y-15 },
      p1: { x: 155,       y: 40        },
      p2: { x: 265,       y: 40        },
      p3: { x: DOC.x-22,  y: DOC.y-15  },
    };
    const bz = (t: number) => ({
      x: (1-t)**3*DP.p0.x + 3*(1-t)**2*t*DP.p1.x + 3*(1-t)*t**2*DP.p2.x + t**3*DP.p3.x,
      y: (1-t)**3*DP.p0.y + 3*(1-t)**2*t*DP.p1.y + 3*(1-t)*t**2*DP.p2.y + t**3*DP.p3.y,
    });
    const bzAngle = (t: number) => {
      const dt = 0.001;
      const a = bz(Math.max(0,t-dt)), b = bz(Math.min(1,t+dt));
      return Math.atan2(b.y-a.y, b.x-a.x);
    };
    const NP = {
      p0: { x: DOC.x-10, y: DOC.y+20  },
      p1: { x: DOC.x-60, y: DOC.y+120 },
      p2: { x: PAT.x+60, y: PAT.y-80  },
      p3: { x: PAT.x,    y: PAT.y-20  },
    };
    const nbz = (t: number) => ({
      x: (1-t)**3*NP.p0.x + 3*(1-t)**2*t*NP.p1.x + 3*(1-t)*t**2*NP.p2.x + t**3*NP.p3.x,
      y: (1-t)**3*NP.p0.y + 3*(1-t)**2*t*NP.p1.y + 3*(1-t)*t**2*NP.p2.y + t**3*NP.p3.y,
    });

    const BP = 35;
    const bpx = Array.from({length:BP}, () => Math.random()*W);
    const bpy = Array.from({length:BP}, () => Math.random()*H);
    const bpvx = Array.from({length:BP}, () => (Math.random()-0.5)*0.18);
    const bpvy = Array.from({length:BP}, () => (Math.random()-0.5)*0.18);

    const trail: { x: number; y: number; life: number; maxLife: number; r: number }[] = [];
    const ripples: { x: number; y: number; r: number; maxR: number; alpha: number; color: string }[] = [];

    const PH = {
      nodesIn: 15, labGlow: 35, docSpawn: 55, docArrive: 150,
      stamp: 155, notif: 195, patLight: 240, lines: 258, hub: 310, hold: 420, reset: 460,
    };

    let frame = 0, animId: number;
    let labGlow = 0, stampA = 0, stampBounce = 0;
    let notifT = -1, patGlow = 0, lineP = 0, hubA = 0;

    const rrect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
      ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
      ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
      ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
      ctx.closePath();
    };

    const drawDoc = (x: number, y: number, angle: number, alpha: number) => {
      ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.rotate(angle);
      const W2 = 26, H2 = 34;
      ctx.shadowColor = "rgba(59,130,246,0.55)"; ctx.shadowBlur = 14;
      ctx.fillStyle = "white"; rrect(-W2/2, -H2/2, W2, H2, 3); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#dbeafe";
      ctx.beginPath(); ctx.moveTo(W2/2-8,-H2/2); ctx.lineTo(W2/2,-H2/2+8); ctx.lineTo(W2/2,-H2/2); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#3b82f6"; rrect(-W2/2+5,-H2/2+5,W2-10,3,1); ctx.fill();
      [0,1,2,3].forEach(li => {
        ctx.fillStyle = li===3 ? "#cbd5e1" : "#94a3b8";
        rrect(-W2/2+4,-H2/2+13+li*5.5,li===3?W2-14:W2-8,2,1); ctx.fill();
      });
      ctx.restore();
    };

    const drawStamp = (x: number, y: number, alpha: number) => {
      if (alpha<=0) return;
      ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y+stampBounce);
      ctx.shadowColor = "rgba(22,163,74,0.4)"; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.arc(0,0,18,0,Math.PI*2); ctx.fillStyle="#dcfce7"; ctx.fill();
      ctx.strokeStyle="#16a34a"; ctx.lineWidth=2; ctx.stroke(); ctx.shadowBlur=0;
      ctx.strokeStyle="#16a34a"; ctx.lineWidth=2.8; ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.beginPath(); ctx.moveTo(-7,0); ctx.lineTo(-2,6); ctx.lineTo(8,-6); ctx.stroke();
      ctx.restore();
    };

    const setNode = (ref: React.RefObject<HTMLDivElement | null>, active: boolean, color="rgba(96,165,250,0.8)", glow="rgba(59,130,246,0.35)") => {
      const el = ref.current; if (!el) return;
      el.style.borderColor = active ? color : "rgba(219,234,254,0.6)";
      el.style.boxShadow = active ? `0 0 22px ${glow}` : "";
      el.style.transform = active ? "translate(-50%,-50%) scale(1.08)" : "translate(-50%,-50%) scale(1)";
    };
    const setStatus = (msg: string, color="#64748b") => {
      const el = statusRef.current; if (!el) return;
      el.textContent = msg; el.style.opacity = msg?"1":"0"; el.style.color = color;
    };

    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      for (let i=0;i<BP;i++) {
        bpx[i]=(bpx[i]+bpvx[i]+W)%W; bpy[i]=(bpy[i]+bpvy[i]+H)%H;
        ctx.beginPath(); ctx.arc(bpx[i],bpy[i],1,0,Math.PI*2);
        ctx.fillStyle="rgba(147,197,253,0.3)"; ctx.fill();
      }
      if (frame===PH.nodesIn) {
        [labRef,doctorRef,patientRef].forEach(ref=>{
          if(!ref.current)return;
          ref.current.style.transition="opacity 0.45s ease,transform 0.45s cubic-bezier(0.34,1.56,0.64,1)";
          ref.current.style.opacity="1"; ref.current.style.transform="translate(-50%,-50%) scale(1)";
        });
      }
      if (frame>=PH.labGlow && frame<PH.docArrive) {
        labGlow=Math.min(1,labGlow+0.06);
        const pulse=0.6+0.4*Math.sin(frame*0.18);
        const g=ctx.createRadialGradient(LAB.x,LAB.y,0,LAB.x,LAB.y,55*pulse);
        g.addColorStop(0,`rgba(59,130,246,${0.4*labGlow*pulse})`); g.addColorStop(1,"rgba(59,130,246,0)");
        ctx.beginPath(); ctx.arc(LAB.x,LAB.y,55*pulse,0,Math.PI*2); ctx.fillStyle=g; ctx.fill();
        if(frame===PH.labGlow){setNode(labRef,true);setStatus("Lab uploading report...");}
      }
      if (frame>=PH.docSpawn && frame<PH.docArrive) {
        const flyFrames=PH.docArrive-PH.docSpawn;
        const raw=(frame-PH.docSpawn)/flyFrames;
        const t=raw<0.5?2*raw*raw:-1+(4-2*raw)*raw;
        const pos=bz(t); const ang=bzAngle(t)*0.35;
        for(let g=3;g>=1;g--){const gt=Math.max(0,t-g*0.045);const gpos=bz(gt);const gang=bzAngle(gt)*0.35;drawDoc(gpos.x,gpos.y,gang,0.07*(4-g));}
        if(frame%2===0)trail.push({x:pos.x,y:pos.y,life:0,maxLife:22,r:2.5+Math.random()*2});
        drawDoc(pos.x,pos.y,ang,1);
      }
      for(let i=trail.length-1;i>=0;i--){
        trail[i].life++;
        if(trail[i].life>=trail[i].maxLife){trail.splice(i,1);continue;}
        const a=1-trail[i].life/trail[i].maxLife;
        ctx.beginPath(); ctx.arc(trail[i].x,trail[i].y,trail[i].r*a,0,Math.PI*2);
        ctx.fillStyle=`rgba(96,165,250,${a*0.55})`; ctx.fill();
      }
      if(frame===PH.docArrive){
        ripples.push({x:DOC.x,y:DOC.y,r:0,maxR:65,alpha:0.75,color:"59,130,246"});
        ripples.push({x:DOC.x,y:DOC.y,r:0,maxR:38,alpha:0.55,color:"96,165,250"});
        stampA=0;stampBounce=-38;setNode(doctorRef,true);setStatus("Doctor received the report.");labGlow=0;
      }
      if(frame>=PH.stamp && frame<PH.notif){
        const sf=frame-PH.stamp;
        stampA=Math.min(1,sf/6);
        if(sf<8)stampBounce=-38+38*(sf/8);
        else if(sf<12)stampBounce=-6*Math.sin((sf-8)/4*Math.PI);
        else stampBounce=0;
        const pulse=0.5+0.5*Math.sin(frame*0.22);
        const g=ctx.createRadialGradient(DOC.x,DOC.y,0,DOC.x,DOC.y,50*pulse);
        g.addColorStop(0,`rgba(22,163,74,${0.3*pulse})`);g.addColorStop(1,"rgba(22,163,74,0)");
        ctx.beginPath();ctx.arc(DOC.x,DOC.y,50*pulse,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
        if(sf===8)setStatus("Doctor reviewed. ✓","#16a34a");
      }
      if(stampA>0)drawStamp(DOC.x,DOC.y-38,stampA);
      for(let i=ripples.length-1;i>=0;i--){
        ripples[i].r+=2.8;
        const rp=ripples[i];
        if(rp.r>=rp.maxR){ripples.splice(i,1);continue;}
        const a=rp.alpha*(1-rp.r/rp.maxR);
        ctx.beginPath();ctx.arc(rp.x,rp.y,rp.r,0,Math.PI*2);
        ctx.strokeStyle=`rgba(${rp.color},${a})`;ctx.lineWidth=1.8;ctx.stroke();
      }
      if(frame>=PH.notif && frame<PH.patLight){
        if(frame===PH.notif)setStatus("Notifying patient...");
        const nf=PH.patLight-PH.notif;
        const raw=(frame-PH.notif)/nf;
        const nt=raw<0.5?2*raw*raw:-1+(4-2*raw)*raw;
        notifT=nt;
        ctx.beginPath();ctx.moveTo(NP.p0.x,NP.p0.y);
        ctx.bezierCurveTo(NP.p1.x,NP.p1.y,NP.p2.x,NP.p2.y,NP.p3.x,NP.p3.y);
        ctx.strokeStyle="rgba(96,165,250,0.18)";ctx.lineWidth=1.5;ctx.setLineDash([4,6]);ctx.stroke();ctx.setLineDash([]);
        const np=nbz(nt);
        for(let r=3;r>=1;r--){ctx.beginPath();ctx.arc(np.x,np.y,r*5,0,Math.PI*2);ctx.fillStyle=`rgba(59,130,246,${0.35-r*0.09})`;ctx.fill();}
        ctx.beginPath();ctx.arc(np.x,np.y,4,0,Math.PI*2);ctx.fillStyle="white";ctx.fill();
        if(frame%6===0)ripples.push({x:np.x,y:np.y,r:0,maxR:16,alpha:0.4,color:"96,165,250"});
      }
      void notifT;
      if(frame>=PH.patLight){
        if(frame===PH.patLight){
          setNode(patientRef,true,"rgba(52,211,153,0.8)","rgba(16,185,129,0.4)");
          setStatus("Patient notified instantly. ✓","#10b981");
          ripples.push({x:PAT.x,y:PAT.y,r:0,maxR:70,alpha:0.7,color:"16,185,129"});
          ripples.push({x:PAT.x,y:PAT.y,r:0,maxR:45,alpha:0.5,color:"52,211,153"});
        }
        patGlow=Math.min(1,patGlow+0.07);
        const pulse=0.55+0.45*Math.sin(frame*0.14);
        const g=ctx.createRadialGradient(PAT.x,PAT.y,0,PAT.x,PAT.y,52*pulse);
        g.addColorStop(0,`rgba(16,185,129,${0.45*patGlow*pulse})`);g.addColorStop(1,"rgba(16,185,129,0)");
        ctx.beginPath();ctx.arc(PAT.x,PAT.y,52*pulse,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();
      }
      if(frame>=PH.lines){
        lineP=Math.min(1,(frame-PH.lines)/45);
        [[LAB,HUB],[DOC,HUB],[PAT,HUB]].forEach(([a,b])=>{
          const ex=a.x+(b.x-a.x)*lineP,ey=a.y+(b.y-a.y)*lineP;
          const g=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
          g.addColorStop(0,"rgba(96,165,250,0.55)");g.addColorStop(1,"rgba(6,182,212,0.8)");
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(ex,ey);ctx.strokeStyle=g;ctx.lineWidth=1.6;ctx.stroke();
          if(lineP>0.3){const ft=((frame*0.028)%1);const fx=a.x+(b.x-a.x)*ft,fy=a.y+(b.y-a.y)*ft;ctx.beginPath();ctx.arc(fx,fy,2.5,0,Math.PI*2);ctx.fillStyle="rgba(147,197,253,0.85)";ctx.fill();}
        });
      }
      if(frame>=PH.hub){
        hubA=Math.min(1,(frame-PH.hub)/28);
        if(frame===PH.hub)setStatus("One platform. Zero trips.","#2563eb");
        const pulse=0.72+0.28*Math.sin(frame*0.07);
        const glowR=58*pulse;
        const cg=ctx.createRadialGradient(HUB.x,HUB.y,0,HUB.x,HUB.y,glowR);
        cg.addColorStop(0,`rgba(59,130,246,${0.5*pulse*hubA})`);cg.addColorStop(1,"rgba(59,130,246,0)");
        ctx.beginPath();ctx.arc(HUB.x,HUB.y,glowR,0,Math.PI*2);ctx.fillStyle=cg;ctx.fill();
        ctx.globalAlpha=hubA;
        const hg=ctx.createLinearGradient(HUB.x-34,HUB.y-34,HUB.x+34,HUB.y+34);
        hg.addColorStop(0,"#60a5fa");hg.addColorStop(1,"#0891b2");
        ctx.beginPath();ctx.arc(HUB.x,HUB.y,34,0,Math.PI*2);ctx.fillStyle=hg;
        ctx.shadowColor="rgba(59,130,246,0.7)";ctx.shadowBlur=26;ctx.fill();ctx.shadowBlur=0;
        ctx.fillStyle="rgba(255,255,255,0.96)";ctx.font="bold 8px system-ui,sans-serif";
        ctx.textAlign="center";ctx.textBaseline="middle";
        ctx.fillText("OUT",HUB.x,HUB.y-6.5);ctx.fillText("LYNK",HUB.x,HUB.y+6.5);
        ctx.globalAlpha=1;
        ctx.beginPath();ctx.arc(HUB.x,HUB.y,40+8*(1-pulse),0,Math.PI*2);
        ctx.strokeStyle=`rgba(96,165,250,${0.4*pulse*hubA})`;ctx.lineWidth=2;ctx.stroke();
      }
      frame++;
      if(frame>=PH.reset){
        frame=0;trail.length=0;ripples.length=0;
        notifT=-1;stampA=0;labGlow=0;patGlow=0;lineP=0;hubA=0;stampBounce=0;
        [labRef,doctorRef,patientRef].forEach(ref=>{
          if(!ref.current)return;
          ref.current.style.transition="none";ref.current.style.opacity="0";
          ref.current.style.transform="translate(-50%,-50%) scale(0.6)";
          ref.current.style.borderColor="rgba(219,234,254,0.6)";ref.current.style.boxShadow="";
        });
        setStatus("");
      }
      animId=requestAnimationFrame(tick);
    };
    animId=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="hidden md:flex flex-col items-center justify-center h-[460px] animate-fade-up-d2">
      <div className="relative" style={{width:420,height:420}}>
        <canvas ref={canvasRef} className="absolute inset-0" />
        <div ref={labRef} className="absolute pointer-events-none"
          style={{left:90,top:160,opacity:0,transform:"translate(-50%,-50%) scale(0.6)",
            transition:"border-color 0.3s ease,box-shadow 0.3s ease,transform 0.3s ease"}}>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl flex flex-col items-center gap-1 border shadow-lg shadow-blue-100/60"
            style={{padding:"9px 13px",borderColor:"rgba(219,234,254,0.6)",minWidth:64}}>
            <span style={{fontSize:24}}>🔬</span>
            <span className="text-[9px] font-bold text-slate-600">Lab</span>
          </div>
        </div>
        <div ref={doctorRef} className="absolute pointer-events-none"
          style={{left:330,top:160,opacity:0,transform:"translate(-50%,-50%) scale(0.6)",
            transition:"border-color 0.3s ease,box-shadow 0.3s ease,transform 0.3s ease"}}>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl flex flex-col items-center gap-1 border shadow-lg shadow-blue-100/60"
            style={{padding:"9px 13px",borderColor:"rgba(219,234,254,0.6)",minWidth:64}}>
            <span style={{fontSize:24}}>🩺</span>
            <span className="text-[9px] font-bold text-slate-600">Doctor</span>
          </div>
        </div>
        <div ref={patientRef} className="absolute pointer-events-none"
          style={{left:210,top:330,opacity:0,transform:"translate(-50%,-50%) scale(0.6)",
            transition:"border-color 0.3s ease,box-shadow 0.3s ease,transform 0.3s ease"}}>
          <div className="bg-white/95 backdrop-blur-sm rounded-xl flex flex-col items-center gap-1 border shadow-lg shadow-blue-100/60"
            style={{padding:"9px 13px",borderColor:"rgba(219,234,254,0.6)",minWidth:64}}>
            <span style={{fontSize:24}}>🙋</span>
            <span className="text-[9px] font-bold text-slate-600">Patient</span>
          </div>
        </div>
      </div>
      <p ref={statusRef} className="text-xs font-semibold mt-1"
        style={{opacity:0,transition:"opacity 0.4s ease,color 0.4s ease",minHeight:20,textAlign:"center"}} />
    </div>
  );
}

/* ─── Data ────────────────────────────────────────────────────────── */
type Role = "patient" | "doctor" | "lab";

const roles: { id: Role; label: string; icon: string; description: string; features: string[] }[] = [
  { id: "patient", label: "Patient", icon: "🙋",
    description: "Access your reports, consult your doctor remotely, and maintain a complete health history, all in one place.",
    features: ["Instant report access", "Remote consultations", "Full medical history"] },
  { id: "doctor", label: "Doctor", icon: "🩺",
    description: "Receive reports directly from labs, review them remotely, and decide the right next step for your patient.",
    features: ["Direct lab reports", "Remote review", "Digital prescriptions"] },
  { id: "lab", label: "Diagnostic Centre", icon: "🔬",
    description: "Upload reports once. They reach the ordering doctor and patient instantly, no calls, no delays.",
    features: ["One-click upload", "Instant delivery", "Zero follow-up calls"] },
];

const steps = [
  { number: "01", label: "First",   title: "Doctor orders a test",
    description: "After your consultation, your doctor sends a digital test order through Outlynk to a diagnostic centre near you.",
    icon: "🩺", color: "from-blue-500 to-blue-600" },
  { number: "02", label: "Then",    title: "Lab uploads the report",
    description: "Once your tests are done, the diagnostic centre uploads your report directly to Outlynk, no paper, no courier.",
    icon: "🔬", color: "from-cyan-500 to-blue-500" },
  { number: "03", label: "Finally", title: "Doctor reviews remotely",
    description: "Your doctor gets notified instantly, reviews your reports, and decides if a physical visit is even needed.",
    icon: "📱", color: "from-blue-600 to-indigo-600" },
];

const problems = [
  { label: "First",   title: "You visit a doctor.",         detail: "They order tests. You have no digital record." },
  { label: "Then",    title: "Tests are repeated.",          detail: "Reports are physical. No one else can access them." },
  { label: "Finally", title: "And it is often unclear...",   detail: "Do you need a follow-up? Where are your reports?" },
];

const heroPills = ["Secure & Consent-first", "Instant Report Delivery", "India-first Platform"];

/* ─── Page ────────────────────────────────────────────────────────── */
export default function Home() {
  const [activeRole, setActiveRole] = useState<Role>("patient");
  const [formData, setFormData] = useState({ name: "", mobile: "", email: "", city: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const problem  = useInView();
  const steps_   = useInView();
  const forWho   = useInView();
  const waitlist = useInView();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: activeRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setSubmitted(true);
      setFormData({ name: "", mobile: "", email: "", city: "" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen text-slate-900" style={{ backgroundColor: "#f4f7ff" }}>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100/60 shadow-sm shadow-blue-100/20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M9 21 C4 17 4 11 9 7"  stroke="#2563eb" strokeWidth="3"   strokeLinecap="round"/>
              <path d="M13 24 C5 19 5 9 13 4" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M17 26 C6 20 6 8 17 2" stroke="#60a5fa" strokeWidth="2"   strokeLinecap="round"/>
            </svg>
            <span className="text-xl font-extrabold text-gradient tracking-tight">outlynk</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#for-who"      className="hover:text-blue-600 transition-colors">Who it&apos;s For</a>
            <a href="#waitlist"     className="hover:text-blue-600 transition-colors">Register</a>
          </div>
          <a href="#waitlist" className="shimmer-btn text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-md shadow-blue-300/40">
            Register Interest
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-20 pb-36 px-6 overflow-hidden" style={{ backgroundColor: "#f4f7ff" }}>

        {/* Animated mesh grid */}
        <div className="absolute inset-0 hero-grid pointer-events-none" />

        {/* Large animated blobs */}
        <div className="absolute -top-48 -right-48 w-[650px] h-[650px] rounded-full animate-blob pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(191,219,254,0.65) 0%, transparent 65%)" }} />
        <div className="absolute top-1/3 -left-56 w-[500px] h-[500px] rounded-full animate-blob-d1 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(165,243,252,0.45) 0%, transparent 65%)" }} />
        <div className="absolute -bottom-32 right-1/3 w-[420px] h-[420px] rounded-full animate-blob-d2 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(147,197,253,0.4) 0%, transparent 65%)" }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-blue-200/70 shadow-md shadow-blue-100/50 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-6 animate-fade-up">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-dot" />
                Built for India · Registering Interest Now
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 animate-fade-up-d1">
                India&apos;s healthcare<br />is fragmented.<br />
                <span className="text-gradient">Outlynk connects</span><br />
                <span className="text-gradient">the chain.</span>
              </h1>

              <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-md animate-fade-up-d2">
                One platform to centralize the fragmented healthcare in India.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-up-d3">
                <a href="#waitlist"
                  className="shimmer-btn text-white font-bold px-8 py-4 rounded-full shadow-xl shadow-blue-400/30 hover:opacity-90 transition-opacity text-sm">
                  Register Interest
                </a>
                <a href="#how-it-works"
                  className="bg-white border-2 border-blue-200 text-blue-600 font-bold px-8 py-4 rounded-full hover:bg-blue-50 hover:border-blue-400 transition-all text-sm shadow-sm">
                  See How It Works
                </a>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 animate-fade-up-d3">
                {heroPills.map((pill, i) => (
                  <span key={pill}
                    className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-blue-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm animate-float"
                    style={{ animationDelay: `${i * 0.6}s` }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    {pill}
                  </span>
                ))}
              </div>
            </div>

            <HeroAnimation />
          </div>
        </div>

        {/* Wave transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-14">
            <path d="M0 70 C360 10 1080 70 1440 10 L1440 70 L0 70 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Problem ── */}
      <section className="relative section-white pt-8 pb-28 px-6 overflow-hidden">
        {/* Soft orbs */}
        <div className="absolute top-10 right-0 w-[380px] h-[380px] rounded-full pointer-events-none animate-glow"
          style={{ background: "radial-gradient(circle, rgba(191,219,254,0.45) 0%, transparent 68%)" }} />
        <div className="absolute bottom-10 -left-20 w-[300px] h-[300px] rounded-full pointer-events-none animate-glow"
          style={{ background: "radial-gradient(circle, rgba(165,243,252,0.3) 0%, transparent 68%)", animationDelay: "2.5s" }} />

        <div className="max-w-5xl mx-auto relative" ref={problem.ref}>
          <div className="text-center mb-16" style={reveal(problem.visible, 0)}>
            <span className="inline-block bg-red-50 text-red-500 text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-red-100 shadow-sm">
              The Problem
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              A Situation Many Patients Recognise
            </h2>
            <div className="w-14 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full" />
          </div>

          <div className="relative">
            {/* Animated connecting line */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-[2px] z-0 overflow-hidden rounded-full bg-blue-100">
              <div style={{
                height: "100%",
                background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
                transformOrigin: "left",
                transform: problem.visible ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 1.1s ease 0.5s",
              }} />
            </div>

            <div className="grid md:grid-cols-3 gap-6 relative z-10">
              {problems.map((p, i) => (
                <div key={p.label}
                  className="relative bg-white rounded-2xl shadow-lg p-7 card-hover overflow-hidden glow-card gradient-border"
                  style={reveal(problem.visible, 160 + i * 130)}>
                  {/* Large decorative number */}
                  <div className="absolute -top-2 -right-1 text-[86px] font-black leading-none select-none"
                    style={{ color: "#eff6ff" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  {/* Top color bar */}
                  <div className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: `linear-gradient(90deg, hsl(${210 + i*15},90%,55%), hsl(${195 + i*10},85%,50%))` }} />
                  <div className="relative z-10 pt-2">
                    <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
                      {p.label}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mb-2">{p.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{p.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center" style={reveal(problem.visible, 580)}>
              <div className="inline-flex items-center gap-3 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-blue-300/30 text-sm"
                style={{ background: "linear-gradient(135deg, #2563eb, #06b6d4)" }}>
                <span className="text-lg">⚡</span>
                Outlynk was built to address this
              </div>
            </div>
          </div>
        </div>

        {/* Wave to next section */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-14">
            <path d="M0 0 C480 70 960 0 1440 70 L1440 70 L0 70 Z" fill="#f4f7ff" />
          </svg>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="relative section-tint pt-8 pb-28 px-6 overflow-hidden">
        <div className="absolute -top-20 left-0 w-[420px] h-[420px] rounded-full pointer-events-none animate-blob-d1"
          style={{ background: "radial-gradient(circle, rgba(147,197,253,0.35) 0%, transparent 68%)" }} />
        <div className="absolute bottom-10 right-0 w-[360px] h-[360px] rounded-full pointer-events-none animate-blob"
          style={{ background: "radial-gradient(circle, rgba(165,243,252,0.3) 0%, transparent 68%)" }} />

        <div className="max-w-5xl mx-auto relative" ref={steps_.ref}>
          <div className="text-center mb-16" style={reveal(steps_.visible, 0)}>
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-blue-200/50 shadow-sm">
              Built to support every role in healthcare
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Designed for How Healthcare Works
            </h2>
            <div className="w-14 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.number}
                className="relative bg-white rounded-2xl border border-slate-100 p-7 shadow-lg card-hover overflow-hidden glow-card"
                style={reveal(steps_.visible, 100 + i * 150)}>
                {/* Top accent */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${step.color}`} />
                {/* Large bg number */}
                <div className="absolute -bottom-2 -right-1 text-[86px] font-black leading-none select-none"
                  style={{ color: "#f0f9ff" }}>
                  {step.number}
                </div>
                <div className="relative z-10 pt-1">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} text-white text-xl flex items-center justify-center shadow-lg`}>
                      {step.icon}
                    </div>
                    <span className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      {step.label}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Result banner */}
          <div className="mt-10 relative overflow-hidden rounded-2xl p-8 text-white text-center shadow-2xl shadow-blue-500/25"
            style={{
              ...reveal(steps_.visible, 570),
              background: "linear-gradient(135deg, #1e40af 0%, #2563eb 45%, #0891b2 100%)",
            }}>
            {/* Dot overlay */}
            <div className="absolute inset-0 opacity-[0.08]"
              style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
            {/* Spinning ring decoration */}
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border-2 border-white/20 animate-ring-spin" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full border border-white/15 animate-ring-spin" style={{ animationDirection: "reverse" }} />
            <div className="relative">
              <div className="text-2xl font-extrabold mb-2">The result?</div>
              <p className="text-blue-100 max-w-xl mx-auto text-sm leading-relaxed">
                Doctor reviews reports from their phone. Decides if a visit is needed. Prescription is digital. Everything lives in your medical history.
              </p>
            </div>
          </div>
        </div>

        {/* Wave to next section */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-14">
            <path d="M0 70 C360 0 1080 70 1440 0 L1440 70 L0 70 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section id="for-who" className="relative section-white pt-8 pb-28 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[440px] h-[440px] rounded-full pointer-events-none animate-glow"
          style={{ background: "radial-gradient(circle, rgba(191,219,254,0.5) 0%, transparent 68%)" }} />
        <div className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full pointer-events-none animate-glow"
          style={{ background: "radial-gradient(circle, rgba(165,243,252,0.3) 0%, transparent 68%)", animationDelay: "3s" }} />

        <div className="max-w-5xl mx-auto relative" ref={forWho.ref}>
          <div className="text-center mb-16" style={reveal(forWho.visible, 0)}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Built for Everyone in the Chain
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              One platform that connects patients, doctors, and diagnostic centres, securely and with consent.
            </p>
            <div className="w-14 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role, i) => (
              <div key={role.id}
                className="group relative bg-white border border-slate-100 rounded-2xl shadow-lg card-hover overflow-hidden glow-card"
                style={reveal(forWho.visible, 100 + i * 120)}>
                <div className="h-[3px] bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="p-7">
                  <div className="w-14 h-14 rounded-2xl icon-box flex items-center justify-center text-2xl mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    {role.icon}
                  </div>
                  <h3 className="font-extrabold text-slate-900 mb-2 text-lg">{role.label}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-5">{role.description}</p>
                  <ul className="space-y-2">
                    {role.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <span className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 text-[10px] font-bold">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center" style={reveal(forWho.visible, 480)}>
            <a href="#waitlist"
              className="shimmer-btn text-white font-bold px-10 py-4 rounded-full shadow-xl shadow-blue-400/30 hover:opacity-90 transition-opacity text-sm inline-block">
              Register Interest →
            </a>
          </div>
        </div>

        {/* Wave to next section */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 70" preserveAspectRatio="none" className="w-full h-14">
            <path d="M0 0 C480 70 960 0 1440 70 L1440 70 L0 70 Z" fill="#eff6ff" />
          </svg>
        </div>
      </section>

      {/* ── Waitlist ── */}
      <section id="waitlist" className="relative pt-8 pb-28 px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 60%, #eff6ff 100%)" }}>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full pointer-events-none animate-blob-d2"
          style={{ background: "radial-gradient(circle, rgba(191,219,254,0.55) 0%, transparent 65%)" }} />
        <div className="absolute -bottom-40 -left-40 w-[450px] h-[450px] rounded-full pointer-events-none animate-blob"
          style={{ background: "radial-gradient(circle, rgba(165,243,252,0.4) 0%, transparent 65%)" }} />

        <div className="max-w-xl mx-auto relative" ref={waitlist.ref}>
          <div className="text-center mb-10" style={reveal(waitlist.visible, 0)}>
            <div className="inline-flex items-center gap-2 bg-white text-blue-700 text-xs font-bold px-5 py-2 rounded-full mb-5 border border-blue-200 shadow-md shadow-blue-100/50">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-dot" />
              Register Interest
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Tell us you&apos;re interested.
            </h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
              We are gauging interest before we build. Register below and we will reach out as we get closer to launch.
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-3 mb-6" style={reveal(waitlist.visible, 160)}>
            {roles.map((role) => (
              <button key={role.id}
                onClick={() => { setActiveRole(role.id); setSubmitted(false); }}
                className={`rounded-2xl p-4 text-center border-2 transition-all ${
                  activeRole === role.id
                    ? "border-blue-500 bg-white shadow-lg shadow-blue-100"
                    : "border-transparent bg-white/70 hover:bg-white hover:border-blue-200"
                }`}>
                <div className="text-2xl mb-1.5">{role.icon}</div>
                <div className={`text-xs font-bold ${activeRole === role.id ? "text-blue-600" : "text-slate-600"}`}>
                  {role.label}
                </div>
              </button>
            ))}
          </div>

          <div style={reveal(waitlist.visible, 290)}>
            {submitted ? (
              <div className="text-center bg-white border border-blue-100 rounded-2xl p-12 shadow-xl shadow-blue-100/40 glow-card">
                <div className="w-16 h-16 rounded-full icon-box-blue flex items-center justify-center mx-auto mb-5 text-3xl shadow-lg shadow-blue-200">🎉</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">You are registered!</h3>
                <p className="text-slate-500 text-sm">
                  We will reach out as we get ready to launch for{" "}
                  {activeRole === "lab" ? "diagnostic centres" : activeRole + "s"} in your city.
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-blue-600 text-sm font-semibold hover:underline">
                  Register another
                </button>
              </div>
            ) : (
              <div className="glass-card rounded-2xl shadow-2xl shadow-blue-100/50 p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: "Full Name",       key: "name",   type: "text",  required: true,
                      placeholder: activeRole === "lab" ? "Diagnostic Centre Name" : activeRole === "doctor" ? "Dr. Full Name" : "Your full name" },
                    { label: "Mobile Number",   key: "mobile", type: "tel",   required: false, placeholder: "+91 98765 43210" },
                    { label: "Email Address",   key: "email",  type: "email", required: true,  placeholder: "you@example.com" },
                    { label: "City",            key: "city",   type: "text",  required: false, placeholder: "Bengaluru, Mumbai, Hyderabad..." },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        {f.label}{" "}
                        {f.required
                          ? <span className="text-blue-500">*</span>
                          : <span className="text-slate-400 font-normal text-xs">(optional)</span>}
                      </label>
                      <input type={f.type} required={f.required}
                        value={formData[f.key as keyof typeof formData]}
                        onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/80 focus:bg-white"
                      />
                    </div>
                  ))}

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
                  )}

                  <button type="submit" disabled={loading}
                    className="w-full shimmer-btn text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-lg shadow-blue-300/30">
                    {loading ? "Submitting..." : `Register as ${activeRole === "lab" ? "Diagnostic Centre" : activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`}
                  </button>
                  <p className="text-xs text-slate-400 text-center">
                    No spam. We will only reach out when we are ready to launch in your city.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="section-white border-t border-slate-100 py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M9 21 C4 17 4 11 9 7"  stroke="#2563eb" strokeWidth="3"   strokeLinecap="round"/>
                <path d="M13 24 C5 19 5 9 13 4" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M17 26 C6 20 6 8 17 2" stroke="#60a5fa" strokeWidth="2"   strokeLinecap="round"/>
              </svg>
              <span className="text-xl font-extrabold text-gradient">outlynk</span>
            </div>
            <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
              <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
              <a href="#for-who"      className="hover:text-blue-600 transition-colors">Who it&apos;s For</a>
              <a href="#waitlist"     className="hover:text-blue-600 transition-colors">Register</a>
            </div>
            <a href="#waitlist" className="shimmer-btn text-white text-sm font-bold px-6 py-2.5 rounded-full shadow-md shadow-blue-200 hover:opacity-90 transition-opacity">
              Register Interest
            </a>
          </div>
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <p>Connecting patients, doctors, and diagnostic centres across India.</p>
            <p>2026 Outlynk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
