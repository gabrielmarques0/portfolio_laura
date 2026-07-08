"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  useCallback,
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
const EMPTY_ITEMS: CartItem[] = [];

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

// The cart's source of truth lives outside React state so useSyncExternalStore
// can hand back a stable, empty snapshot during SSR and the initial hydration
// pass — matching what the server rendered — then switch to the real
// localStorage-backed value right after, with no setState-in-effect involved.
let cachedItems: CartItem[] | null = null;
const listeners = new Set<() => void>();

function getSnapshot(): CartItem[] {
  if (cachedItems === null) {
    cachedItems = loadFromStorage();
  }
  return cachedItems;
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_ITEMS;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function commit(next: CartItem[]) {
  cachedItems = next;
  saveToStorage(next);
  listeners.forEach((listener) => listener());
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
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((print: Print, size: PrintSize, quantity = 1) => {
    const current = getSnapshot();
    const idx = current.findIndex(
      (item) => item.print.id === print.id && item.size.label === size.label,
    );
    const next =
      idx >= 0
        ? current.map((item, i) =>
            i === idx
              ? { ...item, quantity: item.quantity + quantity }
              : item,
          )
        : [...current, { print, size, quantity }];
    commit(next);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((printId: string, sizeLabel: string) => {
    const current = getSnapshot();
    commit(
      current.filter(
        (item) => !(item.print.id === printId && item.size.label === sizeLabel),
      ),
    );
  }, []);

  const updateQuantity = useCallback(
    (printId: string, sizeLabel: string, quantity: number) => {
      const current = getSnapshot();
      commit(
        current.map((item) =>
          item.print.id === printId && item.size.label === sizeLabel
            ? { ...item, quantity }
            : item,
        ),
      );
    },
    [],
  );

  const clearCart = useCallback(() => {
    commit([]);
  }, []);

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
