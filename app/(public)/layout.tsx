import NavbarWrapper from "@/components/layout/NavbarWrapper";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavbarWrapper />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}