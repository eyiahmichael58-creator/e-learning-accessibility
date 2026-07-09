'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { FontAdjuster } from '@/components/accessibility/FontAdjuster';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import Link from 'next/link';

export default function Home() {
  const { user, signOut, loading } = useAuth();
  const { speak, stop, isPlaying } = useTextToSpeech();
  const [dictation, setDictation] = useState('');
  
  const { startListening, stopListening, isListening } = useSpeechToText({
    onResult: (text) => setDictation(text),
  });

  const sampleLessonText = "Welcome to the accessible learning room. Your profile saves all interface choices automatically.";

  if (loading) return <div className="p-8 text-center text-slate-500">Loading learning environment parameters...</div>;

  return (
    <main className="min-h-screen p-8 bg-white max-w-4xl mx-auto space-y-12">
      <header className="border-b pb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
            E-Learning Accessibility Sandbox
          </h1>
          <p className="text-slate-600">
            {user ? `Logged in as: ${user.email}` : 'Browsing as Guest'}
          </p>
        </div>
        <div>
          {user ? (
            <button onClick={signOut} className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-700 font-medium hover:bg-slate-200 transition">
              Log Out
            </button>
          ) : (
            <div className="flex gap-2">
              <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">Log In</Link>
              <Link href="/signup" className="px-4 py-2 border rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition">Register</Link>
            </div>
          )}
        </div>
      </header>

      {/* Font adjustment and state controls remain interactive below */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">1. Typography Profile Persistence</h2>
        <FontAdjuster />
        <div className="p-6 border rounded-xl bg-slate-50">
          <p>
            {user 
              ? "Change your font layout choice. Refreshing your page won't lose this setting because it pulls straight from your profiles table row."
              : "Sign in to persist your layout settings permanently to your profile row database storage."}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800">2. Lesson Reader</h2>
        <div className="p-6 border rounded-xl space-y-4">
          <p className="italic text-slate-700">"{sampleLessonText}"</p>
          {!isPlaying ? (
            <button onClick={() => speak(sampleLessonText)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium">Listen</button>
          ) : (
            <button onClick={stop} className="px-4 py-2 bg-rose-600 text-white rounded-lg font-medium">Stop</button>
          )}
        </div>
      </section>
    </main>
  );
}