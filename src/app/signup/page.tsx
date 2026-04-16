"use client";

import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    companyName: "", contactName: "", email: "", phone: "",
    website: "", description: "", category: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.companyName.trim()) e.companyName = "Company name is required";
    if (!form.contactName.trim()) e.contactName = "Contact name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!validateEmail(form.email)) e.email = "Invalid email format";
    if (!form.description.trim()) e.description = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://treasurymapbackend-production.up.railway.app/api/v1"}/email/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSubmitted(true);
    } catch {
      setErrors({ submit: "Failed to submit. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const isValid = form.companyName && form.contactName && form.email && form.description && validateEmail(form.email);

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#00B894]/15 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#00B894]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Application Submitted</h1>
        <p className="text-[#94A3B8]">Thank you! We&apos;ll review your submission and get back to you within 48 hours.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-white text-center mb-2">Get Your Company Listed</h1>
      <p className="text-[#94A3B8] text-center mb-8">
        Join 300+ treasury technology providers on TreasuryMap.
      </p>

      <form onSubmit={handleSubmit} className="bg-[#1A2332] border border-[#1E293B] rounded-xl p-6 space-y-5">
        {errors.submit && (
          <p className="text-sm text-[#E17055] bg-[#E17055]/10 px-4 py-2 rounded-lg">{errors.submit}</p>
        )}

        <div>
          <label htmlFor="companyName" className="block text-sm text-[#94A3B8] mb-1.5">Company Name *</label>
          <input
            id="companyName" type="text" required placeholder="Your company name"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6C5CE7]"
          />
          {errors.companyName && <p className="text-xs text-[#E17055] mt-1">{errors.companyName}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="contactName" className="block text-sm text-[#94A3B8] mb-1.5">Contact Name *</label>
            <input
              id="contactName" type="text" required placeholder="Full name"
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6C5CE7]"
            />
            {errors.contactName && <p className="text-xs text-[#E17055] mt-1">{errors.contactName}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm text-[#94A3B8] mb-1.5">Phone</label>
            <input
              id="phone" type="tel" placeholder="+352 ..."
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6C5CE7]"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm text-[#94A3B8] mb-1.5">Email *</label>
          <input
            id="email" type="email" required placeholder="you@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onBlur={() => form.email && !validateEmail(form.email) && setErrors({ ...errors, email: "Invalid email format" })}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6C5CE7]"
          />
          {errors.email && <p className="text-xs text-[#E17055] mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="website" className="block text-sm text-[#94A3B8] mb-1.5">Website</label>
          <input
            id="website" type="url" placeholder="https://company.com"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6C5CE7]"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm text-[#94A3B8] mb-1.5">Primary Category</label>
          <select
            id="category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6C5CE7]"
          >
            <option value="">Select a category</option>
            <option value="FIDP">FIDP — Financial Instrument Dealing Platform</option>
            <option value="FDF">FDF — Financial Data Feeding</option>
            <option value="CMA">CMA — Currency Management Automation</option>
            <option value="Integrators">Integrators</option>
            <option value="OTS">OTS — Other Treasury Solutions</option>
            <option value="TMS">TMS / TRMS</option>
            <option value="BI">BI &amp; Analytics</option>
            <option value="ERP">ERP</option>
            <option value="ETL">ETL</option>
            <option value="FSC">FSC — Financial Supply Chain</option>
            <option value="CFF">CFF — Cash Flow Forecasting</option>
            <option value="RegTech">RegTech</option>
            <option value="Banking">Banking</option>
            <option value="Insurance">Insurance</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm text-[#94A3B8] mb-1.5">Company Description *</label>
          <textarea
            id="description" required rows={4}
            placeholder="Tell us about your company and treasury solutions..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-[#0F172A] border border-[#1E293B] rounded-lg px-4 py-2.5 text-sm text-white placeholder-[#475569] focus:outline-none focus:border-[#6C5CE7] resize-none"
          />
          {errors.description && <p className="text-xs text-[#E17055] mt-1">{errors.description}</p>}
        </div>

        <button
          type="submit"
          disabled={!isValid || loading}
          className="w-full py-3 rounded-lg bg-[#6C5CE7] hover:bg-[#5A4BD1] disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium transition-colors"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
