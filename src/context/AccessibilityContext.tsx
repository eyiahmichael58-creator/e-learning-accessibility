'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

type FontSize = 'small' | 'medium' | 'large' | 'xlarge';
type ThemeMode = 'light' | 'high-contrast-dark';

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  speechControlEnabled: boolean;
  setSpeechControlEnabled: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const fontClassMap = {
  small: 'text-sm tracking-normal',
  medium: 'text-base tracking-normal md:text-lg',
  large: 'text-xl tracking-wide md:text-2xl font-medium',
  xlarge: 'text-3xl tracking-widest md:text-4xl font-bold leading-relaxed',
};

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const supabase = createClient();

  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [speechControlEnabled, setSpeechControlEnabled] = useState(false);

  // Load preferences from database when user logs in
  useEffect(() => {
    async function loadPreferences() {
      if (!user) return;
      const { data, error } = await supabase
        .from('profiles')
        .select('font_size, theme_preference')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        if (data.font_size) setFontSizeState(data.font_size as FontSize);
        if (data.theme_preference) setThemeState(data.theme_preference as ThemeMode);
      }
    }
    loadPreferences();
  }, [user, supabase]);

  // Sync font size changes to DB
  const setFontSize = async (size: FontSize) => {
    setFontSizeState(size);
    if (user) {
      await supabase.from('profiles').update({ font_size: size }).eq('id', user.id);
    }
  };

  // Sync theme changes to DB
  const setTheme = async (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (user) {
      await supabase.from('profiles').update({ theme_preference: newTheme }).eq('id', user.id);
    }
  };

  // Build the dynamic application wrapper layout classes based on preference selections
  const themeClasses = theme === 'high-contrast-dark' 
    ? 'bg-zinc-950 text-white select-contrast border-yellow-400' 
    : 'bg-white text-slate-900';

  return (
    <AccessibilityContext.Provider value={{ fontSize, setFontSize, theme, setTheme, speechControlEnabled, setSpeechControlEnabled }}>
      <div className={`${fontClassMap[fontSize]} ${themeClasses} min-h-screen w-full transition-colors duration-200`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within an AccessibilityProvider');
  return context;
}