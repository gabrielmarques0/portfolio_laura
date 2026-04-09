"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { prints, formatPrice, type Print, type PrintSize } from "@/lib/prints";
import { useCart } from "@/context/CartContext";

type Category = "all" | Print["category"];

export default function PrintShop() {
  const t = useTranslations("shop");
  const locale = useLocale();
  const { addItem } = useCart();

  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selected, setSelected] = useState<Print | null>(null);
  const [selectedSize, setSelectedSize] = useState<PrintSize | null>(null);
  const [closing, setClosing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [qty, setQty] = useState(1);

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: t("categories.all") },
    { key: "landscape", label: t("categories.landscape") },
    { key: "portrait", label: t("categories.portrait") },
    { key: "urban", label: t("categories.urban") },
    { key: "nature", label: t("categories.nature") },
  ];

  const filtered =
    activeCategory === "all"
      ? prints
      : prints.filter((p) => p.category === activeCategory);

  function openModal(print: Print) {
    setSelected(print);
    setSelectedSize(print.sizes[1]);
    setImageLoaded(false);
    setQty(1);
  }

  function closeModal() {
    setClosing(true);
  }

  function onModalClosed() {
    setSelected(null);
    setSelectedSize(null);
    setClosing(false);
    setFullscreen(false);
  }

  function handleAddToCart() {
    if (!selected || !selectedSize) return;
    addItem(selected, selectedSize, qty);
    closeModal();
  }

  return (
    <>
      {/* Category filter */}
      <div className="flex flex-wrap gap-3 mb-10 border-b border-stone-200 pb-8">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveCategory(key)}
            className={`cursor-pointer text-xs tracking-widest uppercase px-5 py-2 transition-all duration-300 ${
              activeCategory === key
                ? "bg-stone-900 text-white"
                : "text-stone-500 hover:text-stone-900 border border-stone-200 hover:border-stone-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 lg:gap-5">
        {filtered.map((print) => (
          <div
            key={print.id}
            className="break-inside-avoid mb-4 lg:mb-5 group cursor-pointer relative overflow-hidden"
            onClick={() => openModal(print)}
          >
            <div className="relative overflow-hidden">
              <Image
                src={print.src}
                alt={print.alt}
                width={print.width}
                height={print.height}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/50 transition-all duration-500 flex flex-col justify-end p-5">
                <p className="font-[family-name:var(--font-playfair)] text-white italic text-lg opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  {print.title}
                </p>
                <p className="text-stone-300 text-xs tracking-widest uppercase mt-1 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75 translate-y-2 group-hover:translate-y-0">
                  {t("fromPrice", { price: formatPrice(print.sizes[0].price, locale) })}
                </p>
                <span className="mt-3 self-start text-xs tracking-widest uppercase bg-white/10 border border-white/30 text-white px-4 py-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 translate-y-2 group-hover:translate-y-0">
                  {t("viewPrint")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Print detail modal */}
      {selected && (
        <div
          className={`${closing ? "animate-modal-fade-out" : "animate-modal-fade"} fixed inset-0 z-50 bg-stone-950/90 flex items-center justify-center p-4 lg:p-12 overflow-y-auto`}
          onClick={closeModal}
        >
          {selected.width > selected.height ? (
            /* ── Landscape layout: image full-width on top, two-column details below ── */
            <div
              className={`${closing ? "animate-modal-panel-out" : "animate-modal-panel"} relative bg-stone-50 w-full max-w-2xl my-auto shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
              onAnimationEnd={closing ? onModalClosed : undefined}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 cursor-pointer text-stone-900 transition-colors bg-stone-50/90 rounded-full w-7 h-7 flex items-center justify-center"
                aria-label="Close"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="1" y1="1" x2="9" y2="9" />
                  <line x1="9" y1="1" x2="1" y2="9" />
                </svg>
              </button>

              {/* Image — natural aspect ratio, no cropping */}
              <div
                className="relative w-full bg-stone-100"
                style={{ aspectRatio: `${selected.width}/${selected.height}` }}
              >
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-stone-200 flex items-center justify-center">
                    <svg className="animate-spin-pause" width="26" height="26" viewBox="-4 -2.33 26 26" aria-hidden="true">
                      <circle cx="9" cy="10.67" r="12" fill="none" stroke="#a8a29e" strokeWidth="2" />
                      <polygon points="9,0 0,16 18,16" fill="#a8a29e" />
                    </svg>
                  </div>
                )}
                <Image
                  src={selected.src}
                  alt={selected.alt}
                  fill
                  className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  sizes="(max-width: 672px) 100vw, 672px"
                  onLoad={() => setImageLoaded(true)}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); setFullscreen(true); }}
                  className="absolute bottom-3 right-3 z-10 cursor-pointer text-stone-900 transition-colors bg-stone-50/90 rounded-full w-7 h-7 flex items-center justify-center"
                  aria-label="View fullscreen"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="1,3.5 1,1 3.5,1" />
                    <polyline points="6.5,1 9,1 9,3.5" />
                    <polyline points="1,6.5 1,9 3.5,9" />
                    <polyline points="6.5,9 9,9 9,6.5" />
                  </svg>
                </button>
              </div>

              {/* Details — two columns */}
              <div className="p-8 grid sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">
                    Laura Peixoto — {t(`categories.${selected.category}`)}
                  </p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-stone-900">
                    {selected.title}
                  </h2>
                  <p className="text-stone-500 text-sm leading-relaxed mt-3">
                    {selected.description}
                  </p>
                  <p className="text-xs text-stone-400 mt-2">
                    {t("edition", { count: selected.edition })}
                  </p>
                </div>

                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs tracking-widest uppercase text-stone-600 mb-3">
                      {t("selectSize")}
                    </p>
                    <div className="flex flex-col gap-2">
                      {selected.sizes.map((size) => (
                        <button
                          key={size.label}
                          onClick={() => setSelectedSize(size)}
                          className={`cursor-pointer flex justify-between items-center px-4 py-3 border text-sm transition-all duration-200 ${
                            selectedSize?.label === size.label
                              ? "border-stone-900 bg-stone-900 text-white"
                              : "border-stone-200 text-stone-700 hover:border-stone-400"
                          }`}
                        >
                          <span className="font-medium">{size.label} — {size.dimensions}</span>
                          <span className="font-[family-name:var(--font-playfair)] italic">
                            {formatPrice(size.price, locale)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100">
                    {selectedSize && (
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center border border-stone-200">
                          <button
                            onClick={() => setQty((q) => Math.max(1, q - 1))}
                            className="cursor-pointer w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm text-stone-900 select-none">
                            {qty}
                          </span>
                          <button
                            onClick={() => setQty((q) => q + 1)}
                            className="cursor-pointer w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-[family-name:var(--font-playfair)] text-2xl text-stone-900">
                          {formatPrice(selectedSize.price * qty, locale)}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={handleAddToCart}
                      disabled={!selectedSize}
                      className="w-full cursor-pointer bg-stone-900 text-white text-xs tracking-widest uppercase py-4 transition-all duration-300 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t("addToCart")}
                    </button>
                    <p className="text-xs text-stone-400 text-center mt-3">
                      {t("paymentNote")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── Portrait layout: image left, details right ── */
            <div
              className={`${closing ? "animate-modal-panel-out" : "animate-modal-panel"} relative bg-stone-50 w-full max-w-4xl my-auto flex flex-col lg:flex-row shadow-2xl`}
              onClick={(e) => e.stopPropagation()}
              onAnimationEnd={closing ? onModalClosed : undefined}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 cursor-pointer text-stone-900 transition-colors bg-stone-50/90 rounded-full w-7 h-7 flex items-center justify-center"
                aria-label="Close"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <line x1="1" y1="1" x2="9" y2="9" />
                  <line x1="9" y1="1" x2="1" y2="9" />
                </svg>
              </button>

              {/* Image */}
              <div className="lg:w-1/2 relative min-h-72 lg:min-h-[32rem] bg-stone-100">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-stone-200 flex items-center justify-center">
                    <svg className="animate-spin-pause" width="26" height="26" viewBox="-4 -2.33 26 26" aria-hidden="true">
                      <circle cx="9" cy="10.67" r="12" fill="none" stroke="#a8a29e" strokeWidth="2" />
                      <polygon points="9,0 0,16 18,16" fill="#a8a29e" />
                    </svg>
                  </div>
                )}
                <Image
                  src={selected.src}
                  alt={selected.alt}
                  fill
                  className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onLoad={() => setImageLoaded(true)}
                />
                <button
                  onClick={(e) => { e.stopPropagation(); setFullscreen(true); }}
                  className="absolute bottom-3 right-3 z-10 cursor-pointer text-stone-900 transition-colors bg-stone-50/90 rounded-full w-7 h-7 flex items-center justify-center"
                  aria-label="View fullscreen"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="1,3.5 1,1 3.5,1" />
                    <polyline points="6.5,1 9,1 9,3.5" />
                    <polyline points="1,6.5 1,9 3.5,9" />
                    <polyline points="6.5,9 9,9 9,6.5" />
                  </svg>
                </button>
              </div>

              {/* Details */}
              <div className="lg:w-1/2 p-8 lg:p-10 flex flex-col gap-6">
                <div>
                  <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">
                    Laura Peixoto — {t(`categories.${selected.category}`)}
                  </p>
                  <h2 className="font-[family-name:var(--font-playfair)] text-3xl text-stone-900">
                    {selected.title}
                  </h2>
                  <p className="text-stone-500 text-sm leading-relaxed mt-3">
                    {selected.description}
                  </p>
                  <p className="text-xs text-stone-400 mt-2">
                    {t("edition", { count: selected.edition })}
                  </p>
                </div>

                <div>
                  <p className="text-xs tracking-widest uppercase text-stone-600 mb-3">
                    {t("selectSize")}
                  </p>
                  <div className="flex flex-col gap-2">
                    {selected.sizes.map((size) => (
                      <button
                        key={size.label}
                        onClick={() => setSelectedSize(size)}
                        className={`cursor-pointer flex justify-between items-center px-4 py-3 border text-sm transition-all duration-200 ${
                          selectedSize?.label === size.label
                            ? "border-stone-900 bg-stone-900 text-white"
                            : "border-stone-200 text-stone-700 hover:border-stone-400"
                        }`}
                      >
                        <span className="font-medium">{size.label} — {size.dimensions}</span>
                        <span className="font-[family-name:var(--font-playfair)] italic">
                          {formatPrice(size.price, locale)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-stone-100">
                  {selectedSize && (
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center border border-stone-200">
                        <button
                          onClick={() => setQty((q) => Math.max(1, q - 1))}
                          className="cursor-pointer w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm text-stone-900 select-none">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty((q) => q + 1)}
                          className="cursor-pointer w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-[family-name:var(--font-playfair)] text-2xl text-stone-900">
                        {formatPrice(selectedSize.price * qty, locale)}
                      </p>
                    </div>
                  )}
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize}
                    className="w-full cursor-pointer bg-stone-900 text-white text-xs tracking-widest uppercase py-4 transition-all duration-300 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("addToCart")}
                  </button>
                  <p className="text-xs text-stone-400 text-center mt-3">
                    {t("paymentNote")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Fullscreen overlay */}
      {fullscreen && selected && (
        <div
          className="animate-modal-fade fixed inset-0 z-[70] bg-stone-950 flex items-center justify-center cursor-zoom-out"
          onClick={() => setFullscreen(false)}
        >
          <Image
            src={selected.src}
            alt={selected.alt}
            fill
            className="object-contain"
            sizes="100vw"
          />
          <button
            onClick={(e) => { e.stopPropagation(); setFullscreen(false); }}
            className="absolute top-4 right-4 z-10 cursor-pointer text-white transition-colors bg-stone-900/80 hover:bg-stone-900 rounded-full w-7 h-7 flex items-center justify-center"
            aria-label="Exit fullscreen"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <line x1="1" y1="1" x2="9" y2="9" />
              <line x1="9" y1="1" x2="1" y2="9" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
