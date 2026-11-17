"use client";

import { zipSync } from "fflate";
import { toBlob } from "html-to-image";
import { Check, Download, LayoutGrid, Loader2, Palette, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AutoForm } from "./auto-form";
import { BODY_FONTS, FORMATS, HEADING_FONTS, THEMES, getFormat } from "./formats";
import { TEMPLATES } from "./templates";
import type { Brand, Category, DataRecord, Format, FormatId } from "./types";

const CATEGORIES: Category[] = ["Oyuncu", "Kadro ve Taktik", "Maç ve Lig", "İçerik"];

const STORAGE_KEY = "fm-studio-v1";

type StudioState = {
  templateId: string;
  formatId: FormatId;
  /** Show every selected size side by side instead of one. */
  showAll: boolean;
  /** Sizes included in the one-click download. */
  exportIds: FormatId[];
  brand: Brand;
  data: Record<string, DataRecord>;
};

const DEFAULT_STATE: StudioState = {
  templateId: TEMPLATES[0].id,
  formatId: "ig-portrait",
  showAll: false,
  exportIds: ["ig-portrait", "x-landscape"],
  brand: {
    name: "FM Atölye",
    handle: "@fmatolye",
    footnote: "Football Manager 26",
    logo: "",
    theme: "night",
    ...THEMES[0].palette,
    headingFont: "archivo",
    bodyFont: "geist",
    background: "",
    backgroundDim: "medium",
  },
  data: {},
};

