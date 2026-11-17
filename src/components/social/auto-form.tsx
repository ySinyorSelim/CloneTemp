"use client";

import { ChevronDown, ChevronUp, ImagePlus, Plus, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "./countries";
import type { DataRecord, Field, FieldValue, ItemField } from "./types";

const INPUT =
  "w-full rounded-md border border-input bg-background px-2.5 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";

const ITEM_SIZE: Record<NonNullable<ItemField["size"]>, string> = {
  xs: "w-12 shrink-0",
  sm: "w-20 shrink-0",
  md: "w-28 shrink-0",
  grow: "min-w-24 flex-1",
};

/** Downscale uploads so they stay small enough for localStorage; keeps transparency. */
export async function readImage(file: File, maxSize = 1400): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/webp", 0.9);
}

function CountrySelect({
  id,
  label,
  value,
  onChange,
  className,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (next: string) => void;
  className?: string;
}) {
  return (
    <select id={id} aria-label={label} title={label} value={value} onChange={(e) => onChange(e.target.value)} className={className}>
      <option value="">— {label}</option>
      {COUNTRIES.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  );
}

function ImageCell({ label, value, onChange }: { label: string; value: string; onChange: (next: string) => void }) {
  return (
    <label
      title={label}
      className="relative grid size-8 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-md border border-dashed border-input text-muted-foreground hover:border-ring hover:text-foreground"
    >
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element -- local data URL thumbnail
        <img src={value} alt="" className="size-full object-cover object-top" />
      ) : (
        <ImagePlus className="size-4" />
      )}
      <input
        type="file"
        accept="image/*"
        aria-label={label}
        className="sr-only"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onChange(await readImage(file, 480));
        }}
      />
    </label>
  );
}

function blankItem(fields: ItemField[]): DataRecord {
  return Object.fromEntries(fields.map((f) => [f.key, f.type === "number" ? (f.min ?? 0) : ""]));
}

function ListEditor({
  field,
  items,
  onChange,
}: {
  field: Extract<Field, { type: "list" }>;
  items: DataRecord[];
  onChange: (next: DataRecord[]) => void;
}) {
  const update = (index: number, key: string, value: FieldValue) =>
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-1.5">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <span className="w-5 shrink-0 text-right text-xs text-muted-foreground tabular-nums">{index + 1}</span>
          <div className="flex min-w-0 flex-1 flex-wrap gap-1">
            {field.fields.map((sub) =>
              sub.type === "country" ? (
                <CountrySelect
                  key={sub.key}
                  label={sub.label}
                  value={String(item[sub.key] ?? "")}
                  onChange={(next) => update(index, sub.key, next)}
                  className={cn(INPUT, "h-8 px-1", ITEM_SIZE[sub.size ?? "md"])}
                />
              ) : sub.type === "image" ? (
                <ImageCell
                  key={sub.key}
                  label={sub.label}
                  value={String(item[sub.key] ?? "")}
                  onChange={(next) => update(index, sub.key, next)}
                />
              ) : (
              <input
                key={sub.key}
                aria-label={sub.label}
                title={sub.label}
                placeholder={sub.label}
                type={sub.type === "number" ? "number" : "text"}
                min={sub.min}
                max={sub.max}
                value={String(item[sub.key] ?? "")}
                onChange={(e) =>
                  update(index, sub.key, sub.type === "number" ? Number(e.target.value) : e.target.value)
                }
                className={cn(INPUT, "h-8 px-2", ITEM_SIZE[sub.size ?? "grow"])}
              />
              ),
            )}
          </div>
          <div className="flex shrink-0 text-muted-foreground">
            <button type="button" aria-label="Yukarı taşı" onClick={() => move(index, -1)} className="rounded p-0.5 hover:bg-accent hover:text-foreground">
              <ChevronUp className="size-4" />
            </button>
            <button type="button" aria-label="Aşağı taşı" onClick={() => move(index, 1)} className="rounded p-0.5 hover:bg-accent hover:text-foreground">
              <ChevronDown className="size-4" />
            </button>
            <button
              type="button"
              aria-label={`${field.itemLabel} sil`}
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              className="rounded p-0.5 hover:bg-destructive/20 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, blankItem(field.fields)])}
        className="flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-input text-xs text-muted-foreground hover:border-ring hover:text-foreground"
      >
        <Plus className="size-3.5" /> {field.itemLabel} ekle
      </button>
    </div>
  );
}

