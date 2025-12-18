'use client';

import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image_url: string;
    stock: number;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    try {
       await api.put(`/cart/items/${itemId}`, { quantity: newQty });
       fetchCart(); // Refresh cart
    } catch (error) {
       console.error("Failed to update cart", error);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!confirm("Hapus barang ini dari keranjang?")) return;
    try {
       await api.delete(`/cart/items/${itemId}`);
       fetchCart();
    } catch (error) {
       console.error("Failed to remove item", error);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await api.post('/orders/checkout');
      router.push('/orders'); // Redirect to order history
    } catch (error: any) {
      alert(error.response?.data?.error || "Checkout gagal");
      setLoading(false);
    }
  };

  const totalPrice = cart?.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;

  if (loading) return <div className="min-h-screen bg-unify-bg"><Navbar /><div className="p-8 text-center">Loading...</div></div>;

  return (
    <div className="min-h-screen bg-unify-bg font-sans text-unify-text">
      <Navbar />

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>

        {(!cart || cart.items.length === 0) ? (
           <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
              <div className="w-48 h-48 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                 <span className="text-4xl">🛒</span>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Keranjangmu masih kosong</h2>
              <p className="text-gray-500 mb-6">Yuk, mulai belanja dan penuhi kebutuhanmu!</p>
              <Link href="/" className="px-8 py-3 bg-unify-green text-white font-bold rounded-lg hover:bg-unify-dark-green transition-colors">
                 Mulai Belanja
              </Link>
           </div>
        ) : (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-8 space-y-4">
                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 font-bold text-gray-700">
                       Daftar Produk
                    </div>
                    <div>
                       {cart.items.map((item) => (
                          <div key={item.id} className="p-4 flex gap-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                             {/* Checkbox (Mock) */}
                             <div className="flex items-center">
                                <input type="checkbox" checked readOnly className="w-4 h-4 text-unify-green rounded focus:ring-unify-green" />
                             </div>
                             
                             {/* Image */}
                             <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                {item.product.image_url ? (
                                   <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                                ) : (
                                   <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                )}
                             </div>

                             {/* Details */}
                             <div className="flex-1">
                                <Link href={`/product/${item.product.slug}`} className="font-semibold text-gray-900 line-clamp-2 hover:text-unify-green">
                                   {item.product.name}
                                </Link>
                                <div className="mt-1 font-bold text-gray-900">Rp {item.product.price.toLocaleString('id-ID')}</div>
                             </div>

                             {/* Actions */}
                             <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                   <button 
                                     onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                     className="p-1 px-2 hover:bg-gray-100 disabled:opacity-50"
                                     disabled={item.quantity <= 1}
                                   >
                                      <Minus className="w-3 h-3" />
                                   </button>
                                   <input 
                                     type="text" 
                                     value={item.quantity} 
                                     readOnly 
                                     className="w-8 text-center text-sm font-bold focus:outline-none bg-transparent" 
                                   />
                                   <button 
                                     onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                     className="p-1 px-2 hover:bg-gray-100 disabled:opacity-50"
                                     disabled={item.quantity >= item.product.stock}
                                   >
                                      <Plus className="w-3 h-3 text-unify-green" />
                                   </button>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500">
                                   <Trash2 className="w-5 h-5" />
                                </button>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Summary Card */}
              <div className="lg:col-span-4">
                 <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sticky top-24">
                    <h3 className="font-bold text-lg mb-4">Ringkasan Belanja</h3>
                    <div className="flex justify-between items-center mb-4 text-gray-600">
                       <span>Total Harga ({cart.items.length} barang)</span>
                       <span className="font-bold text-gray-900">Rp {totalPrice.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-4 mb-6">
                       <div className="flex justify-between items-center text-lg font-bold">
                          <span>Total Tagihan</span>
                          <span className="text-unify-green">Rp {totalPrice.toLocaleString('id-ID')}</span>
                       </div>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      className="w-full py-3 bg-unify-green text-white font-bold rounded-lg hover:bg-unify-dark-green transition-colors shadow-lg shadow-green-200"
                    >
                       Beli ({cart.items.length})
                    </button>
                 </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
}
