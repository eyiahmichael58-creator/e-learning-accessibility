'use client';
import React from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';

export function ThemeToggler() {
  const { theme, setTheme } = useAccessibility();

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold uppercase tracking-wider opacity-70">Display Theme:</span>
      <button
        onClick={() => setTheme(theme === 'light' ? 'high-contrast-dark' : 'light')}
        className={`px-4 py-2 rounded-xl text-xs font-bold uppercase border tracking-wider transition-all duration-150 flex items-center gap-2 ${
          theme === 'high-contrast-dark'
            ? 'bg-yellow-400 text-black border-yellow-400 hover:bg-yellow-300'
            : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
        }`}
      >
        {theme === 'high-contrast-dark' ? '☀️ Switch to Light Mode' : '🌙 High-Contrast Dark'}
      </button>
    </div>
  );
}