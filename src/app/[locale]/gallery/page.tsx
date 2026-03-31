import Navbar from "@/components/Navbar";
import GalleryPage from "@/components/GalleryPage";
import Footer from "@/components/Footer";

export default function Gallery() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <GalleryPage />
      </main>
      <Footer />
    </>
  );
}
