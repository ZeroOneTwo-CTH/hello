import { useRef, useLayoutEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Printer, 
  Scan, 
  Monitor, 
  Flame, 
  Cpu, 
  Microchip,
  Wrench,
  BookOpen,
  Play,
  FileText,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Search,
  Glasses,
  Zap,
  Activity,
  Laptop
} from 'lucide-react';
import { useColor } from '../context/ColorContext';

gsap.registerPlugin(ScrollTrigger);

interface Machine {
  id: string;
  name: string;
  category: string;
  description: string;
  quantity: string;
  icon: React.ReactNode;
  inductionRequired: boolean;
  resources: {
    type: 'guide' | 'video' | 'documentation';
    title: string;
    url: string;
  }[];
  specs?: string[];
  status: 'available' | 'busy' | 'maintenance';
}

const machinesData: Machine[] = [
  // 3D PRINTING
  {
    id: 'bambu-p1s',
    name: 'Bambu Lab P1S 3D Printer',
    category: '3D Printing',
    description: 'High-speed CoreXY 3D printer with enclosed chamber for creating FDM printed 3D objects.',
    quantity: '9 units',
    icon: <Printer className="w-6 h-6" />,
    inductionRequired: true,
    status: 'available',
    specs: ['Build Volume: 256×256×256mm', 'Multi-material AMS', 'Materials: PLA, PETG, TPU', 'STEP files'],
    resources: [
      { type: 'video', title: 'Bambu Studio Setup', url: 'https://www.youtube.com/watch?v=8TQCRVS72Us' },
      //{ type: 'video', title: 'First Print Tutorial', url: '#' },
      { type: 'documentation', title: '3D Printing Guidelines', url: '#' },
    ],
  },
  {
    id: 'bambu-h2d',
    name: 'Bambu Lab H2D Multi-Tool',
    category: '3D Printing',
    description: 'Multi-function fabrication tool with 3D printing, laser engraving, vinyl cutting, and pen plotting capabilities.',
    quantity: '1 unit',
    icon: <Printer className="w-6 h-6" />,
    inductionRequired: true,
    status: 'available',
    specs: ['3D Print + Laser Module', 'Vinyl Cutter Attachment', 'Pen Plotter Module', 'Multi-material AMS', 'STEP files'],
    resources: [
      { type: 'video', title: 'H2D Multi-Tool Overview', url: 'https://www.youtube.com/watch?v=idOY8ebZ25Q' },
      //{ type: 'video', title: 'Laser Engraving Basics', url: '#' },
      { type: 'documentation', title: '3D Printing Guidelines', url: '#' },
    ],
  },
  {
    id: 'stratasys-j55',
    name: 'Stratasys J55 Prime Polyjet',
    category: '3D Printing',
    description: 'Professional full-colour Polyjet 3D printer for high-detail prototypes and realistic models.',
    quantity: '1 unit',
    icon: <Printer className="w-6 h-6" />,
    inductionRequired: true,
    status: 'available',
    specs: ['Full Colour Printing', 'Water-soluble Support', 'PolyJet Resin', '3mf files'],
    resources: [
      { type: 'guide', title: 'Export 3mf from Keyshot', url: 'https://manual.keyshot.com/manual/models-tab/export/export-formats/' },
      //{ type: 'video', title: 'GrabCAD Print Workflow', url: '#' },
      { type: 'documentation', title: '3D Printing Guidelines', url: '#' },
    ],
  },
  {
    id: 'stratasys-f170',
    name: 'Stratasys F170 FDM Printer',
    category: '3D Printing',
    description: 'Industrial FDM 3D printer for reliable, repeatable prototyping with engineering materials.',
    quantity: '2 units',
    icon: <Printer className="w-6 h-6" />,
    inductionRequired: true,
    status: 'available',
    specs: ['Build Volume: 254×254×254mm', 'Materials: ABS, TPU', 'Chemical-Soluble Support Material'],
    resources: [
      //{ type: 'guide', title: 'F170 Setup Guide', url: '#' },
      //{ type: 'video', title: 'Support Material Removal', url: '#' },
      { type: 'documentation', title: '3D Printing Guidelines', url: '#' },
    ],
  },
  {
    id: 'sunlu-pen',
    name: 'Sunlu SL300 3D Pen',
    category: '3D Printing',
    description: 'Handheld 3D printing pen for freeform drawing, repairs, and quick prototyping.',
    quantity: 'Multiple',
    icon: <Printer className="w-6 h-6" />,
    inductionRequired: false,
    status: 'available',
    specs: ['Temperature: 160-230°C', 'Filament: 1.75mm PLA/ABS', 'OLED Display'],
    resources: [
      //{ type: 'guide', title: '3D Pen Techniques', url: '#' },
     // { type: 'video', title: 'Basic Drawing Tutorial', url: '#' },
    ],
  },
  // 3D SCANNING
  {
    id: 'revopoint-inspire',
    name: 'Revopoint Inspire 3D Scanner',
    category: '3D Scanning',
    description: 'Affordable handheld 3D scanner for quick digitisation of small to medium objects.',
    quantity: '1 unit',
    icon: <Scan className="w-6 h-6" />,
    inductionRequired: true,
    status: 'available',
    specs: ['Accuracy: 0.2mm', 'Scan Speed: 18fps', 'Working Distance: 150-400mm', 'Small Object scanning', 'Face Scanning', 'Colour Scanning'],
    resources: [
      { type: 'guide', title: 'Inspire Quick Start', url: 'https://download.revopoint3d.com/wp-content/uploads/download/INSPIRE%20Quick%20Start%20Guide%20-%200911.pdf' },
      //{ type: 'video', title: 'Scanning Technique', url: '#' },
      { type: 'documentation', title: 'Revo Scan Software', url: 'https://www.revopoint3d.com/pages/support-download' },
    ],
  },
  {
    id: 'artec-eva',
    name: 'Artec Eva 3D Scanner',
    category: '3D Scanning',
    description: 'Professional structured-light 3D scanner for high-precision reverse engineering and metrology.',
    quantity: '1 unit',
    icon: <Scan className="w-6 h-6" />,
    inductionRequired: true,
    status: 'available',
    specs: ['Accuracy: 0.1mm', '3D Resolution: 0.5mm', 'Capture Speed: 16fps', 'Artec Studio Software','Medium-Large Object scanning','Colour Scanning'],
    resources: [
      //{ type: 'guide', title: 'Eva Professional Workflow', url: '#' },
     //{ type: 'video', title: 'Advanced Scanning Tips', url: '#' },
     // { type: 'documentation', title: 'Artec Studio Guide', url: '#' },
    ],
  },
  // LASER & CNC
  {
    id: 'epilog-fibremark',
    name: 'Epilog Fibermark 50W Laser',
    category: 'Laser & CNC',
    description: 'Fiber laser system for permanent marking and etching on metal surfaces.',
    quantity: '1 unit',
    icon: <Zap className="w-6 h-6" />,
    inductionRequired: true,
    status: 'available',
    specs: ['50W Fiber Laser', 'Marking Area: 112×112mm', 'Materials: Metals, Plastics', 'Epilog Software Suite'],
    resources: [
      { type: 'video', title: 'Machine Overview', url: 'https://www.youtube.com/watch?v=cSZlpydmTDs' },
      //{ type: 'video', title: 'Metal Etching Tutorial', url: '#' },
      { type: 'documentation', title: 'Material Compatibility', url: 'https://www.epiloglaser.com/en-uk/how-it-works/laser-material-compatibility/' },
    ],
  },
  {
    id: 'genmitsu-cnc',
    name: 'Genmitsu 3020-ProMAX V2 CNC',
    category: 'Laser & CNC',
    description: 'Desktop CNC router for milling, engraving, and cutting various materials.',
    quantity: '1 unit',
    icon: <Zap className="w-6 h-6" />,
    inductionRequired: true,
    status: 'maintenance',
    specs: ['Work Area: 300×200×65mm', 'Spindle: 300W', 'Materials: Wood, Acrylic, PCB, Soft Metals'],
    resources: [
     // { type: 'guide', title: 'CNC Safety & Setup', url: '#' },
      //{ type: 'video', title: 'First CNC Project', url: '#' },
     // { type: 'documentation', title: 'Candle/UGS Software', url: '#' },
    ],
  },
  // COMPUTING
  {
    id: 'workstation-pc',
    name: 'High Performance PC Workstations',
    category: 'Computing',
    description: 'Powerful desktop workstations for CAD, rendering, simulation, and development work.',
    quantity: '6 units',
    icon: <Monitor className="w-6 h-6" />,
    inductionRequired: false,
    status: 'available',
    specs: ['High-end GPUs', '32GB+ RAM', 'NVMe Storage', 'Software: Fusion 360, SolidWorks, Adobe CC, Clo3D, Unreal Engine, Arduino IDE, Optitex, SketchUp'],
    resources: [
      //{ type: 'guide', title: 'Workstation Software List', url: '#' },
     // { type: 'documentation', title: 'Network Storage Access', url: '#' },
    ],
  },
  {
    id: 'high-end-laptops',
    name: 'High Performance Laptops',
    category: 'Computing',
    description: 'Portable workstations for design, coding, and classroom work.',
    quantity: '14 units',
    icon: <Laptop className="w-6 h-6" />,
    inductionRequired: false,
    status: 'available',
    specs: ['Dedicated GPUs', '16GB+ RAM', 'SSD Storage', 'Available for Loan', 'Software: Fusion 360, SolidWorks, Adobe CC, Arduino IDE, Optitex, SketchUp'],
    resources: [
     // { type: 'guide', title: 'Laptop Loan Policy', url: '#' },
      //{ type: 'documentation', title: 'Software Installation', url: '#' },
    ],
  },
  // ELECTRONICS
  {
    id: 'weller-solder',
    name: 'Weller WE1010 Soldering Stations',
    category: 'Electronics',
    description: 'Professional temperature-controlled soldering stations for electronics assembly and repair.',
    quantity: '6 units',
    icon: <Flame className="w-6 h-6" />,
    inductionRequired: true,
    status: 'available',
    specs: ['Temperature: 200-450°C', 'Power: 70W', 'Digital Display', 'ESD Safe'],
    resources: [
      //{ type: 'guide', title: 'Soldering Basics', url: '#' },
     // { type: 'video', title: 'Through-Hole Soldering', url: '#' },
     // { type: 'video', title: 'SMD Soldering Techniques', url: '#' },
    ],
  },
  {
    id: 'ayue-rework',
    name: 'Ayue INT850A SMD Rework Station',
    category: 'Electronics',
    description: 'Hot air rework station for SMD component removal, placement, and reflow soldering.',
    quantity: '1 unit',
    icon: <Flame className="w-6 h-6" />,
    inductionRequired: true,
    status: 'available',
    specs: ['Hot Air: 100-480°C', 'Airflow Control', 'Multiple Nozzle Sizes'],
    resources: [
     // { type: 'guide', title: 'Hot Air Rework Basics', url: '#' },
     // { type: 'video', title: 'QFN/BGA Rework', url: '#' },
    ],
  },
  {
    id: 'isotech-scope',
    name: 'ISO-Tech ISR622 Oscilloscope',
    category: 'Electronics',
    description: 'Digital storage oscilloscope for analysing electronic signals and circuit debugging.',
    quantity: '1 unit',
    icon: <Activity className="w-6 h-6" />,
    inductionRequired: true,
    status: 'available',
    specs: ['2 Channels', '25MHz Bandwidth', '500MS/s Sample Rate'],
    resources: [
      //{ type: 'guide', title: 'Oscilloscope Basics', url: '#' },
      //{ type: 'video', title: 'Signal Analysis', url: '#' },
     // { type: 'documentation', title: 'Measurement Techniques', url: '#' },
    ],
  },
  {
    id: 'rapid-psu',
    name: 'Rapid PS3025 Bench Power Supplies',
    category: 'Electronics',
    description: 'Variable DC power supplies for powering and testing electronic circuits.',
    quantity: '8 units',
    icon: <Zap className="w-6 h-6" />,
    inductionRequired: false,
    status: 'available',
    specs: ['Output: 0-30V, 0-5A', 'Digital Display', 'Current Limiting', 'Short Circuit Protection'],
    resources: [
     // { type: 'guide', title: 'Power Supply Safety', url: '#' },
     // { type: 'documentation', title: 'Circuit Powering Guide', url: '#' },
    ],
  },
  // VR
  {
    id: 'meta-quest',
    name: 'Meta Quest 3 VR Headsets',
    category: 'VR / AR',
    description: 'Standalone virtual reality headsets for immersive design review, prototyping, and development.',
    quantity: '3 units',
    icon: <Glasses className="w-6 h-6" />,
    inductionRequired: true,
    status: 'available',
    specs: ['Mixed Reality Capable', 'Wireless', 'Hand Tracking', 'PC VR Compatible'],
    resources: [
     // { type: 'guide', title: 'Quest 3 Setup', url: '#' },
     // { type: 'video', title: 'VR Design Review', url: '#' },
     // { type: 'documentation', title: 'Unity/Unreal VR Dev', url: '#' },
    ],
  },
  // MICROCONTROLLERS
  {
    id: 'esp32-boards',
    name: 'ESP32 Development Boards',
    category: 'Microcontrollers',
    description: 'WiFi and Bluetooth-enabled microcontroller boards for IoT and wireless projects.',
    quantity: 'Various',
    icon: <Cpu className="w-6 h-6" />,
    inductionRequired: false,
    status: 'available',
    specs: ['Dual-core 240MHz', 'WiFi 802.11 b/g/n', 'Bluetooth 4.2/5.0', '520KB SRAM'],
    resources: [
     // { type: 'guide', title: 'ESP32 Getting Started', url: '#' },
     // { type: 'documentation', title: 'Arduino IDE Setup', url: '#' },
     // { type: 'documentation', title: 'PlatformIO Guide', url: '#' },
    ],
  },
  {
    id: 'arduino-boards',
    name: 'Arduino Boards',
    category: 'Microcontrollers',
    description: 'Beginner-friendly microcontroller platform with extensive community and library support.',
    quantity: 'Various',
    icon: <Microchip className="w-6 h-6" />,
    inductionRequired: false,
    status: 'available',
    specs: ['Uno and Nano variants', '16-20MHz Clock', '14-54 Digital I/O', 'Analog Inputs'],
    resources: [
     // { type: 'guide', title: 'Arduino Basics', url: '#' },
      { type: 'documentation', title: 'Uno Pinout Reference', url: 'https://content.arduino.cc/assets/Pinout-UNOrev3_latest.pdf' },
     // { type: 'guide', title: 'Common Sensor Hookups', url: '#' },
    ],
  },
  {
    id: 'raspberry-pi',
    name: 'Raspberry Pi Boards',
    category: 'Microcontrollers',
    description: 'Single-board computers for Linux-based projects, media centres, and edge computing.',
    quantity: 'Various',
    icon: <Cpu className="w-6 h-6" />,
    inductionRequired: false,
    status: 'available',
    specs: ['Pi 4 / Pi 5 variants', '2-8GB RAM', 'Quad-core', 'GPIO Header', '4K Output'],
    resources: [
      //{ type: 'guide', title: 'Raspberry Pi Setup', url: '#' },
     // { type: 'documentation', title: 'GPIO Pin Reference', url: '#' },
     // { type: 'guide', title: 'Headless Configuration', url: '#' },
    ],
  },
  {
    id: 'grove-kits',
    name: 'Grove Arduino Starter Kits',
    category: 'Microcontrollers',
    description: 'Modular sensor kits with easy plug-and-play connections.',
    quantity: 'Multiple',
    icon: <Cpu className="w-6 h-6" />,
    inductionRequired: false,
    status: 'available',
    specs: ['Sensors: Temp, Humidity, Light, Motion', 'Seeed Studio Libraries'],
    resources: [
      { type: 'guide', title: 'Grove System Overview', url: 'https://wiki.seeedstudio.com/Grove-Beginner-Kit-For-Arduino/' },
     // { type: 'documentation', title: 'Sensor Examples', url: '#' },
    ],
  },
  {
    id: 'bbc-microbit',
    name: 'BBC micro:bit',
    category: 'Microcontrollers',
    description: 'Educational microcontroller board with built-in sensors, LED matrix, and radio.',
    quantity: 'Multiple',
    icon: <Microchip className="w-6 h-6" />,
    inductionRequired: false,
    status: 'available',
    specs: ['LED 5×5 Matrix', 'Accelerometer & Compass', 'Radio & Bluetooth', 'MakeCode / Python'],
    resources: [
      { type: 'guide', title: 'micro:bit Quick Start', url: 'https://microbit.org/get-started/user-guide/introduction/' },
      { type: 'documentation', title: 'MakeCode Editor', url: 'https://makecode.microbit.org/' },
      //{ type: 'guide', title: 'MicroPython Guide', url: '#' },
    ],
  },
  {
    id: 'sensor-parts',
    name: 'Electronic Sensors & Components',
    category: 'Microcontrollers',
    description: 'Wide variety of sensors, modules, and electronic components for prototyping.',
    quantity: 'Various',
    icon: <Cpu className="w-6 h-6" />,
    inductionRequired: false,
    status: 'available',
    specs: ['Temperature, Humidity, Pressure', 'Distance, Motion, Light', 'Motors, Servos, Drivers', 'Resistors, Capacitors, ICs'],
    resources: [
     // { type: 'guide', title: 'Component Inventory', url: '#' },
     // { type: 'documentation', title: 'Sensor Datasheets', url: '#' },
     // { type: 'guide', title: 'Circuit Design Tips', url: '#' },
    ],
  },
  // HAND TOOLS
  {
    id: 'hand-tools',
    name: 'Hand Tool Library',
    category: 'Tools',
    description: 'Comprehensive collection of hand tools for assembly, fabrication, and repair work.',
    quantity: 'Full Set',
    icon: <Wrench className="w-6 h-6" />,
    inductionRequired: false,
    status: 'available',
    specs: ['Screwdrivers (various)', 'Scalpels & Blades', 'Cordless Drill', 'Glue Guns', 'Dremel Rotary Tool', 'Ratchet & Socket Set', 'Pliers, Flush Cutters', 'Rulers, Calipers, Squares'],
    resources: [
    //  { type: 'guide', title: 'Tool Safety Guidelines', url: '#' },
     // { type: 'documentation', title: 'Tool Checkout System', url: '#' },
    ],
  },
];

