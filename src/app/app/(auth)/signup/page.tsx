'use client';
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage('Registration successful! Please check your email inbox to confirm your account.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
        {error && <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">{error}</p>}
        {message && <p className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg">{message}</p>}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 block">Full Name</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 block">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 block">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
          {loading ? 'Creating Account...' : 'Register'}
        </button>
        <p className="text-sm text-center text-slate-600">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </form>
    </div>
  );
}