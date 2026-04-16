"use client";

import { useState, useRef, useEffect } from "react";

type Role = "patient" | "doctor" | "lab";

// Fires once when element scrolls into view
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

// Inline style for a scroll-reveal element
function reveal(visible: boolean, delayMs = 0): React.CSSProperties {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px) scale(1)" : "translateY(40px) scale(0.97)",
    transition: `opacity 0.7s ease ${delayMs}ms, transform 0.7s ease ${delayMs}ms`,
    willChange: "transform, opacity",
  };
}

const roles: { id: Role; label: string; icon: string; description: string }[] = [
  {
    id: "patient",
    label: "Patient",
    icon: "🙋",
    description: "Access your reports, consult your doctor remotely, and maintain a complete health history, all in one place.",
  },
  {
    id: "doctor",
    label: "Doctor",
    icon: "🩺",
    description: "Receive reports directly from labs, review them remotely, and decide the right next step for your patient.",
  },
  {
    id: "lab",
    label: "Diagnostic Centre",
    icon: "🔬",
    description: "Upload reports once. They reach the ordering doctor and patient instantly, no calls, no delays.",
  },
];

const steps = [
  {
    number: "01",
    label: "First",
    title: "Doctor orders a test",
    description: "After your consultation, your doctor sends a digital test order through Outlynk to a diagnostic centre near you.",
    icon: "🩺",
    color: "from-blue-500 to-blue-600",
  },
  {
    number: "02",
    label: "Then",
    title: "Lab uploads the report",
    description: "Once your tests are done, the diagnostic centre uploads your report directly to Outlynk, no paper, no courier.",
    icon: "🔬",
    color: "from-cyan-500 to-blue-500",
  },
  {
    number: "03",
    label: "Finally",
    title: "Doctor reviews remotely",
    description: "Your doctor gets notified instantly, reviews your reports, and decides if a physical visit is even needed.",
    icon: "📱",
    color: "from-blue-600 to-indigo-600",
  },
];

const problems = [
  { label: "First", title: "You visit a doctor.", detail: "They order tests. You have no digital record." },
  { label: "Then", title: "Tests are repeated.", detail: "Reports are physical. No one else can access them." },
  { label: "Finally", title: "And it is often unclear...", detail: "Do you need a follow-up? Where are your reports?" },
];

