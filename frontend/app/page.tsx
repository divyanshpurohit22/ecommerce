'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product, CartItem } from '../types';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then((r) => r.json())
      .then((data: Product[]) => {
        setFeatured(data.slice(0, 8));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addToCart = (product: Product) => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem('fitzone_cart') || '[]');
    const existing = cart.find((i) => i.product._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ product, quantity: 1 });
    }
    localStorage.setItem('fitzone_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('fitzone_update'));
    alert(`${product.name} added to cart!`);
  };

  const categories = [
    { name: 'Dumbbells', icon: '🏋️', color: 'from-green-900 to-green-800' },
    { name: 'Yoga', icon: '🧘', color: 'from-emerald-900 to-emerald-800' },
    { name: 'Protein', icon: '💪', color: 'from-teal-900 to-teal-800' },
    { name: 'Cardio', icon: '🏃', color: 'from-green-900 to-teal-900' },
    { name: 'Accessories', icon: '🎒', color: 'from-emerald-900 to-green-800' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-700 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block bg-green-900 text-green-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-green-700">
            🔥 New Arrivals — Gym Season is Here
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Train Harder.
            <br />
            <span className="text-green-400">Go Further.</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Premium sports and fitness equipment for every level. From beginners to elite athletes — FitZone has everything you need.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="btn-primary text-lg px-8 py-3">
              Shop Now →
            </Link>
            <Link href="/auth/register" className="btn-secondary text-lg px-8 py-3">
              Join FitZone
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${cat.name}`}
              className={`bg-gradient-to-br ${cat.color} rounded-xl p-6 text-center border border-gray-800 hover:border-green-600 transition-all duration-200 hover:scale-105 group`}
            >
              <div className="text-4xl mb-3">{cat.icon}</div>
              <div className="text-white font-semibold text-sm group-hover:text-green-400 transition-colors">
                {cat.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Featured Products</h2>
          <Link href="/products" className="text-green-400 hover:text-green-300 font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="bg-gray-800 h-52 w-full" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-800 rounded w-1/2" />
                  <div className="h-8 bg-gray-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map((product) => (
              <div key={product._id} className="card hover:border-green-700 transition-colors group">
                <Link href={`/products/${product._id}`}>
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 badge bg-green-900 text-green-400">
                      {product.category}
                    </span>
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${product._id}`}>
                    <h3 className="text-white font-semibold mb-1 hover:text-green-400 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-bold text-lg">₹{product.price.toLocaleString()}</span>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Stats Banner */}
      <section className="bg-green-700 py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { val: '500+', label: 'Products' },
            { val: '10K+', label: 'Happy Customers' },
            { val: '5 Star', label: 'Avg. Rating' },
            { val: 'Free', label: 'Shipping ₹999+' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-white">{s.val}</div>
              <div className="text-green-200 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
