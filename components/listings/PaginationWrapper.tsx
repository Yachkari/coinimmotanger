"use client";
import dynamic from "next/dynamic";

interface Props {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
}

const Pagination = dynamic<Props>(
  () => import("@/components/listings/Pagination"),
  { ssr: false }
);

export default Pagination;