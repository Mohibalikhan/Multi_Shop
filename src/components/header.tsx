'use client';

import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  session: any;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ session, onMenuClick }) => {
  return (
    <nav className="bg-gradient-to-r from-teal-600 via-indigo-800 to-purple-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-300 drop-shadow-lg hover:scale-105 transition-transform duration-300">
          HisabKitab
        </h1>

        {/* Show toggle only if logged in AND on mobile */}
        {session && (
          <div className="lg:hidden">
            <button onClick={onMenuClick}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
