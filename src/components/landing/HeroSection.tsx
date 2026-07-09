'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function HeroSection() {
  const { user } = useAuth();

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Inclusive Learning for Everyone
        </h1>
        <p className="text-xl md:text-2xl text-blue-100">
          Access quality education with built-in accessibility features designed for learners with diverse needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          {user ? (
            <>
              <Link
                href="/courses"
                className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition inline-block"
              >
                Explore Courses
              </Link>
              <Link
                href="/dashboard"
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:bg-opacity-10 transition inline-block"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition inline-block"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:bg-opacity-10 transition inline-block"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