function saveFile(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

function loadState(): StudioState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const saved = JSON.parse(raw) as Partial<StudioState>;
    return {
      ...DEFAULT_STATE,
      ...saved,
      brand: { ...DEFAULT_STATE.brand, ...saved.brand },
      data: saved.data ?? {},
      exportIds: Array.isArray(saved.exportIds) ? saved.exportIds : DEFAULT_STATE.exportIds,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

/** Scales the full-size card down to fit its container. */
function Preview({ format, children }: { format: Format; children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () =>
      setScale(Math.min(container.clientWidth / format.width, container.clientHeight / format.height));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [format.width, format.height]);

  return (
    <div ref={containerRef} className="grid h-full w-full place-items-center overflow-hidden">
      <div
        className="relative overflow-hidden rounded-lg shadow-2xl ring-1 ring-white/10"
        style={{ width: format.width * scale, height: format.height * scale }}
      >
        <div className="absolute top-0 left-0 origin-top-left" style={{ transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Studio() {
  const [state, setState] = useState<StudioState>(loadState);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const exportRefs = useRef<Partial<Record<FormatId, HTMLDivElement | null>>>({});

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full (large images) — editing still works, it just won't persist.
    }
  }, [state]);

  const template = TEMPLATES.find((t) => t.id === state.templateId) ?? TEMPLATES[0];
  const format = getFormat(state.formatId);
  const data: DataRecord = { ...template.defaults, ...state.data[template.id] };

  const setData = (next: DataRecord) =>
    setState((s) => ({ ...s, data: { ...s.data, [template.id]: next } }));
  const setBrand = (patch: Partial<Brand>) => setState((s) => ({ ...s, brand: { ...s.brand, ...patch } }));

  const exportFormats = FORMATS.filter((f) => state.exportIds.includes(f.id));
  const toggleExport = (id: FormatId) =>
    setState((s) => ({
      ...s,
      exportIds: s.exportIds.includes(id) ? s.exportIds.filter((x) => x !== id) : [...s.exportIds, id],
    }));

  /** One size → a PNG. Several sizes → a single zip, so one click covers Instagram and X. */
  const download = useCallback(
    async (formats: Format[]) => {
      if (formats.length === 0) return;
      setBusy(true);
      setError("");
      try {
        await document.fonts.ready;
        const files: { name: string; blob: Blob }[] = [];
        for (const target of formats) {
          const node = exportRefs.current[target.id]?.firstElementChild;
          if (!(node instanceof HTMLElement)) continue;
          const blob = await toBlob(node, { width: target.width, height: target.height, pixelRatio: 1 });
          if (!blob) throw new Error("empty image");
          const platform = target.platform === "X" ? "x" : "instagram";
          files.push({ name: `${template.id}-${platform}-${target.width}x${target.height}.png`, blob });
        }
        if (files.length === 1) {
          saveFile(files[0].blob, files[0].name);
        } else {
          const entries: Record<string, Uint8Array> = {};
          for (const file of files) entries[file.name] = new Uint8Array(await file.blob.arrayBuffer());
          const zipped = zipSync(entries, { level: 0 });
          saveFile(new Blob([zipped.slice()], { type: "application/zip" }), `${template.id}.zip`);
        }
      } catch {
        setError("Görsel oluşturulamadı. Lütfen tekrar deneyin.");
      } finally {
        setBusy(false);
      }
    },
    [template.id],
  );

  return (
    <div className="dark flex min-h-dvh flex-col bg-background text-foreground lg:h-dvh lg:flex-row">
      {/* Preview */}
      <section className="flex min-w-0 flex-col gap-4 p-4 lg:order-2 lg:flex-1 lg:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-1 rounded-lg border border-border p-1">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setState((s) => ({ ...s, formatId: f.id, showAll: false }))}
                className={cn(
                  "rounded-md px-3 py-1.5 text-left text-sm transition",
                  !state.showAll && f.id === format.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-medium">
                  {f.platform} {f.label}
                </span>
                <span className="ml-2 text-xs opacity-70">{f.ratio}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setState((s) => ({ ...s, showAll: true }))}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition",
                state.showAll ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="size-4" /> Yan yana
            </button>
          </div>
          {!state.showAll ? (
            <span className="text-xs text-muted-foreground tabular-nums">
              {format.width} × {format.height} px
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-2">
          <span className="px-1 text-xs text-muted-foreground">Pakete dahil:</span>
          {FORMATS.map((f) => {
            const active = state.exportIds.includes(f.id);
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => toggleExport(f.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition",
                  active ? "border-primary bg-accent text-foreground" : "border-border text-muted-foreground",
                )}
              >
                <Check className={cn("size-3", !active && "opacity-0")} />
                {f.platform} {f.ratio}
              </button>
            );
          })}
          <div className="ml-auto flex gap-2">
            {!state.showAll ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => download([format])}
                className="flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium hover:bg-accent disabled:opacity-50"
              >
                Sadece bu boyut
              </button>
            ) : null}
            <button
              type="button"
              disabled={busy || exportFormats.length === 0}
              onClick={() => download(exportFormats)}
              className="flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
              Paketi indir ({exportFormats.length})
            </button>
          </div>
        </div>
        {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
        {state.showAll ? (
          <div
            className={cn(
              "grid h-[80vh] min-h-0 gap-4 lg:h-auto lg:flex-1",
              exportFormats.length > 1 ? "grid-cols-2" : "grid-cols-1",
              exportFormats.length > 2 ? "grid-rows-2" : "grid-rows-1",
            )}
          >
            {exportFormats.length === 0 ? (
              <p className="text-sm text-muted-foreground">Pakete en az bir boyut ekleyin.</p>
            ) : null}
            {exportFormats.map((f) => (
              <div key={f.id} className="flex min-h-0 min-w-0 flex-col gap-2">
                <p className="text-xs text-muted-foreground">
                  {f.platform} {f.label} · {f.width} × {f.height}
                </p>
                <div className="min-h-0 flex-1">
                  <Preview format={f}>{template.render({ data, format: f, brand: state.brand })}</Preview>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-[62vh] min-h-0 lg:h-auto lg:flex-1">
            <Preview format={format}>{template.render({ data, format, brand: state.brand })}</Preview>
          </div>
        )}
      </section>

      {/* Controls */}
      <aside className="flex w-full shrink-0 flex-col border-border lg:order-1 lg:w-[440px] lg:border-r">
        <div className="border-b border-border p-4">
          <h1 className="text-base font-semibold">FM Paylaşım Stüdyosu</h1>
          <p className="text-xs text-muted-foreground">Şablonu seç, içeriği düzenle, PNG olarak indir.</p>
        </div>
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4">
          <div>
            <h2 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Şablon</h2>
            <div className="space-y-3">
              {CATEGORIES.map((category) => (
                <div key={category}>
                  <p className="mb-1.5 text-xs text-muted-foreground">{category}</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {TEMPLATES.filter((t) => t.category === category).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        title={t.description}
                        onClick={() => setState((s) => ({ ...s, templateId: t.id }))}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left text-sm font-medium transition",
                          t.id === template.id ? "border-primary bg-accent" : "border-border hover:bg-accent/50",
                        )}
                      >
                        <t.icon className="size-4 shrink-0" />
                        <span className="truncate">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Renk paleti</h2>
            <div className="mb-3 grid grid-cols-3 gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  aria-pressed={theme.id === state.brand.theme}
                  onClick={() => setBrand({ theme: theme.id, ...theme.palette })}
                  className={cn(
                    "flex h-10 items-center justify-center rounded-lg border text-xs font-semibold transition",
                    theme.swatchClass,
                    theme.id === state.brand.theme ? "border-foreground ring-2 ring-foreground/40" : "border-border",
                  )}
                >
                  {theme.label}
                </button>
              ))}
              <button
                type="button"
                aria-pressed={state.brand.theme === "custom"}
                onClick={() => setBrand({ theme: "custom" })}
                className={cn(
                  "flex h-10 items-center justify-center gap-1.5 rounded-lg border text-xs font-semibold transition",
                  state.brand.theme === "custom" ? "border-foreground ring-2 ring-foreground/40" : "border-border",
                )}
              >
                <Palette className="size-3.5" /> Özel
              </button>
            </div>
            {state.brand.theme === "custom" ? (
              <AutoForm
                fields={[
                  { key: "colorAccent", label: "Vurgu rengi", type: "color" },
                  { key: "colorBg", label: "Arka plan", type: "color" },
                  { key: "colorSurface", label: "Kutu rengi", type: "color" },
                  { key: "colorText", label: "Yazı rengi", type: "color" },
                ]}
                value={state.brand}
                onChange={(next) => setBrand(next as Partial<Brand>)}
              />
            ) : (
              <p className="text-xs text-muted-foreground">
                Kendi renklerin için &quot;Özel&quot;e bas; seçili paletten başlar.
              </p>
            )}
          </div>

          <div>
            <h2 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Yazı tipi ve marka</h2>
            <AutoForm
              fields={[
                { key: "headingFont", label: "Başlık yazı tipi", type: "select", options: HEADING_FONTS },
                { key: "bodyFont", label: "Metin yazı tipi", type: "select", options: BODY_FONTS },
                { key: "name", label: "Hesap adı", type: "text" },
                { key: "handle", label: "Kullanıcı adı", type: "text" },
                { key: "footnote", label: "Alt bilgi (sağ alt)", type: "text" },
                {
                  key: "backgroundDim",
                  label: "Arka plan karartma",
                  type: "select",
                  options: [
                    { value: "light", label: "Hafif" },
                    { value: "medium", label: "Orta" },
                    { value: "strong", label: "Koyu" },
                  ],
                },
                { key: "logo", label: "Logo (sol üst)", type: "image" },
                { key: "background", label: "Arka plan görseli", type: "image", hint: "Tüm kartın arkasına yerleşir; okunurluk için karartılır." },
              ]}
              value={state.brand}
              onChange={(next) => setBrand(next as Partial<Brand>)}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">İçerik</h2>
              <button
                type="button"
                onClick={() => setData(template.defaults)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3" /> Örnek veriye dön
              </button>
            </div>
            <AutoForm key={template.id} fields={template.fields} value={data} onChange={setData} />
          </div>
        </div>
      </aside>

      {/* Full-size copies used for export, kept off-screen. */}
      <div aria-hidden className="pointer-events-none fixed top-0 left-[-20000px]">
        {FORMATS.map((f) => (
          <div
            key={f.id}
            ref={(node) => {
              exportRefs.current[f.id] = node;
            }}
          >
            {template.render({ data, format: f, brand: state.brand })}
          </div>
        ))}
      </div>
    </div>
  );
}
