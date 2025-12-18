'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image_url: string;
    // Add other fields if available like rating, location, etc.
    // For now we mock rating/location as they aren't in DB yet
  };
}

import { useWishlistStore } from '@/store/wishlistStore';
import { Heart } from 'lucide-react';

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link href={`/product/${product.slug || product.id}`} className="block h-full relative group/card"> 
      {/* Fallback to ID if slug missing */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
        <div className="aspect-square bg-gray-50 relative overflow-hidden">
           {product.image_url ? (
             <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" />
           ) : (
             <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                <span className="text-xs">No Image</span>
             </div>
           )}
           
           {/* Wishlist Button */}
           <button 
             onClick={handleToggleWishlist}
             className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors z-10"
           >
             <Heart 
               className={`w-5 h-5 transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'}`} 
             />
           </button>
        </div>
        
        <div className="p-3 flex-1 flex flex-col">
           <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover/card:text-unify-green transition-colors mb-1">
              {product.name}
           </h3>
           
           <div className="mt-auto">
             <div className="text-base font-bold text-gray-900">Rp {product.price.toLocaleString('id-ID')}</div>
             
             {/* Mock Discount/Rating for visual fidelity */}
             <div className="flex items-center gap-1 mt-1">
                 <div className="px-1 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded">10%</div>
                 <span className="text-xs text-gray-400 line-through">Rp {(product.price * 1.1).toLocaleString('id-ID', { maximumFractionDigits: 0 })}</span>
             </div>
             
             <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                 <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                 <span>4.8</span>
                 <span>|</span>
                 <span>Jakarta</span>
             </div>
           </div>
        </div>
      </div>
    </Link>
  );
}
