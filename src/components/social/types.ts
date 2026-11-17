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
};

export type Brand = {
  name: string;
  handle: string;
  footnote: string;
  theme: ThemeId;
};

export type FieldValue = string | number | string[] | DataRecord[];
export type DataRecord = { [key: string]: FieldValue };

type BaseField = { key: string; label: string; hint?: string };

export type ItemField = BaseField & {
  type: "text" | "number";
  /** Width of the input inside a list row. */
  size?: "xs" | "sm" | "grow";
  min?: number;
  max?: number;
};

export type Field =
  | (BaseField & { type: "text" | "textarea" | "image" | "lines" })
  | (BaseField & { type: "number"; min?: number; max?: number; step?: number })
  | (BaseField & { type: "list"; itemLabel: string; fields: ItemField[] });

export type TemplateProps<T> = {
  data: T;
  format: Format;
  brand: Brand;
};

export type TemplateDefinition = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  fields: Field[];
  defaults: DataRecord;
  render: (props: TemplateProps<DataRecord>) => ReactNode;
};
