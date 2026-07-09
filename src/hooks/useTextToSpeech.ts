'use client';
import { useState, useEffect, useCallback } from 'react';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSynth(window.speechSynthesis);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!synth) return;

    // Cancel any ongoing speech before starting a new one
    synth.cancel();

    const u = new SpeechSynthesisUtterance(text);
    
    u.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    
    u.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    u.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    setUtterance(u);
    synth.speak(u);
  }, [synth]);

  const stop = useCallback(() => {
    if (!synth) return;
    synth.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, [synth]);

  const pause = useCallback(() => {
    if (!synth || !isPlaying) return;
    synth.pause();
    setIsPaused(true);
  }, [synth, isPlaying]);

  const resume = useCallback(() => {
    if (!synth || !isPaused) return;
    synth.resume();
    setIsPaused(false);
  }, [synth, isPaused]);

  return { speak, stop, pause, resume, isPlaying, isPaused };
};