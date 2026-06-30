"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function MentorApplicationForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [expertise, setExpertise] = useState("");
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const res = await fetch("/api/public/mentor-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, whatsapp, expertise, bio, linkedin }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-md shadow-glass p-10 text-center max-w-lg mx-auto"
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime/30">
          <CheckCircle2 className="text-teal" size={28} />
        </span>
        <h3 className="text-xl font-bold text-teal mt-5">Thanks, {fullName.split(" ")[0]}.</h3>
        <p className="text-sm text-muted mt-2 leading-relaxed">
          We&apos;ve received your application. Our team will review it and reach out to you
          soon — once confirmed, you&apos;ll be added to the platform as a mentor.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-md shadow-glass p-6 sm:p-8 flex flex-col gap-4 max-w-lg mx-auto"
    >
      <div>
        <label className="text-sm font-medium text-teal">Full name</label>
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Your full name"
          className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-teal">Email</label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-teal">WhatsApp number</label>
        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          placeholder="e.g. +234 800 000 0000"
          className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-teal">Area of expertise</label>
        <input
          required
          value={expertise}
          onChange={(e) => setExpertise(e.target.value)}
          placeholder="e.g. Career coaching, Computer Science, Postgraduate applications"
          className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-teal">LinkedIn (optional)</label>
        <input
          value={linkedin}
          onChange={(e) => setLinkedin(e.target.value)}
          placeholder="linkedin.com/in/yourname"
          className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-teal">Short bio</label>
        <textarea
          required
          rows={4}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell students a bit about your background and how you can help..."
          className="mt-1 w-full border border-border-light rounded-lg px-3 py-2 text-sm text-teal"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="bg-lime text-teal-deep font-semibold px-6 py-3 rounded-full shadow-skeu active:shadow-skeu-pressed transition-shadow disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit application"}
      </button>
    </form>
  );
}
