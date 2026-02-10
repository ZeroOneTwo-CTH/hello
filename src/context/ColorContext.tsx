import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export const accentColors = [
  { name: 'Coral', value: '#FF6B4A' },    // Better contrast than #FF4D2E
  { name: 'Blue', value: '#4A9EFF' },
  { name: 'Green', value: '#4AFF6B' },
  { name: 'Purple', value: '#9E4AFF' },
  { name: 'Yellow', value: '#FFC74A' },
  { name: 'Pink', value: '#FF4A9E' },
  { name: 'Cyan', value: '#4AFFF6' },
  { name: 'Orange', value: '#FF8C4A' },
];

interface ColorContextType {
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: ReactNode }) {
  const [accentColor, setAccentColor] = useState(() => {
    // Load from localStorage on init
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accentColor') || '#FF6B4A';
    }
    return '#FF6B4A';
  });

  useEffect(() => {
    // Update CSS variable when color changes
    document.documentElement.style.setProperty('--accent-color', accentColor);
    document.documentElement.style.setProperty('--accent-color-dark', adjustBrightness(accentColor, -20));
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  // Helper to darken color for hover states
  const adjustBrightness = (hex: string, percent: number) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  };

  return (
    <ColorContext.Provider value={{ accentColor, setAccentColor }}>
      {children}
    </ColorContext.Provider>
  );
}

export const useColor = () => {
  const context = useContext(ColorContext);
  if (!context) throw new Error('useColor must be used within ColorProvider');
  return context;
};