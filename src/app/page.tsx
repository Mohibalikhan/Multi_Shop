'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push('/dashboard');
      }
    });
  }, [router]);

  // ✅ Login handler
  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Login failed: ' + error.message);
    } else {
      router.push('/dashboard');
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-indigo-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-800">
          Login to HisabKitab
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded-md mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded-md mb-6"
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
}
