'use client';

export default function DashboardPage() {
  return (
    <section className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-indigo-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-indigo-800 mb-6">Welcome to HisabKitab Dashboard!</h1>

      <p className="mb-4 text-gray-700 text-lg">
        This system helps you manage your shop's financial records easily. Here your current focus:
      </p>

      <ul className="space-y-3 text-gray-800 text-base list-disc list-inside">

      <li>
          <strong>Sell Products:</strong> Keep track of what you sell each day in your shop — stay on top of your daily sales.
       </li>
       <li>
          <strong>Udhar Products:</strong> Track items you give to others on credit, daily or monthly, to manage your shop's Udhar easily.
      </li>
        <li>
          <strong>Expense Products:</strong> Track your daily or monthly shop expenses by adding items like electricity bills, staff salary, rent, and other operational costs.
        </li>
      </ul>

      <div className="mt-8 text-sm text-gray-600">
        Tip: All your expenses are stored securely in Supabase and accessible from any device after login.
      </div>
    </section>
  );
}
