'use client';

import Navbar from '@/components/layout/Navbar';
import ProductCard from '@/components/product/ProductCard';
import api from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Define Interfaces
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
}

interface Category {
  id: string;
  name: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     const fetchData = async () => {
        try {
           const [prodRes, catRes] = await Promise.all([
             api.get('/products?limit=10'),
             api.get('/categories')
           ]);
           
           setProducts(prodRes.data.data || []);
           setCategories(catRes.data.data || []);
        } catch (error) {
           console.error("Failed to fetch data", error);
        } finally {
           setLoading(false);
        }
     }
     fetchData();
  }, []);

  // Helper to get random pastel color for category icon
  const getCategoryColor = (name: string) => {
    const colors = ['bg-green-50', 'bg-blue-50', 'bg-red-50', 'bg-yellow-50', 'bg-purple-50', 'bg-pink-50'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getCategoryTextColor = (name: string) => {
    const colors = ['text-green-600', 'text-blue-600', 'text-red-600', 'text-yellow-600', 'text-purple-600', 'text-pink-600'];
    const index = name.length % colors.length;
    return colors[index];
  }

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
             <Link href="/categories" className="text-unify-green font-semibold hover:text-unify-dark-green text-sm lg:text-base">Lihat Semua</Link>
          </div>
          
          {loading ? (
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {Array.from({ length: 6 }).map((_, i) => (
                 <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse"></div>
               ))}
             </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {categories.slice(0, 12).map((cat) => (
                  <div key={cat.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] transition-all cursor-pointer flex flex-col items-center gap-4 text-center group h-full">
                     <div className={`w-16 h-16 rounded-3xl ${getCategoryColor(cat.name)} flex items-center justify-center transition-colors group-hover:scale-110 duration-300`}>
                        <span className={`text-2xl font-bold ${getCategoryTextColor(cat.name)}`}>
                          {cat.name.charAt(0).toUpperCase()}
                        </span>
                     </div>
                     <span className="text-sm font-semibold text-gray-700 group-hover:text-unify-green transition-colors line-clamp-2">
                        {cat.name}
                     </span>
                  </div>
               ))}
               
               {/* Fallback if no categories */}
               {categories.length === 0 && (
                 <div className="col-span-full text-center py-8 text-gray-500">
                    Belum ada kategori.
                 </div>
               )}
            </div>
          )}
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
