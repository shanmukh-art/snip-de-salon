import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { useAuth } from './AuthContext';
import { api } from '../services/api';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  itemsCount: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user } = useAuth();
  const { success, error } = useToast();

  // Load from local storage initially
  useEffect(() => {
    const saved = localStorage.getItem('snip_guest_cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Save to local storage when guest
  useEffect(() => {
    if (!user) {
      localStorage.setItem('snip_guest_cart', JSON.stringify(items));
    }
  }, [items, user]);

  // If user logs in, sync or fetch user cart
  useEffect(() => {
    if (user && user.customerId) {
      api.getCart()
        .then((res) => {
          if (res.success && res.items) {
            setItems(res.items);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const addToCart = async (product: Product, quantity = 1) => {
    try {
      if (product.stock < quantity) {
        error(`Only ${product.stock} units available in stock`);
        return;
      }

      if (user && user.customerId) {
        await api.addToCart(product.id, quantity);
        const res = await api.getCart();
        if (res.success) setItems(res.items);
      } else {
        // Guest mode
        setItems((prev) => {
          const existing = prev.find((i) => i.productId === product.id);
          const effectivePrice = product.price * (1 - product.discountPercent / 100);

          if (existing) {
            const newQty = existing.quantity + quantity;
            return prev.map((i) =>
              i.productId === product.id
                ? { ...i, quantity: newQty, subtotal: effectivePrice * newQty }
                : i
            );
          }

          const newItem: CartItem = {
            id: `guest_${product.id}`,
            productId: product.id,
            quantity,
            product,
            subtotal: effectivePrice * quantity,
          };
          return [...prev, newItem];
        });
      }

      success(`Added "${product.name}" to your luxury shopping bag`);
      setIsCartOpen(true);
    } catch (err: any) {
      error(err.message || 'Failed to add item to bag');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      if (user && user.customerId) {
        await api.updateCartItem(itemId, quantity);
        const res = await api.getCart();
        if (res.success) setItems(res.items);
      } else {
        if (quantity <= 0) {
          setItems((prev) => prev.filter((i) => i.id !== itemId));
        } else {
          setItems((prev) =>
            prev.map((i) => {
              if (i.id === itemId) {
                const effPrice = i.product.price * (1 - i.product.discountPercent / 100);
                return { ...i, quantity, subtotal: effPrice * quantity };
              }
              return i;
            })
          );
        }
      }
    } catch (err: any) {
      error(err.message || 'Failed to update item quantity');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      if (user && user.customerId) {
        await api.removeCartItem(itemId);
        setItems((prev) => prev.filter((i) => i.id !== itemId));
      } else {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
      }
      success('Item removed from bag');
    } catch (err: any) {
      error(err.message || 'Failed to remove item');
    }
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('snip_guest_cart');
  };

  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemsCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
