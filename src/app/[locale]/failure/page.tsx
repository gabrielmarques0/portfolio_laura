import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function FailureContent() {
  const t = useTranslations("order");
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-12 h-12 rounded-full border-2 border-stone-400 flex items-center justify-center mb-8">
        <svg
          className="w-5 h-5 text-stone-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <p className="text-xs tracking-widest uppercase text-stone-400 mb-4">
        Laura Peixoto
      </p>
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-stone-900 mb-4">
        {t("failureTitle")}
      </h1>
      <p className="text-stone-500 max-w-md leading-relaxed mb-10">
        {t("failureMessage")}
      </p>
      <Link
        href="/"
        className="text-xs tracking-widest uppercase border border-stone-900 text-stone-900 px-8 py-3 hover:bg-stone-900 hover:text-white transition-all duration-300"
      >
        {t("backToShop")}
      </Link>
    </div>
  );
}

export default function FailurePage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-24">
        <FailureContent />
      </main>
      <Footer />
    </>
  );
}
