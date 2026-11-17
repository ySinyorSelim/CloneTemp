import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type FormatId = "ig-portrait" | "ig-square" | "ig-story" | "x-landscape";

/** Layout family a template uses to arrange itself for a given canvas. */
export type Layout = "portrait" | "square" | "story" | "wide";

export type Format = {
  id: FormatId;
  platform: "Instagram" | "X";
  label: string;
  ratio: string;
  width: number;
  height: number;
  layout: Layout;
};

export type ThemeId = "night" | "violet" | "ember" | "ice" | "paper";

export type Theme = {
  id: ThemeId;
  label: string;
  /** Static Tailwind classes for the swatch in the studio UI. */
  swatchClass: string;
  /** Same colours as the CSS block, used as the starting point for a custom palette. */
  palette: Palette;
};

export type HeadingFont = "archivo" | "sora" | "space-grotesk" | "montserrat" | "oswald" | "bebas-neue" | "anton";
export type BodyFont = "geist" | "inter" | "manrope" | "dm-sans";

export type Palette = { colorBg: string; colorSurface: string; colorText: string; colorAccent: string };

export type Brand = Palette & {
  name: string;
  handle: string;
  footnote: string;
  /** Channel address printed in the footer of every card, e.g. "youtube.com/kanal". */
  link: string;
  /** Uploaded logo shown in the header instead of the default mark. */
  logo: string;
  theme: ThemeId | "custom";
  headingFont: HeadingFont;
  bodyFont: BodyFont;
  /** Optional photo behind the whole card, and how strongly it is dimmed. */
  background: string;
  backgroundDim: "light" | "medium" | "strong";
};

export type FieldValue = string | number | string[] | DataRecord[];
export type DataRecord = { [key: string]: FieldValue };

type BaseField = { key: string; label: string; hint?: string };

export type ItemField = BaseField & {
  type: "text" | "number" | "country" | "image";
  /** Width of the input inside a list row. */
  size?: "xs" | "sm" | "md" | "grow";
  min?: number;
  max?: number;
};

export type Field =
  | (BaseField & { type: "text" | "textarea" | "image" | "lines" | "country" | "color" })
  | (BaseField & { type: "select"; options: { value: string; label: string }[] })
  | (BaseField & { type: "number"; min?: number; max?: number; step?: number })
  | (BaseField & { type: "list"; itemLabel: string; fields: ItemField[] });

export type TemplateProps<T> = {
  data: T;
  format: Format;
  brand: Brand;
};

export type Category = "Oyuncu" | "Kadro ve Taktik" | "Maç ve Lig" | "İçerik";

export type TemplateDefinition = {
  id: string;
  name: string;
  category: Category;
  description: string;
  icon: LucideIcon;
  fields: Field[];
  defaults: DataRecord;
  render: (props: TemplateProps<DataRecord>) => ReactNode;
};
