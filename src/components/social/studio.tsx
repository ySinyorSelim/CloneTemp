"use client";

import { toPng } from "html-to-image";
import { Download, Images, Loader2, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { AutoForm } from "./auto-form";
import { FORMATS, THEMES, getFormat } from "./formats";
import { TEMPLATES } from "./templates";
import type { Brand, DataRecord, Format, FormatId } from "./types";

const STORAGE_KEY = "fm-studio-v1";

type StudioState = {
  templateId: string;
  formatId: FormatId;
  brand: Brand;
  data: Record<string, DataRecord>;
};

const DEFAULT_STATE: StudioState = {
  templateId: TEMPLATES[0].id,
  formatId: "ig-portrait",
  brand: { name: "FM Atölye", handle: "@fmatolye", footnote: "Football Manager 26", theme: "night" },
  data: {},
};

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

  const download = useCallback(
    async (formats: Format[]) => {
      setBusy(true);
      setError("");
      try {
        await document.fonts.ready;
        for (const target of formats) {
          const node = exportRefs.current[target.id]?.firstElementChild;
          if (!(node instanceof HTMLElement)) continue;
          const url = await toPng(node, { width: target.width, height: target.height, pixelRatio: 1 });
          const link = document.createElement("a");
          link.href = url;
          link.download = `${template.id}-${target.id}-${target.width}x${target.height}.png`;
          link.click();
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
                onClick={() => setState((s) => ({ ...s, formatId: f.id }))}
                className={cn(
                  "rounded-md px-3 py-1.5 text-left text-sm transition",
                  f.id === format.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="font-medium">
                  {f.platform} {f.label}
                </span>
                <span className="ml-2 text-xs opacity-70">{f.ratio}</span>
              </button>
            ))}
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {format.width} × {format.height} px
          </span>
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => download(FORMATS)}
              className="flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm font-medium hover:bg-accent disabled:opacity-50"
            >
              <Images className="size-4" /> Tüm boyutlar
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => download([format])}
              className="flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />} PNG indir
            </button>
          </div>
        </div>
        {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
        <div className="h-[62vh] min-h-0 lg:h-auto lg:flex-1">
          <Preview format={format}>{template.render({ data, format, brand: state.brand })}</Preview>
        </div>
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
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setState((s) => ({ ...s, templateId: t.id }))}
                  className={cn(
                    "flex items-start gap-2.5 rounded-lg border p-2.5 text-left transition",
                    t.id === template.id ? "border-primary bg-accent" : "border-border hover:bg-accent/50",
                  )}
                >
                  <t.icon className="mt-0.5 size-4 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{t.name}</span>
                    <span className="block text-xs text-muted-foreground">{t.description}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">Marka</h2>
            <div className="mb-3 flex gap-2">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  aria-pressed={theme.id === state.brand.theme}
                  onClick={() => setBrand({ theme: theme.id })}
                  className={cn(
                    "flex h-11 flex-1 flex-col items-center justify-center rounded-lg border text-xs font-semibold transition",
                    theme.swatchClass,
                    theme.id === state.brand.theme ? "border-foreground ring-2 ring-foreground/40" : "border-border",
                  )}
                >
                  {theme.label}
                </button>
              ))}
            </div>
            <AutoForm
              fields={[
                { key: "name", label: "Hesap adı", type: "text" },
                { key: "handle", label: "Kullanıcı adı", type: "text" },
                { key: "footnote", label: "Alt bilgi (sağ alt)", type: "text" },
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
