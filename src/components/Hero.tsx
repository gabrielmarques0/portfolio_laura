"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { heroPhoto } from "@/lib/photos";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src={heroPhoto.src}
          alt={heroPhoto.alt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-20 lg:pb-28 w-full">
        <div className="max-w-xl">
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl lg:text-7xl text-white leading-tight mb-6">
            <span className="block">{t("tagline")}</span>
            <span className="block italic">{t("tagline2")}</span>
          </h1>
          <Link
            href="/gallery"
            className="inline-flex items-center gap-3 text-sm tracking-widest uppercase text-white border border-white/60 hover:border-white hover:bg-white hover:text-stone-900 px-8 py-3.5 transition-all duration-300"
          >
            {t("cta")}
            <span className="text-base">→</span>
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 lg:right-12 z-10 flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-white/40 animate-pulse" />
      </div>
    </section>
  );
}
