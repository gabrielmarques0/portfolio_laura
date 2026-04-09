"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Print, PrintSize } from "@/lib/prints";
import { getPrintById } from "@/lib/prints";

export type CartItem = {
  print: Print;
  size: PrintSize;
  quantity: number;
};

type PersistedItem = { printId: string; sizeLabel: string; quantity: number };

const STORAGE_KEY = "laura-cart";

function loadFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const persisted: PersistedItem[] = JSON.parse(raw);
    const items: CartItem[] = [];
    for (const { printId, sizeLabel, quantity } of persisted) {
      const print = getPrintById(printId);
      if (!print) continue;
      const size = print.sizes.find((s) => s.label === sizeLabel);
      if (!size) continue;
      items.push({ print, size, quantity });
    }
    return items;
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  const persisted: PersistedItem[] = items.map(({ print, size, quantity }) => ({
    printId: print.id,
    sizeLabel: size.label,
    quantity,
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
}

type CartContextType = {
  items: CartItem[];
  addItem: (print: Print, size: PrintSize, quantity?: number) => void;
  removeItem: (printId: string, sizeLabel: string) => void;
  updateQuantity: (
    printId: string,
    sizeLabel: string,
    quantity: number,
  ) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Hydrate from localStorage once on mount
  useEffect(() => {
    setItems(loadFromStorage());
  }, []);

  function addItem(print: Print, size: PrintSize, quantity = 1) {
    setItems((prev) => {
      const idx = prev.findIndex(
        (item) => item.print.id === print.id && item.size.label === size.label,
      );
      const next =
        idx >= 0
          ? prev.map((item, i) =>
              i === idx
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            )
          : [...prev, { print, size, quantity }];
      saveToStorage(next);
      return next;
    });
    setIsOpen(true);
  }

  function removeItem(printId: string, sizeLabel: string) {
    setItems((prev) => {
      const next = prev.filter(
        (item) => !(item.print.id === printId && item.size.label === sizeLabel),
      );
      saveToStorage(next);
      return next;
    });
  }

  function updateQuantity(
    printId: string,
    sizeLabel: string,
    quantity: number,
  ) {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.print.id === printId && item.size.label === sizeLabel
          ? { ...item, quantity }
          : item,
      );
      saveToStorage(next);
      return next;
    });
  }

  function clearCart() {
    setItems([]);
    saveToStorage([]);
  }

  const total = items.reduce(
    (sum, item) => sum + item.size.price * item.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
