import Navbar from "@/components/Navbar";
import AboutFull from "@/components/AboutFull";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <AboutFull />
      </main>
      <Footer />
    </>
  );
}
