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

/* ─── Canvas particle-network hero animation ──────────────────────── */
function HeroAnimation() {
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const canvasWrapRef  = useRef<HTMLDivElement>(null);
  const phoneRef       = useRef<HTMLDivElement>(null);
  const phoneShellRef  = useRef<HTMLDivElement>(null);
  const phoneBodyRef   = useRef<HTMLDivElement>(null);
  const nodeRefs       = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const statusRef      = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const W = 420, H = 420;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = `${W}px`;
    canvas.style.height = `${H}px`;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const cx = W / 2, cy = H / 2;
    const OR = 148;

    const N = 52;
    const px  = Array.from({ length: N }, () => Math.random() * W);
    const py  = Array.from({ length: N }, () => Math.random() * H);
    const pvx = Array.from({ length: N }, () => (Math.random() - 0.5) * 0.28);
    const pvy = Array.from({ length: N }, () => (Math.random() - 0.5) * 0.28);
    const pr  = Array.from({ length: N }, () => Math.random() * 1.4 + 0.5);

    const packets: { t: number; hi: number }[] = [];
    const HUB_OFFSETS = [240, 120, 0];

    const STATUS_MSGS = [
      "", "Patient connecting to Outlynk...", "Lab connecting to Outlynk...",
      "Doctor connecting to Outlynk...", "All connected. Healthcare, simplified.",
      "Outlynk — healthcare in your pocket.",
    ];

    let stepState = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const setStep = (s: number) => {
      stepState = s;
      // clear pending morph timeouts on any step change
      timeouts.forEach(clearTimeout);
      timeouts.length = 0;

      if (statusRef.current) {
        statusRef.current.textContent = STATUS_MSGS[s];
        statusRef.current.style.opacity = s === 0 ? "0" : "1";
        statusRef.current.style.color =
          s === 5 ? "#0891b2" : s === 4 ? "#2563eb" : "#64748b";
      }

      if (s === 5) {
        // ── hide nodes ──────────────────────────────────────────────
        nodeRefs.current.forEach(el => { if (el) el.style.opacity = "0"; });

        // ── canvas fades fast so hub disappears ─────────────────────
        const cw = canvasWrapRef.current;
        if (cw) { cw.style.transition = "opacity 0.22s ease"; cw.style.opacity = "0"; }

        // ── phone starts as a tiny glowing blue circle (= hub) ──────
        const ph    = phoneRef.current;
        const shell = phoneShellRef.current;
        const body  = phoneBodyRef.current;
        if (ph && shell && body) {
          body.style.transition  = "none";
          body.style.opacity     = "0";

          ph.style.transition    = "none";
          ph.style.opacity       = "1";
          ph.style.transform     = "translate(-50%,-50%) scale(0.17)";

          shell.style.transition  = "none";
          shell.style.borderRadius = "50%";
          shell.style.background  = "linear-gradient(135deg, #60a5fa 0%, #0891b2 100%)";
          shell.style.border      = "none";
          shell.style.boxShadow   =
            "0 0 0 10px rgba(96,165,250,0.3), 0 0 55px rgba(59,130,246,0.6)";
        }

        // ── 80 ms later: grow + morph into phone ────────────────────
        timeouts.push(setTimeout(() => {
          const ph2    = phoneRef.current;
          const shell2 = phoneShellRef.current;
          if (!ph2 || !shell2) return;

          ph2.style.transition   = "transform 0.82s cubic-bezier(0.34,1.56,0.64,1)";
          ph2.style.transform    = "translate(-50%,-50%) scale(1)";

          shell2.style.transition =
            "border-radius 0.7s ease 0.12s, background 0.55s ease 0.18s, " +
            "border 0.4s ease 0.22s, box-shadow 0.55s ease 0.18s";
          shell2.style.borderRadius = "40px";
          shell2.style.background   = "#0f172a";
          shell2.style.border       = "6px solid #1e293b";
          shell2.style.boxShadow    =
            "0 32px 80px rgba(15,23,42,0.45), 0 0 0 1px rgba(255,255,255,0.06), " +
            "inset 0 0 0 1px rgba(255,255,255,0.07)";
        }, 80));

        // ── 800 ms later: fade in screen content ────────────────────
        timeouts.push(setTimeout(() => {
          const body2 = phoneBodyRef.current;
          if (body2) { body2.style.transition = "opacity 0.55s ease"; body2.style.opacity = "1"; }
        }, 800));

      } else {
        // ── reset: hide phone, restore canvas ───────────────────────
        const cw = canvasWrapRef.current;
        if (cw) { cw.style.transition = "none"; cw.style.opacity = "1"; }

        const ph   = phoneRef.current;
        const body = phoneBodyRef.current;
        if (ph)   { ph.style.transition = "none"; ph.style.opacity = "0"; }
        if (body) { body.style.transition = "none"; body.style.opacity = "0"; }

        nodeRefs.current.forEach((el, i) => {
          if (!el) return;
          el.style.opacity     = s > i ? "1" : "0";
          el.style.transform   = `translate(-50%, -50%) scale(${s > i ? 1 : 0.6})`;
          el.style.borderColor = s > i ? "rgba(96,165,250,0.7)" : "rgba(219,234,254,0.6)";
        });
      }
    };

    let angle = 0, frame = 0;
    let animId: number;

    // milestones: -, connect1, connect2, connect3, all-glow, phone, reset
    const STEPS_AT = [0, 22, 80, 138, 196, 290, 470];

    const tick = () => {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < N; i++) {
        px[i] = (px[i] + pvx[i] + W) % W;
        py[i] = (py[i] + pvy[i] + H) % H;
        ctx.beginPath();
        ctx.arc(px[i], py[i], pr[i], 0, Math.PI * 2);
        ctx.fillStyle = "rgba(147,197,253,0.45)";
        ctx.fill();
      }

      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = px[i] - px[j], dy = py[i] - py[j];
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 75) {
            ctx.beginPath();
            ctx.moveTo(px[i], py[i]);
            ctx.lineTo(px[j], py[j]);
            ctx.strokeStyle = `rgba(147,197,253,${0.13 * (1 - d / 75)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      [[OR, [6,4], 0.28], [OR*0.68, [], 0.16], [OR*0.42, [3,4], 0.1]].forEach(([r, dash, alpha]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r as number, 0, Math.PI * 2);
        ctx.setLineDash(dash as number[]);
        ctx.strokeStyle = `rgba(147,197,253,${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
      });

      angle += 0.22;
      const hx: number[] = [], hy: number[] = [];
      HUB_OFFSETS.forEach((off, i) => {
        const a = ((angle + off) * Math.PI) / 180;
        hx[i] = cx + Math.cos(a) * OR;
        hy[i] = cy + Math.sin(a) * OR;
        const el = nodeRefs.current[i];
        if (el) { el.style.left = `${hx[i]}px`; el.style.top = `${hy[i]}px`; }
      });

      for (let i = 0; i < 3; i++) {
        if (stepState > i && stepState < 5) {
          ctx.beginPath();
          ctx.moveTo(hx[i], hy[i]);
          ctx.lineTo(cx, cy);
          const g = ctx.createLinearGradient(hx[i], hy[i], cx, cy);
          g.addColorStop(0, "rgba(96,165,250,0.55)");
          g.addColorStop(1, "rgba(6,182,212,0.75)");
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.8;
          ctx.stroke();
        }
      }

      for (let i = packets.length - 1; i >= 0; i--) {
        packets[i].t += 0.024;
        if (packets[i].t >= 1) { packets.splice(i, 1); continue; }
        const hi = packets[i].hi;
        const t  = packets[i].t;
        const ppx = hx[hi] + (cx - hx[hi]) * t;
        const ppy = hy[hi] + (cy - hy[hi]) * t;
        const g2 = ctx.createRadialGradient(ppx, ppy, 0, ppx, ppy, 8);
        g2.addColorStop(0, "rgba(59,130,246,0.9)");
        g2.addColorStop(1, "rgba(59,130,246,0)");
        ctx.beginPath(); ctx.arc(ppx, ppy, 8, 0, Math.PI * 2);
        ctx.fillStyle = g2; ctx.fill();
        ctx.beginPath(); ctx.arc(ppx, ppy, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = "white"; ctx.fill();
      }
      if (frame % 72 === 36 && stepState > 0 && stepState < 5) {
        packets.push({ t: 0, hi: Math.floor(Math.random() * Math.min(stepState, 3)) });
      }

      const pulse = 0.75 + 0.25 * Math.sin(frame * 0.055);
      const glowR = stepState === 4 ? 58 * pulse : 44;
      const cg0 = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
      cg0.addColorStop(0, `rgba(59,130,246,${stepState === 4 ? 0.5 * pulse : 0.22})`);
      cg0.addColorStop(1, "rgba(59,130,246,0)");
      ctx.beginPath(); ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
      ctx.fillStyle = cg0; ctx.fill();

      if (stepState === 4) {
        ctx.beginPath();
        ctx.arc(cx, cy, 38 + 10 * (1 - pulse), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(96,165,250,${0.4 * pulse})`;
        ctx.lineWidth = 2; ctx.stroke();
      }

      // hub — hidden during step 5 (canvas is opacity 0 by then)
      if (stepState < 5) {
        const hubG = ctx.createLinearGradient(cx - 30, cy - 30, cx + 30, cy + 30);
        hubG.addColorStop(0, "#60a5fa");
        hubG.addColorStop(1, "#0891b2");
        ctx.beginPath(); ctx.arc(cx, cy, 32, 0, Math.PI * 2);
        ctx.fillStyle = hubG;
        ctx.shadowColor = "rgba(59,130,246,0.65)";
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.fillStyle = "rgba(255,255,255,0.96)";
        ctx.font = "bold 7.5px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("OUT",  cx, cy - 5.5);
        ctx.fillText("LYNK", cx, cy + 5.5);
      }

      frame++;
      if      (frame === STEPS_AT[1]) setStep(1);
      else if (frame === STEPS_AT[2]) setStep(2);
      else if (frame === STEPS_AT[3]) setStep(3);
      else if (frame === STEPS_AT[4]) setStep(4);
      else if (frame === STEPS_AT[5]) setStep(5);
      else if (frame >= STEPS_AT[6]) { setStep(0); frame = 0; packets.length = 0; }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(animId); timeouts.forEach(clearTimeout); };
  }, []);

  return (
    <div className="hidden md:flex flex-col items-center justify-center h-[460px] animate-fade-up-d2">
      <div className="relative" style={{ width: 420, height: 420 }}>

        {/* Canvas + node cards */}
        <div ref={canvasWrapRef} className="absolute inset-0">
          <canvas ref={canvasRef} className="absolute inset-0" />

          {[
            { icon: "🙋", label: "Patient" },
            { icon: "🔬", label: "Lab" },
            { icon: "🩺", label: "Doctor" },
          ].map((card, i) => (
            <div
              key={card.label}
              ref={el => { nodeRefs.current[i] = el; }}
              className="absolute pointer-events-none"
              style={{
                left: 210, top: 210,
                transform: "translate(-50%, -50%) scale(0.6)",
                opacity: 0,
                transition: "opacity 0.45s ease, transform 0.45s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease",
              }}
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-xl flex flex-col items-center gap-0.5 border shadow-lg shadow-blue-100/70"
                style={{ padding: "7px 10px", width: 64, borderColor: "rgba(219,234,254,0.6)" }}>
                <span style={{ fontSize: 22 }}>{card.icon}</span>
                <span className="text-[9px] font-bold text-slate-600">{card.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Phone — starts as tiny blue circle at center, morphs into phone */}
        <div
          ref={phoneRef}
          className="absolute pointer-events-none"
          style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%) scale(0.17)", opacity: 0 }}
        >
          {/* Shell — morphs from circle to phone body */}
          <div
            ref={phoneShellRef}
            style={{
              width: 192, height: 388,
              background: "#0f172a",
              borderRadius: 40,
              border: "6px solid #1e293b",
              boxShadow: "0 32px 80px rgba(15,23,42,0.45), 0 0 0 1px rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.07)",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Dynamic island */}
            <div style={{
              width: 76, height: 22, background: "#000",
              borderRadius: 12, margin: "9px auto 0", flexShrink: 0,
            }} />

            {/* Screen — home screen with app icons */}
            <div ref={phoneBodyRef} style={{
              flex: 1,
              background: "linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 40%, #0891b2 100%)",
              margin: "6px 0 0", borderRadius: "0 0 34px 34px",
              overflow: "hidden", display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              opacity: 0, padding: "10px 0 18px",
            }}>
              {/* Time */}
              <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 22, fontWeight: 700, marginBottom: 2 }}>9:41</div>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 7.5, marginBottom: 18 }}>Thursday, 17 April</div>

              {/* App icon grid */}
              {[
                [
                  { icon: "🙋", label: "Patients",  bg: "linear-gradient(135deg,#3b82f6,#2563eb)" },
                  { icon: "🩺", label: "Doctors",   bg: "linear-gradient(135deg,#06b6d4,#0891b2)" },
                  { icon: "🔬", label: "Labs",      bg: "linear-gradient(135deg,#8b5cf6,#6d28d9)" },
                ],
                [
                  { icon: "📋", label: "Reports",   bg: "linear-gradient(135deg,#10b981,#059669)" },
                  { icon: "💊", label: "Meds",      bg: "linear-gradient(135deg,#f59e0b,#d97706)" },
                  { icon: "🏥", label: "Hospitals", bg: "linear-gradient(135deg,#ef4444,#dc2626)" },
                ],
              ].map((row, ri) => (
                <div key={ri} style={{ display: "flex", gap: 14, marginBottom: 14 }}>
                  {row.map(app => (
                    <div key={app.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9,
                        background: app.bg,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16,
                        boxShadow: "0 3px 10px rgba(0,0,0,0.25)",
                      }}>{app.icon}</div>
                      <span style={{ color: "rgba(255,255,255,0.82)", fontSize: 6.5, fontWeight: 600 }}>{app.label}</span>
                    </div>
                  ))}
                </div>
              ))}

              {/* Outlynk — featured dock icon */}
              <div style={{ marginTop: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 0 3px rgba(255,255,255,0.35), 0 6px 20px rgba(0,0,0,0.35)",
                }}>
                  <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
                    <path d="M9 21 C4 17 4 11 9 7"  stroke="#2563eb" strokeWidth="3"   strokeLinecap="round"/>
                    <path d="M13 24 C5 19 5 9 13 4" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M17 26 C6 20 6 8 17 2" stroke="#60a5fa" strokeWidth="2"   strokeLinecap="round"/>
                  </svg>
                </div>
                <span style={{ color: "white", fontSize: 7.5, fontWeight: 800, letterSpacing: "0.04em" }}>outlynk</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status text */}
      <p
        ref={statusRef}
        className="text-xs font-semibold mt-1"
        style={{ opacity: 0, transition: "opacity 0.4s ease, color 0.4s ease", minHeight: 20 }}
      />
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
