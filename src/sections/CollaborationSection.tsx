import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function CollaborationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineBlockRef = useRef<HTMLDivElement>(null);
  const topCenterImageRef = useRef<HTMLDivElement>(null);
  const topRightCoralRef = useRef<HTMLDivElement>(null);
  const bottomLeftImageRef = useRef<HTMLDivElement>(null);
  const bottomRightImageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);

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
        .fromTo(headlineBlockRef.current,
          { x: '-50vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0
        )
        .fromTo(topCenterImageRef.current,
          { y: '-40vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.08
        )
        .fromTo(topRightCoralRef.current,
          { x: '30vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.10
        )
        .fromTo(bottomLeftImageRef.current,
          { y: '60vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.06
        )
        .fromTo(bottomRightImageRef.current,
          { x: '50vw', opacity: 0 },
          { x: 0, opacity: 1, ease: 'none' },
          0.10
        )
        .fromTo(headlineRef.current,
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.12
        )
        .fromTo(sublineRef.current,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.20
        );

      // SETTLE (30% - 70%) - hold position

      // EXIT (70% - 100%)
      scrollTl
        .fromTo(headlineBlockRef.current,
          { y: 0, opacity: 1 },
          { y: '-18vh', opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(bottomLeftImageRef.current,
          { y: 0, opacity: 1 },
          { y: '22vh', opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(bottomRightImageRef.current,
          { y: 0, opacity: 1 },
          { y: '22vh', opacity: 0, ease: 'power2.in' },
          0.72
        )
        .fromTo(topCenterImageRef.current,
          { x: 0, opacity: 1 },
          { x: '18vw', opacity: 0, ease: 'power2.in' },
          0.70
        )
        .fromTo(topRightCoralRef.current,
          { scale: 1, opacity: 1 },
          { scale: 0.92, opacity: 0, ease: 'power2.in' },
          0.75
        );

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-pinned bg-dark z-50">
      {/* Micro label */}
      <span className="absolute left-[6vw] top-[6vh] font-mono text-xs uppercase tracking-[0.12em] text-[#6A6A6A]">
        Partners
      </span>

      {/* Top-left headline block */}
      <div
        ref={headlineBlockRef}
        className="absolute left-[6vw] top-[10vh] w-[46vw] h-[30vh] bg-dark flex flex-col justify-center px-[3vw]"
      >
        <h2
          ref={headlineRef}
          className="font-display text-[clamp(28px,3.5vw,56px)] font-bold tracking-[-0.03em] text-[#F6F6F6] leading-tight"
        >
          Built with teams.
        </h2>
        <p
          ref={sublineRef}
          className="mt-3 text-[clamp(13px,1.1vw,16px)] text-[#A6A6A6] leading-relaxed"
        >
          We join early—so design, engineering, and making stay in sync.
        </p>
      </div>

      {/* Top-center image window */}
      <div
        ref={topCenterImageRef}
        className="absolute left-[54vw] top-[10vh] w-[22vw] h-[30vh] image-frame overflow-hidden"
      >
        <img
          src="/collab_team_review.jpg"
          alt="Team reviewing prototype"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Top-right coral square */}
      <div
        ref={topRightCoralRef}
        className="absolute left-[78vw] top-[10vh] w-[16vw] h-[30vh] bg-coral"
      />

      {/* Bottom-left image window */}
      <div
        ref={bottomLeftImageRef}
        className="absolute left-[6vw] top-[44vh] w-[40vw] h-[46vh] image-frame overflow-hidden"
      >
        <img
          src="/collab_workshop_wide.jpg"
          alt="Workshop interior"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom-right image window */}
      <div
        ref={bottomRightImageRef}
        className="absolute left-[50vw] top-[44vh] w-[44vw] h-[46vh] image-frame overflow-hidden"
      >
        <img
          src="/collab_object_on_table.jpg"
          alt="Product on workshop table"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
}
