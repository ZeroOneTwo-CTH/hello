import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail } from 'lucide-react';
import { useColor } from '../context/ColorContext';
/*import teamClive from "../assets/team-clive.jpg";
import teamLinda from "../assets/team-linda.jpg";
import teamGary from "../assets/team-gary.jpg";
import teamCallum from "../assets/team-callum.jpg";*/

gsap.registerPlugin(ScrollTrigger);

interface TeamMember {
  id: string;
  name: string;
  jobTitle: string;
  bio: string;
  skills: string[];
  image: string;
  email?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 'clive',
    name: 'Clive',
    jobTitle: 'Senior Technician',
    bio: 'Clive oversees workshop operations and safety protocols, bringing extensive experience in electronics and digital fabrication. As Laser Safety Officer, he ensures all equipment is maintained to the highest standards and mentors students through complex projects.',
    skills: ['Workshop Management', 'Electronics', 'Creative Coding', 'Microcontrollers', '3D Printing & Scanning', 'Laser Safety Officer'],
    image: '../assets/team-clive.jpg',
    email: 'clive@zeroonetwo.ac.uk',
  },
  {
    id: 'linda',
    name: 'Linda',
    jobTitle: 'Scientific Officer',
    bio: 'Linda leads technical research initiatives at the intersection of fashion and technology. Her expertise spans traditional textile craft and cutting-edge digital fabrication, supporting innovative projects in wearable technology and smart materials.',
    skills: ['Technical Led Research', 'Fashion', 'Embroidery', 'Digital Loom', 'Digital Fashion'],
    image: '../assets/team-linda.jpg',
    email: 'linda@zeroonetwo.ac.uk',
  },
  {
    id: 'gary',
    name: 'Gary',
    jobTitle: 'Senior Technician',
    bio: 'Gary specializes in animation, software development, and immersive technologies. He manages the high-performance computing resources and VR equipment, helping students realise ambitious digital projects from concept to completion.',
    skills: ['Animation', 'Software', 'High Powered PCs', 'VR', 'Digital Fashion'],
    image: '../assets/team-gary.jpg',
    email: 'gary@zeroonetwo.ac.uk',
  },
  {
    id: 'callum',
    name: 'Callum',
    jobTitle: 'Technician',
    bio: 'Callum brings hands-on expertise in 3D printing, metalwork, and jewellery-making. As Laser Safety Officer, he ensures safe operation of the metal laser etcher while supporting students in precision manufacturing and silversmithing projects.',
    skills: ['3D Printers', 'Metal Laser Etcher', 'Metalwork', 'Silversmithing', 'Laser Safety Officer'],
    image: '../assets/team-callum.jpg',
    email: 'callum@zeroonetwo.ac.uk',
  },
];

export default function TeamPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const { accentColor } = useColor();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          }
        }
      );

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: index * 0.1,
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0B0C] pt-24 pb-16">
      {/* Header */}
      <div ref={headerRef} className="px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <span 
            className="font-mono text-xs uppercase tracking-[0.12em] mb-4 block"
            style={{ color: accentColor }}
          >
            Meet the Team
          </span>
          <h1 className="font-display text-[clamp(36px,5vw,72px)] font-bold tracking-[-0.03em] text-[#F6F6F6] mb-4">
            ZERO.ONE.TWO Staff
          </h1>
          <p className="text-[clamp(14px,1.2vw,18px)] text-[#A6A6A6] max-w-2xl leading-relaxed">
            Our experienced technicians and officers are here to help you bring your ideas to life. 
            From 3D printing to electronics, fashion to VR — we have got the expertise to support your projects.
          </p>
        </div>
      </div>

      {/* Team Grid - Landscape Photos */}
      <div className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={member.id}
                ref={el => { cardsRef.current[index] = el; }}
                className="bg-[#111] border border-[#222] hover:border-[#444] transition-colors overflow-hidden"
              >
                {/* Landscape Image */}
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h2 className="font-display text-2xl font-semibold text-[#F6F6F6] mb-1">
                      {member.name}
                    </h2>
                    <span 
                      className="font-mono text-xs uppercase tracking-[0.12em]"
                      style={{ color: accentColor }}
                    >
                      {member.jobTitle}
                    </span>
                  </div>

                  <p className="text-[#A6A6A6] text-sm leading-relaxed mb-6">
                    {member.bio}
                  </p>

                  {/* Skills */}
                  <div className="mb-6">
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#6A6A6A] mb-3">
                      Areas of Expertise
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 bg-[#1a1a1a] text-[#F6F6F6] font-mono text-[10px] uppercase tracking-wider"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="inline-flex items-center gap-2 text-[#A6A6A6] hover:text-accent transition-colors group"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="font-mono text-xs">{member.email}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Workshop Hours / Contact CTA */}
      <div className="px-6 mt-16">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#111] border border-[#222] p-8 text-center">
            <h2 className="font-display text-2xl font-semibold text-[#F6F6F6] mb-4">
              Need Help with a Project?
            </h2>
            <p className="text-[#A6A6A6] max-w-xl mx-auto mb-6">
              Our team is available during workshop hours to assist with equipment inductions, 
              technical questions, and project guidance.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 bg-[#1a1a1a]">
                <span className="font-mono text-xs text-[#6A6A6A] uppercase tracking-wider block mb-1">Workshop Hours</span>
                <span className="text-[#F6F6F6] text-sm">Mon–Fri, 9am–5pm</span>
              </div>
              <div className="px-4 py-2 bg-[#1a1a1a]">
                <span className="font-mono text-xs text-[#6A6A6A] uppercase tracking-wider block mb-1">Location</span>
                <span className="text-[#F6F6F6] text-sm">University Workshop</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
