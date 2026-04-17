"use client";

import { useState, useRef, useEffect } from "react";

/* ─── Scroll-reveal hook ─────────────────────────────────────────── */
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

/* ─── Hero orbital animation ─────────────────────────────────────── */
function HeroOrbit() {
  const [step, setStep] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const run = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
      setStep(0);
      timers.current.push(setTimeout(() => setStep(1), 400));
      timers.current.push(setTimeout(() => setStep(2), 1600));
      timers.current.push(setTimeout(() => setStep(3), 2800));
      timers.current.push(setTimeout(() => setStep(4), 3700));
      timers.current.push(setTimeout(() => setStep(0), 5400));
      timers.current.push(setTimeout(run, 6100));
    };
    run();
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const statusMessages = [
    "",
    "Patient connecting to Outlynk...",
    "Lab connecting to Outlynk...",
    "Doctor connecting to Outlynk...",
    "All connected. Healthcare, simplified.",
  ];

  const nodeAnim = (show: boolean): React.CSSProperties => ({
    opacity: show ? 1 : 0,
    animation: show ? "node-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
    transition: show ? "none" : "opacity 0.4s ease",
  });

  return (
    <div className="hidden md:flex flex-col items-center justify-center h-[440px] animate-fade-up-d2">
      <div className="relative w-80 h-80 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full"
          style={{ backgroundImage: "radial-gradient(circle, #bfdbfe 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="absolute w-64 h-64 rounded-full border border-dashed border-blue-300/50 animate-spin-slow" />
        <div className="absolute w-48 h-48 rounded-full border border-blue-200/40 animate-spin-rev" />
        <div className="absolute w-16 h-16 rounded-full bg-blue-400/20 animate-ping-slow" />
        <div className="absolute w-16 h-16 rounded-full bg-blue-400/10 animate-ping-slow" style={{ animationDelay: "1s" }} />

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
          <line x1="45" y1="230" x2="160" y2="160" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"
            strokeDasharray="135" strokeDashoffset={step >= 1 ? 0 : 135}
            style={{ transition: step >= 1 ? "stroke-dashoffset 0.8s ease 0.2s" : "none" }} />
          <line x1="275" y1="230" x2="160" y2="160" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"
            strokeDasharray="135" strokeDashoffset={step >= 2 ? 0 : 135}
            style={{ transition: step >= 2 ? "stroke-dashoffset 0.8s ease 0.2s" : "none" }} />
          <line x1="160" y1="30" x2="160" y2="160" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"
            strokeDasharray="130" strokeDashoffset={step >= 3 ? 0 : 130}
            style={{ transition: step >= 3 ? "stroke-dashoffset 0.8s ease 0.2s" : "none" }} />
        </svg>

        <div className="relative z-20 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center"
          style={{
            boxShadow: step === 4
              ? "0 0 0 5px rgba(96,165,250,0.35), 0 0 40px rgba(59,130,246,0.65), 0 20px 40px rgba(59,130,246,0.3)"
              : "0 20px 40px rgba(96,165,250,0.35)",
            transition: "box-shadow 0.6s ease",
          }}>
          <div className="text-white font-black text-xs tracking-widest leading-tight text-center">OUT<br />LYNK</div>
        </div>

        <div className="absolute bottom-4 left-0 z-10">
          <div key={`p-${step >= 1}`} style={nodeAnim(step >= 1)}>
            <div className="bg-white rounded-2xl px-3 py-2 flex flex-col items-center gap-1 w-20 border border-blue-200 shadow-lg shadow-blue-100/60">
              <span className="text-2xl">🙋</span>
              <span className="text-xs font-bold text-slate-600">Patient</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 right-0 z-10">
          <div key={`l-${step >= 2}`} style={nodeAnim(step >= 2)}>
            <div className="bg-white rounded-2xl px-3 py-2 flex flex-col items-center gap-1 w-20 border border-blue-200 shadow-lg shadow-blue-100/60">
              <span className="text-2xl">🔬</span>
              <span className="text-xs font-bold text-slate-600">Lab</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div key={`d-${step >= 3}`} style={nodeAnim(step >= 3)}>
            <div className="bg-white rounded-2xl px-3 py-2 flex flex-col items-center gap-1 w-20 border border-blue-200 shadow-lg shadow-blue-100/60">
              <span className="text-2xl">🩺</span>
              <span className="text-xs font-bold text-slate-600">Doctor</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-7 mt-3 flex items-center justify-center overflow-hidden">
        <p key={step} className="text-xs font-semibold animate-fade-up"
          style={{ color: step === 4 ? "#2563eb" : "#64748b", opacity: step === 0 ? 0 : 1 }}>
          {statusMessages[step]}
        </p>
      </div>
    </div>
  );
}

/* ─── Data ───────────────────────────────────────────────────────── */
type Role = "patient" | "doctor" | "lab";

const roles: { id: Role; label: string; icon: string; description: string; features: string[] }[] = [
  {
    id: "patient",
    label: "Patient",
    icon: "🙋",
    description: "Access your reports, consult your doctor remotely, and maintain a complete health history, all in one place.",
    features: ["Instant report access", "Remote consultations", "Full medical history"],
  },
  {
    id: "doctor",
    label: "Doctor",
    icon: "🩺",
    description: "Receive reports directly from labs, review them remotely, and decide the right next step for your patient.",
    features: ["Direct lab reports", "Remote review", "Digital prescriptions"],
  },
  {
    id: "lab",
    label: "Diagnostic Centre",
    icon: "🔬",
    description: "Upload reports once. They reach the ordering doctor and patient instantly, no calls, no delays.",
    features: ["One-click upload", "Instant delivery", "Zero follow-up calls"],
  },
];

const steps = [
  {
    number: "01", label: "First", title: "Doctor orders a test",
    description: "After your consultation, your doctor sends a digital test order through Outlynk to a diagnostic centre near you.",
    icon: "🩺", color: "from-blue-500 to-blue-600",
  },
  {
    number: "02", label: "Then", title: "Lab uploads the report",
    description: "Once your tests are done, the diagnostic centre uploads your report directly to Outlynk, no paper, no courier.",
    icon: "🔬", color: "from-cyan-500 to-blue-500",
  },
  {
    number: "03", label: "Finally", title: "Doctor reviews remotely",
    description: "Your doctor gets notified instantly, reviews your reports, and decides if a physical visit is even needed.",
    icon: "📱", color: "from-blue-600 to-indigo-600",
  },
];

const problems = [
  { label: "First", title: "You visit a doctor.", detail: "They order tests. You have no digital record." },
  { label: "Then", title: "Tests are repeated.", detail: "Reports are physical. No one else can access them." },
  { label: "Finally", title: "And it is often unclear...", detail: "Do you need a follow-up? Where are your reports?" },
];

const marqueeItems = [
  "Patients", "Doctors", "Diagnostic Centres", "Outlynk",
  "Instant Reports", "Remote Consultations", "Built for India", "Healthcare Simplified",
];

/* ─── Page ───────────────────────────────────────────────────────── */
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
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: activeRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setSubmitted(true);
      setFormData({ name: "", mobile: "", email: "", city: "" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-900" style={{ backgroundColor: "#f4f7ff" }}>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100/60 shadow-sm shadow-blue-100/30">
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
      <section className="relative pt-20 pb-24 px-6 overflow-hidden" style={{ backgroundColor: "#f4f7ff" }}>
        {/* Background blobs */}
        <div className="absolute -top-32 -right-32 w-[550px] h-[550px] rounded-full animate-glow pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(191,219,254,0.6) 0%, transparent 68%)" }} />
        <div className="absolute -bottom-40 -left-32 w-[450px] h-[450px] rounded-full animate-glow pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(165,243,252,0.4) 0%, transparent 68%)", animationDelay: "2s" }} />

        <div className="max-w-6xl mx-auto relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-6 animate-fade-up border border-blue-200/50 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-dot" />
                Built for India · Registering Interest Now
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 animate-fade-up-d1">
                India&apos;s healthcare<br />is fragmented.<br />
                <span className="text-gradient">Outlynk connects</span><br />
                <span className="text-gradient">the chain.</span>
              </h1>

              <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-md animate-fade-up-d2">
                One platform where diagnostic reports flow directly from labs to doctors, consultations happen remotely, and your medical history lives in one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-up-d3">
                <a href="#waitlist"
                  className="shimmer-btn text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-blue-300/40 hover:opacity-90 transition-opacity text-sm">
                  Register Interest
                </a>
                <a href="#how-it-works"
                  className="border-2 border-blue-200 text-blue-600 font-bold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors text-sm">
                  See How It Works
                </a>
              </div>

              {/* Trust row */}
              <div className="flex items-center gap-4 animate-fade-up-d3">
                <div className="flex -space-x-2">
                  {["🙋","🩺","🔬"].map((e,i) => (
                    <div key={i} className="w-9 h-9 rounded-full bg-white border-2 border-blue-100 flex items-center justify-center text-base shadow-sm">
                      {e}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-medium">Patients, Doctors &amp; Labs all on one platform</p>
              </div>
            </div>

            <HeroOrbit />
          </div>
        </div>
      </section>

      {/* ── Marquee strip ── */}
      <div className="relative py-4 overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700">
        <div className="flex animate-marquee whitespace-nowrap select-none">
          {[0, 1].map(set => (
            <span key={set} className="flex items-center shrink-0">
              {marqueeItems.map(item => (
                <span key={item} className="inline-flex items-center mx-6 text-white/90 font-semibold text-sm tracking-wide">
                  <span className="mr-6">{item}</span>
                  <span className="text-blue-300/60">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── Problem ── */}
      <section className="relative section-white py-28 px-6 overflow-hidden">
        <div className="section-blob-tr" />

        <div className="max-w-5xl mx-auto relative" ref={problem.ref}>
          <div className="text-center mb-16" style={reveal(problem.visible, 0)}>
            <span className="inline-block bg-red-50 text-red-500 text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-red-100">
              The Problem
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              A Situation Many Patients Recognise
            </h2>
            <div className="w-14 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full" />
          </div>

          <div className="relative">
            <div
              className="hidden md:block absolute top-12 left-[20%] right-[20%] border-t-2 border-dashed border-blue-200 z-0"
              style={{
                transformOrigin: "left center",
                transform: problem.visible ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 1s ease 0.4s",
              }}
            />
            <div className="grid md:grid-cols-3 gap-6 relative z-10">
              {problems.map((p, i) => (
                <div
                  key={p.label}
                  className="relative bg-white rounded-2xl shadow-md p-7 card-hover overflow-hidden gradient-border"
                  style={reveal(problem.visible, 160 + i * 130)}
                >
                  {/* Large decorative number */}
                  <div className="absolute -top-3 -right-1 text-[80px] font-black leading-none select-none"
                    style={{ color: "#eff6ff" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="relative z-10">
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
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="relative section-tint py-28 px-6 overflow-hidden">
        <div className="section-blob-bl" />
        <div className="absolute top-20 right-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(147,197,253,0.3) 0%, transparent 70%)" }} />

        <div className="max-w-5xl mx-auto relative" ref={steps_.ref}>
          <div className="text-center mb-16" style={reveal(steps_.visible, 0)}>
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 border border-blue-200/50">
              Built to support every role in healthcare
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Designed for How Healthcare Works
            </h2>
            <div className="w-14 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="relative bg-white rounded-2xl border border-slate-100 p-7 shadow-md card-hover overflow-hidden"
                style={reveal(steps_.visible, 100 + i * 150)}
              >
                {/* Decorative number */}
                <div className="absolute -bottom-2 -right-1 text-[80px] font-black leading-none select-none"
                  style={{ color: "#f0f9ff" }}>
                  {step.number}
                </div>
                {/* Top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${step.color}`} />
                <div className="relative z-10">
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
          <div
            className="mt-10 relative overflow-hidden rounded-2xl p-8 text-white text-center shadow-xl shadow-blue-400/25"
            style={{
              ...reveal(steps_.visible, 570),
              background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #0891b2 100%)",
            }}
          >
            {/* Dot pattern overlay */}
            <div className="absolute inset-0 opacity-[0.07]"
              style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
            <div className="relative">
              <div className="text-2xl font-extrabold mb-2">The result?</div>
              <p className="text-blue-100 max-w-xl mx-auto text-sm leading-relaxed">
                Doctor reviews reports from their phone. Decides if a visit is needed. Prescription is digital. Everything lives in your medical history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section id="for-who" className="relative section-white py-28 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(191,219,254,0.5) 0%, transparent 70%)" }} />

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
              <div
                key={role.id}
                className="group relative bg-white border border-slate-100 rounded-2xl shadow-md card-hover overflow-hidden"
                style={reveal(forWho.visible, 100 + i * 120)}
              >
                {/* Gradient top accent */}
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
            <a href="#waitlist" className="shimmer-btn text-white font-bold px-10 py-4 rounded-full shadow-lg shadow-blue-300/40 hover:opacity-90 transition-opacity text-sm inline-block">
              Register Interest →
            </a>
          </div>
        </div>
      </section>

      {/* ── Waitlist ── */}
      <section id="waitlist" className="relative py-28 px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f0f9ff 50%, #eff6ff 100%)" }}>
        <div className="section-blob-tr" />
        <div className="section-blob-bl" />

        <div className="max-w-xl mx-auto relative" ref={waitlist.ref}>
          <div className="text-center mb-10" style={reveal(waitlist.visible, 0)}>
            <div className="inline-flex items-center gap-2 bg-white text-blue-700 text-xs font-bold px-5 py-2 rounded-full mb-5 border border-blue-200 shadow-sm">
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
              <button
                key={role.id}
                onClick={() => { setActiveRole(role.id); setSubmitted(false); }}
                className={`rounded-2xl p-4 text-center border-2 transition-all ${
                  activeRole === role.id
                    ? "border-blue-500 bg-white shadow-lg shadow-blue-100"
                    : "border-transparent bg-white/70 hover:bg-white hover:border-blue-200"
                }`}
              >
                <div className="text-2xl mb-1.5">{role.icon}</div>
                <div className={`text-xs font-bold ${activeRole === role.id ? "text-blue-600" : "text-slate-600"}`}>
                  {role.label}
                </div>
              </button>
            ))}
          </div>

          <div style={reveal(waitlist.visible, 290)}>
            {submitted ? (
              <div className="text-center bg-white border border-blue-100 rounded-2xl p-12 shadow-xl shadow-blue-100/40">
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
              <div className="glass-card rounded-2xl shadow-xl shadow-blue-100/40 p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { label: "Full Name", key: "name", type: "text", required: true,
                      placeholder: activeRole === "lab" ? "Diagnostic Centre Name" : activeRole === "doctor" ? "Dr. Full Name" : "Your full name" },
                    { label: "Mobile Number", key: "mobile", type: "tel", required: false, placeholder: "+91 98765 43210" },
                    { label: "Email Address", key: "email", type: "email", required: true, placeholder: "you@example.com" },
                    { label: "City", key: "city", type: "text", required: false, placeholder: "Bengaluru, Mumbai, Hyderabad..." },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                        {f.label}{" "}
                        {f.required
                          ? <span className="text-blue-500">*</span>
                          : <span className="text-slate-400 font-normal text-xs">(optional)</span>}
                      </label>
                      <input
                        type={f.type}
                        required={f.required}
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

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full shimmer-btn text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-lg shadow-blue-300/30"
                  >
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
