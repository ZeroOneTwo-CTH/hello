import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: 'Modular Desk Organizer',
    tags: ['CNC', 'Birch Plywood'],
    image: '/project_desk_organizer.jpg',
  },
  {
    title: 'Connected Scale Prototype',
    tags: ['ESP32', 'CAD', 'UI'],
    image: '/project_smart_scale.jpg',
  },
  {
    title: 'Retail Fixture System',
    tags: ['Sheet Metal', 'Powder Coat'],
    image: '/project_retail_fixture.jpg',
  },
  {
    title: 'Wearable Sensor Housing',
    tags: ['TPU', '3D Print', 'Sealing'],
    image: '/project_wearable_sensor.jpg',
  },
];

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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

      // Cards animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.5,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
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
    <section ref={sectionRef} className="bg-dark py-[8vh] px-[6vw] z-[70] relative">
      <h2
        ref={titleRef}
        className="font-display text-[clamp(32px,4vw,64px)] font-bold tracking-[-0.03em] text-[#F6F6F6] mb-[6vh]"
      >
        Selected Work
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[4vw] gap-y-[6vh]">
        {projects.map((project, index) => (
          <div
            key={project.title}
            ref={el => { cardsRef.current[index] = el; }}
            className="group cursor-pointer"
          >
            <div className="image-frame overflow-hidden aspect-[16/10] mb-4">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display text-[clamp(18px,1.5vw,24px)] font-semibold text-[#F6F6F6] mb-2 group-hover:text-coral transition-colors">
                  {project.title}
                </h3>
                <div className="flex gap-2">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#6A6A6A]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-[#6A6A6A] group-hover:text-coral transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