function ImageInput({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex h-9 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-input text-sm text-muted-foreground hover:border-ring hover:text-foreground">
        <ImagePlus className="size-4" />
        {value ? "Görseli değiştir" : "Görsel yükle"}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (file) onChange(await readImage(file));
          }}
        />
      </label>
      {value ? (
        <button
          type="button"
          aria-label="Görseli kaldır"
          onClick={() => onChange("")}
          className="grid size-9 place-items-center rounded-md border border-input text-muted-foreground hover:text-destructive"
        >
          <X className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

type AutoFormProps = {
  fields: Field[];
  value: DataRecord;
  onChange: (next: DataRecord) => void;
};

/** Renders an editing form straight from a template's field list. */
export function AutoForm({ fields, value, onChange }: AutoFormProps) {
  const set = (key: string, next: FieldValue) => onChange({ ...value, [key]: next });

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4">
      {fields.map((field) => {
        const current = value[field.key];
        const half =
          field.type === "text" ||
          field.type === "number" ||
          field.type === "select" ||
          field.type === "country" ||
          field.type === "color";
        const id = `field-${field.key}`;
        return (
          <div key={field.key} className={cn("min-w-0", half ? "col-span-1" : "col-span-2")}>
            <label htmlFor={id} className="mb-1.5 block truncate text-xs font-medium text-muted-foreground">
              {field.label}
            </label>
            {field.type === "text" ? (
              <input id={id} value={String(current ?? "")} onChange={(e) => set(field.key, e.target.value)} className={cn(INPUT, "h-9")} />
            ) : field.type === "number" ? (
              <input
                id={id}
                type="number"
                min={field.min}
                max={field.max}
                step={field.step}
                value={Number(current ?? 0)}
                onChange={(e) => set(field.key, Number(e.target.value))}
                className={cn(INPUT, "h-9")}
              />
            ) : field.type === "select" ? (
              <select id={id} value={String(current ?? "")} onChange={(e) => set(field.key, e.target.value)} className={cn(INPUT, "h-9")}>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "country" ? (
              <CountrySelect id={id} label={field.label} value={String(current ?? "")} onChange={(next) => set(field.key, next)} className={cn(INPUT, "h-9")} />
            ) : field.type === "color" ? (
              <div className="flex gap-2">
                <input
                  type="color"
                  aria-label={field.label}
                  value={/^#[0-9a-f]{6}$/i.test(String(current)) ? String(current) : "#000000"}
                  onChange={(e) => set(field.key, e.target.value)}
                  className="h-9 w-11 shrink-0 cursor-pointer rounded-md border border-input bg-background p-1"
                />
                <input id={id} value={String(current ?? "")} onChange={(e) => set(field.key, e.target.value)} className={cn(INPUT, "h-9 font-mono")} />
              </div>
            ) : field.type === "textarea" ? (
              <textarea id={id} rows={3} value={String(current ?? "")} onChange={(e) => set(field.key, e.target.value)} className={cn(INPUT, "py-2")} />
            ) : field.type === "lines" ? (
              <textarea
                id={id}
                rows={Math.max(3, Array.isArray(current) ? current.length + 1 : 3)}
                value={Array.isArray(current) ? (current as string[]).join("\n") : ""}
                onChange={(e) => set(field.key, e.target.value.split("\n"))}
                onBlur={(e) => set(field.key, e.target.value.split("\n").map((l) => l.trim()).filter(Boolean))}
                className={cn(INPUT, "py-2")}
              />
            ) : field.type === "image" ? (
              <ImageInput value={String(current ?? "")} onChange={(next) => set(field.key, next)} />
            ) : field.type === "list" ? (
              <ListEditor
                field={field}
                items={Array.isArray(current) ? (current as DataRecord[]) : []}
                onChange={(next) => set(field.key, next)}
              />
            ) : null}
            {field.hint ? <p className="mt-1 text-xs text-muted-foreground/80">{field.hint}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
