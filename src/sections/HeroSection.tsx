import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Cpu, Printer, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useColor } from '../context/ColorContext';
import heroImage from "../assets/hero_object_closeup.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const topLeftRef = useRef<HTMLDivElement>(null);
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
      const loadTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      loadTl
        .fromTo(topLeftRef.current, 
          { opacity: 0, x: '-12vw', scale: 0.98 },
          { opacity: 1, x: 0, scale: 1, duration: 0.6 },
          0
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

      // Scroll-driven exit animation
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
          onLeaveBack: () => {
            gsap.set([topLeftRef.current, rightPanelRef.current, bottomLeftBlockRef.current, bottomRightImageRef.current, headlineRef.current, sublineRef.current, quickLinksRef.current], {
              opacity: 1, x: 0, y: 0, scale: 1
            });
          }
        }
      });

      // EXIT phase (70% - 100%)
      scrollTl
        .fromTo(topLeftRef.current,
          { x: 0, opacity: 1 },
          { x: '-40vw', opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(rightPanelRef.current,
          { x: 0, opacity: 1 },
          { x: '30vw', opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(bottomLeftBlockRef.current,
          { y: 0, opacity: 1 },
          { y: '35vh', opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(bottomRightImageRef.current,
          { x: 0, y: 0, opacity: 1 },
          { x: '35vw', y: '20vh', opacity: 0, ease: 'power2.in' },
          0.70
        );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned bg-[#0B0B0C] z-10">
      {/* Micro label */}
      <span className="absolute left-[6vw] top-[6vh] font-mono text-xs uppercase tracking-[0.12em] text-[#A6A6A6]">
        University Creative Technology Workshop
      </span>

      {/* Top-left video placeholder */}
      <div
        ref={topLeftRef}
        className="absolute left-[6vw] top-[10vh] w-[62vw] h-[46vh] image-frame overflow-hidden bg-[#1a1a1a] flex items-center justify-center group cursor-pointer"
      >
        {/* Video placeholder content */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
        
        {/* Play button overlay */}
        <div className="relative z-10 flex flex-col items-center">
          <div 
            className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
            style={{ backgroundColor: accentColor }}
          >
            <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-1" fill="white" />
          </div>
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#6A6A6A]">
            Watch Intro Video
          </span>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/10 rounded-full" />
        </div>
      </div>

      {/* Right accent panel */}
      <div
        ref={rightPanelRef}
        className="absolute left-[71vw] top-[10vh] w-[23vw] h-[46vh] bg-accent flex items-center justify-center"
        style={{ backgroundColor: accentColor }}
      >
        <span className="font-display text-6xl font-bold text-white/20">
          012
        </span>
      </div>

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
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-accent transition-colors group"
          >
            <Printer className="w-4 h-4 text-[#6A6A6A] group-hover:text-white" />
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#F6F6F6]">Browse Machines</span>
          </Link>
          <Link
            to="/tutorials"
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-accent transition-colors group"
          >
            <BookOpen className="w-4 h-4 text-[#6A6A6A] group-hover:text-white" />
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#F6F6F6]">View Tutorials</span>
          </Link>
          <Link
            to="/tutorials"
            className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-accent transition-colors group"
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
        <img src={heroImage}
          /*src="./hero_object_closeup.jpg"*/
          alt="Workshop object"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>
    </section>
  );
}
