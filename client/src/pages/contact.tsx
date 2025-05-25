import React, { useState } from "react";
import { Instagram, Leaf, Linkedin, Mail, Send, Twitter } from "lucide-react";
import { Link } from "wouter";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSubmitted(true);
    } catch (err) {
      setError("Failed to send message. Please try again later.");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-12">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-green-100 rounded-full p-4 mb-2">
              <Mail className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-700 mb-1">Contact Us</h1>
            {!submitted && (
              <p className="text-slate-600 text-center">
                Have a question, suggestion, or need help? Fill out the form below and we’ll get back to you soon!
              </p>
            )}
          </div>
          {submitted ? (
            <div className="text-green-700 font-semibold text-center py-8">
              Thank you for reaching out! <br /> We’ll get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-1 font-medium text-slate-700">Your Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-slate-700">Your Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-slate-700">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-slate-700">Message</label>
                <textarea
                  name="message"
                  required
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border border-green-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows={5}
                  placeholder="How can we help you?"
                />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                <Send className="h-4 w-4" />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-green-700 text-white pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid layout for content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            {/* Brand and description */}
            <div>
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer mb-3">
                  <Leaf className="h-8 w-8 text-green-600" />
                  <span className="text-2xl font-bold">PlantID</span>
                </div>
              </Link>
              <p className="text-green-100 leading-relaxed">
                Identify plants instantly and get expert care tips with our AI-powered tool.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-green-200">Home</Link></li>
                <li><Link href="/disease-diagnosis" className="hover:text-green-200">Plant Doctor</Link></li>
                <li><Link href="/my-plants" className="hover:text-green-200">My Plants</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-green-200">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-green-200">Terms of Service</Link></li>
                <li><Link href="/faq" className="hover:text-green-200">FAQs</Link></li>
                <li><Link href="/contact" className="hover:text-green-200">Contact Us</Link></li>
              </ul>
            </div>

            {/* Social Icons */}
            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <p className="text-green-100 mb-4">Follow us on social media</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-green-200" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="hover:text-green-200" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="hover:text-green-200" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
          </div>

          {/* Divider and bottom section */}
          <div className="mt-10 border-t border-green-600 pt-4 text-center text-xs text-green-200">
            &copy; {new Date().getFullYear()} PlantID. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}