import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { BookOpen, Cpu, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useColor } from '../context/ColorContext';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const topLeftImageRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const bottomLeftBlockRef = useRef<HTMLDivElement>(null);
  const bottomRightImageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const quickLinksRef = useRef<HTMLDivElement>(null);
  const { accentColor } = useColor();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(topLeftImageRef.current, 
        { opacity: 0, x: '-12vw', scale: 0.98 },
        { opacity: 1, x: 0, scale: 1, duration: 0.6 }
      )
      .fromTo(rightPanelRef.current,
        { opacity: 0, x: '12vw' },
        { opacity: 1, x: 0, duration: 0.6 },
        0.15
      )
      .fromTo(bottomLeftBlockRef.current,
        { opacity: 0, y: '10vh' },
        { opacity: 1, y: 0, duration: 0.6 },
        0.25
      )
      .fromTo(bottomRightImageRef.current,
        { opacity: 0, x: '10vw', scale: 0.98 },
        { opacity: 1, x: 0, scale: 1, duration: 0.6 },
        0.35
      )
      .fromTo(headlineRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.45
      )
      .fromTo(sublineRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        0.55
      )
      .fromTo(quickLinksRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        0.65
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned bg-[#0B0B0C]">
      {/* Micro label */}
      <span className="absolute left-[6vw] top-[6vh] font-mono text-xs uppercase tracking-[0.12em] text-[#A6A6A6]">
        University Creative Technology Workshop
      </span>

      {/* Top-left image window */}
      <div
        ref={topLeftImageRef}
        className="absolute left-[6vw] top-[10vh] w-[62vw] h-[46vh] image-frame overflow-hidden"
      >
        <img
          src="/hero_workshop_table.jpg"
          alt="Workshop scene"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      {/* Right accent panel */}
      <div
        ref={rightPanelRef}
        className="absolute left-[71vw] top-[10vh] w-[23vw] h-[46vh]"
        style={{ backgroundColor: accentColor }}
      />

      {/* Bottom-left headline block */}
      <div
        ref={bottomLeftBlockRef}
        className="absolute left-[6vw] top-[60vh] w-[56vw] h-[30vh] bg-[#0B0B0C] flex flex-col justify-center px-[3vw]"
      >
        <h1
          ref={headlineRef}
          className="font-display text-[clamp(44px,6vw,96px)] font-bold tracking-[-0.03em] text-[#F6F6F6] leading-none"
        >
          Zero.One.Two
        </h1>
        <p
          ref={sublineRef}
          className="mt-4 text-[clamp(14px,1.2vw,18px)] text-[#A6A6A6] max-w-[36vw] leading-relaxed"
        >
          Your university workshop for 3D printing, electronics, and creative technology. 
          Learn, build, and bring your ideas to life.
        </p>

        {/* Quick Links */}
        <div ref={quickLinksRef} className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/machines"
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:opacity-80 transition-opacity group"
          >
            <Printer className="w-4 h-4 text-[#6A6A6A] group-hover:text-white" />
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#F6F6F6]">Browse Machines</span>
          </Link>
          <Link
            to="/tutorials"
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:opacity-80 transition-opacity group"
          >
            <BookOpen className="w-4 h-4 text-[#6A6A6A] group-hover:text-white" />
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#F6F6F6]">View Tutorials</span>
          </Link>
          <Link
            to="/tutorials"
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:opacity-80 transition-opacity group"
          >
            <Cpu className="w-4 h-4 text-[#6A6A6A] group-hover:text-white" />
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#F6F6F6]">Microcontroller Guides</span>
          </Link>
        </div>
      </div>

      {/* Bottom-right image window */}
      <div
        ref={bottomRightImageRef}
        className="absolute left-[64vw] top-[60vh] w-[30vw] h-[30vh] image-frame overflow-hidden"
      >
        <img
          src="/hero_object_closeup.jpg"
          alt="Object closeup"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
    </section>
  );
}
