'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu, Search as SearchIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
           <svg className="w-8 h-8 text-unify-green" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
           </svg>
           <span className="text-2xl font-bold text-unify-green hidden sm:block">LuxeCommerce</span>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">
           <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari di LuxeCommerce"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-unify-green focus:ring-1 focus:ring-unify-green transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-6">
           {/* Cart */}
           <Link href="/cart" className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 hover:text-unify-green transition-colors relative group">
              <ShoppingCart className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
           </Link>

           <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

           {/* Auth Buttons */}
           {isAuthenticated ? (
             <div className="flex items-center gap-3">
                <Link href="/dashboard" className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-unify-green">
                   <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-unify-green font-bold">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                   </div>
                   <span className="max-w-[100px] truncate">{user?.email?.split('@')[0]}</span>
                </Link>
             </div>
           ) : (
             <div className="flex items-center gap-3">
                <Link 
                  href="/login" 
                  className="px-4 py-1.5 text-sm font-bold text-unify-green border border-unify-green rounded-lg hover:bg-green-50 transition-colors"
                >
                  Masuk
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-1.5 text-sm font-bold text-white bg-unify-green rounded-lg hover:bg-unify-dark-green transition-colors shadow-sm shadow-green-200"
                >
                  Daftar
                </Link>
             </div>
           )}
        </div>
      </div>
    </header>
  );
}
