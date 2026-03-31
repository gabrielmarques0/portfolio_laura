"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  return (
    <footer className="bg-stone-950 text-stone-400 py-12 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 pb-10 border-b border-stone-800">
          <Link
            href="/"
            className="font-[family-name:var(--font-playfair)] text-xl text-stone-200 hover:text-white transition-colors"
          >
            Laura Peixoto
          </Link>
          <nav className="flex flex-wrap gap-8">
            {[
              { href: "/gallery", label: nav("portfolio") },
              { href: "/about", label: nav("about") },
              { href: "/contact", label: nav("contact") },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs tracking-widest uppercase hover:text-stone-200 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4 text-xs">
          <p>
            © {new Date().getFullYear()} Laura Peixoto. {t("rights")}
          </p>
          <p className="italic text-stone-600">{t("madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}
