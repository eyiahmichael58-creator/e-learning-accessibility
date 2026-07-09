'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { createClient } from '@/lib/supabase/client';

type FontSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AccessibilityContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  speechControlEnabled: boolean;
  setSpeechControlEnabled: (enabled: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const supabase = createClient();

  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const [speechControlEnabled, setSpeechControlEnabledState] = useState(false);

  // 1. Fetch user's saved layout configuration from Supabase profile table
  useEffect(() => {
    async function loadPreferences() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('font_size_preference, speech_control_enabled')
        .eq('id', user.id)
        .single();

      if (data && !error) {
        if (data.font_size_preference) setFontSizeState(data.font_size_preference as FontSize);
        if (data.speech_control_enabled !== null) setSpeechControlEnabledState(data.speech_control_enabled);
      }
    }
    loadPreferences();
  }, [user, supabase]);

  // 2. Wrap setting updates to push values asynchronously to Supabase
  const setFontSize = async (size: FontSize) => {
    setFontSizeState(size);
    if (!user) return;
    
    await supabase
      .from('profiles')
      .update({ font_size_preference: size })
      .eq('id', user.id);
  };

  const setSpeechControlEnabled = async (enabled: boolean) => {
    setSpeechControlEnabledState(enabled);
    if (!user) return;

    await supabase
      .from('profiles')
      .update({ speech_control_enabled: enabled })
      .eq('id', user.id);
  };

  const fontClassMap = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  return (
    <AccessibilityContext.Provider value={{ fontSize, setFontSize, speechControlEnabled, setSpeechControlEnabled }}>
      <div className={fontClassMap[fontSize]}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility must be used within an AccessibilityProvider');
  return context;
};