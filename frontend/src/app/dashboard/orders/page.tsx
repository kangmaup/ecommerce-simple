'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Package, Search, Filter, MoreVertical, Eye } from 'lucide-react';

interface Order {
  id: string;
  user: {
    name: string;
    email: string;
  };
  total_amount: number;
  status: string;
  created_at: string;
  items: any[];
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/admin/orders');
        setOrders(res.data.data);
      } catch (error) {
        console.error("Failed to fetch admin orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Orders...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-500">Manage customer orders and status.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
             <Filter className="w-4 h-4" /> Filter
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm">
             <Package className="w-4 h-4" /> Export
           </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                  <tr>
                     <th className="px-6 py-4">Order ID</th>
                     <th className="px-6 py-4">Customer</th>
                     <th className="px-6 py-4">Total</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Date</th>
                     <th className="px-6 py-4 text-right">Action</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {orders.length === 0 ? (
                    <tr>
                       <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                    </tr>
                  ) : orders.map((order) => (
                     <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                           #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4">
                           <div className="font-medium text-gray-900">{order.user?.name || "Unknown"}</div>
                           <div className="text-xs text-gray-500">{order.user?.email}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                           Rp {order.total_amount.toLocaleString('id-ID')}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                               order.status === 'paid' ? 'bg-green-100 text-green-800' :
                               order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                               'bg-gray-100 text-gray-800'
                           }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                           {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                              <MoreVertical className="w-4 h-4" />
                           </button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {/* Pagination (Static for now) */}
         <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <span>Showing {orders.length} orders</span>
            <div className="flex gap-2">
               <button disabled className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
               <button disabled className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
         </div>
      </div>
    </div>
  );
}
