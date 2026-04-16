"use client";

import { useState } from "react";

type Role = "patient" | "doctor" | "lab";

const roles: { id: Role; label: string; icon: string; description: string }[] = [
  {
    id: "patient",
    label: "Patient",
    icon: "🧑‍⚕️",
    description: "Get your reports shared directly with your doctor. No more carrying physical files.",
  },
  {
    id: "doctor",
    label: "Doctor",
    icon: "👨‍⚕️",
    description: "Review reports remotely. Decide if a physical visit is even needed before the patient travels.",
  },
  {
    id: "lab",
    label: "Diagnostic Centre",
    icon: "🏥",
    description: "Upload reports once. They reach the doctor and patient instantly, no follow-up calls.",
  },
];

const steps = [
  {
    number: "01",
    title: "Doctor orders a test",
    description:
      "After your consultation, your doctor sends a digital test order through Outlynk to a diagnostic centre.",
    icon: "📋",
  },
  {
    number: "02",
    title: "Lab uploads the report",
    description:
      "Once your tests are done, the diagnostic centre uploads your report directly to Outlynk.",
    icon: "📤",
  },
  {
    number: "03",
    title: "Doctor reviews remotely",
    description:
      "Your doctor gets notified instantly and reviews your reports remotely, then decides the next step.",
    icon: "💻",
  },
];

const problems = [
  { step: "1", label: "Visit doctor", detail: "Consultation + test prescription" },
  { step: "2", label: "Visit diagnostic centre", detail: "Get tests done" },
  { step: "3", label: "Collect physical reports", detail: "Wait 1–2 days, then go back" },
  { step: "4", label: "Visit doctor again", detail: "Carry reports manually for review" },
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
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600 tracking-tight">Outlynk</span>
          <a
            href="#waitlist"
            className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors"
          >
            Register Interest
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-36 pb-24 px-6 text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl mx-auto">
          <div className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Built for India · Registering Interest
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Your diagnostic reports
            <span className="text-blue-600"> reach your doctor</span>
            <br />
            the moment they&apos;re ready.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Outlynk connects patients, doctors, and diagnostic centres on one platform, eliminating
            unnecessary trips and putting your medical history in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#waitlist"
              className="bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              Register Interest
            </a>
            <a
              href="#how-it-works"
              className="border border-slate-300 text-slate-700 text-lg font-semibold px-8 py-4 rounded-full hover:bg-slate-50 transition-colors"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-100 bg-white py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: "3", label: "User types connected" },
            { value: "1 platform", label: "For reports, consults & prescriptions" },
            { value: "0 extra trips", label: "Goal for every patient" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              The way it works today is broken.
            </h2>
            <p className="text-lg text-slate-600 max-w-xl mx-auto">
              Getting a diagnosis in India means multiple trips, carrying physical files, and losing time for both patients and doctors.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            {problems.map((p, i) => (
              <div key={p.step} className="flex md:flex-col items-center gap-3 flex-1 w-full">
                <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                  <div className="bg-red-100 text-red-700 rounded-2xl p-5 flex-1 text-center">
                    <div className="text-xs font-bold text-red-400 mb-1">TRIP {p.step}</div>
                    <div className="font-semibold text-slate-800 text-sm">{p.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{p.detail}</div>
                  </div>
                  {i < problems.length - 1 && (
                    <div className="hidden md:block text-slate-300 text-2xl">→</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-slate-500 mt-8 text-sm">
            ↑ Most patients make <strong className="text-red-600">3–4 separate trips</strong> just to get a diagnosis and prescription.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              With Outlynk, the flow is simple.
            </h2>
            <p className="text-lg text-slate-600">
              Reports flow automatically. Doctors decide what&apos;s needed. Patients stay informed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-blue-50 rounded-2xl p-8 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{step.icon}</div>
                <div className="text-blue-600 font-bold text-sm mb-2">{step.number}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white text-center">
            <div className="text-2xl font-bold mb-2">The result?</div>
            <p className="text-blue-100 text-lg">
              Doctor reviews reports from their phone. Decides: virtual call or in-person visit.
              Prescription is digital. Everything is in your medical history, forever.
            </p>
          </div>
        </div>
      </section>

      {/* Who it&apos;s for */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Built for everyone in the chain.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-white rounded-2xl p-8 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-4">{role.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{role.label}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="py-24 px-6 bg-white">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Tell us you&apos;re interested.
            </h2>
            <p className="text-slate-600">
              We are gauging interest before we build. Register below and we will reach out to you directly as we get closer to launch.
            </p>
          </div>

          {/* Role tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 mb-8">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => { setActiveRole(role.id); setSubmitted(false); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  activeRole === role.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {role.icon} {role.label}
              </button>
            ))}
          </div>

          {submitted ? (
            <div className="text-center bg-green-50 border border-green-200 rounded-2xl p-10">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">You&apos;re on the list!</h3>
              <p className="text-slate-600 text-sm">
                We&apos;ll reach out to you as soon as we&apos;re ready to onboard{" "}
                {activeRole === "lab" ? "diagnostic centres" : activeRole + "s"} in your city.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-6 text-blue-600 text-sm font-semibold underline"
              >
                Register another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={
                    activeRole === "lab"
                      ? "Diagnostic Centre Name"
                      : activeRole === "doctor"
                      ? "Dr. Full Name"
                      : "Your full name"
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">City <span className="text-slate-400 font-normal">(optional)</span></label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bengaluru, Mumbai, Hyderabad..."
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white font-semibold py-4 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm mt-2"
              >
                {loading ? "Submitting..." : `Register as ${activeRole === "lab" ? "Diagnostic Centre" : activeRole.charAt(0).toUpperCase() + activeRole.slice(1)}`}
              </button>

              <p className="text-xs text-slate-400 text-center">
                No spam. We will only reach out when we are ready to launch in your city.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-10 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="text-xl font-bold text-blue-600 mb-2">Outlynk</div>
          <p className="text-slate-500 text-sm mb-4">
            Connecting patients, doctors, and diagnostic centres across India.
          </p>
          <p className="text-slate-400 text-xs">© 2026 Outlynk. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
