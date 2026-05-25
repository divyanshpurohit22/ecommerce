'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartItem } from '../../types';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored: CartItem[] = JSON.parse(localStorage.getItem('fitzone_cart') || '[]');
    setCart(stored);
  }, []);

  const updateQty = (productId: string, delta: number) => {
    const updated = cart
      .map((item) => {
        if (item.product._id === productId) {
          return { ...item, quantity: item.quantity + delta };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    setCart(updated);
    localStorage.setItem('fitzone_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('fitzone_update'));
  };

  const removeItem = (productId: string) => {
    const updated = cart.filter((item) => item.product._id !== productId);
    setCart(updated);
    localStorage.setItem('fitzone_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('fitzone_update'));
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const placeOrder = async () => {
    const token = localStorage.getItem('fitzone_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (cart.length === 0) {
      setMessage('Your cart is empty');
      return;
    }

    setPlacing(true);
    setMessage('');

    try {
      const res = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || 'Failed to place order');
        return;
      }

      localStorage.removeItem('fitzone_cart');
      setCart([]);
      window.dispatchEvent(new Event('fitzone_update'));
      setMessage('success');
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (message === 'success') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-black text-white mb-3">Order Placed!</h2>
        <p className="text-gray-400 mb-8 text-center">
          Your order has been successfully placed. We&apos;ll get it ready for you soon!
        </p>
        <div className="flex gap-4">
          <Link href="/orders" className="btn-primary px-8 py-3">View Orders</Link>
          <Link href="/products" className="btn-secondary px-8 py-3">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-black text-white mb-8">Shopping Cart</h1>

      {message && message !== 'success' && (
        <div className="bg-red-900/50 border border-red-700 text-red-400 px-4 py-3 rounded-lg mb-6">
          {message}
        </div>
      )}

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🛒</p>
          <p className="text-gray-400 text-xl mb-6">Your cart is empty</p>
          <Link href="/products" className="btn-primary px-8 py-3">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Table */}
          <div className="lg:col-span-2">
            <div className="card overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-green-900/40 border-b border-green-700">
                    <th className="text-left text-green-300 text-sm font-semibold px-6 py-4 uppercase tracking-wider">Product</th>
                    <th className="text-right text-green-300 text-sm font-semibold px-4 py-4 uppercase tracking-wider">Price</th>
                    <th className="text-center text-green-300 text-sm font-semibold px-4 py-4 uppercase tracking-wider">Quantity</th>
                    <th className="text-right text-green-300 text-sm font-semibold px-4 py-4 uppercase tracking-wider">Subtotal</th>
                    <th className="text-center text-green-300 text-sm font-semibold px-4 py-4 uppercase tracking-wider">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.product._id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div>
                            <Link href={`/products/${item.product._id}`} className="text-white font-medium hover:text-green-400 transition-colors line-clamp-2 text-sm">
                              {item.product.name}
                            </Link>
                            <span className="text-gray-500 text-xs">{item.product.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-gray-300 text-sm whitespace-nowrap">
                        ₹{item.product.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => updateQty(item.product._id, -1)}
                            className="w-7 h-7 bg-gray-700 hover:bg-gray-600 rounded text-white font-bold text-sm transition-colors"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-white font-semibold text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.product._id, 1)}
                            className="w-7 h-7 bg-gray-700 hover:bg-gray-600 rounded text-white font-bold text-sm transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-green-400 font-bold text-sm whitespace-nowrap">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => removeItem(item.product._id)}
                          className="text-gray-500 hover:text-red-400 transition-colors text-xl leading-none"
                          title="Remove item"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <span className="text-gray-400 line-clamp-1 flex-1 mr-2">{item.product.name} × {item.quantity}</span>
                    <span className="text-gray-300 whitespace-nowrap">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-semibold">Total</span>
                  <span className="text-2xl font-black text-green-400">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing}
                className="btn-primary w-full py-3 text-base"
              >
                {placing ? 'Placing Order...' : 'Place Order →'}
              </button>

              <Link href="/products" className="block text-center text-gray-500 hover:text-gray-400 text-sm mt-4 transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
