import Navbar from "@/components/Navbar";
import ContactFull from "@/components/ContactFull";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <ContactFull />
      </main>
      <Footer />
    </>
  );
}
