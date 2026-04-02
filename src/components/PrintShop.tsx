"use client";

import { useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { prints, formatPrice, type Print, type PrintSize } from "@/lib/prints";

type Category = "all" | Print["category"];

export default function PrintShop() {
  const t = useTranslations("shop");
  const locale = useLocale();

  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selected, setSelected] = useState<Print | null>(null);
  const [selectedSize, setSelectedSize] = useState<PrintSize | null>(null);
  const [loading, setLoading] = useState(false);

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
    setSelectedSize(print.sizes[1]); // default to medium
  }

  function closeModal() {
    setSelected(null);
    setSelectedSize(null);
  }

  async function handleBuy() {
    if (!selected || !selectedSize) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          printId: selected.id,
          sizeLabel: selectedSize.label,
          title: selected.title,
          dimensions: selectedSize.dimensions,
          price: selectedSize.price,
          locale,
        }),
      });
      if (!res.ok) throw new Error("checkout failed");
      const { init_point } = await res.json();
      window.location.href = init_point;
    } catch {
      alert(t("buyError"));
      setLoading(false);
    }
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
                  {t("fromPrice", {
                    price: formatPrice(print.sizes[0].price, locale),
                  })}
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
          className="fixed inset-0 z-50 bg-stone-950/90 flex items-center justify-center p-4 lg:p-12 overflow-y-auto"
          onClick={closeModal}
        >
          <div
            className="relative bg-stone-50 w-full max-w-4xl my-auto flex flex-col lg:flex-row shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 cursor-pointer text-stone-400 hover:text-stone-900 text-2xl leading-none transition-colors"
              aria-label="Close"
            >
              ×
            </button>

            {/* Image */}
            <div className="lg:w-1/2 relative min-h-72 lg:min-h-[32rem] bg-stone-100">
              <Image
                src={selected.src}
                alt={selected.alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
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

              {/* Size selector */}
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
                      <span className="font-medium">
                        {size.label} — {size.dimensions}
                      </span>
                      <span className="font-[family-name:var(--font-playfair)] italic">
                        {formatPrice(size.price, locale)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price + CTA */}
              <div className="mt-auto pt-4 border-t border-stone-100">
                {selectedSize && (
                  <p className="font-[family-name:var(--font-playfair)] text-2xl text-stone-900 mb-4">
                    {formatPrice(selectedSize.price, locale)}
                  </p>
                )}
                <button
                  onClick={handleBuy}
                  disabled={!selectedSize || loading}
                  className="w-full cursor-pointer bg-stone-900 text-white text-xs tracking-widest uppercase py-4 transition-all duration-300 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t("processing") : t("buy")}
                </button>
                <p className="text-xs text-stone-400 text-center mt-3">
                  {t("paymentNote")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
