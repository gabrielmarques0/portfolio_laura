import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedGallery from "@/components/FeaturedGallery";
import AboutPreview from "@/components/AboutPreview";
import ContactPreview from "@/components/ContactPreview";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturedGallery />
        <AboutPreview />
        <ContactPreview />
      </main>
      <Footer />
    </>
  );
}
