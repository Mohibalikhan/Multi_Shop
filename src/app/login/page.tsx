'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side Image */}
      <div className="md:w-1/2 h-64 md:h-auto">
        <img
          src="/images/login.jpg" // ✅ Correct public path
          alt="Login Visual"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Login Form */}
      <div className="md:w-1/2 flex items-center justify-center bg-gray-100 px-6 py-12">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-3xl font-semibold text-indigo-700 mb-6 text-center">
            Welcome to <span className="font-bold">HisabKitab</span>
          </h2>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleLogin}
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Login
            </button>
          </div>

          
        </div>
      </div>
    </div>
  );
}
