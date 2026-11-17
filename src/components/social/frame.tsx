/* eslint-disable @next/next/no-img-element -- cards are rasterised client-side; next/image would break export */
import { MonitorUp, Play, Star, User } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { UploadTarget, useImageEditor } from "./edit-context";
import { DIM_CLASS, FRAME_CLASS, luminance } from "./formats";
import type { Brand, Format, Layout } from "./types";

type CardFrameProps = {
  format: Format;
  brand: Brand;
  tag: string;
  children: ReactNode;
};

/** Inline variables for a user-defined palette; preset themes live in globals.css. */
function customPalette(brand: Brand): CSSProperties | undefined {
  if (brand.theme !== "custom") return undefined;
  const lightBackground = luminance(brand.colorBg) > 0.4;
  return {
    "--fm-bg": brand.colorBg,
    "--fm-surface": brand.colorSurface,
    "--fm-text": brand.colorText,
    "--fm-accent": brand.colorAccent,
    "--fm-on-accent": luminance(brand.colorAccent) > 0.35 ? "#0b0f14" : "#ffffff",
    ...(lightBackground ? { "--fm-good": "#17804f", "--fm-warn": "#c77a00", "--fm-bad": "#d43d3d" } : {}),
  } as CSSProperties;
}

/** Shared shell of every card: background, brand header, footer. */
export function CardFrame({ format, brand, tag, children }: CardFrameProps) {
  return (
    <div
      lang="tr"
      data-fm-theme={brand.theme}
      data-fm-heading={brand.headingFont}
      data-fm-body={brand.bodyFont}
      style={customPalette(brand)}
      className={cn(
        "relative flex shrink-0 flex-col overflow-hidden bg-fm-bg font-sans text-fm-text antialiased",
        FRAME_CLASS[format.id],
      )}
    >
      {brand.background ? (
        <>
          <img src={brand.background} alt="" className="absolute inset-0 size-full object-cover" />
          <div className={cn("absolute inset-0 bg-fm-bg", DIM_CLASS[brand.backgroundDim] ?? DIM_CLASS.medium)} />
        </>
      ) : null}
      <div className="fm-card-glow pointer-events-none absolute inset-0" />
      <div className="fm-card-grid pointer-events-none absolute inset-0" />

      <header className="relative flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          {brand.logo ? (
            <img src={brand.logo} alt="" className="h-[48px] w-auto max-w-[160px] object-contain" />
          ) : (
            <span className="grid size-[44px] place-items-center rounded-[12px] bg-fm-accent">
              <span className="size-[16px] rotate-45 rounded-[3px] bg-fm-on-accent" />
            </span>
          )}
          <span className="fm-display text-[26px] tracking-normal">{brand.name}</span>
        </div>
        {tag ? (
          <span className="fm-label flex items-center gap-3 rounded-full border border-fm-line bg-fm-surface px-5 py-2.5 text-[17px]">
            <span className="size-[9px] rounded-full bg-fm-accent" />
            {tag}
          </span>
        ) : null}
      </header>

      <main className={cn("relative flex min-h-0 flex-1 flex-col", format.layout === "wide" ? "py-7" : "py-9")}>
        {children}
      </main>

      <footer className="relative flex items-center justify-between gap-6 border-t border-fm-line pt-5 text-[21px]">
        <div className="flex min-w-0 items-center gap-5">
          {brand.link ? (
            <span className="flex items-center gap-2.5 font-semibold">
              <span className="grid h-[22px] w-[31px] shrink-0 place-items-center rounded-[7px] bg-fm-accent text-fm-on-accent">
                <Play className="size-[11px] fill-current" strokeWidth={3} />
              </span>
              {brand.link}
            </span>
          ) : null}
          {brand.handle ? (
            <span className={brand.link ? "truncate text-fm-muted" : "truncate font-semibold"}>{brand.handle}</span>
          ) : null}
        </div>
        <span className="shrink-0 text-fm-muted">{brand.footnote}</span>
      </footer>
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-[28px] border border-fm-line bg-fm-surface", className)}>{children}</div>
  );
}

export function Label({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cn("fm-label text-[16px] text-fm-muted", className)}>{children}</span>;
}

/** Five-star rating in half-star steps. */
export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("flex gap-1", className)}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = value - i >= 1 ? "w-full" : value - i >= 0.5 ? "w-1/2" : "w-0";
        return (
          <span key={i} className="relative size-[1em]">
            <Star className="size-full fill-fm-line text-transparent" />
            <span className={cn("absolute inset-y-0 left-0 overflow-hidden", fill)}>
              <Star className="size-[1em] fill-fm-accent text-fm-accent" />
            </span>
          </span>
        );
      })}
    </span>
  );
}

