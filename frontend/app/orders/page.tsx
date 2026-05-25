'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Order } from '../../types';

const API = process.env.NEXT_PUBLIC_API_URL;

const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-900 text-yellow-400 border-yellow-800',
  processing: 'bg-blue-900 text-blue-400 border-blue-800',
  shipped: 'bg-purple-900 text-purple-400 border-purple-800',
  delivered: 'bg-green-900 text-green-400 border-green-800',
  cancelled: 'bg-red-900 text-red-400 border-red-800',
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('fitzone_token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetch(`${API}/api/orders/my`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          localStorage.removeItem('fitzone_token');
          localStorage.removeItem('fitzone_user');
          router.push('/auth/login');
          throw new Error('Unauthorized');
        }
        return r.json();
      })
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.message !== 'Unauthorized') {
          setError('Failed to load orders');
        }
        setLoading(false);
      });
  }, [router]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-5 bg-gray-800 rounded w-1/3 mb-4" />
              <div className="h-4 bg-gray-800 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-800 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <p className="text-red-400 text-lg mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-black text-white">My Orders</h1>
        <Link href="/products" className="btn-secondary text-sm px-4 py-2">
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📦</p>
          <p className="text-gray-400 text-xl mb-6">No orders yet</p>
          <Link href="/products" className="btn-primary px-8 py-3">
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="card p-6">
              {/* Order Header */}
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-gray-500 text-xs mb-1">ORDER ID</p>
                  <p className="text-white font-mono text-sm">{order._id}</p>
                  <p className="text-gray-500 text-xs mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <span className={`badge border ${STATUS_STYLES[order.status] || 'bg-gray-800 text-gray-400'} text-sm px-3 py-1.5 capitalize`}>
                    {order.status}
                  </span>
                  <p className="text-2xl font-black text-green-400 mt-2">₹{order.totalAmount.toLocaleString()}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left text-gray-500 text-xs font-semibold pb-3">PRODUCT</th>
                      <th className="text-right text-gray-500 text-xs font-semibold pb-3">UNIT PRICE</th>
                      <th className="text-center text-gray-500 text-xs font-semibold pb-3">QTY</th>
                      <th className="text-right text-gray-500 text-xs font-semibold pb-3">SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item._id} className="border-b border-gray-800/50 last:border-0">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            {item.product?.image && (
                              <img
                                src={item.product.image}
                                alt={item.product?.name || 'Product'}
                                className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                              />
                            )}
                            <span className="text-gray-300 text-sm">{item.product?.name || 'Product'}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right text-gray-400 text-sm whitespace-nowrap">
                          ₹{item.price.toLocaleString()}
                        </td>
                        <td className="py-3 text-center text-gray-400 text-sm">
                          {item.quantity}
                        </td>
                        <td className="py-3 text-right text-green-400 font-semibold text-sm whitespace-nowrap">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="pt-4 text-right text-gray-400 font-semibold pr-4">
                        Total:
                      </td>
                      <td className="pt-4 text-right text-green-400 font-black text-lg">
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
