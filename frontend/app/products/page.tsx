'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Product, CartItem } from '../../types';

const API = process.env.NEXT_PUBLIC_API_URL;
const CATEGORIES = ['All', 'Dumbbells', 'Yoga', 'Protein', 'Cardio', 'Accessories'];

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category') || 'All';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryParam);

  useEffect(() => {
    setLoading(true);
    const url =
      activeCategory === 'All'
        ? `${API}/api/products`
        : `${API}/api/products?category=${activeCategory}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategory]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (cat === 'All') {
      router.push('/products');
    } else {
      router.push(`/products?category=${cat}`);
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white mb-2">All Products</h1>
        <p className="text-gray-400">Discover our full range of fitness equipment and supplements</p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
              activeCategory === cat
                ? 'bg-green-600 border-green-600 text-white'
                : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-green-600 hover:text-green-400'
            }`}
          >
            {cat}
          </button>
        ))}
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
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🏋️</p>
          <p className="text-gray-400 text-lg">No products found in this category</p>
        </div>
      ) : (
        <>
          <p className="text-gray-500 text-sm mb-6">{products.length} products found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
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
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="badge bg-red-900 text-red-400 text-sm px-4 py-2">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/products/${product._id}`}>
                    <h3 className="text-white font-semibold mb-1 hover:text-green-400 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-xs mb-3 line-clamp-2">{product.description}</p>
                  <p className="text-gray-600 text-xs mb-3">
                    {product.stock > 0 ? (
                      <span className="text-green-600">In Stock ({product.stock})</span>
                    ) : (
                      <span className="text-red-500">Out of Stock</span>
                    )}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-400 font-bold text-lg">₹{product.price.toLocaleString()}</span>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><p className="text-gray-400">Loading...</p></div>}>
      <ProductsContent />
    </Suspense>
  );
}
