import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

export interface CartItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  selectedSize: string;
  selectedColor?: string;
  department: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: number, selectedSize: string) => void;
  updateQuantity: (id: number, selectedSize: string, delta: number) => void;
  clearCart: () => void;
  getTotalCount: () => number;
  getTotalPrice: () => number;
}

const safeStorage: StateStorage = {
  getItem: (name: string) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(name);
      }
    } catch (e) {
      // Return null safely if localStorage is restricted
    }
    return null;
  },
  setItem: (name: string, value: string) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(name, value);
      }
    } catch (e) {
      // Ignore quota or security errors gracefully
    }
  },
  removeItem: (name: string) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(name);
      }
    } catch (e) {}
  },
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      addItem: (item) => {
        const qty = item.quantity || 1;
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) => i.id === item.id && i.selectedSize === item.selectedSize
          );
          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += qty;
            return { items: updated, isOpen: true };
          }
          return { items: [...state.items, { ...item, quantity: qty }], isOpen: true };
        });
      },
      removeItem: (id, selectedSize) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.selectedSize === selectedSize)),
        }));
      },
      updateQuantity: (id, selectedSize, delta) => {
        set((state) => {
          const updated = state.items
            .map((i) => {
              if (i.id === id && i.selectedSize === selectedSize) {
                const newQty = i.quantity + delta;
                return newQty > 0 ? { ...i, quantity: newQty } : null;
              }
              return i;
            })
            .filter(Boolean) as CartItem[];
          return { items: updated };
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'j_viloria_cart',
      storage: createJSONStorage(() => safeStorage),
    }
  )
);
