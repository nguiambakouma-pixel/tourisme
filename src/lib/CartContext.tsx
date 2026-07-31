import { createContext, useContext, useState, useEffect, useMemo, ReactNode, useCallback } from 'react';

export interface CartItem {
  key: string;
  type: 'experience' | 'accommodation';
  id: number;
  title: string;
  price: string;
  image: string;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  isInCart: (key: string) => boolean;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'stayeatsee_cart';

function parsePrice(price: string): number {
  return parseInt(price.replace(/\s/g, ''), 10) || 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => (prev.some((i) => i.key === item.key) ? prev : [...prev, item]));
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const isInCart = useCallback((key: string) => {
    return items.some((i) => i.key === key);
  }, [items]);

  const clear = useCallback(() => setItems([]), []);

  const total = useMemo(() => items.reduce((sum, item) => sum + parsePrice(item.price), 0), [items]);

  const value = useMemo<CartContextValue>(() => ({
    items, isOpen, addItem, removeItem, isInCart, clear,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen((o) => !o),
    total,
  }), [items, isOpen, addItem, removeItem, isInCart, clear, total]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart doit être utilisé dans un CartProvider');
  return ctx;
}