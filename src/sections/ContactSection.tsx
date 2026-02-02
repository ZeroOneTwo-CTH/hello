import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, Mail, MapPin } from 'lucide-react';
import { useColor } from '../context/ColorContext';

gsap.registerPlugin(ScrollTrigger);

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    budget: '',
    message: '',
  });
  const { accentColor } = useColor();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(leftColRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: leftColRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      gsap.fromTo(formRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.1,
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for your message! We will get back to you within two business days.');
  };

  return (
    <section ref={sectionRef} className="bg-light py-[8vh] px-[6vw] z-[90] relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left column */}
          <div ref={leftColRef}>
            <h2 className="font-display text-[clamp(32px,4vw,64px)] font-bold tracking-[-0.03em] text-dark leading-tight mb-6">
              Start a project
            </h2>
            <p className="text-[clamp(14px,1.2vw,18px)] text-[#6A6A6A] leading-relaxed mb-10 max-w-md">
              Tell us what you're building. We reply within two business days.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" style={{ color: accentColor }} />
                <span className="font-mono text-sm text-dark">
                  hello@zeroonetwo.studio
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" style={{ color: accentColor }} />
                <span className="font-mono text-sm text-dark">
                  University Workshop / Remote
                </span>
              </div>
            </div>
          </div>

          {/* Right column - Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.12em] text-[#6A6A6A] mb-2">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent border-b-2 border-[#ccc] focus:border-accent py-3 text-dark outline-none transition-colors"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.12em] text-[#6A6A6A] mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-transparent border-b-2 border-[#ccc] focus:border-accent py-3 text-dark outline-none transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.12em] text-[#6A6A6A] mb-2">
                Budget
              </label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="w-full bg-transparent border-b-2 border-[#ccc] focus:border-accent py-3 text-dark outline-none transition-colors cursor-pointer"
              >
                <option value="">Select a range</option>
                <option value="small">$5,000 - $15,000</option>
                <option value="medium">$15,000 - $50,000</option>
                <option value="large">$50,000+</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase tracking-[0.12em] text-[#6A6A6A] mb-2">
                Message
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-transparent border-b-2 border-[#ccc] focus:border-accent py-3 text-dark outline-none transition-colors resize-none"
                rows={4}
                placeholder="Tell us about your project..."
                required
              />
            </div>

            <button
              type="submit"
              className="btn-coral flex items-center gap-2 mt-4"
              style={{ backgroundColor: accentColor }}
            >
              Send message
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-8 border-t border-[#ddd]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-lg font-semibold text-dark">
            Zero.One.Two
          </span>
          <span className="font-mono text-xs text-[#6A6A6A]">
            © 2026 Zero.One.Two Studio. All rights reserved.
          </span>
        </div>
      </div>
    </section>
  );
}
