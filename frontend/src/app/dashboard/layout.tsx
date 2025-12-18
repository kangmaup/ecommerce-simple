'use client';

import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  LogOut, 
  User, 
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Basic protection
    const isAuthenticated = useAuthStore.getState().isAuthenticated;
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Logout failed", err);
    }
    logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/dashboard/orders', icon: Package },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Categories', href: '/dashboard/categories', icon: Tags },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex font-sans text-slate-800">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-100 fixed inset-y-0 z-50 transition-all">
        <div className="flex items-center justify-start h-20 px-8 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 rounded-lg p-1.5">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              LuxeCommerce
            </span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-1.5">
          {navItems.map((item) => {
             const isActive = pathname === item.href;
             return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden',
                  isActive 
                    ? 'bg-indigo-50/80 text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900'
                )}
              >
                <div className="flex items-center">
                  <item.icon className={clsx(
                    "mr-3 h-5 w-5 flex-shrink-0 transition-colors",
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                  )} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-indigo-400" />}
              </Link>
             );
          })}
        </nav>

        <div className="p-4 m-4 bg-gray-50 rounded-2xl border border-gray-100">
           <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                <User size={20} />
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">Administrator</p>
                <p className="text-xs text-gray-500 truncate">admin@luxe.com</p>
              </div>
           </div>
           <button
             onClick={handleLogout}
             className="flex w-full items-center justify-center px-4 py-2 text-xs font-medium text-red-600 bg-white border border-red-100 rounded-lg hover:bg-red-50 transition-colors shadow-sm"
           >
             <LogOut className="mr-2 h-3.5 w-3.5" />
             Sign out
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sticky top-0 z-40">
           <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Luxe</span>
           <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-gray-100 text-gray-600">
             {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
           </button>
        </div>
        
        {/* Mobile Sidebar */}
        {isSidebarOpen && (
           <div className="md:hidden fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        )}
        
        <div className={clsx(
           "md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out",
           isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {/* Mobile Sidebar Content same as desktop roughly */}
           <div className="flex items-center justify-center h-20 border-b border-gray-100">
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">LuxeCommerce</h1>
           </div>
           <nav className="p-4 space-y-2">
             {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={clsx(
                    'flex items-center px-4 py-3 text-sm font-medium rounded-xl',
                    pathname === item.href
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
             ))}
           </nav>
        </div>

        <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
