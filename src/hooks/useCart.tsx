'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, MenuItem } from '@/types';

interface CartContextType {
  cart: CartItem[];
  canteenId: string | null;
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  scheduledTime: string;
  setScheduledTime: (time: string) => void;
  orderNotes: string;
  setOrderNotes: (notes: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [canteenId, setCanteenId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<string>('now');
  const [orderNotes, setOrderNotes] = useState<string>('');

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('campusbite_cart');
      const savedCanteenId = localStorage.getItem('campusbite_canteenId');
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedCanteenId) setCanteenId(savedCanteenId);
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('campusbite_cart', JSON.stringify(cart));
      if (canteenId) {
        localStorage.setItem('campusbite_canteenId', canteenId);
      } else {
        localStorage.removeItem('campusbite_canteenId');
      }
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }, [cart, canteenId]);

  const addToCart = (item: MenuItem, quantity = 1) => {
    // If cart has items from another canteen, prompt/reset
    if (cart.length > 0 && canteenId && canteenId !== item.canteenId) {
      if (
        confirm(
          'Your cart has items from another canteen. Clear cart and add this item?'
        )
      ) {
        setCart([{ item, quantity }]);
        setCanteenId(item.canteenId);
      }
      return;
    }

    setCanteenId(item.canteenId);
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id
            ? { ...ci, quantity: ci.quantity + quantity }
            : ci
        );
      }
      return [...prev, { item, quantity }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const updated = prev.filter((ci) => ci.item.id !== itemId);
      if (updated.length === 0) setCanteenId(null);
      return updated;
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) =>
        ci.item.id === itemId ? { ...ci, quantity } : ci
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setCanteenId(null);
    setScheduledTime('now');
    setOrderNotes('');
    try {
      localStorage.removeItem('campusbite_cart');
      localStorage.removeItem('campusbite_canteenId');
    } catch (e) {}
  };

  const totalItems = cart.reduce((sum, ci) => sum + ci.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, ci) => sum + ci.item.price * ci.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        canteenId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        scheduledTime,
        setScheduledTime,
        orderNotes,
        setOrderNotes,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
