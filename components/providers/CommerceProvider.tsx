"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/store";
import { getCartCount, getCartTotal, productToCartItem, type CartItem } from "@/lib/cart";

type CommerceContextValue = {
  items: CartItem[];
  favoriteIds: string[];
  hydrated: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
};

const CommerceContext = createContext<CommerceContextValue | null>(null);
const CART_KEY = "soluna-cart";
const FAVORITES_KEY = "soluna-favorites";

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_KEY);
      const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      if (storedCart) setItems(JSON.parse(storedCart) as CartItem[]);
      if (storedFavorites) setFavoriteIds(JSON.parse(storedFavorites) as string[]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
  }, [favoriteIds, hydrated]);

  const value = useMemo<CommerceContextValue>(
    () => ({
      items,
      favoriteIds,
      hydrated,
      addToCart(product, quantity = 1) {
        setItems((current) => {
          const existing = current.find((item) => item.id === product.id);
          if (existing) {
            return current.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item));
          }
          return [...current, productToCartItem(product, quantity)];
        });
      },
      removeFromCart(productId) {
        setItems((current) => current.filter((item) => item.id !== productId));
      },
      increaseQuantity(productId) {
        setItems((current) => current.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item)));
      },
      decreaseQuantity(productId) {
        setItems((current) =>
          current
            .map((item) => (item.id === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item))
            .filter((item) => item.quantity > 0)
        );
      },
      clearCart() {
        setItems([]);
      },
      getCartTotal() {
        return getCartTotal(items);
      },
      getCartCount() {
        return getCartCount(items);
      },
      toggleFavorite(productId) {
        setFavoriteIds((current) => (current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]));
      },
      isFavorite(productId) {
        return favoriteIds.includes(productId);
      }
    }),
    [favoriteIds, hydrated, items]
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}

export function useCommerce() {
  const context = useContext(CommerceContext);
  if (!context) throw new Error("useCommerce must be used within CommerceProvider");
  return context;
}
