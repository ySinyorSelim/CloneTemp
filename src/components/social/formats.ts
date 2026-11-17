import type { Format, FormatId, Theme } from "./types";

export const FORMATS: Format[] = [
  { id: "ig-portrait", platform: "Instagram", label: "Gönderi", ratio: "4:5", width: 1080, height: 1350, layout: "portrait" },
  { id: "ig-square", platform: "Instagram", label: "Kare", ratio: "1:1", width: 1080, height: 1080, layout: "square" },
  { id: "ig-story", platform: "Instagram", label: "Hikâye", ratio: "9:16", width: 1080, height: 1920, layout: "story" },
  { id: "x-landscape", platform: "X", label: "Gönderi", ratio: "16:9", width: 1600, height: 900, layout: "wide" },
];

/** Canvas size + safe-area padding per format. Static strings so Tailwind can see them. */
export const FRAME_CLASS: Record<FormatId, string> = {
  "ig-portrait": "w-[1080px] h-[1350px] p-[64px]",
  "ig-square": "w-[1080px] h-[1080px] p-[60px]",
  "ig-story": "w-[1080px] h-[1920px] px-[64px] pt-[240px] pb-[260px]",
  "x-landscape": "w-[1600px] h-[900px] px-[64px] py-[52px]",
};

export const THEMES: Theme[] = [
  { id: "night", label: "Gece", swatchClass: "bg-[#0b0f14] text-[#c8f53a]" },
  { id: "violet", label: "Mor", swatchClass: "bg-[#0e0b1c] text-[#9d8cff]" },
  { id: "ember", label: "Kor", swatchClass: "bg-[#130d0b] text-[#ff7a45]" },
  { id: "ice", label: "Buz", swatchClass: "bg-[#06131a] text-[#45d9f7]" },
  { id: "paper", label: "Açık", swatchClass: "bg-[#f3f1ea] text-[#17804f]" },
];

export function getFormat(id: FormatId): Format {
  return FORMATS.find((f) => f.id === id) ?? FORMATS[0];
}
