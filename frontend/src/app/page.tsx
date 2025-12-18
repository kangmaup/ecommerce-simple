'use client';

import Navbar from '@/components/layout/Navbar';
import ProductCard from '@/components/product/ProductCard';
import api from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Define Interface
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchProducts = async () => {
        try {
           const res = await api.get('/products?limit=10'); // Fetch 10 products
           setProducts(res.data.data || []);
        } catch (error) {
           console.error("Failed to fetch products", error);
        } finally {
           setLoading(false);
        }
     }
     fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-unify-bg text-unify-text font-sans">
      <Navbar />

      <main className="container mx-auto px-4 lg:px-8 py-6 space-y-8">
        {/* Banner Section */}
        <section className="rounded-xl overflow-hidden shadow-sm relative h-[300px] bg-gradient-to-r from-unify-green to-teal-500 flex items-center px-8 sm:px-16">
           <div className="max-w-xl space-y-4 text-white z-10">
              <h1 className="text-4xl sm:text-5xl font-bold leading-tight">Belanja Kebutuhan Harian Lebih Hemat</h1>
              <p className="text-lg opacity-90">Nikmati diskon hingga 50% untuk produk pilihan hari ini.</p>
              <button className="mt-4 px-6 py-3 bg-white text-unify-dark-green font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-transform hover:-translate-y-0.5">
                 Belanja Sekarang
              </button>
           </div>
           {/* Decorative circles */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
           <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full blur-2xl -ml-20 -mb-20"></div>
        </section>

        {/* Categories Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
             <h2 className="text-2xl font-bold text-gray-800">Kategori Pilihan</h2>
             <Link href="/categories" className="text-unify-green font-semibold hover:text-unify-dark-green">Lihat Semua</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
             {['Elektronik', 'Fashion Pria', 'Fashion Wanita', 'Rumah Tangga', 'Kesehatan', 'Hobi & Mainan'].map((cat, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center gap-3 text-center group">
                   <div className="w-16 h-16 rounded-full bg-gray-50 group-hover:bg-green-50 flex items-center justify-center text-unify-green transition-colors">
                      {/* Placeholder Icon */}
                      <span className="text-2xl font-bold opacity-50">{cat.charAt(0)}</span>
                   </div>
                   <span className="text-sm font-semibold text-gray-700 group-hover:text-unify-green transition-colors">{cat}</span>
                </div>
             ))}
          </div>
        </section>

        {/* Product Recommendations */}
        <section>
           <h2 className="text-2xl font-bold text-gray-800 mb-4">Rekomendasi Untukmu</h2>
           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
               {loading ? (
                   Array.from({ length: 5 }).map((_, i) => (
                       <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
                   ))
               ) : (
                   products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                   ))
               )}
           </div>
        </section>
      </main>
    </div>
  );
}
