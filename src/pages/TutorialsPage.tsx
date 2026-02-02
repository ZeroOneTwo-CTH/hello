import { useRef, useLayoutEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  BookOpen, 
  Code, 
  Cpu, 
  Lightbulb,
  Clock,
  BarChart,
  ChevronRight,
  Search,
  ExternalLink,
  Play,
  Copy,
  Check
} from 'lucide-react';
import { useColor } from '../context/ColorContext';

gsap.registerPlugin(ScrollTrigger);

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  icon: React.ReactNode;
  content?: {
    type: 'text' | 'code';
    content: string;
    language?: string;
  }[];
  resources: {
    type: 'video' | 'documentation' | 'github';
    title: string;
    url: string;
  }[];
}

const tutorialsData: Tutorial[] = [
  // BAMBU LAB PRINTERS
  {
    id: 'bambu-first-print',
    title: 'Bambu Lab: Your First Print',
    description: 'Get started with the Bambu Lab P1S. Learn Bambu Studio, load filament, and start your first print.',
    category: '3D Printing',
    difficulty: 'beginner',
    duration: '20 min',
    icon: <Lightbulb className="w-6 h-6" />,
    content: [
      {
        type: 'text',
        content: 'The Bambu Lab P1S is a high-speed CoreXY 3D printer. This guide covers setup, Bambu Studio installation, and your first successful print.'
      },
      {
        type: 'text',
        content: 'Key steps: 1) Unbox and level the printer, 2) Install Bambu Studio, 3) Connect via WiFi, 4) Load filament, 5) Slice and print a test model.'
      }
    ],
    resources: [
      { type: 'video', title: 'Bambu Studio Setup', url: '#' },
      { type: 'documentation', title: 'P1S User Manual', url: '#' },
      { type: 'github', title: 'Test Print Models', url: '#' },
    ],
  },
  {
    id: 'bambu-ams',
    title: 'Bambu Lab: Multi-Material with AMS',
    description: 'Use the Automatic Material System for multi-color and multi-material prints.',
    category: '3D Printing',
    difficulty: 'intermediate',
    duration: '30 min',
    icon: <Lightbulb className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'AMS Loading Tutorial', url: '#' },
      { type: 'documentation', title: 'AMS Best Practices', url: '#' },
    ],
  },
  {
    id: 'bambu-h2d-laser',
    title: 'Bambu H2D: Laser Engraving',
    description: 'Use the H2D laser module for engraving on wood, leather, and anodized aluminum.',
    category: '3D Printing',
    difficulty: 'intermediate',
    duration: '25 min',
    icon: <Lightbulb className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'Laser Safety & Setup', url: '#' },
      { type: 'documentation', title: 'Laser Parameters Guide', url: '#' },
    ],
  },
  // STRATASYS PRINTERS
  {
    id: 'stratasys-polyjet',
    title: 'Stratasys J55: Full-Color Printing',
    description: 'Create photorealistic prototypes with the J55 Prime Polyjet printer.',
    category: '3D Printing',
    difficulty: 'advanced',
    duration: '45 min',
    icon: <Lightbulb className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'GrabCAD Print Workflow', url: '#' },
      { type: 'documentation', title: 'Polyjet Material Guide', url: '#' },
    ],
  },
  // 3D SCANNING
  {
    id: 'revopoint-scanning',
    title: 'Revopoint Inspire: 3D Scanning Basics',
    description: 'Digitize physical objects quickly with the Revopoint Inspire handheld scanner.',
    category: '3D Scanning',
    difficulty: 'beginner',
    duration: '20 min',
    icon: <Lightbulb className="w-6 h-6" />,
    content: [
      {
        type: 'text',
        content: 'The Revopoint Inspire is perfect for quickly capturing objects for 3D printing or digital archiving. Best for objects 10cm to 1m in size.'
      },
      {
        type: 'text',
        content: 'Tips for good scans: Ensure good lighting, use the turntable for small objects, maintain consistent distance, and overlap your passes.'
      }
    ],
    resources: [
      { type: 'video', title: 'Scanning Technique', url: '#' },
      { type: 'documentation', title: 'Revo Scan Software', url: '#' },
    ],
  },
  {
    id: 'artec-professional',
    title: 'Artec Eva: Professional Scanning',
    description: 'High-precision scanning for reverse engineering and metrology applications.',
    category: '3D Scanning',
    difficulty: 'advanced',
    duration: '60 min',
    icon: <Lightbulb className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'Artec Studio Advanced', url: '#' },
      { type: 'documentation', title: 'Metrology Workflows', url: '#' },
    ],
  },
  // LASER & CNC
  {
    id: 'epilog-metal-marking',
    title: 'Epilog Fibremark: Metal Marking',
    description: 'Create permanent marks on metal parts, tools, and products with the fiber laser.',
    category: 'Laser & CNC',
    difficulty: 'intermediate',
    duration: '30 min',
    icon: <Lightbulb className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'Laser Safety Certification', url: '#' },
      { type: 'documentation', title: 'Metal Marking Settings', url: '#' },
    ],
  },
  {
    id: 'cnc-basics',
    title: 'Genmitsu CNC: First Milling Project',
    description: 'Learn CNC basics and create your first milled part on the Genmitsu router.',
    category: 'Laser & CNC',
    difficulty: 'intermediate',
    duration: '45 min',
    icon: <Lightbulb className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'CNC Safety & Setup', url: '#' },
      { type: 'documentation', title: 'Candle Software Guide', url: '#' },
    ],
  },
  // ELECTRONICS
  {
    id: 'soldering-basics',
    title: 'Soldering: Through-Hole Components',
    description: 'Master the fundamentals of soldering with the Weller WE1010 stations.',
    category: 'Electronics',
    difficulty: 'beginner',
    duration: '30 min',
    icon: <Lightbulb className="w-6 h-6" />,
    content: [
      {
        type: 'text',
        content: 'Good soldering is essential for reliable electronics. Learn proper iron technique, temperature settings, and how to create clean, strong joints.'
      },
      {
        type: 'text',
        content: 'Temperature guide: Leaded solder at 320-350°C, Lead-free at 360-380°C. Always use the fume extractor and ESD protection.'
      }
    ],
    resources: [
      { type: 'video', title: 'Soldering Technique', url: '#' },
      { type: 'documentation', title: 'Soldering Safety', url: '#' },
    ],
  },
  {
    id: 'smd-rework',
    title: 'SMD Rework: Hot Air Techniques',
    description: 'Remove and replace surface-mount components with the Ayue hot air station.',
    category: 'Electronics',
    difficulty: 'advanced',
    duration: '40 min',
    icon: <Lightbulb className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'Hot Air Rework Demo', url: '#' },
      { type: 'documentation', title: 'SMD Package Guide', url: '#' },
    ],
  },
  {
    id: 'oscilloscope',
    title: 'Oscilloscope: Signal Analysis',
    description: 'Use the ISO-Tech oscilloscope to visualize and debug electronic signals.',
    category: 'Electronics',
    difficulty: 'intermediate',
    duration: '35 min',
    icon: <Lightbulb className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'Scope Basics', url: '#' },
      { type: 'documentation', title: 'Measurement Techniques', url: '#' },
    ],
  },
  // VR
  {
    id: 'quest3-vr',
    title: 'Meta Quest 3: VR Development Setup',
    description: 'Set up the Quest 3 for VR design review, prototyping, and Unity/Unreal development.',
    category: 'VR / AR',
    difficulty: 'intermediate',
    duration: '25 min',
    icon: <Lightbulb className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'Quest 3 Setup', url: '#' },
      { type: 'documentation', title: 'Unity VR Development', url: '#' },
    ],
  },
  // ESP32
  {
    id: 'esp32-blink',
    title: 'ESP32: LED Blink & WiFi',
    description: 'Your first ESP32 project - blink an LED and connect to WiFi.',
    category: 'ESP32',
    difficulty: 'beginner',
    duration: '15 min',
    icon: <Cpu className="w-6 h-6" />,
    content: [
      {
        type: 'text',
        content: 'The ESP32 is a powerful WiFi and Bluetooth-enabled microcontroller. This tutorial covers the basics of Arduino IDE setup and your first sketch.'
      },
      {
        type: 'code',
        content: `#include <WiFi.h>

#define LED_PIN 2

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(115200);
  WiFi.begin("YOUR_SSID", "YOUR_PASSWORD");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected!");
}

void loop() {
  digitalWrite(LED_PIN, HIGH);
  delay(1000);
  digitalWrite(LED_PIN, LOW);
  delay(1000);
}`,
        language: 'cpp'
      }
    ],
    resources: [
      { type: 'video', title: 'ESP32 Setup', url: '#' },
      { type: 'documentation', title: 'Arduino IDE Configuration', url: '#' },
    ],
  },
  {
    id: 'esp32-sensors',
    title: 'ESP32: Reading Sensors',
    description: 'Connect temperature, humidity, and motion sensors to your ESP32.',
    category: 'ESP32',
    difficulty: 'beginner',
    duration: '25 min',
    icon: <Cpu className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'Sensor Wiring', url: '#' },
      { type: 'documentation', title: 'Sensor Library Guide', url: '#' },
    ],
  },
  {
    id: 'esp32-webserver',
    title: 'ESP32: Web Server & IoT',
    description: 'Create a web interface to control your ESP32 projects from any browser.',
    category: 'ESP32',
    difficulty: 'intermediate',
    duration: '35 min',
    icon: <Cpu className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'Web Server Tutorial', url: '#' },
      { type: 'github', title: 'Example Code', url: '#' },
    ],
  },
  // ARDUINO
  {
    id: 'arduino-basics',
    title: 'Arduino: First Steps',
    description: 'Learn the Arduino platform - the perfect starting point for physical computing.',
    category: 'Arduino',
    difficulty: 'beginner',
    duration: '20 min',
    icon: <Code className="w-6 h-6" />,
    content: [
      {
        type: 'text',
        content: 'Arduino makes it easy to get started with electronics. No prior experience needed - just plug in and start coding.'
      },
      {
        type: 'code',
        content: `void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
  delay(1000);
}`,
        language: 'cpp'
      }
    ],
    resources: [
      { type: 'video', title: 'Arduino Setup', url: '#' },
      { type: 'documentation', title: 'Arduino Reference', url: '#' },
    ],
  },
  {
    id: 'arduino-motors',
    title: 'Arduino: Motors & Servos',
    description: 'Control DC motors, steppers, and servos for robotic projects.',
    category: 'Arduino',
    difficulty: 'intermediate',
    duration: '30 min',
    icon: <Code className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'Motor Control Basics', url: '#' },
      { type: 'documentation', title: 'Servo Library', url: '#' },
    ],
  },
  // RASPBERRY PI
  {
    id: 'raspberry-pi-setup',
    title: 'Raspberry Pi: Headless Setup',
    description: 'Configure your Raspberry Pi without a monitor using SSH and VNC.',
    category: 'Raspberry Pi',
    difficulty: 'intermediate',
    duration: '25 min',
    icon: <Code className="w-6 h-6" />,
    content: [
      {
        type: 'text',
        content: 'Running a Pi "headless" means no monitor, keyboard, or mouse needed. Access it remotely from your laptop via SSH or VNC.'
      },
      {
        type: 'text',
        content: 'Steps: 1) Flash Raspberry Pi OS to SD card, 2) Create ssh file and wpa_supplicant.conf, 3) Boot and find IP, 4) SSH in with pi@IP.'
      }
    ],
    resources: [
      { type: 'video', title: 'Headless Setup', url: '#' },
      { type: 'documentation', title: 'GPIO Reference', url: '#' },
    ],
  },
  {
    id: 'raspberry-pi-gpio',
    title: 'Raspberry Pi: GPIO with Python',
    description: 'Control LEDs, buttons, and sensors using Python and gpiozero.',
    category: 'Raspberry Pi',
    difficulty: 'beginner',
    duration: '20 min',
    icon: <Code className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'Python GPIO Basics', url: '#' },
      { type: 'documentation', title: 'gpiozero Library', url: '#' },
    ],
  },
  // GROVE & MICRO:BIT
  {
    id: 'grove-sensors',
    title: 'Grove: Plug-and-Play Sensors',
    description: 'Get started quickly with Seeed Studio Grove modular sensor system.',
    category: 'Grove / micro:bit',
    difficulty: 'beginner',
    duration: '15 min',
    icon: <Cpu className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'Grove System Intro', url: '#' },
      { type: 'documentation', title: 'Sensor Examples', url: '#' },
    ],
  },
  {
    id: 'microbit-basics',
    title: 'micro:bit: Code with Blocks',
    description: 'Program the BBC micro:bit using MakeCode block-based coding.',
    category: 'Grove / micro:bit',
    difficulty: 'beginner',
    duration: '15 min',
    icon: <Cpu className="w-6 h-6" />,
    resources: [
      { type: 'video', title: 'MakeCode Tutorial', url: '#' },
      { type: 'documentation', title: 'micro:bit Features', url: '#' },
    ],
  },
];

