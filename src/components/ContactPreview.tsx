"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function ContactPreview() {
  const t = useTranslations("contact");

  return (
    <section className="py-24 lg:py-36 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs tracking-widest uppercase text-stone-400 mb-4">
          {t("title")}
        </p>
        <h2 className="font-[family-name:var(--font-playfair)] text-4xl lg:text-6xl text-stone-900 mb-8 leading-tight">
          {t("subtitle")}
        </h2>
        <div className="w-12 h-px bg-stone-300 mx-auto mb-10" />
        <p className="text-stone-500 mb-10">{t("info.availability")}</p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-3 text-sm tracking-widest uppercase text-stone-900 border border-stone-900 hover:bg-stone-900 hover:text-stone-50 px-10 py-4 transition-all duration-300 group"
        >
          {t("title")}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
