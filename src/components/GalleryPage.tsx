"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { photos, type Photo } from "@/lib/photos";

type Category = "all" | Photo["category"];

export default function GalleryPage() {
  const t = useTranslations("portfolio");
  const [active, setActive] = useState<Category>("all");
  const [lightbox, setLightbox] = useState<Photo | null>(null);

  const categories: { key: Category; label: string }[] = [
    { key: "all", label: t("categories.all") },
    { key: "landscape", label: t("categories.landscape") },
    { key: "portrait", label: t("categories.portrait") },
    { key: "urban", label: t("categories.urban") },
    { key: "nature", label: t("categories.nature") },
  ];

  const filtered =
    active === "all" ? photos : photos.filter((p) => p.category === active);

  return (
    <section className="py-16 lg:py-24 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">
          Laura Peixoto
        </p>
        <h1 className="font-[family-name:var(--font-playfair)] text-5xl lg:text-6xl text-stone-900 mb-10">
          {t("title")}
        </h1>
        <p className="text-stone-500 max-w-xl leading-relaxed">
          {t("subtitle")}
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-3 mb-14 border-b border-stone-200 pb-8">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`text-xs tracking-widest uppercase px-5 py-2 transition-all duration-300 ${
              active === key
                ? "bg-stone-900 text-white"
                : "text-stone-500 hover:text-stone-900 border border-stone-200 hover:border-stone-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Masonry-style grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 lg:gap-5">
        {filtered.map((photo) => (
          <div
            key={photo.id}
            className="break-inside-avoid mb-4 lg:mb-5 overflow-hidden group cursor-pointer relative"
            onClick={() => setLightbox(photo)}
          >
            <div className="relative overflow-hidden">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/30 transition-all duration-500 flex items-end p-4">
                <p className="font-[family-name:var(--font-playfair)] text-white italic text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-2 group-hover:translate-y-0">
                  {photo.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/95 flex items-center justify-center p-4 lg:p-12"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-8 text-stone-400 hover:text-white text-3xl transition-colors"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.src}
              alt={lightbox.alt}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-[family-name:var(--font-playfair)] text-stone-400 italic text-lg">
            {lightbox.title}
          </p>
        </div>
      )}
    </section>
  );
}
