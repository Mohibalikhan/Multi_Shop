'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    const currentShop = localStorage.getItem('currentShop');
    if (!currentShop) {
      router.push('/login');
    }
  }, [router]);

  return (
    <section className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-indigo-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">Welcome to HisabKitab Dashboard!</h1>

      <p className="mb-4 text-gray-700 text-lg">
        This system helps you manage your shop's financial records easily. Here's how to use it:
      </p>

      <ul className="space-y-3 text-gray-800 text-base list-disc list-inside">
        <li>
          <strong>Sell Products:</strong> Add items you've sold, enter quantity, buy & sell rates — the system calculates your profit.
        </li>
        <li>
          <strong>Udhar Products:</strong> Record items given on credit and manage recoveries.
        </li>
        <li>
          <strong>Expense Products:</strong> Track your daily/monthly shop expenses.
        </li>
        <li>
          <strong>Generate Report:</strong> View a summary of all profits, investments, and expenses in one place.
        </li>
        <li>
          <strong>Logout:</strong> You can logout anytime to secure your data.
        </li>
      </ul>

      <div className="mt-8 text-sm text-gray-600">
        Tip: Your data is saved in your browser. Don't clear local storage unless you backup your records.
      </div>
    </section>
  );
}
