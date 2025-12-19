import { create } from 'zustand';
import api from '@/lib/api';
import { useAuthStore } from './authStore';

interface CartItem {
  id: string;
  product_id: string;
  product: {
    name: string;
    image_url: string;
    price: number;
    slug: string;
  };
  quantity: number;
  total_price: number;
}

interface CartState {
  items: CartItem[];
  totalDiffItems: number; // For badge count
  isLoading: boolean;
  fetchCart: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalDiffItems: 0,
  isLoading: false,
  fetchCart: async () => {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;

    set({ isLoading: true });
    try {
      const res = await api.get('/cart');
      const items = res.data.items || [];
      set({ 
        items, 
        totalDiffItems: items.length,
        isLoading: false 
      });
    } catch (error) {
      console.error("Failed to fetch cart", error);
      set({ items: [], totalDiffItems: 0, isLoading: false });
    }
  },
}));
