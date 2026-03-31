"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactFull() {
  const t = useTranslations("contact");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate async send
    setTimeout(() => setStatus("done"), 1500);
  };

  const inputClass =
    "w-full bg-transparent border-b border-stone-300 focus:border-stone-900 outline-none py-3 text-stone-900 placeholder-stone-400 text-sm transition-colors duration-300";

  const info = [
    {
      label: "Location",
      value: t("info.location"),
      icon: "◎",
    },
    {
      label: "Email",
      value: t("info.email"),
      icon: "✉",
      href: `mailto:${t("info.email")}`,
    },
    {
      label: "Instagram",
      value: t("info.instagram"),
      icon: "◈",
    },
  ];

  return (
    <section className="py-16 lg:py-24 px-6 lg:px-12 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">
            {t("title")}
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl lg:text-6xl text-stone-900">
            {t("subtitle")}
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-20 lg:gap-32">
          {/* Form */}
          <div>
            {status === "done" ? (
              <div className="py-16 text-center">
                <div className="w-12 h-px bg-stone-400 mx-auto mb-8" />
                <p className="font-[family-name:var(--font-playfair)] text-2xl text-stone-700 italic">
                  {t("form.success")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid sm:grid-cols-2 gap-10">
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-stone-400 mb-3">
                      {t("form.name")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("form.namePlaceholder")}
                      className={inputClass}
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-stone-400 mb-3">
                      {t("form.email")}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={t("form.emailPlaceholder")}
                      className={inputClass}
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-3">
                    {t("form.subject")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("form.subjectPlaceholder")}
                    className={inputClass}
                    value={form.subject}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, subject: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs tracking-widest uppercase text-stone-400 mb-3">
                    {t("form.message")}
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder={t("form.messagePlaceholder")}
                    className={`${inputClass} resize-none`}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center gap-3 text-sm tracking-widest uppercase text-stone-900 border border-stone-900 hover:bg-stone-900 hover:text-stone-50 px-10 py-4 transition-all duration-300 disabled:opacity-50 group"
                >
                  {status === "sending" ? t("form.sending") : t("form.send")}
                  {status !== "sending" && (
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            <div className="space-y-10">
              {info.map((item) => (
                <div key={item.label}>
                  <p className="text-xs tracking-widest uppercase text-stone-400 mb-2">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-lg text-stone-700 hover:text-stone-900 transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-lg text-stone-700">{item.value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-16 lg:mt-0 pt-12 border-t border-stone-200">
              <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">
                Availability
              </p>
              <p className="font-[family-name:var(--font-playfair)] text-2xl text-stone-700 italic">
                {t("info.availability")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