const categories = ['All', '3D Printing', '3D Scanning', 'Laser & CNC', 'Computing', 'Electronics', 'VR / AR', 'Microcontrollers', 'Tools'];

const statusConfig = {
  available: { icon: CheckCircle, color: 'text-green-500', text: 'Available' },
  busy: { icon: AlertCircle, color: 'text-yellow-500', text: 'In Use' },
  maintenance: { icon: AlertCircle, color: 'text-red-500', text: 'Maintenance' },
};

const resourceIcons = {
  guide: BookOpen,
  video: Play,
  documentation: FileText,
};

export default function MachinesPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
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

  const filteredMachines = useMemo(() => {
    return machinesData.filter(machine => {
      const matchesCategory = selectedCategory === 'All' || machine.category === selectedCategory;
      const matchesSearch = machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           machine.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0B0B0C] pt-24 pb-16">
      {/* Header */}
      <div ref={headerRef} className="px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <span 
            className="font-mono text-xs uppercase tracking-[0.12em] mb-4 block"
            style={{ color: accentColor }}
          >
            Workshop Resources
          </span>
          <h1 className="font-display text-[clamp(36px,5vw,72px)] font-bold tracking-[-0.03em] text-[#F6F6F6] mb-4">
            Machines & Equipment
          </h1>
          <p className="text-[clamp(14px,1.2vw,18px)] text-[#A6A6A6] max-w-2xl leading-relaxed">
            Browse our complete equipment inventory. Check induction requirements and access learning resources. 
            All machines marked with induction required must be completed before independent use.
          </p>
        </div>
      </div>

      {/* Content */}
      <div ref={contentRef} className="px-6">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6A6A6A]" />
              <input
                type="text"
                placeholder="Search equipment..."
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
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 mb-8 text-sm">
            {Object.entries(statusConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <config.icon className={`w-4 h-4 ${config.color}`} />
                <span className="text-[#A6A6A6]">{config.text}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div 
                className="w-2 h-2 rounded-full" 
                style={{ backgroundColor: accentColor }}
              />
              <span className="text-[#A6A6A6]">Induction Required</span>
            </div>
          </div>

          {/* Machines Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMachines.map((machine) => {
              const status = statusConfig[machine.status];
              return (
                <div
                  key={machine.id}
                  className="bg-[#111] border border-[#222] hover:border-[#444] transition-colors"
                >
                  <div className="p-6 border-b border-[#222]">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 bg-[#1a1a1a] flex items-center justify-center"
                          style={{ color: accentColor }}
                        >
                          {machine.icon}
                        </div>
                        <div>
                          <h3 className="font-display text-lg font-semibold text-[#F6F6F6]">
                            {machine.name}
                          </h3>
                          <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#6A6A6A]">
                            {machine.category} • {machine.quantity}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <status.icon className={`w-4 h-4 ${status.color}`} />
                        <span className="font-mono text-xs uppercase tracking-[0.12em] text-[#6A6A6A]">
                          {status.text}
                        </span>
                      </div>
                    </div>

                    <p className="text-[#A6A6A6] text-sm leading-relaxed mb-4">
                      {machine.description}
                    </p>

                    {machine.specs && (
                      <div className="flex flex-wrap gap-2">
                        {machine.specs.map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-1 bg-[#1a1a1a] text-[#6A6A6A] font-mono text-[10px] uppercase tracking-wider"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}

                    {machine.inductionRequired && (
                      <div className="mt-4 flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: accentColor }}
                        />
                        <span 
                          className="font-mono text-xs"
                          style={{ color: accentColor }}
                        >
                          Induction Required
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h4 className="font-mono text-xs uppercase tracking-[0.12em] text-[#6A6A6A] mb-4">
                      Learning Resources
                    </h4>
                    <div className="space-y-2">
                      {machine.resources.map((resource, idx) => {
                        const Icon = resourceIcons[resource.type];
                        return (
                          <a
                            key={idx}
                            href={resource.url}
                            className="flex items-center justify-between p-3 bg-[#1a1a1a] hover:bg-[#222] transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4 text-[#6A6A6A] group-hover:text-accent transition-colors" />
                              <span className="text-sm text-[#F6F6F6]">{resource.title}</span>
                            </div>
                            <ExternalLink className="w-4 h-4 text-[#6A6A6A] group-hover:text-accent transition-colors" />
                          </a>
                        );
                      })}
                    </div>

                    {machine.inductionRequired && (
                     /* <button 
                        className="w-full mt-4 py-3 px-6 rounded-full font-mono text-xs uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: accentColor }}
                      >
                        Book Induction
                      </button> */
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredMachines.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#6A6A6A] font-mono text-sm">
                No equipment found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
