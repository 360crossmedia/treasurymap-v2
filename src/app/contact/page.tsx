"use client";

import { useState } from "react";
import type { Metadata } from "next";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "", email: "", company: "", subject: "", message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!validateEmail(form.email)) e.email = "Invalid email format";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://treasurymapbackend-production.up.railway.app/api/v1"}/email/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      setErrors({ submit: "Failed to send. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const isValid = form.name && form.email && form.message && validateEmail(form.email);

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#00B894]/15 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#00B894]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Message Sent</h1>
        <p className="text-[#94A3B8]">Thank you for reaching out. We&apos;ll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-white text-center mb-2">Contact Us</h1>
      <p className="text-[#94A3B8] text-center mb-8">Have a question? We&apos;d love to hear from you.</p>

      <form onSubmit={handleSubmit} className="bg-[#1A2332] border border-[#1E293B] rounded-xl p-6 space-y-5">
        {errors.submit && (
          <p className="text-sm text-[#E17055] bg-[#E17055]/10 px-4 py-2 rounded-lg">{errors.submit}</p>
        )}

        <div>
          <label htmlFor="name" className="block text-sm text-[#94A3B8] mb-1.5">Name *</label>
          <input
            id="name"
            type="text"
            required
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6C5CE7]"
          />
          {errors.name && <p className="text-xs text-[#E17055] mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-[#94A3B8] mb-1.5">Email *</label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onBlur={() => form.email && !validateEmail(form.email) && setErrors({ ...errors, email: "Invalid email format" })}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6C5CE7]"
          />
          {errors.email && <p className="text-xs text-[#E17055] mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="company" className="block text-sm text-[#94A3B8] mb-1.5">Company</label>
          <input
            id="company"
            type="text"
            placeholder="Your company name"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6C5CE7]"
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm text-[#94A3B8] mb-1.5">Subject</label>
          <input
            id="subject"
            type="text"
            placeholder="What is this about?"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6C5CE7]"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm text-[#94A3B8] mb-1.5">Message *</label>
          <textarea
            id="message"
            required
            placeholder="Your message..."
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6C5CE7] resize-none"
          />
          {errors.message && <p className="text-xs text-[#E17055] mt-1">{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full py-3 rounded-lg bg-[#6C5CE7] hover:bg-[#5A4BD1] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}
