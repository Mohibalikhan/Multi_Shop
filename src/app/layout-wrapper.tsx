'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/supabase-js';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import Footer from '@/components/footer';
import Header from '@/components/header'; // ✅ Imported from new file

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isPublicPage = pathname === '/login' || pathname === '/signup';

  const supabase = createClientComponentClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const initSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session || null);
      setLoading(false);

      if (!data.session && !isPublicPage) {
        router.replace('/login');
      }

      if (data.session && isPublicPage) {
        router.replace('/dashboard');
      }
    };

    initSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('currentShop');
    router.push('/login');
  };

  if (loading && !isPublicPage) {
    return (
      <div className="h-screen flex justify-center items-center text-indigo-700 text-xl font-semibold">
        Checking session...
      </div>
    );
  }

  if (isPublicPage) {
    return (
      <>
        <Header session={session} />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          {children}
        </main>
        <Footer />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col justify-between w-64 bg-blue-800 text-white p-6">
        <div>
          <Link href="/dashboard">
            <h2 className="text-xl font-bold mb-6">Dashboard</h2>
          </Link>
          <nav className="flex flex-col text-lg space-y-3">
            <Link href="/sell-products" className="hover:text-yellow-300">Add Sell Products</Link>
            <Link href="/udhar-products" className="hover:text-yellow-300">Add Udhar Products</Link>
            <Link href="/expense-products" className="hover:text-yellow-300">Add Expense Products</Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Header session={session} onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

        {/* Mobile Dropdown Menu (under header) */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gray-700 text-white px-4 py-4 space-y-3">
            <Link
              href="/sell-products"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-yellow-300"
            >
              Add Sell Products
            </Link>
            <Link
              href="/udhar-products"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-yellow-300"
            >
              Add Udhar
            </Link>
            <Link
              href="/expense-products"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:text-yellow-300"
            >
              Add Expenses
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="block text-red-400 hover:text-red-300 mt-2"
            >
              Logout
            </button>
          </div>
        )}

        <main className="flex-1 p-4 bg-gray-100">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
