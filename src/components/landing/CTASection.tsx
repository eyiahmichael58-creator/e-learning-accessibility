'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function CTASection() {
  const { user } = useAuth();

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto bg-blue-50 border-2 border-blue-200 rounded-lg p-12 text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
          Ready to Start Learning?
        </h2>
        <p className="text-lg text-slate-600">
          Join thousands of learners experiencing education without barriers
        </p>

        {user ? (
          <Link
            href="/courses"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
          >
            Browse Courses Now
          </Link>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition inline-block"
            >
              Sign Up Today
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition inline-block"
            >
              Already Have an Account?
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
