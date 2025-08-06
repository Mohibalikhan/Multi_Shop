'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';

const Header = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session?.user);
    };

    checkAuth();

    // Listen to auth changes (login/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('currentShop');
    setIsLoggedIn(false); // Update state
    router.push('/login'); // or: window.location.href = '/login';
  };

  return (
    <nav className="bg-gradient-to-r from-teal-600 via-indigo-800 to-purple-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-amber-300 drop-shadow-lg hover:scale-105 transition-transform duration-300">
          HisabKitab
        </h1>

        {isLoggedIn && (
          <Button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
          >
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Header;
