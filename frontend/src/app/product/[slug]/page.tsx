'use client';

import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import Navbar from '@/components/layout/Navbar';
import { Star, Share2, Heart, Minus, Plus, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: {
    name: string;
    slug: string;
  };
}

import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>('');
  const router = useRouter();
  
  // Unwrap params
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/slug/${slug}`);
        setProduct(res.data);
      } catch (err) {
        setError('Product not found or backend error');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= (product?.stock || 1)) {
       setQuantity(newQty);
    }
  };

  if (loading) {
     return (
        <div className="min-h-screen bg-unify-bg">
           <Navbar />
           <div className="container mx-auto px-4 py-8 flex justify-center">
              <div className="animate-pulse space-y-4 w-full max-w-4xl">
                 <div className="h-64 bg-gray-200 rounded-xl"></div>
                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                 <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
           </div>
        </div>
     )
  }

  if (error || !product) {
      return (
        <div className="min-h-screen bg-unify-bg">
           <Navbar />
           <div className="container mx-auto px-4 py-16 text-center">
               <h1 className="text-2xl font-bold text-gray-800">Oops! Produk tidak ditemukan</h1>
               <p className="text-gray-500 mt-2">Mungkin link yang kamu tuju salah atau produk sudah dihapus.</p>
               <Link href="/" className="mt-6 inline-block px-6 py-2 bg-unify-green text-white font-bold rounded-lg">
                  Kembali ke Beranda
               </Link>
           </div>
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-unify-bg font-sans text-unify-text">
      <Navbar />

      <main className="container mx-auto px-4 lg:px-8 py-6">
         {/* Breadcrumb */}
         <nav className="flex text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-unify-green">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/categories" className="hover:text-unify-green">{product.category?.name || 'Category'}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
         </nav>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Images */}
            <div className="lg:col-span-4 space-y-4">
               <div className="aspect-square bg-white rounded-xl border border-gray-200 overflow-hidden relative group">
                  {/* Main Image Placeholder */}
                  {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-contain" />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-300">
                         <span className="text-4xl">No Image</span>
                      </div>
                  )}
               </div>
               {/* Thumbnails (Mock) */}
               <div className="flex gap-2 overflow-x-auto pb-2">
                   {[1,2,3].map(i => (
                     <div key={i} className={`w-16 h-16 rounded-lg border cursor-pointer ${i===1 ? 'border-unify-green ring-1 ring-unify-green' : 'border-gray-200 hover:border-gray-300'}`}>
                         <div className="w-full h-full bg-gray-50"></div>
                     </div>
                   ))}
               </div>
            </div>

            {/* Middle Column: Info */}
            <div className="lg:col-span-5 space-y-6">
               <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug">{product.name}</h1>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                     <div className="flex items-center gap-1">
                        <span className="text-yellow-400 font-bold">4.9</span>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                     </div>
                     <span>(50+ Ulasan)</span>
                     <span>•</span>
                     <span>Terjual 100+</span>
                  </div>
               </div>

               <div className="text-3xl font-bold text-gray-900">
                  Rp {product.price.toLocaleString('id-ID')}
               </div>

               <div className="border-t border-b border-gray-100 py-4 space-y-3">
                  <h3 className="font-bold text-unify-green">Detail Produk</h3>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                     {product.description || "Tidak ada deskripsi produk."}
                  </div>
               </div>
               
               <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <button className="flex items-center gap-1 hover:text-gray-900"><Heart className="w-4 h-4"/> Wishlist</button>
                  <button className="flex items-center gap-1 hover:text-gray-900"><Share2 className="w-4 h-4"/> Share</button>
               </div>
            </div>

            {/* Right Column: Sticky Action Card */}
            <div className="lg:col-span-3">
               <div className="lg:sticky lg:top-24 bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
                  <h3 className="font-bold text-gray-900">Atur jumlah dan catatan</h3>
                  
                  <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                         <button 
                           onClick={() => handleQuantityChange(-1)}
                           className="p-2 hover:bg-gray-50 disabled:opacity-50"
                           disabled={quantity <= 1}
                         >
                            <Minus className="w-4 h-4 text-gray-600" />
                         </button>
                         <input 
                           type="text" 
                           value={quantity} 
                           readOnly 
                           className="w-12 text-center text-sm font-bold text-gray-900 focus:outline-none" 
                         />
                         <button 
                           onClick={() => handleQuantityChange(1)}
                           className="p-2 hover:bg-gray-50 disabled:opacity-50"
                           disabled={quantity >= product.stock}
                         >
                            <Plus className="w-4 h-4 text-unify-green" />
                         </button>
                      </div>
                      <div className="text-sm text-gray-500">
                         Stok Total: <span className="font-bold text-gray-900">{product.stock}</span>
                      </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                     <span>Subtotal</span>
                     <span className="font-bold text-lg text-gray-900">Rp {(product.price * quantity).toLocaleString('id-ID')}</span>
                  </div>

                  <div className="space-y-3">
                     <button 
                       onClick={async () => {
                          try {
                             await api.post('/cart', { product_id: product.id, quantity });
                             alert('Berhasil masuk keranjang!');
                             // Optionally update cart count in navbar context
                          } catch (err: any) {
                             if (err.response?.status === 401) {
                                router.push('/login');
                             } else {
                                alert(err.response?.data?.error || "Gagal menambah ke keranjang");
                             }
                          }
                       }}
                       className="w-full py-2.5 bg-unify-green text-white font-bold rounded-lg hover:bg-unify-dark-green transition-colors flex items-center justify-center gap-2"
                     >
                        <Plus className="w-4 h-4" /> Keranjang
                     </button>
                     <button 
                       onClick={async () => {
                          try {
                             await api.post('/cart', { product_id: product.id, quantity });
                             router.push('/cart');
                          } catch (err: any) {
                             if (err.response?.status === 401) {
                                router.push('/login');
                             } else {
                                alert(err.response?.data?.error || "Gagal menambah ke keranjang");
                             }
                          }
                       }}
                       className="w-full py-2.5 border border-unify-green text-unify-green font-bold rounded-lg hover:bg-green-50 transition-colors"
                     >
                        Beli Langsung
                     </button>
                  </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
}
