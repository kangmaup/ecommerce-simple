'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, Menu, Search as SearchIcon } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useState, useEffect } from 'react';


export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter(); // Need to import useRouter

  const handleLogout = async () => {
    try {
      // Optional: Call API to invalidate cookie
      // await api.post('/auth/logout'); 
    } catch (error) {
       console.error(error);
    }
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100 font-sans">
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
           <svg className="w-8 h-8 text-unify-green" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
           </svg>
           <span className="text-2xl font-bold text-unify-green hidden sm:block">LuxeCommerce</span>
        </Link>
        
        {/* Category (Mock) */}
        <div className="hidden lg:block text-gray-500 text-sm hover:text-unify-green cursor-pointer">
            Kategori
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-2xl relative">
           <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <SearchIcon className="h-4 w-4 text-gray-400 group-focus-within:text-unify-green" />
              </div>
              <input
                type="text"
                placeholder="Cari di LuxeCommerce"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-unify-green focus:ring-1 focus:ring-unify-green transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-6">
           {/* Cart */}
           <div 
              className="relative group z-50"
              onMouseEnter={() => useCartStore.getState().fetchCart()} // Fetch on hover for freshness
           >
             <Link href="/cart" className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 hover:text-unify-green transition-colors relative block">
                <ShoppingCart className="h-6 w-6" />
                {useCartStore((state) => state.totalDiffItems) > 0 && (
                   <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                )}
             </Link>

             {/* Cart Popover */}
             <div className="absolute right-0 top-full pt-2 w-[400px] hidden group-hover:block z-50">
                <div className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                   <div className="p-4 flex items-center justify-between border-b border-gray-50 bg-white">
                      <h4 className="font-bold text-gray-700">Keranjang ({useCartStore((state) => state.totalDiffItems)})</h4>
                      <Link href="/cart" className="text-unify-green font-bold text-sm hover:underline">Lihat</Link>
                   </div>
                   
                   {useCartStore((state) => state.items).length === 0 ? (
                      // Empty State (Matches Image)
                      <div className="p-8 flex flex-col items-center justify-center text-center bg-white">
                          <img 
                            src="https://img.freepik.com/free-vector/shopping-basket-concept-illustration_114360-17255.jpg?w=740&t=st=1709123456~exp=1709124056~hmac=..." 
                            alt="Empty Cart" 
                            className="w-32 h-32 mb-4 opacity-80 grayscale-[0.2]"
                            onError={(e) => {
                              // Fallback if image fails
                              (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/11329/11329060.png"
                            }}
                          />
                          <h5 className="font-bold text-gray-800 text-lg mb-1">Wah, keranjang belanjamu kosong</h5>
                          <p className="text-gray-500 text-sm mb-6">Yuk, isi dengan barang-barang impianmu!</p>
                          <Link 
                            href="/" 
                            className="px-8 py-2.5 bg-unify-green text-white font-bold rounded-lg hover:bg-unify-dark-green transition-transform active:scale-95"
                          >
                             Mulai Belanja
                          </Link>
                      </div>
                   ) : (
                      // Filled State
                      <div className="max-h-[300px] overflow-y-auto bg-white">
                         {useCartStore((state) => state.items).slice(0, 3).map((item) => (
                            <div key={item.id} className="p-4 border-b border-gray-50 flex gap-3 hover:bg-gray-50 transition-colors">
                               <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                  <img src={item.product.image_url || '/placeholder.png'} alt={item.product.name} className="w-full h-full object-cover" />
                               </div>
                               <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800 truncate">{item.product.name}</p>
                                  <p className="text-xs text-gray-500">{item.quantity} Barang</p>
                               </div>
                               <div className="font-bold text-unify-orange text-sm">
                                  Rp{(item.product.price * item.quantity).toLocaleString('id-ID')}
                               </div>
                            </div>
                         ))}
                         {useCartStore((state) => state.items).length > 3 && (
                            <div className="p-3 text-center text-xs text-gray-400 bg-gray-50">
                               {useCartStore((state) => state.items).length - 3} barang lainnya...
                            </div>
                         )}
                      </div>
                   )}
                </div>
             </div>
           </div>

           <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

           {/* Auth Buttons / Dropdown */}
           {isAuthenticated ? (
             <div 
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
             >
                <Link href="/dashboard" className="hidden sm:flex items-center gap-2 py-2">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-unify-green font-bold border border-gray-200">
                         {user?.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="max-w-[100px] truncate text-sm font-medium text-gray-700 hover:text-unify-green transition-colors">
                        {user?.email?.split('@')[0]}
                      </span>
                   </div>
                </Link>

                {/* Dropdown Menu (Tokopedia Style) */}
                {isDropdownOpen && (
                   <div className="absolute right-0 top-full pt-2 w-80 z-50">
                      <div className="bg-white rounded-lg shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden">
                         {/* Header Profile */}
                         <div className="p-4 bg-white border-b border-gray-50 flex items-center gap-3 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-unify-green/10 flex items-center justify-center text-unify-green font-bold text-lg">
                               {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 overflow-hidden">
                               <h4 className="font-bold text-gray-900 truncate">{user?.email?.split('@')[0]}</h4>
                               <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <span className="bg-gray-100 px-1 rounded">Member Theurapeutic</span>
                               </div>
                            </div>
                         </div>
                         
                         {/* Wallet Section (Dummy) */}
                         <div className="p-4 grid grid-cols-2 gap-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded bg-blue-500"></div> {/* GoPay Icon */}
                                  <span className="text-sm font-bold text-gray-700">GoPay</span>
                               </div>
                               <span className="text-xs text-unify-green font-bold cursor-pointer hover:underline">Aktifkan</span>
                            </div>
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded bg-green-500"></div> {/* Saldo Icon */}
                                  <span className="text-sm font-bold text-gray-700">Saldo</span>
                               </div>
                               <span className="text-xs text-gray-500">Rp0</span>
                            </div>
                         </div>

                         {/* Menu List */}
                         <div className="py-2">
                            <ul className="text-sm text-gray-600">
                               <li>
                                  <Link href="/orders" className="block px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer">
                                     Pembelian
                                  </Link>
                               </li>
                               <li>
                                  <Link href="/wishlist" className="block px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer">
                                     Wishlist
                                  </Link>
                               </li>
                               <li>
                                  <div className="block px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer text-gray-400">
                                     Toko Favorit (Coming Soon)
                                  </div>
                               </li>
                               <li>
                                  <Link href="/user/settings/address" className="block px-4 py-2 hover:bg-gray-50 transition-colors cursor-pointer">
                                     Daftar Alamat
                                  </Link>
                               </li>
                            </ul>
                         </div>
                         
                         <div className="h-px bg-gray-100 my-1"></div>

                         <div className="p-2">
                            <button 
                               onClick={handleLogout}
                               className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors flex items-center justify-between"
                            >
                               Keluar
                               <LogOutIcon className="w-4 h-4 ml-2" />
                            </button>
                         </div>
                      </div>
                   </div>
                )}
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

function LogOutIcon(props: any) {
    return (
        <svg 
          {...props}
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
    )
}
