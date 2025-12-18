'use client';

import Navbar from '@/components/layout/Navbar';
import api from '@/lib/api';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag, ChevronRight, Package, Clock } from 'lucide-react';

interface OrderItem {
  id: string;
  product: {
    name: string;
    image_url: string;
    price: number;
    slug: string;
  };
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="min-h-screen bg-unify-bg"><Navbar /><div className="p-8 text-center">Loading Orders...</div></div>;

  return (
    <div className="min-h-screen bg-unify-bg font-sans text-unify-text">
      <Navbar />

      <main className="container mx-auto px-4 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Daftar Transaksi</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
             <div className="w-48 h-48 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
             </div>
             <h2 className="text-xl font-bold text-gray-800 mb-2">Belum ada transaksi</h2>
             <p className="text-gray-500 mb-6">Yuk, mulai belanja dan penuhi kebutuhanmu!</p>
             <Link href="/" className="px-8 py-3 bg-unify-green text-white font-bold rounded-lg hover:bg-unify-dark-green transition-colors">
                Mulai Belanja
             </Link>
          </div>
        ) : (
          <div className="space-y-4">
             {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                   {/* Header */}
                   <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                         <ShoppingBag className="w-4 h-4" />
                         <span className="font-bold text-gray-900">Belanja</span>
                         <span>•</span>
                         <span>{new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                         <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                             order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                             order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                         }`}>
                            {order.status.toUpperCase()}
                         </span>
                      </div>
                      <span className="text-sm text-gray-500 hidden md:block">INV/{order.id.slice(0,8)}</span>
                   </div>

                   {/* Items (Show First Only + Summary) */}
                   <div className="flex flex-col md:flex-row gap-4">
                      {/* Image */}
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {order.items && order.items.length > 0 && order.items[0].product.image_url ? (
                               <img src={order.items[0].product.image_url} alt="Product" className="w-full h-full object-cover" />
                          ) : (
                               <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                          )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                          <h3 className="font-bold text-gray-900 line-clamp-1">
                             {order.items && order.items.length > 0 ? order.items[0].product.name : 'Unknown Product'}
                          </h3>
                          <div className="text-sm text-gray-500 mt-1">
                             {order.items.length > 1 ? `+ ${order.items.length - 1} barang lainnya` : `${order.items[0]?.quantity} barang`}
                          </div>
                      </div>

                      {/* Total & Action */}
                      <div className="flex flex-col items-end md:border-l border-gray-100 md:pl-6 md:w-48 gap-2">
                          <div className="text-xs text-gray-500">Total Belanja</div>
                          <div className="font-bold text-gray-900">Rp {order.total_amount.toLocaleString('id-ID')}</div>
                          {/* Future: Pay Button if pending */}
                          {order.status === 'pending' && (
                              <button className="text-sm font-bold text-unify-green border border-unify-green px-4 py-1.5 rounded-lg hover:bg-green-50 w-full mt-1">
                                 Bayar Sekarang
                              </button>
                          )}
                      </div>
                   </div>
                </div>
             ))}
          </div>
        )}
      </main>
    </div>
  );
}
