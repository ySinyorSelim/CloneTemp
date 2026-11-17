import type { BodyFont, Format, FormatId, HeadingFont, Theme } from "./types";

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
  { id: "night", label: "Gece", swatchClass: "bg-[#0b0f14] text-[#c8f53a]", palette: { colorBg: "#0b0f14", colorSurface: "#141b24", colorText: "#f2f5f7", colorAccent: "#c8f53a" } },
  { id: "violet", label: "Mor", swatchClass: "bg-[#0e0b1c] text-[#9d8cff]", palette: { colorBg: "#0e0b1c", colorSurface: "#18142c", colorText: "#f4f2ff", colorAccent: "#9d8cff" } },
  { id: "ember", label: "Kor", swatchClass: "bg-[#130d0b] text-[#ff7a45]", palette: { colorBg: "#130d0b", colorSurface: "#1f1613", colorText: "#fbf4f0", colorAccent: "#ff7a45" } },
  { id: "ice", label: "Buz", swatchClass: "bg-[#06131a] text-[#45d9f7]", palette: { colorBg: "#06131a", colorSurface: "#0e1f29", colorText: "#eef8fb", colorAccent: "#45d9f7" } },
  { id: "paper", label: "Açık", swatchClass: "bg-[#f3f1ea] text-[#17804f]", palette: { colorBg: "#f3f1ea", colorSurface: "#ffffff", colorText: "#14181c", colorAccent: "#17804f" } },
];

export function getFormat(id: FormatId): Format {
  return FORMATS.find((f) => f.id === id) ?? FORMATS[0];
}

export const HEADING_FONTS: { value: HeadingFont; label: string }[] = [
  { value: "archivo", label: "Archivo Geniş (varsayılan)" },
  { value: "sora", label: "Sora" },
  { value: "space-grotesk", label: "Space Grotesk" },
  { value: "montserrat", label: "Montserrat Black" },
  { value: "oswald", label: "Oswald (dar)" },
  { value: "bebas-neue", label: "Bebas Neue (dar)" },
  { value: "anton", label: "Anton (dar, kalın)" },
];

export const BODY_FONTS: { value: BodyFont; label: string }[] = [
  { value: "geist", label: "Geist (varsayılan)" },
  { value: "inter", label: "Inter" },
  { value: "manrope", label: "Manrope" },
  { value: "dm-sans", label: "DM Sans" },
];

export const DIM_CLASS = { light: "opacity-55", medium: "opacity-75", strong: "opacity-90" } as const;

/** Relative luminance (0 = black, 1 = white) of a #rrggbb colour. */
export function luminance(hex: string): number {
  const value = /^#?([0-9a-f]{6})$/i.exec(hex)?.[1];
  if (!value) return 0;
  const [r, g, b] = [0, 2, 4].map((i) => {
    const channel = Number.parseInt(value.slice(i, i + 2), 16) / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
