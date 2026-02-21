"use client";
import dynamic from "next/dynamic";

interface Props {
  lat: number;
  lng: number;
  address?: string;
  zoom?: number;
}

const OfficeMap = dynamic<Props>(
  () => import("@/components/contact/OfficeMap"),
  { ssr: false }
);

export default OfficeMap;