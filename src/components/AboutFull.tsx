"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export default function AboutFull() {
  const t = useTranslations("about");

  const stats = [
    { value: "12+", label: t("stats.years") },
    { value: "200+", label: t("stats.projects") },
    { value: "18", label: t("stats.exhibitions") },
    { value: "8", label: t("stats.countries") },
  ];

  const services = [
    { title: t("services.editorial"), desc: t("services.editorial_desc") },
    { title: t("services.portrait"), desc: t("services.portrait_desc") },
    { title: t("services.events"), desc: t("services.events_desc") },
    { title: t("services.fine_art"), desc: t("services.fine_art_desc") },
  ];

  return (
    <>
      {/* Hero section */}
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542038374967-c07434a4c5ff?w=2000&q=80"
          alt="Behind the lens"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-stone-950/50" />
        <div className="absolute inset-0 flex items-end px-6 lg:px-12 pb-16 max-w-7xl mx-auto">
          <div>
            <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">
              {t("title")}
            </p>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl lg:text-6xl text-white">
              {t("subtitle")}
            </h1>
          </div>
        </div>
      </section>

      {/* Bio + photo */}
      <section className="py-24 lg:py-32 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-28 items-start">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=900&q=80"
              alt="Laura Peixoto"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 90vw, 45vw"
            />
          </div>

          <div className="flex flex-col justify-center">
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl lg:text-4xl text-stone-900 mb-8">
              Laura Peixoto
            </h2>
            <div className="space-y-6 text-stone-600 leading-relaxed">
              <p className="text-lg">{t("bio1")}</p>
              <p>{t("bio2")}</p>
              <p>{t("bio3")}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12 pt-10 border-t border-stone-200">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-[family-name:var(--font-playfair)] text-4xl text-stone-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-stone-400 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-stone-100 py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">
            {t("services.title")}
          </p>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl text-stone-900 mb-16">
            {t("services.title")}
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-stone-200">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-stone-100 p-8 hover:bg-white transition-colors duration-300"
              >
                <div className="w-8 h-px bg-stone-400 mb-6" />
                <h3 className="font-[family-name:var(--font-playfair)] text-xl text-stone-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-bleed image */}
      <div className="relative h-[60vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=2000&q=80"
          alt="Camera close-up"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-stone-950/30" />
      </div>
    </>
  );
}
