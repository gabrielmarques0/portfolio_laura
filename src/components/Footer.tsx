"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-stone-950 text-stone-400 py-10 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
        <p className="font-[family-name:var(--font-playfair)] text-stone-200 text-base">
          Laura Peixoto
        </p>
        <p>
          © {new Date().getFullYear()} Laura Peixoto. {t("rights")}
        </p>
        <p className="italic text-stone-600">{t("madeWith")}</p>
      </div>
    </footer>
  );
}
