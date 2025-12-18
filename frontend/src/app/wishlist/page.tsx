'use client';

import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';

interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image_url: string;
  };
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchWishlistIds } = useWishlistStore();

  const fetchWishlist = async () => {
    try {
      const res = await api.get('/wishlist');
      setWishlistItems(res.data.data || []);
      // Sync store IDs
      fetchWishlistIds();
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-unify-bg font-sans text-unify-text">
      <Navbar />

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            Wishlist Saya
        </h1>

        {loading ? (
             <div className="text-center py-20">Loading...</div>
        ) : wishlistItems.length === 0 ? (
           <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
              <img 
                src="https://assets.tokopedia.net/assets-tokopedia-lite/v2/zeus/kratos/6009fdd0.png" 
                alt="Empty Wishlist" 
                className="w-48 mb-6"
              />
              <h2 className="text-xl font-bold text-gray-800 mb-2">Wah, wishlistmu masih kosong</h2>
              <p className="text-gray-500 mb-6">Yuk, cari barang impianmu dan simpan di sini!</p>
              <Link href="/" className="px-8 py-2.5 bg-unify-green text-white font-bold rounded-lg hover:bg-unify-dark-green transition-colors">
                 Cari Barang
              </Link>
           </div>
        ) : (
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {wishlistItems.map((item) => (
                 <div key={item.id} className="h-full">
                     <ProductCard product={item.product} />
                 </div>
              ))}
           </div>
        )}
      </main>
    </div>
  );
}
