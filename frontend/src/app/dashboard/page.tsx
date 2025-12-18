'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Package, Tags, ShoppingCart, Users, ArrowUpRight, TrendingUp, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
       try {
         const [prodRes, catRes] = await Promise.all([
           api.get('/products?limit=1'),
           api.get('/categories')
         ]);
         
         setStats({
           products: prodRes.data.meta?.total || 0,
           categories: catRes.data.length || 0,
         });
       } catch (error) {
         console.error("Failed to fetch stats", error);
       }
    };
    fetchStats();
  }, []);

  const cards = [
    { name: 'Total Revenue', value: 'RP 124.5M', change: '+12.5%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Active Orders', value: '12', change: '+4.3%', icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Products', value: stats.products.toString(), change: '+2.1%', icon: Package, color: 'text-violet-600', bg: 'bg-violet-50' },
    { name: 'Categories', value: stats.categories.toString(), change: '0%', icon: Tags, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Overview of your store's performance.</p>
        </div>
        <div className="flex space-x-3">
           <button className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-lg shadow-sm hover:bg-gray-50">
             Export Report
           </button>
           <button className="px-4 py-2 bg-indigo-600 text-sm font-medium text-white rounded-lg shadow-sm hover:bg-indigo-500 shadow-indigo-200">
             + New Order
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div key={card.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3 mr-1" />
                {card.change}
              </span>
            </div>
            <div className="mt-5">
              <p className="text-sm font-medium text-gray-500">{card.name}</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Charts / Main Graph Placeholder */}
         <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-gray-900">Revenue Analytics</h3>
               <select className="text-sm border-gray-200 rounded-lg text-gray-500 bg-gray-50">
                 <option>This Year</option>
                 <option>Last Year</option>
               </select>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
               <p className="text-gray-400 text-sm font-medium">Chart Visualization Placeholder</p>
            </div>
         </div>

         {/* Recent Activity */}
         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">View All</button>
             </div>
             <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start">
                     <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ShoppingCardIcon i={i} />
                     </div>
                     <div className="ml-4 flex-1">
                        <p className="text-sm font-medium text-gray-900">Order #24{i}0 placed</p>
                        <p className="text-xs text-gray-500 mt-0.5">by Customer {i}</p>
                     </div>
                     <span className="text-xs text-gray-400">2h ago</span>
                  </div>
                ))}
             </div>
         </div>
      </div>
    </div>
  );
}

function ShoppingCardIcon({ i }: { i: number }) {
  if (i % 2 === 0) return <ShoppingCart className="h-4 w-4 text-indigo-600" />;
  return <Users className="h-4 w-4 text-indigo-600" />;
}
