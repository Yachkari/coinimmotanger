"use client";
import dynamic from "next/dynamic";

const ListingForm = dynamic(
  () => import("@/components/admin/ListingForm"),
  { ssr: false }
);

export default ListingForm;