'use client';
import React from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';

export function FontAdjuster() {
  const { fontSize, setFontSize } = useAccessibility();

  const options: { value: 'small' | 'medium' | 'large' | 'xlarge'; label: string; style: string }[] = [
    { value: 'small', label: 'A', style: 'text-sm' },
    { value: 'medium', label: 'A', style: 'text-base' },
    { value: 'large', label: 'A', style: 'text-lg' },
    { value: 'xlarge', label: 'A', style: 'text-2xl font-bold' },
  ];

  return (
    <div className="flex flex-col gap-2 p-4 bg-slate-50 rounded-xl border border-slate-200 w-fit">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Font Size Options
      </span>
      <div className="flex items-center gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFontSize(opt.value)}
            className={`h-12 w-12 flex items-center justify-center rounded-lg border transition-all ${
              fontSize === opt.value
                ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            title={`Set text sizing to ${opt.value}`}
            aria-pressed={fontSize === opt.value}
          >
            <span className={opt.style}>{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}