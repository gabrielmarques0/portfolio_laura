"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { photos } from "@/lib/photos";

export default function FeaturedGallery() {
  const t = useTranslations("portfolio");
  const featured = photos.slice(0, 6);

  return (
    <section className="py-24 lg:py-36 px-6 lg:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
        <div>
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">
            {t("title")}
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl lg:text-5xl text-stone-900">
            Selected Work
          </h2>
        </div>
        <Link
          href="/gallery"
          className="text-sm tracking-widest uppercase text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-2 group"
        >
          {t("categories.all")}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {/* Asymmetric grid */}
      <div className="grid grid-cols-12 grid-rows-2 gap-3 lg:gap-4 h-[70vh] min-h-[500px]">
        {/* Large left */}
        <div className="col-span-7 row-span-2 relative overflow-hidden group">
          <Image
            src={featured[0].src}
            alt={featured[0].alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 58vw"
          />
          <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-500" />
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="font-[family-name:var(--font-playfair)] text-white text-lg italic">
              {featured[0].title}
            </p>
          </div>
        </div>

        {/* Top right */}
        <div className="col-span-5 row-span-1 relative overflow-hidden group">
          <Image
            src={featured[1].src}
            alt={featured[1].alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 42vw"
          />
          <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-500" />
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="font-[family-name:var(--font-playfair)] text-white text-lg italic">
              {featured[1].title}
            </p>
          </div>
        </div>

        {/* Bottom right */}
        <div className="col-span-5 row-span-1 relative overflow-hidden group">
          <Image
            src={featured[2].src}
            alt={featured[2].alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 42vw"
          />
          <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-500" />
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <p className="font-[family-name:var(--font-playfair)] text-white text-lg italic">
              {featured[2].title}
            </p>
          </div>
        </div>
      </div>

      {/* Secondary row */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4 mt-3 lg:mt-4">
        {featured.slice(3).map((photo) => (
          <div key={photo.id} className="relative aspect-square overflow-hidden group">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors duration-500" />
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <p className="font-[family-name:var(--font-playfair)] text-white text-sm italic">
                {photo.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
