'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechToTextOptions {
  onResult?: (text: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
}

export const useSpeechToText = (options: UseSpeechToTextOptions = {}) => {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  // FIX 1: We use a ref to track if the user WANTS to be listening. 
  // This prevents React "stale closure" bugs from killing the auto-restart loop.
  const shouldListenRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      // If it stopped but we still want to be listening, restart it!
      if (recognitionRef.current && shouldListenRef.current) {
        try {
          recognitionRef.current.start();
        } catch (error) {
          // Safeguard if it's already trying to cycle states
        }
      } else {
        setIsListening(false);
      }
    };

    recognition.onerror = (event: any) => {
      // 1. Normal silence timeout
      if (event.error === 'no-speech') {
        return; 
      }
      
      // FIX 2: Gracefully handle network drops from Google/Microsoft Cloud
      if (event.error === 'network') {
        console.warn('Network error: Cloud speech service dropped. Restart your browser or try Edge if this persists.');
        shouldListenRef.current = false;
        setIsListening(false);
        return; 
      }

      // 3. Microphone permissions blocked
      if (event.error === 'not-allowed' || event.error === 'audio-capture') {
        console.error('Microphone access denied.');
        shouldListenRef.current = false;
        setIsListening(false);
        return;
      }
      
      // Handle other critical errors
      console.error('Speech recognition engine error:', event.error);
      shouldListenRef.current = false;
      setIsListening(false);
    };
    
    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      const cleanText = currentTranscript.trim().toLowerCase();
      setTranscript(cleanText);
      
      if (optionsRef.current.onResult) {
        optionsRef.current.onResult(cleanText);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      shouldListenRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setTranscript('');
    shouldListenRef.current = true; // Tell the engine to stay alive
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.warn('Engine already running:', error);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    shouldListenRef.current = false; // Tell the engine it's allowed to sleep
    try {
      recognitionRef.current.stop();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return { startListening, stopListening, isListening, transcript, resetTranscript };
}