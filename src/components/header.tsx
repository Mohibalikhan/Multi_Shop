'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Header = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const shopId = localStorage.getItem('currentShop');
    setIsLoggedIn(!!shopId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentShop');
    router.push('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-teal-600 via-indigo-800 to-purple-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-300 drop-shadow-lg hover:scale-105 transition-transform duration-300">
          HisabKitab
        </h1>

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Header;
