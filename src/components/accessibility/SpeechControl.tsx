'use client';
import React, { useEffect } from 'react';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useRouter } from 'next/navigation';

interface SpeechControlProps {
  onReadAction?: () => void;
  onStopAction?: () => void;
}

export function SpeechControl({ onReadAction, onStopAction }: SpeechControlProps) {
  const { fontSize, setFontSize } = useAccessibility();
  const router = useRouter();

  // Command processor core
  const processVoiceCommand = (spokenText: string) => {
    console.log('Processing Voice Command:', spokenText);

    // 1. FONT COMMANDS
    if (spokenText.includes('font larger') || spokenText.includes('make font bigger')) {
      if (fontSize === 'small') setFontSize('medium');
      else if (fontSize === 'medium') setFontSize('large');
      else if (fontSize === 'large') setFontSize('xlarge');
      resetTranscript();
    }
    
    if (spokenText.includes('font smaller') || spokenText.includes('make font smaller')) {
      if (fontSize === 'xlarge') setFontSize('large');
      else if (fontSize === 'large') setFontSize('medium');
      else if (fontSize === 'medium') setFontSize('small');
      resetTranscript();
    }

    // 2. AUDIO READING COMMANDS
    if (spokenText.includes('read lesson') || spokenText.includes('start reading')) {
      if (onReadAction) onReadAction();
      resetTranscript();
    }

    if (spokenText.includes('stop reading') || spokenText.includes('be quiet')) {
      if (onStopAction) onStopAction();
      resetTranscript();
    }

    // 3. NAVIGATION COMMANDS
    if (spokenText.includes('go back') || spokenText.includes('go to courses')) {
      router.push('/courses');
      resetTranscript();
    }
  };

  const { startListening, stopListening, isListening, transcript, resetTranscript } = useSpeechToText({
    onResult: (text) => processVoiceCommand(text),
  });

  return (
    <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md w-full">
      <div className="flex items-center gap-3">
        <div className={`h-3 w-3 rounded-full ${isListening ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
        <div>
          <p className="text-sm font-bold">Voice Command Control Panel</p>
          <p className="text-xs text-slate-400">
            {isListening ? 'Listening for commands...' : 'Voice commands deactivated.'}
          </p>
        </div>
      </div>

      {/* Helper Chips for Impaired Learners */}
      <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-300">
        <span className="bg-slate-800 px-2 py-1 rounded">🗣️ "Read Lesson"</span>
        <span className="bg-slate-800 px-2 py-1 rounded">🗣️ "Font Larger"</span>
        <span className="bg-slate-800 px-2 py-1 rounded">🗣️ "Go Back"</span>
      </div>

      <button
        onClick={isListening ? stopListening : startListening}
        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
          isListening 
            ? 'bg-rose-600 text-white hover:bg-rose-700' 
            : 'bg-emerald-600 text-white hover:bg-emerald-700'
        }`}
      >
        {isListening ? 'Turn Off Control' : 'Activate Voice Control'}
      </button>
    </div>
  );
}