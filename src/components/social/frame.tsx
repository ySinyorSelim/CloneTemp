/* eslint-disable @next/next/no-img-element -- cards are rasterised client-side; next/image would break export */
import { Star, User } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FRAME_CLASS } from "./formats";
import type { Brand, Format } from "./types";

type CardFrameProps = {
  format: Format;
  brand: Brand;
  tag: string;
  children: ReactNode;
};

/** Shared shell of every card: background, brand header, footer. */
export function CardFrame({ format, brand, tag, children }: CardFrameProps) {
  return (
    <div
      lang="tr"
      data-fm-theme={brand.theme}
      className={cn(
        "relative flex shrink-0 flex-col overflow-hidden bg-fm-bg font-sans text-fm-text antialiased",
        FRAME_CLASS[format.id],
      )}
    >
      <div className="fm-card-glow pointer-events-none absolute inset-0" />
      <div className="fm-card-grid pointer-events-none absolute inset-0" />

      <header className="relative flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <span className="grid size-[44px] place-items-center rounded-[12px] bg-fm-accent">
            <span className="size-[16px] rotate-45 rounded-[3px] bg-fm-on-accent" />
          </span>
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
        <span className="font-semibold">{brand.handle}</span>
        <span className="text-fm-muted">{brand.footnote}</span>
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

/** Uploaded picture, or a neutral placeholder when empty. */
export function Photo({ src, alt, className }: { src: string; alt: string; className?: string }) {
  return (
    <div
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
    </div>
  );
}

/** Club badge: uploaded logo or a monogram. */
export function Crest({ src, code, className }: { src: string; code: string; className?: string }) {
  return (
    <div className={cn("grid shrink-0 place-items-center", className)}>
      {src ? (
        <img src={src} alt={code} className="size-full object-contain" />
      ) : (
        <span className="fm-display grid size-full place-items-center rounded-full border-[3px] border-fm-accent bg-fm-surface tracking-normal">
          {code}
        </span>
      )}
    </div>
  );
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}
