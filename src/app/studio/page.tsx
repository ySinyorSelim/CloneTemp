import type { Metadata } from "next";
import { StudioLoader } from "@/components/social/studio-loader";

export const metadata: Metadata = {
  title: "FM Paylaşım Stüdyosu",
  description: "Football Manager paylaşımları için Instagram ve X şablonları",
};

export default function StudioPage() {
  return <StudioLoader />;
}
