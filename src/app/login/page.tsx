'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [shopId, setShopId] = useState('');
  const router = useRouter();

  const ALLOWED_SHOP_ID = '0000'; // 🔐 only this code is valid

  useEffect(() => {
    const currentShop = localStorage.getItem('currentShop');
    if (currentShop === ALLOWED_SHOP_ID) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleLogin = () => {
    const trimmedId = shopId.trim();
    if (!trimmedId) {
      alert('Please enter your Shop ID');
      return;
    }

    if (trimmedId !== ALLOWED_SHOP_ID) {
      alert('Invalid Shop ID');
      return;
    }

    localStorage.setItem('currentShop', trimmedId);
    router.push('/dashboard');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-indigo-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-800">
          Login to Your Shop
        </h1>
        <input
          type="text"
          placeholder="Enter Shop ID"
          value={shopId}
          onChange={(e) => setShopId(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
        >
          Login
        </button>
      </div>
    </div>
  );
}