const categories = ['All', '3D Printing', '3D Scanning', 'Laser & CNC', 'Electronics', 'VR / AR', 'ESP32', 'Arduino', 'Raspberry Pi', 'Grove / micro:bit'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const difficultyColors = {
  beginner: 'text-green-500',
  intermediate: 'text-yellow-500',
  advanced: 'text-red-500',
};

const resourceIcons = {
  video: Play,
  documentation: BookOpen,
  github: Code,
};

export default function TutorialsPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
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

      gsap.fromTo(contentRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          delay: 0.1,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 85%',
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const filteredTutorials = useMemo(() => {
    return tutorialsData.filter(tutorial => {
      const matchesCategory = selectedCategory === 'All' || tutorial.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || tutorial.difficulty === selectedDifficulty.toLowerCase();
      const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesDifficulty && matchesSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] pt-24 pb-16">
      {/* Header */}
      <div ref={headerRef} className="px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <span 
            className="font-mono text-xs uppercase tracking-[0.12em] mb-4 block"
            style={{ color: accentColor }}
          >
            Learning Center
          </span>
          <h1 className="font-display text-[clamp(36px,5vw,72px)] font-bold tracking-[-0.03em] text-[#F6F6F6] mb-4">
            Tutorials & Guides
          </h1>
          <p className="text-[clamp(14px,1.2vw,18px)] text-[#A6A6A6] max-w-2xl leading-relaxed">
            Step-by-step guides for ZERO.ONE.TWO equipment. From 3D printing to microcontrollers, 
            learn to use our workshop tools effectively.
          </p>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="px-6">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A6A6A]" />
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-[#333] py-3 pl-12 pr-4 text-[#F6F6F6] placeholder-[#6A6A6A] outline-none focus:border-[#555] transition-colors"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-all ${
                    selectedCategory === category
                      ? 'text-white'
                      : 'bg-[#1a1a1a] text-[#A6A6A6] hover:text-[#F6F6F6] border border-[#333]'
                  }`}
                  style={selectedCategory === category ? { backgroundColor: accentColor } : {}}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-all ${
                    selectedDifficulty === difficulty
                      ? 'bg-[#333] text-[#F6F6F6]'
                      : 'bg-[#1a1a1a] text-[#6A6A6A] hover:text-[#F6F6F6] border border-[#333]'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Tutorials List */}
          <div className="space-y-4">
            {filteredTutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="bg-[#111] border border-[#222] hover:border-[#444] transition-colors"
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => setExpandedTutorial(expandedTutorial === tutorial.id ? null : tutorial.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 bg-[#1a1a1a] flex items-center justify-center"
                        style={{ color: accentColor }}
                      >
                        {tutorial.icon}
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-semibold text-[#F6F6F6]">
                          {tutorial.title}
                        </h3>
                        <p className="text-[#A6A6A6] text-sm mt-1 max-w-xl">
                          {tutorial.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <BarChart className={`w-4 h-4 ${difficultyColors[tutorial.difficulty]}`} />
                        <span className={`font-mono text-xs uppercase tracking-wider ${difficultyColors[tutorial.difficulty]}`}>
                          {tutorial.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[#6A6A6A]">
                        <Clock className="w-4 h-4" />
                        <span className="font-mono text-xs">{tutorial.duration}</span>
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 text-[#6A6A6A] transition-transform ${
                          expandedTutorial === tutorial.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </div>
                </div>

                {expandedTutorial === tutorial.id && (
                  <div className="border-t border-[#222] p-6">
                    {tutorial.content && (
                      <div className="mb-8 space-y-6">
                        {tutorial.content.map((section, idx) => (
                          <div key={idx}>
                            {section.type === 'text' ? (
                              <p className="text-[#A6A6A6] leading-relaxed">
                                {section.content}
                              </p>
                            ) : (
                              <div className="relative">
                                <div className="flex items-center justify-between bg-[#1a1a1a] px-4 py-2 border-b border-[#333]">
                                  <span className="font-mono text-xs text-[#6A6A6A]">
                                    {section.language || 'code'}
                                  </span>
                                  <button
                                    onClick={() => copyCode(section.content, `${tutorial.id}-${idx}`)}
                                    className="flex items-center gap-2 text-[#6A6A6A] hover:text-accent transition-colors"
                                  >
                                    {copiedCode === `${tutorial.id}-${idx}` ? (
                                      <>
                                        <Check className="w-4 h-4" />
                                        <span className="text-xs">Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-4 h-4" />
                                        <span className="text-xs">Copy</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                                <pre className="bg-[#0a0a0a] p-4 overflow-x-auto">
                                  <code className="font-mono text-sm text-[#F6F6F6]">
                                    {section.content}
                                  </code>
                                </pre>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div>
                      <h4 className="font-mono text-xs uppercase tracking-[0.12em] text-[#6A6A6A] mb-4">
                        Additional Resources
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {tutorial.resources.map((resource, idx) => {
                          const Icon = resourceIcons[resource.type];
                          return (
                            <a
                              key={idx}
                              href={resource.url}
                              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] transition-colors group"
                            >
                              <Icon className="w-4 h-4 text-[#6A6A6A] group-hover:text-accent" />
                              <span className="text-sm text-[#F6F6F6]">{resource.title}</span>
                              <ExternalLink className="w-3 h-3 text-[#6A6A6A] group-hover:text-accent" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredTutorials.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#6A6A6A] font-mono text-sm">
                No tutorials found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
