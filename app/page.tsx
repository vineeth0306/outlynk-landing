"use client";

import { useState } from "react";

type Role = "patient" | "doctor" | "lab";

const roles: { id: Role; label: string; icon: string; description: string }[] = [
  {
    id: "patient",
    label: "Patient",
    icon: "🙋",
    description: "Get your reports shared directly with your doctor. No more carrying physical files or making extra trips.",
  },
  {
    id: "doctor",
    label: "Doctor",
    icon: "🩺",
    description: "Review reports remotely before the patient even steps out. Decide if a physical visit is needed at all.",
  },
  {
    id: "lab",
    label: "Diagnostic Centre",
    icon: "🔬",
    description: "Upload reports once. They reach the doctor and patient instantly, with zero follow-up calls needed.",
  },
];

const steps = [
  {
    number: "01",
    title: "Doctor orders a test",
    description: "After your consultation, your doctor sends a digital test order through Outlynk to a diagnostic centre.",
    icon: "🩺",
    color: "from-blue-500 to-blue-600",
  },
  {
    number: "02",
    title: "Lab uploads the report",
    description: "Once your tests are done, the diagnostic centre uploads your report directly to Outlynk.",
    icon: "🔬",
    color: "from-cyan-500 to-blue-500",
  },
  {
    number: "03",
    title: "Doctor reviews remotely",
    description: "Your doctor gets notified instantly, reviews your reports remotely, then decides the next step.",
    icon: "📱",
    color: "from-blue-600 to-indigo-600",
  },
];

const problems = [
  { step: "1", label: "Visit doctor", detail: "Consultation + test prescription" },
  { step: "2", label: "Visit diagnostic centre", detail: "Get tests done" },
  { step: "3", label: "Collect physical reports", detail: "Wait 1-2 days, then go back" },
  { step: "4", label: "Visit doctor again", detail: "Carry reports manually for review" },
];

const floatingCards = [
  { icon: "📊", title: "Report Ready", sub: "CBC Report uploaded by LabCare", time: "Just now", color: "border-blue-200" },
  { icon: "🩺", title: "Doctor Notified", sub: "Dr. Sharma reviewed your report", time: "2 min ago", color: "border-cyan-200" },
  { icon: "💊", title: "Prescription Ready", sub: "Digital prescription issued", time: "5 min ago", color: "border-indigo-200" },
];

