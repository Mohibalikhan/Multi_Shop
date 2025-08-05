'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Link from 'next/link';
import { Menu } from 'lucide-react'; // for mobile hamburger icon

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/login';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const shopId = localStorage.getItem('currentShop');

    if (!shopId && !isLoginPage) {
      router.push('/login');
    } else if (shopId && isLoginPage) {
      router.push('/dashboard');
    }

    setIsLoggedIn(!!shopId);
  }, [pathname, router, isLoginPage]);

  if (isLoginPage) {
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

  if (!isLoggedIn) return null; // Prevent flashing unauthorized pages

  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      {/* Sidebar for large screens */}
      <aside className="hidden lg:block w-64 bg-gray-800 text-white p-6 space-y-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/sell-products" className="hover:text-yellow-300">Sell Products</Link>
          <Link href="/udhar-products" className="hover:text-yellow-300">Udhar Products</Link>
          <Link href="/expense-products" className="hover:text-yellow-300">Expense Products</Link>
          <Link href="/generate-report" className="hover:text-yellow-300">Generate Report</Link>
        </nav>
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
        <span className="font-bold text-lg">Dashboard</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="focus:outline-none">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-700 text-white px-4 py-4 space-y-3">
          <Link href="/sell-products" className="block hover:text-yellow-300" onClick={() => setMobileMenuOpen(false)}>Sell Products</Link>
          <Link href="/udhar-products" className="block hover:text-yellow-300" onClick={() => setMobileMenuOpen(false)}>Udhar Products</Link>
          <Link href="/expense-products" className="block hover:text-yellow-300" onClick={() => setMobileMenuOpen(false)}>Expense Products</Link>
          <Link href="/generate-report" className="block hover:text-yellow-300" onClick={() => setMobileMenuOpen(false)}>Generate Report</Link>
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
