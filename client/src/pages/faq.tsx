import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Leaf, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "wouter";

const faqs = [
  {
    question: "How does PlantID identify plants?",
    answer:
      "PlantID uses advanced AI and image analysis to identify plants from your uploaded photos. Just upload a clear image and get instant results!",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes, your data is stored securely and is never shared with third parties. Please see our Privacy Policy for more details.",
  },
  {
    question: "Can I delete my account?",
    answer:
      "Absolutely! Please contact us via the Contact page and we’ll assist you in deleting your account and all associated data.",
  },
  {
    question: "What if the identification is wrong?",
    answer:
      "AI is not perfect. If you believe the identification is incorrect, you can try uploading a clearer photo or contact us for manual review.",
  },
  {
    question: "How do I get plant care tips?",
    answer:
      "After identifying a plant, you’ll receive a personalized care guide. You can also view care tips for your saved plants in your dashboard.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-12">
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-green-100 rounded-full p-4 mb-2">
              <HelpCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-green-700 mb-2">Frequently Asked Questions</h1>
            <p className="text-slate-600 text-center mb-4">
              Find answers to common questions about PlantID.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-green-100 rounded-lg"
              >
                <button
                  className="w-full flex justify-between items-center px-4 py-3 text-left focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  aria-expanded={openIndex === idx}
                >
                  <span className="font-medium text-green-800">{faq.question}</span>
                  {openIndex === idx ? (
                    <ChevronUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-green-600" />
                  )}
                </button>
                {openIndex === idx && (
                  <div className="px-4 pb-4 text-slate-700 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500 mt-8">
            <p className="text-slate-700">
              Still have questions?{" "}
              <a href="/contact" className="text-green-700 underline font-medium">
                Contact us
              </a>
              .
            </p>
          </div>
          <p className="text-xs text-slate-400 text-center mt-4">
            &copy; {new Date().getFullYear()} PlantID. All rights reserved.
          </p>
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