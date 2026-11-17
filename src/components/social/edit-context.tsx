"use client";

import { ImageUp } from "lucide-react";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Lets image slots inside the live preview be filled by clicking or dropping
 * a file on them. `path` is the data key ("photo") or a list cell
 * ("players.3.photo"). Export copies render without the provider, so the
 * upload affordance never ends up in a PNG.
 */
export type ImageEditor = {
  pick: (path: string) => void;
  drop: (path: string, file: File) => void;
};

export const EditContext = createContext<ImageEditor | null>(null);

export function useImageEditor(): ImageEditor | null {
  return useContext(EditContext);
}

type UploadTargetProps = {
  path: string | undefined;
  className?: string;
  /** Short hint shown on hover; sized in card pixels. */
  hintClass?: string;
  /** Only react to dropped files (no click, no hover overlay) — for areas that already show content. */
  dropOnly?: boolean;
  children: ReactNode;
};

export function UploadTarget({ path, className, hintClass = "text-[20px]", dropOnly, children }: UploadTargetProps) {
  const editor = useImageEditor();
  const [dragging, setDragging] = useState(false);
  if (!editor || !path) return <div className={className}>{children}</div>;
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) editor.drop(path, file);
  };

  if (dropOnly) {
    return (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={className}
      >
        {children}
        {dragging ? (
          <span
            className={cn(
              "pointer-events-none absolute inset-0 z-10 grid place-content-center justify-items-center gap-3 rounded-[28px] border-4 border-dashed border-white/80 bg-black/70 font-semibold text-white",
              hintClass,
            )}
          >
            <ImageUp className="size-[2em]" />
            Buraya bırak
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      title="Görsel yüklemek için tıkla ya da dosyayı buraya sürükle"
      onClick={() => editor.pick(path)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") editor.pick(path);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={cn("group/upload cursor-pointer", className)}
    >
      {children}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 z-10 grid place-items-center rounded-[inherit] bg-black/55 font-semibold text-white opacity-0 transition group-hover/upload:opacity-100",
          hintClass,
        )}
      >
        <ImageUp className="size-[1.6em]" />
      </span>
    </div>
  );
}
