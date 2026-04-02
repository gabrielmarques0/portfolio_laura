import { useTranslations } from "next-intl";
import Navbar from "@/components/Navbar";
import PrintShop from "@/components/PrintShop";
import Footer from "@/components/Footer";

function ShopHeader() {
  const t = useTranslations("shop");
  return (
    <div className="mb-10">
      <p className="text-xs tracking-widest uppercase text-stone-400 mb-3">
        Laura Peixoto
      </p>
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl lg:text-5xl text-stone-900 mb-4">
        {t("title")}
      </h1>
      <p className="text-stone-500 max-w-lg leading-relaxed text-sm">
        {t("subtitle")}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 px-6 lg:px-12 max-w-7xl mx-auto min-h-screen">
        <ShopHeader />
        <PrintShop />
      </main>
      <Footer />
    </>
  );
}
