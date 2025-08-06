'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/supabase-js';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { Menu } from 'lucide-react';

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
      const { data, error } = await supabase.auth.getSession();
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

  if (loading && !isPublicPage) {
    return (
      <div className="h-screen flex justify-center items-center text-indigo-700 text-xl font-semibold">
        Checking session...
      </div>
    );
  }

  // Public page
  if (isPublicPage) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          {children}
        </main>
        <Footer />
      </>
    );
  }

  // Protected page (Expense only)
  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/expense-products" className="hover:text-yellow-300">Expense Products</Link>
        </nav>
      </aside>

      {/* Mobile Topbar */}
      <div className="lg:hidden bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-lg">Dashboard</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-700 text-white px-4 py-4 space-y-3">
          <Link
            href="/expense-products"
            onClick={() => setMobileMenuOpen(false)}
            className="block hover:text-yellow-300"
          >
            Expense Products
          </Link>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-4 bg-gray-100">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
