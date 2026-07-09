'use client';
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
        {error && <p className="text-sm text-rose-600 bg-rose-50 p-3 rounded-lg">{error}</p>}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 block">Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 block">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <p className="text-sm text-center text-slate-600">
          New to the platform? <Link href="/signup" className="text-blue-600 hover:underline">Create an account</Link>
        </p>
      </form>
    </div>
  );
}
