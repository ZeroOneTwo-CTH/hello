import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type AccentColor = {
  name: string;
  value: string;
};

export const accentColors: AccentColor[] = [
  { name: 'Coral', value: '#FF4D2E' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Orange', value: '#F97316' },
];

interface ColorContextType {
  accentColor: string;
  setAccentColor: (color: string) => void;
  accentColors: AccentColor[];
}

const ColorContext = createContext<ColorContextType>({
  accentColor: accentColors[0].value,
  setAccentColor: () => {},
  accentColors,
});

export function ColorProvider({ children }: { children: React.ReactNode }) {
  const [accentColor, setAccentColorState] = useState(accentColors[0].value);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('accentColor');
      if (saved && accentColors.some(c => c.value === saved)) {
        setAccentColorState(saved);
      }
    } catch (e) {
      // localStorage not available (e.g., in some preview environments)
    }
    setIsInitialized(true);
  }, []);

  // Update CSS variable whenever color changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--accent-color', accentColor);
    }
  }, [accentColor]);

  const setAccentColor = useCallback((color: string) => {
    setAccentColorState(color);
    try {
      localStorage.setItem('accentColor', color);
    } catch (e) {
      // Ignore localStorage errors
    }
  }, []);

  // Don't render children until initialized to prevent hydration mismatch
  if (!isInitialized) {
    return <>{children}</>;
  }

  return (
    <ColorContext.Provider value={{ accentColor, setAccentColor, accentColors }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColor() {
  return useContext(ColorContext);
}
