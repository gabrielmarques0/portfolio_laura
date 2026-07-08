"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/prints";

type ConfirmTarget = { printId: string; sizeLabel: string; title: string };

export default function CartDrawer() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    closeCart,
    total,
  } = useCart();
  const [removing, setRemoving] = useState<Set<string>>(new Set());
  const [confirmRemove, setConfirmRemove] = useState<ConfirmTarget | null>(
    null,
  );

  function handleCheckout() {
    closeCart();
    router.push("/checkout");
  }

  function handleRemove(printId: string, sizeLabel: string) {
    setRemoving((prev) => new Set(prev).add(`${printId}-${sizeLabel}`));
  }

  function onRemoveAnimationEnd(printId: string, sizeLabel: string) {
    removeItem(printId, sizeLabel);
    setRemoving((prev) => {
      const next = new Set(prev);
      next.delete(`${printId}-${sizeLabel}`);
      return next;
    });
  }

  function handleDecrement(
    printId: string,
    sizeLabel: string,
    title: string,
    quantity: number,
  ) {
    if (quantity <= 1) {
      setConfirmRemove({ printId, sizeLabel, title });
    } else {
      updateQuantity(printId, sizeLabel, quantity - 1);
    }
  }

  function confirmAndRemove() {
    if (!confirmRemove) return;
    handleRemove(confirmRemove.printId, confirmRemove.sizeLabel);
    setConfirmRemove(null);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[59] bg-stone-950/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-label={t("title")}
        aria-modal="true"
        className={`fixed right-0 top-0 bottom-0 z-[60] w-full max-w-md bg-stone-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-stone-200">
          <h2 className="font-[family-name:var(--font-playfair)] text-xl text-stone-900">
            {t("title")}
          </h2>
          <button
            onClick={closeCart}
            className="cursor-pointer text-stone-400 hover:text-stone-900 text-2xl leading-none transition-colors"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="text-stone-400 text-sm text-center mt-12">
              {t("empty")}
            </p>
          ) : (
            <ul className="flex flex-col">
              {items.map(({ print, size, quantity }) => {
                const key = `${print.id}-${size.label}`;
                const isRemoving = removing.has(key);
                return (
                  <li
                    key={key}
                    className={`flex gap-4 items-start py-4 border-b border-stone-100 last:border-b-0 ${
                      isRemoving ? "animate-item-remove" : ""
                    }`}
                    onAnimationEnd={
                      isRemoving
                        ? () => onRemoveAnimationEnd(print.id, size.label)
                        : undefined
                    }
                  >
                    <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-stone-100">
                      <Image
                        src={print.src}
                        alt={print.alt}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-[family-name:var(--font-playfair)] text-stone-900 text-sm">
                        {print.title}
                      </p>
                      <p className="text-stone-400 text-xs mt-0.5">
                        {size.label} — {size.dimensions}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-stone-200">
                          <button
                            onClick={() =>
                              handleDecrement(
                                print.id,
                                size.label,
                                print.title,
                                quantity,
                              )
                            }
                            disabled={isRemoving}
                            className="cursor-pointer w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors disabled:pointer-events-none"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-7 text-center text-sm text-stone-900 select-none">
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(print.id, size.label, quantity + 1)
                            }
                            disabled={isRemoving}
                            className="cursor-pointer w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors disabled:pointer-events-none"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-[family-name:var(--font-playfair)] italic text-stone-700 text-sm">
                          {formatPrice(size.price * quantity, locale)}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-6 border-t border-stone-200 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs tracking-widest uppercase text-stone-500">
              {t("total")}
            </span>
            <span className="font-[family-name:var(--font-playfair)] text-xl text-stone-900">
              {formatPrice(total, locale)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="cursor-pointer w-full bg-stone-900 text-white text-xs tracking-widest uppercase py-4 transition-all duration-300 hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("checkout")}
          </button>
          <button
            onClick={clearCart}
            disabled={items.length === 0}
            className={`cursor-pointer text-xs tracking-widest uppercase text-stone-400 hover:text-stone-700 transition-colors text-center ${
              items.length === 0 ? "invisible" : ""
            }`}
          >
            {t("clear")}
          </button>
        </div>
      </div>

      {/* Confirm remove modal */}
      {confirmRemove && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-stone-950/40"
            onClick={() => setConfirmRemove(null)}
            aria-hidden="true"
          />
          <div className="relative bg-stone-50 p-8 w-full max-w-xs shadow-xl">
            <h3 className="font-[family-name:var(--font-playfair)] text-lg text-stone-900 mb-2">
              {t("confirmTitle")}
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed mb-6">
              {t("confirmMessage", { title: confirmRemove.title })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmAndRemove}
                className="cursor-pointer flex-1 bg-stone-900 text-white text-xs tracking-widest uppercase py-3 hover:bg-stone-700 transition-colors"
              >
                {t("confirmYes")}
              </button>
              <button
                onClick={() => setConfirmRemove(null)}
                className="cursor-pointer flex-1 border border-stone-200 text-stone-700 text-xs tracking-widest uppercase py-3 hover:border-stone-400 transition-colors"
              >
                {t("confirmNo")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
