"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLocale = () => {
    const next = locale === "en" ? "pt-BR" : "en";
    router.replace(pathname, { locale: next });
  };

  const navLinks = [
    { href: "/gallery", label: t("portfolio") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  const overImage = !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-stone-50 shadow-sm"
          : "bg-gradient-to-b from-stone-950/50 to-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`font-[family-name:var(--font-playfair)] text-xl tracking-wide transition-colors ${
            overImage
              ? "text-white hover:text-stone-200"
              : "text-stone-900 hover:text-stone-600"
          }`}
        >
          Laura Peixoto
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm tracking-widest uppercase transition-colors relative group ${
                overImage
                  ? "text-stone-200 hover:text-white"
                  : "text-stone-700 hover:text-stone-900"
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-0.5 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${
                  overImage ? "bg-white" : "bg-stone-900"
                }`}
              />
            </Link>
          ))}
          <button
            onClick={switchLocale}
            className={`text-sm tracking-widest uppercase transition-colors border px-3 py-1 rounded-full ${
              overImage
                ? "text-stone-300 hover:text-white border-stone-400 hover:border-white"
                : "text-stone-500 hover:text-stone-800 border-stone-300 hover:border-stone-600"
            }`}
          >
            {t("switchLang")}
          </button>
        </div>

        {/* Mobile: lang + burger */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={switchLocale}
            className={`text-xs tracking-widest uppercase border px-2.5 py-1 rounded-full transition-colors ${
              overImage
                ? "text-stone-300 border-stone-400"
                : "text-stone-600 border-stone-400"
            }`}
          >
            {t("switchLang")}
          </button>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-1"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-px transition-all duration-300 ${overImage ? "bg-white" : "bg-stone-800"} ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-px transition-all duration-300 ${overImage ? "bg-white" : "bg-stone-800"} ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-px transition-all duration-300 ${overImage ? "bg-white" : "bg-stone-800"} ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-stone-50/98 backdrop-blur-sm ${
          menuOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-8 pt-4 flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm tracking-widest uppercase text-stone-600 hover:text-stone-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
