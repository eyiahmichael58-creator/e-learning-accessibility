'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About Us</h3>
            <p className="text-sm leading-relaxed">
              Inclusive E-Learning Platform dedicated to providing accessible learning
              experiences for all learners, including those with visual, hearing, and
              mobility impairments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses" className="hover:text-white transition">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="mailto:support@elearning.com" className="hover:text-white transition">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Accessibility Statement
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6">
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between text-sm">
            <p>&copy; {currentYear} Inclusive E-Learning Platform. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
