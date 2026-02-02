import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function CraftSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const centerImageRef = useRef<HTMLDivElement>(null);
  const textBlockRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.6,
        }
      });

      // ENTRANCE (0% - 30%)
      scrollTl
        .fromTo(leftPanelRef.current,
          { x: '-40vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(centerImageRef.current,
          { y: '-60vh', opacity: 0, scale: 1.03 },
          { y: 0, opacity: 1, scale: 1, ease: 'none' },
          0.06
        )
        .fromTo(textBlockRef.current,
          { x: '40vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.10
        )
        .fromTo(headlineRef.current,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.14
        )
        .fromTo(bodyRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.20
        )
        .fromTo(linkRef.current,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.25
        );

      // SETTLE (30% - 70%) - hold position

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(textBlockRef.current,
          { x: 0, opacity: 1 },
          { x: '20vw', opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(centerImageRef.current,
          { x: 0, opacity: 1 },
          { x: '-18vw', opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(leftPanelRef.current,
          { y: 0, opacity: 1 },
          { y: '-18vh', opacity: 0, ease: 'power2.in' },
          0.70
        );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned bg-dark z-40">
      {/* Left coral panel */}
      <div
        ref={leftPanelRef}
        className="absolute left-[6vw] top-[10vh] w-[28vw] h-[80vh] bg-coral"
      />

      {/* Center image window */}
      <div
        ref={centerImageRef}
        className="absolute left-[36vw] top-[10vh] w-[58vw] h-[52vh] image-frame overflow-hidden"
      >
        <img
          src="/craft_detail_components.jpg"
          alt="Precision components"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom-right text block */}
      <div
        ref={textBlockRef}
        className="absolute left-[52vw] top-[66vh] w-[42vw] h-[24vh] bg-dark flex flex-col justify-center px-[2vw]"
      >
        <h2
          ref={headlineRef}
          className="font-display text-[clamp(24px,3vw,48px)] font-bold tracking-[-0.03em] text-[#F6F6F6] leading-tight"
        >
          Precision is part of the concept.
        </h2>
        <p
          ref={bodyRef}
          className="mt-3 text-[clamp(13px,1.1vw,16px)] text-[#A6A6A6] max-w-[34vw] leading-relaxed"
        >
          Materials, tolerances, and finishes—chosen early so the idea stays intact.
        </p>
        <a
          ref={linkRef}
          href="#standards"
          className="mt-4 font-mono text-xs uppercase tracking-[0.12em] text-[#F6F6F6] link-underline inline-flex items-center gap-2 w-fit"
        >
          See our build standards
          <ArrowRight className="w-3 h-3" />
        </a>
      </div>
    </section>
  );
}
