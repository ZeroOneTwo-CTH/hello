import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const notes = [
  {
    title: 'Why we prototype in monochrome.',
    date: 'Jan 2026',
  },
  {
    title: 'A short guide to living hinges in plywood.',
    date: 'Dec 2025',
  },
  {
    title: 'Designing for small-batch assembly.',
    date: 'Nov 2025',
  },
];

export default function NotesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );

      // Rows animation
      rowsRef.current.forEach((row, index) => {
        if (!row) return;
        gsap.fromTo(row,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="notes" className="bg-dark py-[8vh] px-[6vw] z-[80] relative">
      <h2
        ref={titleRef}
        className="font-display text-[clamp(32px,4vw,64px)] font-bold tracking-[-0.03em] text-[#F6F6F6] mb-[6vh]"
      >
        Studio Notes
      </h2>

      <div className="space-y-0">
        {notes.map((note, index) => (
          <div
            key={note.title}
            ref={el => { rowsRef.current[index] = el; }}
            className="group cursor-pointer border-t border-[#333] py-6 flex items-center justify-between hover:translate-x-[10px] transition-transform duration-300"
          >
            <div className="flex items-center gap-8 md:gap-16">
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#6A6A6A] w-[100px]">
                {note.date}
              </span>
              <h3 className="font-display text-[clamp(16px,1.3vw,20px)] font-medium text-[#F6F6F6] group-hover:text-coral transition-colors">
                {note.title}
              </h3>
            </div>
            <ArrowRight className="w-5 h-5 text-[#6A6A6A] group-hover:text-coral transition-colors" />
          </div>
        ))}
        <div className="border-t border-[#333]" />
      </div>
    </section>
  );
}
