import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function BuildSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const topLeftImageRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const bottomLeftBlockRef = useRef<HTMLDivElement>(null);
  const bottomRightImageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
        }
      });

      // ENTRANCE (0% - 30%)
      scrollTl
        .fromTo(topLeftImageRef.current,
          { x: '-60vw', opacity: 0, scale: 1.03 },
          { x: 0, opacity: 1, scale: 1, ease: 'none' },
          0
        )
        .fromTo(rightPanelRef.current,
          { x: '40vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.06
        )
        .fromTo(bottomLeftBlockRef.current,
          { y: '50vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.10
        )
        .fromTo(bottomRightImageRef.current,
          { x: '50vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.12
        )
        .fromTo(headlineRef.current,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.16
        )
        .fromTo(sublineRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.22
        )
        .fromTo(ctaRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, ease: 'none' },
          0.25
        );

      // SETTLE (30% - 70%) - hold position

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(topLeftImageRef.current,
          { x: 0, opacity: 1 },
          { x: '-30vw', opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(rightPanelRef.current,
          { x: 0, opacity: 1 },
          { x: '30vw', opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(bottomLeftBlockRef.current,
          { y: 0, opacity: 1 },
          { y: '30vh', opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(bottomRightImageRef.current,
          { x: 0, y: 0, opacity: 1 },
          { x: '30vw', y: '18vh', opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(ctaRef.current,
          { opacity: 1 },
          { opacity: 0 },
          0.85
        );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned bg-dark z-[60]">
      {/* Top-left image window */}
      <div
        ref={topLeftImageRef}
        className="absolute left-[6vw] top-[10vh] w-[62vw] h-[46vh] image-frame overflow-hidden"
      >
        <img
          src="/build_packaging.jpg"
          alt="Packaging process"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right coral panel */}
      <div
        ref={rightPanelRef}
        className="absolute left-[71vw] top-[10vh] w-[23vw] h-[46vh] bg-coral"
      />

      {/* Bottom-left headline block */}
      <div
        ref={bottomLeftBlockRef}
        className="absolute left-[6vw] top-[60vh] w-[56vw] h-[30vh] bg-dark flex flex-col justify-center px-[3vw]"
      >
        <h2
          ref={headlineRef}
          className="font-display text-[clamp(28px,4vw,64px)] font-bold tracking-[-0.03em] text-[#F6F6F6] leading-tight"
        >
          Build the idea. Ship the object.
        </h2>
        <p
          ref={sublineRef}
          className="mt-3 text-[clamp(13px,1.1vw,16px)] text-[#A6A6A6] max-w-[40vw] leading-relaxed"
        >
          Small‑batch production, packaging, and clear documentation.
        </p>
      </div>

      {/* Bottom-right image window */}
      <div
        ref={bottomRightImageRef}
        className="absolute left-[64vw] top-[60vh] w-[30vw] h-[30vh] image-frame overflow-hidden"
      >
        <img
          src="/build_object_detail.jpg"
          alt="Product detail"
          className="w-full h-full object-cover"
        />
      </div>

      {/* CTA Button */}
      <button
        ref={ctaRef}
        className="absolute left-[44vw] top-[84vh] btn-coral flex items-center gap-2"
      >
        Start a project
        <ArrowRight className="w-4 h-4" />
      </button>
    </section>
  );
}
