'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">📚 E-Learning</div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-6 items-center">
            <Link href="/courses" className="hover:text-blue-200 transition">
              Courses
            </Link>
            <Link href="/dashboard" className="hover:text-blue-200 transition">
              Dashboard
            </Link>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-blue-200 transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden mt-4 flex gap-3 flex-wrap">
          <Link href="/courses" className="text-sm hover:text-blue-200 transition">
            Courses
          </Link>
          <Link href="/dashboard" className="text-sm hover:text-blue-200 transition">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