export default function Home() {
  const [activeRole, setActiveRole] = useState<Role>("patient");
  const [formData, setFormData] = useState({ name: "", mobile: "", email: "", city: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-light border-b border-slate-100/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-extrabold text-gradient tracking-tight">Outlynk</span>
          <a
            href="#waitlist"
            className="shimmer-btn text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-200"
          >
            Register Interest
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 pb-24 px-6 overflow-hidden bg-slate-950">

        {/* Blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000" />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000" />

        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid opacity-30" />

        {/* Gradient overlay bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass border border-blue-500/30 text-blue-300 text-sm font-semibold px-5 py-2 rounded-full mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Built for India · Registering Interest
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-up-delay">
            India&apos;s healthcare is
            <br />
            <span className="text-gradient">fragmented.</span>
            <br />
            <span className="text-white opacity-90">Outlynk connects the chain.</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up-delay2">
            One platform where diagnostic reports flow directly from labs to doctors, consultations happen remotely, and your medical history lives in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-fade-up-delay2">
            <a
              href="#waitlist"
              className="shimmer-btn text-white text-base font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform glow-blue"
            >
              Register Interest
            </a>
            <a
              href="#how-it-works"
              className="glass text-white text-base font-semibold px-10 py-4 rounded-full hover:bg-white/15 transition-all"
            >
              See How It Works
            </a>
          </div>

          {/* Floating notification cards */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {floatingCards.map((card, i) => (
              <div
                key={card.title}
                className={`glass-light rounded-2xl px-5 py-4 flex items-center gap-3 text-left border ${card.color} shadow-xl ${
                  i === 0 ? "animate-float" : i === 1 ? "animate-float-delayed" : "animate-float-slow"
                }`}
              >
                <div className="text-2xl">{card.icon}</div>
                <div>
                  <div className="text-sm font-bold text-slate-800">{card.title}</div>
                  <div className="text-xs text-slate-500">{card.sub}</div>
                  <div className="text-xs text-blue-500 font-medium mt-0.5">{card.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-28 px-6 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-red-50 rounded-full blur-3xl opacity-60" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-red-500 text-sm font-bold uppercase tracking-widest">The Problem</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-3 mb-4">
              The way it works today is broken.
            </h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">
              Getting a diagnosis in India means multiple trips, carrying physical files, and losing time for both patients and doctors.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            {problems.map((p, i) => (
              <>
                <div
                  key={p.step}
                  className="flex-1 w-full bg-red-50 border border-red-100 hover:border-red-300 hover:shadow-lg transition-all rounded-2xl p-6 text-center group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white text-sm font-bold flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md shadow-red-200">
                    {p.step}
                  </div>
                  <div className="font-bold text-slate-800 mb-1.5">{p.label}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{p.detail}</div>
                </div>
                {i < problems.length - 1 && (
                  <div key={`arrow-${i}`} className="hidden md:flex flex-shrink-0 w-6 items-center justify-center text-red-300 text-xl font-bold">
                    ›
                  </div>
                )}
              </>
            ))}
          </div>

          <div className="mt-10 text-center">
            <span className="inline-block bg-red-50 border border-red-200 text-red-600 text-sm font-semibold px-6 py-3 rounded-full">
              Most patients make 3 to 4 separate trips just to get a diagnosis and prescription.
            </span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-28 px-6 bg-slate-50/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">The Solution</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-3 mb-4">
              With Outlynk, the flow is simple.
            </h2>
            <p className="text-lg text-slate-500">
              Reports flow automatically. Doctors decide remotely. Patients stay informed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-14 left-1/6 right-1/6 h-px bg-gradient-to-r from-blue-200 via-cyan-300 to-blue-200 z-0" style={{ left: "20%", right: "20%" }} />

            {steps.map((step) => (
              <div
                key={step.number}
                className="relative z-10 bg-white rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-100 group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white text-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-md`}>
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-blue-400 tracking-widest mb-2">{step.number}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Result callout */}
          <div className="mt-12 relative overflow-hidden rounded-3xl p-8 text-white text-center animate-gradient-x bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600">
            <div className="absolute inset-0 dot-grid opacity-10" />
            <div className="relative z-10">
              <div className="text-2xl font-extrabold mb-2">The result?</div>
              <p className="text-blue-100 text-lg max-w-xl mx-auto">
                Doctor reviews reports from their phone. Decides if a visit is needed. Prescription is digital. Everything lives in your medical history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-28 px-6 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-50 rounded-full blur-3xl opacity-60" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">Who It is For</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mt-3">
              Built for everyone in the chain.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-white border border-slate-100 rounded-3xl p-8 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all group cursor-default"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                  {role.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{role.label}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-28 px-6 bg-slate-50/80 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-100 rounded-full blur-3xl opacity-50" />

        <div className="relative z-10 max-w-lg mx-auto">
          <div className="text-center mb-10">
            <span className="text-blue-600 text-sm font-bold uppercase tracking-widest">Register Interest</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mt-3 mb-4">
              Tell us you&apos;re interested.
            </h2>
            <p className="text-slate-500">
              We are gauging interest before we build. Register below and we will reach out to you directly as we get closer to launch.
            </p>
          </div>

          {/* Role tabs */}
          <div className="flex rounded-2xl bg-slate-100 p-1.5 mb-8 gap-1">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => { setActiveRole(role.id); setSubmitted(false); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                  activeRole === role.id
                    ? "bg-white text-blue-600 shadow-md glow-blue-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {role.icon} {role.label}
              </button>
            ))}
          </div>

          {submitted ? (
            <div className="text-center bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-3xl p-12 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-5 text-3xl glow-blue">
                🎉
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">You are registered!</h3>
              <p className="text-slate-500 text-sm">
                We will reach out as we get ready to launch for{" "}
                {activeRole === "lab" ? "diagnostic centres" : activeRole + "s"} in your city.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-blue-600 text-sm font-semibold hover:underline"
              >
                Register another
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
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
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
                    placeholder={
                      activeRole === "lab" ? "Diagnostic Centre Name"
                      : activeRole === "doctor" ? "Dr. Full Name"
                      : "Your full name"
                    }
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
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
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
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
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
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-slate-50 focus:bg-white"
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
                  className="w-full shimmer-btn text-white font-bold py-4 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm mt-2 glow-blue"
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
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-2xl font-extrabold text-gradient mb-2">Outlynk</div>
          <p className="text-slate-500 text-sm mb-6">
            Connecting patients, doctors, and diagnostic centres across India.
          </p>
          <p className="text-slate-600 text-xs">2026 Outlynk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