export default function Home() {
  const [activeRole, setActiveRole] = useState<Role>("patient");
  const [formData, setFormData] = useState({ name: "", mobile: "", email: "", city: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Scroll reveal refs — one per section
  const problem = useInView();
  const steps_  = useInView();
  const forWho  = useInView();
  const waitlist = useInView();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
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

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100/60">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M9 21 C4 17 4 11 9 7"   stroke="#2563eb" strokeWidth="3"   strokeLinecap="round"/>
                <path d="M13 24 C5 19 5 9 13 4"  stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M17 26 C6 20 6 8 17 2"  stroke="#60a5fa" strokeWidth="2"   strokeLinecap="round"/>
              </svg>
              <span className="text-xl font-extrabold text-gradient tracking-tight">outlynk</span>
            </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How it Works</a>
            <a href="#for-who" className="hover:text-blue-600 transition-colors">Who it&apos;s For</a>
            <a href="#waitlist" className="hover:text-blue-600 transition-colors">Register</a>
          </div>
          <a
            href="#waitlist"
            className="shimmer-btn text-white text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-md shadow-blue-200"
          >
            Register Interest
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="section-tint pt-20 pb-16 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-6 animate-fade-up">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse-dot" />
                Built for India · Registering Interest Now
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-5 animate-fade-up-d1">
                India&apos;s healthcare
                <br />
                is fragmented.
                <br />
                <span className="text-gradient">Outlynk connects</span>
                <br />
                <span className="text-gradient">the chain.</span>
              </h1>
              <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-md animate-fade-up-d2">
                One platform where diagnostic reports flow directly from labs to doctors, consultations happen remotely, and your medical history lives in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 animate-fade-up-d3">
                <a
                  href="#waitlist"
                  className="shimmer-btn text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-blue-200 hover:opacity-90 transition-opacity text-sm"
                >
                  Register Interest
                </a>
                <a
                  href="#how-it-works"
                  className="border-2 border-blue-200 text-blue-600 font-bold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-colors text-sm"
                >
                  See How It Works
                </a>
              </div>
            </div>

            {/* Right — orbital connectivity hub */}
            <div className="hidden md:flex items-center justify-center h-[420px] animate-fade-up-d2">
              <div className="relative w-80 h-80 flex items-center justify-center">

                {/* Dot grid bg */}
                <div className="absolute inset-0 rounded-full"
                  style={{ backgroundImage: 'radial-gradient(circle, #bfdbfe 1px, transparent 1px)', backgroundSize: '22px 22px' }} />

                {/* Orbit rings */}
                <div className="absolute w-64 h-64 rounded-full border border-dashed border-blue-300/50 animate-spin-slow" />
                <div className="absolute w-48 h-48 rounded-full border border-blue-200/40 animate-spin-rev" />

                {/* Pulse rings on center */}
                <div className="absolute w-16 h-16 rounded-full bg-blue-400/20 animate-ping-slow" />
                <div className="absolute w-16 h-16 rounded-full bg-blue-400/10 animate-ping-slow" style={{ animationDelay: '1s' }} />

                {/* SVG connecting lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
                  <line x1="160" y1="160" x2="160" y2="30"
                    stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="6 4"
                    className="animate-flow" />
                  <line x1="160" y1="160" x2="275" y2="230"
                    stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="6 4"
                    className="animate-flow" style={{ animationDelay: '1s' }} />
                  <line x1="160" y1="160" x2="45" y2="230"
                    stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="6 4"
                    className="animate-flow" style={{ animationDelay: '2s' }} />
                </svg>

                {/* Center hub */}
                <div className="relative z-20 w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-blue-300/60">
                  <div className="text-center">
                    <div className="text-white font-black text-xs tracking-widest leading-tight">OUT<br/>LYNK</div>
                  </div>
                </div>

                {/* Node: Doctor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 animate-float z-10">
                  <div className="bg-white rounded-2xl shadow-lg border border-blue-100 px-3 py-2 flex flex-col items-center gap-1 w-20">
                    <span className="text-2xl">🩺</span>
                    <span className="text-xs font-bold text-slate-600">Doctor</span>
                  </div>
                </div>

                {/* Node: Lab */}
                <div className="absolute bottom-4 right-0 animate-float-d1 z-10">
                  <div className="bg-white rounded-2xl shadow-lg border border-blue-100 px-3 py-2 flex flex-col items-center gap-1 w-20">
                    <span className="text-2xl">🔬</span>
                    <span className="text-xs font-bold text-slate-600">Lab</span>
                  </div>
                </div>

                {/* Node: Patient */}
                <div className="absolute bottom-4 left-0 animate-float-d2 z-10">
                  <div className="bg-white rounded-2xl shadow-lg border border-blue-100 px-3 py-2 flex flex-col items-center gap-1 w-20">
                    <span className="text-2xl">🙋</span>
                    <span className="text-xs font-bold text-slate-600">Patient</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="section-white py-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto" ref={problem.ref}>

          {/* Heading */}
          <div className="text-center mb-14" style={reveal(problem.visible, 0)}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              A Situation Many Patients Recognise
            </h2>
          </div>

          {/* Cards + connecting line */}
          <div className="relative">
            {/* Connecting dashed line — animates width when section appears */}
            <div
              className="hidden md:block absolute top-10 left-[20%] right-[20%] border-t-2 border-dashed border-blue-200 z-0"
              style={{
                transformOrigin: "left center",
                transform: problem.visible ? "scaleX(1)" : "scaleX(0)",
                transition: "transform 0.9s ease 0.35s",
              }}
            />

            <div className="grid md:grid-cols-3 gap-6 relative z-10">
              {problems.map((p, i) => (
                <div
                  key={p.label}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 card-hover"
                  style={reveal(problem.visible, 120 + i * 130)}
                >
                  <div className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
                    {p.label}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{p.title}</h3>
                  <p className="text-sm text-slate-500">{p.detail}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center" style={reveal(problem.visible, 550)}>
              <span className="inline-block bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold px-6 py-3 rounded-full">
                Outlynk was built to address this
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="section-tint py-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto" ref={steps_.ref}>

          {/* Heading */}
          <div className="text-center mb-14" style={reveal(steps_.visible, 0)}>
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full mb-3">
              Built to support every role in healthcare
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
              Designed for How Healthcare Works
            </h2>
          </div>

          {/* Step cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm card-hover"
                style={reveal(steps_.visible, 100 + i * 150)}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} text-white text-xl flex items-center justify-center shadow-md`}>
                    {step.icon}
                  </div>
                  <span className="text-xs font-bold text-blue-400 bg-blue-50 px-3 py-1 rounded-full">{step.label}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Result banner */}
          <div
            className="mt-10 animate-gradient-x bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 rounded-2xl p-7 text-white text-center shadow-lg shadow-blue-200"
            style={reveal(steps_.visible, 550)}
          >
            <div className="font-extrabold text-xl mb-1">The result?</div>
            <p className="text-blue-100 max-w-xl mx-auto text-sm leading-relaxed">
              Doctor reviews reports from their phone. Decides if a visit is needed. Prescription is digital. Everything lives in your medical history.
            </p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section id="for-who" className="section-white py-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto" ref={forWho.ref}>

          {/* Heading */}
          <div className="text-center mb-14" style={reveal(forWho.visible, 0)}>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Built for Everyone in the Chain
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              One platform that connects patients, doctors, and diagnostic centres, securely and with consent.
            </p>
          </div>

          {/* Role cards */}
          <div className="grid md:grid-cols-3 gap-5">
            {roles.map((role, i) => (
              <div
                key={role.id}
                className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm card-hover"
                style={reveal(forWho.visible, 100 + i * 120)}
              >
                <div className="w-12 h-12 rounded-xl icon-box flex items-center justify-center text-2xl mb-4 shadow-sm">
                  {role.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{role.label}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{role.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center" style={reveal(forWho.visible, 460)}>
            <a href="#waitlist" className="shimmer-btn text-white font-bold px-8 py-3.5 rounded-full shadow-lg shadow-blue-200 hover:opacity-90 transition-opacity text-sm inline-block">
              Register Interest
            </a>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="section-tint py-24 px-6">
        <div className="max-w-xl mx-auto" ref={waitlist.ref}>

          <div className="text-center mb-10" style={reveal(waitlist.visible, 0)}>
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-bold px-4 py-2 rounded-full mb-4">
              Register Interest
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Tell us you&apos;re interested.
            </h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              We are gauging interest before we build. Register below and we will reach out as we get closer to launch.
            </p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-3 mb-6" style={reveal(waitlist.visible, 150)}>
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => { setActiveRole(role.id); setSubmitted(false); }}
                className={`rounded-2xl p-4 text-center border-2 transition-all ${
                  activeRole === role.id
                    ? "border-blue-500 bg-white shadow-md shadow-blue-100"
                    : "border-transparent bg-white/60 hover:bg-white hover:border-blue-200"
                }`}
              >
                <div className="text-2xl mb-1.5">{role.icon}</div>
                <div className={`text-xs font-bold ${activeRole === role.id ? "text-blue-600" : "text-slate-600"}`}>
                  {role.label}
                </div>
              </button>
            ))}
          </div>

          <div style={reveal(waitlist.visible, 280)}>
            {submitted ? (
              <div className="text-center bg-white border border-blue-100 rounded-2xl p-12 shadow-lg">
                <div className="w-16 h-16 rounded-full icon-box-blue flex items-center justify-center mx-auto mb-5 text-3xl shadow-lg shadow-blue-200">
                  🎉
                </div>
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
              <div className="bg-white rounded-2xl shadow-lg border border-blue-50 p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Full Name <span className="text-blue-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                      placeholder={activeRole === "lab" ? "Diagnostic Centre Name" : activeRole === "doctor" ? "Dr. Full Name" : "Your full name"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Mobile Number <span className="text-slate-400 font-normal text-xs">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Email Address <span className="text-blue-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      City <span className="text-slate-400 font-normal text-xs">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                      placeholder="Bengaluru, Mumbai, Hyderabad..."
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full shimmer-btn text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed text-sm shadow-lg shadow-blue-200"
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

      {/* Footer */}
      <footer className="section-white border-t border-slate-100 py-10 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <path d="M9 21 C4 17 4 11 9 7"   stroke="#2563eb" strokeWidth="3"   strokeLinecap="round"/>
              <path d="M13 24 C5 19 5 9 13 4"  stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M17 26 C6 20 6 8 17 2"  stroke="#60a5fa" strokeWidth="2"   strokeLinecap="round"/>
            </svg>
            <span className="text-xl font-extrabold text-gradient">outlynk</span>
          </div>
          <p className="text-slate-400 text-sm">Connecting patients, doctors, and diagnostic centres across India.</p>
          <p className="text-slate-300 text-xs mt-3">2026 Outlynk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
