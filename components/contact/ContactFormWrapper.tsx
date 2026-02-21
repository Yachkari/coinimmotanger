"use client";
import dynamic from "next/dynamic";

const ContactFormStandalone = dynamic(
  () => import("@/components/contact/ContactFormStandalone"),
  { ssr: false }
);

export default ContactFormStandalone;