/** Uploaded picture, or a neutral placeholder when empty. `path` makes it clickable in the preview. */
export function Photo({ src, alt, path, className }: { src: string; alt: string; path?: string; className?: string }) {
  return (
    <UploadTarget
      path={path}
      className={cn(
        "relative shrink-0 overflow-hidden rounded-[28px] border border-fm-line bg-fm-surface",
        className,
      )}
    >
      <div className="fm-card-glow absolute inset-0" />
      {src ? (
        <img src={src} alt={alt} className="relative size-full object-cover object-top" />
      ) : (
        <User className="absolute inset-x-0 bottom-[-8%] mx-auto size-[78%] text-fm-line" strokeWidth={1} />
      )}
    </UploadTarget>
  );
}

/** Round face picture for small spots (pitch markers, list rows). */
export function Avatar({ src, path, className }: { src: string | undefined; path?: string; className?: string }) {
  return (
    <UploadTarget
      path={path}
      hintClass="text-[14px]"
      className={cn("relative block shrink-0 overflow-hidden rounded-full bg-fm-surface", className)}
    >
      {src ? (
        <img src={src} alt="" className="size-full object-cover object-top" />
      ) : (
        <User className="absolute inset-x-0 bottom-[-12%] mx-auto size-[82%] text-fm-muted" strokeWidth={1.25} />
      )}
    </UploadTarget>
  );
}

/** Club badge: uploaded logo or a monogram. */
export function Crest({ src, code, path, className }: { src: string; code: string; path?: string; className?: string }) {
  return (
    <UploadTarget path={path} hintClass="text-[16px]" className={cn("relative grid shrink-0 place-items-center rounded-full", className)}>
      {src ? (
        <img src={src} alt={code} className="size-full object-contain" />
      ) : (
        <span className="fm-display grid size-full place-items-center rounded-full border-[3px] border-fm-accent bg-fm-surface tracking-normal">
          {code}
        </span>
      )}
    </UploadTarget>
  );
}

/** Framed game screenshot (e.g. the FM player profile screen), shown uncropped. */
export function Screenshot({ src, path, className }: { src: string; path?: string; className?: string }) {
  const editing = useImageEditor() !== null;
  return (
    <UploadTarget
      path={path}
      hintClass="text-[30px]"
      className={cn(
        "relative min-h-0 overflow-hidden rounded-[28px] border border-fm-line bg-fm-surface",
        className,
      )}
    >
      {src ? (
        <img src={src} alt="" className="absolute inset-0 size-full object-contain" />
      ) : (
        <div className="absolute inset-0 grid place-content-center justify-items-center gap-4 text-fm-muted">
          <MonitorUp className="size-[72px]" strokeWidth={1.25} />
          {editing ? <span className="text-[24px]">FM profil ekran görüntüsünü buraya yükle</span> : null}
        </div>
      )}
    </UploadTarget>
  );
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/** Country flag from /public/flags. `code` is the lowercase ISO code ("tr", "gb-eng"). */
export function Flag({ code, round, className }: { code: string | undefined; round?: boolean; className?: string }) {
  if (!code) return null;
  return (
    <img
      src={`/flags/${code}.svg`}
      alt=""
      className={cn(
        "inline-block shrink-0 object-cover ring-1 ring-fm-line",
        round ? "aspect-square rounded-full" : "aspect-[4/3] rounded-[0.14em]",
        className,
      )}
    />
  );
}

/** Headline size that keeps the longest word of a name on one line. */
export function nameSize(name: string, layout: Layout): string {
  const longest = Math.max(...name.split(/\s+/).map((w) => w.length), 1);
  if (layout === "wide") return longest <= 8 ? "text-[58px]" : longest <= 11 ? "text-[46px]" : "text-[36px]";
  return longest <= 8 ? "text-[68px]" : longest <= 10 ? "text-[58px]" : "text-[48px]";
}

export type Attribute = { name: string; value: number };

/** FM-style attribute rows (1–20) with a small bar; 16+ is highlighted. */
export function AttributeRows({ items, rows, barClass = "w-[48px]" }: { items: Attribute[]; rows: number; barClass?: string }) {
  return (
    <ul>
      {items.slice(0, rows).map((attr, i) => {
        const tone = attr.value >= 16 ? "text-fm-accent" : attr.value >= 11 ? "text-fm-text" : "text-fm-muted";
        return (
          <li key={i} className="flex h-[40px] items-center gap-3 border-b border-fm-line last:border-0">
            <span className="min-w-0 flex-1 truncate text-[21px] text-fm-muted">{attr.name}</span>
            <span className={cn("h-[6px] overflow-hidden rounded-full bg-fm-line", barClass)}>
              <span
                className={cn("block h-full rounded-full", attr.value >= 16 ? "bg-fm-accent" : "bg-fm-muted")}
                style={{ width: `${Math.min(Math.max(attr.value, 0), 20) * 5}%` }}
              />
            </span>
            <span className={cn("w-[30px] text-right text-[24px] font-bold tabular-nums", tone)}>{attr.value}</span>
          </li>
        );
      })}
    </ul>
  );
}

export const toNumber = (value: string) =>
  Number.parseFloat(value.replace(",", ".").replace(/[^0-9.-]/g, "")) || 0;
