'use client';

import './globals.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { User, CartItem } from '../types';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cartCount, setCartCount] = useState(0);

  const loadState = () => {
    const stored = localStorage.getItem('fitzone_user');
    if (stored) setUser(JSON.parse(stored));
    const cart: CartItem[] = JSON.parse(localStorage.getItem('fitzone_cart') || '[]');
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  };

  useEffect(() => {
    loadState();

    const handleStorage = () => loadState();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('fitzone_update', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('fitzone_update', handleStorage);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('fitzone_token');
    localStorage.removeItem('fitzone_user');
    localStorage.removeItem('fitzone_cart');
    setUser(null);
    setCartCount(0);
    window.location.href = '/';
  };

  return (
    <html lang="en">
      <head>
        <title>FitZone - Sports & Fitness Store</title>
        <meta name="description" content="Your ultimate sports and fitness destination" />
      </head>
      <body>
        <div className="h-1 w-full bg-green-500" />
        <nav className="bg-green-950 border-b border-green-900 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-black text-green-500 tracking-tight">FIT</span>
                <span className="text-2xl font-black text-white tracking-tight">ZONE</span>
                <span className="text-xl">🏋️</span>
              </Link>

              <div className="flex items-center gap-6">
                <Link href="/" className="text-gray-300 hover:text-green-400 font-medium transition-colors">
                  Home
                </Link>
                <Link href="/products" className="text-gray-300 hover:text-green-400 font-medium transition-colors">
                  Products
                </Link>
                <Link href="/cart" className="relative text-gray-300 hover:text-green-400 font-medium transition-colors">
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-green-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
                {user ? (
                  <>
                    <Link href="/orders" className="text-gray-300 hover:text-green-400 font-medium transition-colors">
                      Orders
                    </Link>
                    <span className="text-gray-400 text-sm">Hi, {user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className="text-gray-300 hover:text-green-400 font-medium transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main>{children}</main>

        <footer className="bg-gray-900 border-t border-gray-800 mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© 2026 FitZone Sports & Fitness Store. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
