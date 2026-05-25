'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product, CartItem } from '../../../types';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/products/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Product not found');
        return r.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    const cart: CartItem[] = JSON.parse(localStorage.getItem('fitzone_cart') || '[]');
    const existing = cart.find((i) => i.product._id === product._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    localStorage.setItem('fitzone_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('fitzone_update'));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="bg-gray-800 rounded-xl h-96" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-800 rounded w-1/2" />
            <div className="h-20 bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-gray-400 text-xl mb-6">Product not found</p>
        <Link href="/products" className="btn-primary">Back to Products</Link>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-900 text-yellow-400',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link href="/products" className="text-gray-400 hover:text-green-400 text-sm flex items-center gap-1 mb-8 transition-colors">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="card overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <span className="badge bg-green-900 text-green-400 mb-3">{product.category}</span>
          <h1 className="text-3xl font-black text-white mb-4">{product.name}</h1>
          <p className="text-gray-400 mb-6 leading-relaxed">{product.description}</p>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl font-black text-green-400">₹{product.price.toLocaleString()}</span>
          </div>

          <div className="mb-6">
            {product.stock > 10 ? (
              <p className="text-green-500 font-medium">✓ In Stock ({product.stock} available)</p>
            ) : product.stock > 0 ? (
              <p className="text-yellow-500 font-medium">⚠ Only {product.stock} left in stock!</p>
            ) : (
              <p className="text-red-500 font-medium">✗ Out of Stock</p>
            )}
          </div>

          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <label className="text-gray-300 font-medium">Qty:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition-colors"
                >
                  −
                </button>
                <span className="w-10 text-center text-white font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-9 h-9 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`btn-primary flex-1 py-3 ${added ? 'bg-green-700' : ''}`}
            >
              {added ? '✓ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <Link href="/cart" className="btn-secondary py-3 px-6">
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
