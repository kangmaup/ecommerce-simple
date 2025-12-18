import { create } from 'zustand';
import api from '@/lib/api';

interface WishlistStore {
  wishlistIds: Set<string>; // Efficient lookup
  isLoading: boolean;
  fetchWishlistIds: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlistIds: new Set(),
  isLoading: false,

  fetchWishlistIds: async () => {
    set({ isLoading: true });
    try {
      // We'll use the GetMyWishlist endpoint which returns full objects
      // Ideally we'd have a simpler endpoint just for IDs, but this works
      const res = await api.get('/wishlist');
      const items = res.data.data || [];
      const ids = new Set<string>(items.map((item: any) => item.product_id));
      set({ wishlistIds: ids, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
      set({ isLoading: false });
    }
  },

  toggleWishlist: async (productId: string) => {
    // Optimistic Update
    const currentIds = new Set(get().wishlistIds);
    const isAdded = !currentIds.has(productId);
    
    if (isAdded) {
        currentIds.add(productId);
    } else {
        currentIds.delete(productId);
    }
    set({ wishlistIds: currentIds });

    try {
      await api.post('/wishlist/toggle', { product_id: productId });
      // Background re-fetch to ensure consistency (optional)
      // get().fetchWishlistIds(); 
    } catch (error) {
      console.error("Failed to toggle wishlist", error);
      // Revert on error
      const revertIds = new Set(get().wishlistIds);
      if (isAdded) revertIds.delete(productId);
      else revertIds.add(productId);
      set({ wishlistIds: revertIds });
    }
  },

  isInWishlist: (productId: string) => {
    return get().wishlistIds.has(productId);
  }
}));
