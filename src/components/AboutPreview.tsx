"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function AboutPreview() {
  const t = useTranslations("about");

  const stats = [
    { value: "12+", label: t("stats.years") },
    { value: "200+", label: t("stats.projects") },
    { value: "18", label: t("stats.exhibitions") },
    { value: "8", label: t("stats.countries") },
  ];

  return (
    <section className="bg-stone-900 text-stone-50 py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Image */}
        <div className="relative aspect-[3/4] max-w-sm mx-auto lg:max-w-none overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=800&q=80"
            alt="Laura Peixoto portrait"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 80vw, 45vw"
          />
          <div className="absolute inset-0 border border-stone-600/30" />
        </div>

        {/* Text */}
        <div>
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-4">
            {t("title")}
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl lg:text-5xl mb-8 leading-tight">
            {t("subtitle")}
          </h2>
          <p className="text-stone-300 leading-relaxed mb-6 text-lg">
            {t("bio1")}
          </p>
          <p className="text-stone-400 leading-relaxed mb-12">
            {t("bio2")}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12 border-t border-stone-800 pt-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-[family-name:var(--font-playfair)] text-3xl text-white mb-1">
                  {stat.value}
                </p>
                <p className="text-xs text-stone-500 uppercase tracking-wider leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Link
            href="/about"
            className="inline-flex items-center gap-3 text-sm tracking-widest uppercase text-stone-300 border border-stone-600 hover:border-stone-300 hover:text-white px-8 py-3.5 transition-all duration-300 group"
          >
            {t("title")}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
