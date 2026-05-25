'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('fitzone_token', data.token);
      localStorage.setItem('fitzone_user', JSON.stringify(data));
      window.dispatchEvent(new Event('fitzone_update'));
      router.push('/');
    } catch {
      setError('Network error. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            Welcome Back <span className="text-green-400">🏋️</span>
          </h1>
          <p className="text-gray-400">Sign in to your FitZone account</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-green-400 hover:text-green-300 font-medium">
                Create one
              </Link>
            </p>
          </div>

          <div
            className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700 cursor-pointer hover:border-green-600 hover:bg-gray-750 transition-colors group"
            onClick={() => {
              setEmail('customer@fitzone.com');
              setPassword('customer123');
            }}
            title="Click to autofill demo credentials"
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-gray-500 font-medium">Demo Account</p>
              <p className="text-xs text-green-600 group-hover:text-green-400 transition-colors">Click to autofill ↑</p>
            </div>
            <p className="text-xs text-gray-400">Email: customer@fitzone.com</p>
            <p className="text-xs text-gray-400">Password: customer123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
