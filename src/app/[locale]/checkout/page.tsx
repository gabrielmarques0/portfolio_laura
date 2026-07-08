"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/prints";

type ConfirmTarget = { printId: string; sizeLabel: string; title: string };

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const locale = useLocale();
  const { items, total, removeItem, updateQuantity } = useCart();
  const [confirmRemove, setConfirmRemove] = useState<ConfirmTarget | null>(null);

  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [updates, setUpdates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailInvalid = emailTouched && !EMAIL_RE.test(email);

  function handleDecrement(printId: string, sizeLabel: string, title: string, quantity: number) {
    if (quantity <= 1) {
      setConfirmRemove({ printId, sizeLabel, title });
    } else {
      updateQuantity(printId, sizeLabel, quantity - 1);
    }
  }

  function confirmAndRemove() {
    if (!confirmRemove) return;
    removeItem(confirmRemove.printId, confirmRemove.sizeLabel);
    setConfirmRemove(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailTouched(true);
    if (!EMAIL_RE.test(email) || items.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(({ print, size, quantity }) => ({
            printId: print.id,
            sizeLabel: size.label,
            title: print.title,
            dimensions: size.dimensions,
            price: size.price,
            quantity,
          })),
          email,
          receiveUpdates: updates,
          locale,
        }),
      });

      if (!res.ok) throw new Error("checkout failed");
      const { init_point } = await res.json();
      window.location.href = init_point;
    } catch {
      setError(t("error"));
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="pt-28 pb-24 px-6 min-h-screen flex flex-col items-center justify-center text-center">
          <p className="text-stone-400 text-sm mb-8">{t("emptyCart")}</p>
          <Link
            href="/"
            className="text-xs tracking-widest uppercase border border-stone-900 text-stone-900 px-8 py-3 hover:bg-stone-900 hover:text-white transition-all duration-300"
          >
            {t("backToShop")}
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 px-6 lg:px-12 max-w-4xl mx-auto min-h-screen">
        <div className="mb-10">
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">
            Laura Peixoto
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-stone-900">
            {t("title")}
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Order summary */}
          <div>
            <p className="text-xs tracking-widest uppercase text-stone-600 mb-6">
              {t("orderSummary")}
            </p>
            <ul className="flex flex-col">
              {items.map(({ print, size, quantity }) => (
                <li
                  key={`${print.id}-${size.label}`}
                  className="flex gap-4 items-start border-b border-stone-100 py-4 first:pt-0 last:border-b-0"
                >
                  <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden bg-stone-100">
                    <Image
                      src={print.src}
                      alt={print.alt}
                      fill
                      className="object-cover"
                      sizes="64px"
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
                          onClick={() => handleDecrement(print.id, size.label, print.title, quantity)}
                          className="cursor-pointer w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm text-stone-900 select-none">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(print.id, size.label, quantity + 1)}
                          className="cursor-pointer w-7 h-7 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-[family-name:var(--font-playfair)] italic text-stone-900 text-sm flex-shrink-0">
                        {formatPrice(size.price * quantity, locale)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center pt-6 border-t border-stone-200 mt-2">
              <span className="text-xs tracking-widest uppercase text-stone-600">
                {t("total")}
              </span>
              <span className="font-[family-name:var(--font-playfair)] text-2xl text-stone-900">
                {formatPrice(total, locale)}
              </span>
            </div>
          </div>

          {/* Email form */}
          <div>
            <p className="text-xs tracking-widest uppercase text-stone-600 mb-6">
              {t("contactTitle")}
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs tracking-widest uppercase text-stone-600 mb-2"
                >
                  {t("emailLabel")}
                </label>
                <input
                  id="email"
                  type="text"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  placeholder={t("emailPlaceholder")}
                  className={`w-full border bg-transparent px-4 py-3 text-sm text-stone-900 placeholder:text-stone-300 focus:outline-none transition-colors ${
                    emailInvalid
                      ? "border-red-400 focus:border-red-500"
                      : "border-stone-200 focus:border-stone-900"
                  }`}
                />
                {emailInvalid && (
                  <p className="text-xs text-red-500 mt-2" role="alert">
                    {t("emailError")}
                  </p>
                )}
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                  {t("emailNote")}
                </p>
              </div>

              <div className="flex items-start gap-3">
                <input
                  id="updates"
                  type="checkbox"
                  checked={updates}
                  onChange={(e) => setUpdates(e.target.checked)}
                  className="mt-0.5 accent-stone-900"
                />
                <label
                  htmlFor="updates"
                  className="text-xs text-stone-500 leading-relaxed cursor-pointer"
                >
                  {t("updatesLabel")}
                </label>
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || !EMAIL_RE.test(email)}
                className="w-full cursor-pointer bg-stone-900 text-white text-xs tracking-widest uppercase py-4 transition-all duration-300 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t("processing") : t("submit")}
              </button>

              <p className="text-xs text-stone-400 text-center">
                {t("paymentNote")}
              </p>
            </form>
          </div>
        </div>
      </main>
      <Footer />

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
              {tCart("confirmTitle")}
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed mb-6">
              {tCart("confirmMessage", { title: confirmRemove.title })}
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmAndRemove}
                className="cursor-pointer flex-1 bg-stone-900 text-white text-xs tracking-widest uppercase py-3 hover:bg-stone-700 transition-colors"
              >
                {tCart("confirmYes")}
              </button>
              <button
                onClick={() => setConfirmRemove(null)}
                className="cursor-pointer flex-1 border border-stone-200 text-stone-700 text-xs tracking-widest uppercase py-3 hover:border-stone-400 transition-colors"
              >
                {tCart("confirmNo")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
