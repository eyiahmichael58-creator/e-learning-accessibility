'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseSpeechToTextOptions {
  onResult?: (text: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
}

export const useSpeechToText = (options: UseSpeechToTextOptions = {}) => {
  const { onResult, continuous = true, interimResults = true } = options;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Handle cross-browser prefixes for SpeechRecognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech API (SpeechRecognition) is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      setTranscript(currentTranscript);
      if (onResult) {
        onResult(currentTranscript);
      }
    };

    recognitionRef.current = recognition;
  }, [continuous, interimResults, onResult]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    setTranscript('');
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error('Speech recognition starting error:', error);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    recognitionRef.current.stop();
  }, [isListening]);

  return { startListening, stopListening, isListening, transcript };
};