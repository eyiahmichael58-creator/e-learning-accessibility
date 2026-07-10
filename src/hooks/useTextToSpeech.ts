'use client';
import { useState, useCallback, useEffect, useRef } from 'react';

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // This ref is the magic fix! It stops the browser from deleting the audio object.
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.error('Speech API not found.');
      return;
    }

    // Clear the queue
    window.speechSynthesis.cancel();

    // Create the audio package
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Save it to the ref so the browser's garbage collector doesn't destroy it
    utteranceRef.current = utterance; 

    // Fetch available voices (forces the browser to initialize its audio engine)
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      // Try to grab a default English voice, or fallback to the system's first voice
      utterance.voice = voices.find(v => v.lang.includes('en')) || voices[0];
    }

    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlaying(true);
    
    utterance.onend = () => {
      setIsPlaying(false);
      utteranceRef.current = null; // Clean up memory when done
    };
    
    utterance.onerror = (event) => {
      if (event.error !== 'interrupted' && event.error !== 'canceled') {
        console.error('SpeechSynthesis Error:', event.error);
      }
      setIsPlaying(false);
      utteranceRef.current = null;
    };

    // Delay the actual speak command by 50ms to allow React's main thread to breathe
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);

  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { speak, stop, isPlaying };
}