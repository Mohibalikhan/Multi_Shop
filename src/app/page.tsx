'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [shopId, setShopId] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (shopId.trim()) {
      localStorage.setItem('currentShop', shopId.trim());
      router.push('/sell-products'); // Redirect after login
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Login to Your Shop</h1>
        <input
          type="text"
          placeholder="Enter Shop Name or ID"
          value={shopId}
          onChange={(e) => setShopId(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
