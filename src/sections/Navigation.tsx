import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Palette } from 'lucide-react';
import { useColor, accentColors } from '../context/ColorContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Machines', href: '/machines' },
  { label: 'Tutorials', href: '/tutorials' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { accentColor, setAccentColor } = useColor();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsColorPickerOpen(false);
      }
    };

    if (isColorPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isColorPickerOpen]);

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const handleColorSelect = (color: string) => {
    setAccentColor(color);
    setIsColorPickerOpen(false);
  };

  return (
    <>
      {/* Main Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? 'bg-[#0B0B0C]/95 backdrop-blur-sm py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="px-6 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="font-display text-lg font-semibold text-[#F6F6F6] hover:opacity-80 transition-opacity"
          >
            Zero.One.Two
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                  isActive(link.href)
                    ? 'text-accent'
                    : 'text-[#A6A6A6] hover:text-[#F6F6F6]'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Color Picker */}
            <div className="relative ml-4" ref={colorPickerRef}>
              <button
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#1a1a1a] hover:bg-[#222] transition-colors"
                title="Change accent color"
              >
                <Palette className="w-4 h-4 text-[#A6A6A6]" />
                <span
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: accentColor }}
                />
              </button>

              {/* Color Picker Dropdown */}
              {isColorPickerOpen && (
                <div className="absolute right-0 top-full mt-2 p-3 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50 min-w-[160px]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#6A6A6A] mb-3">
                    Accent Color
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {accentColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorSelect(color.value)}
                        className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${
                          accentColor === color.value ? 'ring-2 ring-white scale-110' : ''
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                        aria-label={`Select ${color.name} color`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            {/* Mobile Color Picker */}
            <div className="relative" ref={colorPickerRef}>
              <button
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                className="flex items-center gap-2 p-2"
              >
                <Palette className="w-5 h-5 text-[#A6A6A6]" />
                <span
                  className="w-4 h-4 rounded-full border border-white/20"
                  style={{ backgroundColor: accentColor }}
                />
              </button>

              {isColorPickerOpen && (
                <div className="absolute right-0 top-full mt-2 p-3 bg-[#1a1a1a] border border-[#333] rounded-lg shadow-xl z-50">
                  <div className="grid grid-cols-4 gap-2">
                    {accentColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => handleColorSelect(color.value)}
                        className={`w-8 h-8 rounded-full ${
                          accentColor === color.value ? 'ring-2 ring-white' : ''
                        }`}
                        style={{ backgroundColor: color.value }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#F6F6F6] p-2"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[99] bg-[#0B0B0C] md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`font-display text-3xl font-semibold ${
                  isActive(link.href) ? 'text-accent' : 'text-[#F6F6F6]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
