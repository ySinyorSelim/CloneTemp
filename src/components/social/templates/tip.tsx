import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { CardFrame } from "../frame";
import type { Layout, TemplateProps } from "../types";

type TipData = {
  tag: string;
  title: string;
  intro: string;
  steps: string[];
};

const STEP_COUNT: Record<Layout, number> = { portrait: 5, square: 4, story: 6, wide: 4 };

function TipCard({ data, format, brand }: TemplateProps<TipData>) {
  const layout = format.layout;
  const wide = layout === "wide";

  const heading = (
    <div className="min-w-0">
      <h1 className={cn("fm-display", wide ? "text-[54px]" : layout === "square" ? "text-[52px]" : "text-[64px]")}>
        {data.title}
      </h1>
      {data.intro ? <p className="mt-5 text-[26px] leading-[1.35] text-fm-muted">{data.intro}</p> : null}
    </div>
  );

  const steps = (
    <ol className="flex min-h-0 flex-1 flex-col gap-4">
      {data.steps.slice(0, STEP_COUNT[layout]).map((step, i) => (
        <li
          key={i}
          className="flex max-h-[170px] min-h-0 flex-1 items-center gap-6 rounded-[24px] border border-fm-line bg-fm-surface px-7"
        >
          <span className={cn("fm-display w-[1.3em] shrink-0 text-[52px] tracking-normal", i === 0 ? "text-fm-accent" : "text-fm-muted")}>
            {i + 1}
          </span>
          <span className={cn("line-clamp-3 leading-[1.3]", layout === "story" ? "text-[33px]" : layout === "portrait" ? "text-[30px]" : "text-[27px]")}>{step}</span>
        </li>
      ))}
    </ol>
  );

  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      {wide ? (
        <div className="flex min-h-0 flex-1 gap-10">
          <div className="flex w-[520px] shrink-0 flex-col justify-center">{heading}</div>
          {steps}
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col gap-7">
          {heading}
          {steps}
        </div>
      )}
    </CardFrame>
  );
}

export const tip = defineTemplate<TipData>({
  id: "tip",
  name: "İpucu / Rehber",
  category: "İçerik",
  description: "Adım adım kısa rehber kartı",
  icon: Lightbulb,
  Component: TipCard,
  fields: [
    { key: "tag", label: "Etiket", type: "text" },
    { key: "title", label: "Başlık", type: "text" },
    { key: "intro", label: "Giriş", type: "textarea" },
    { key: "steps", label: "Adımlar", type: "lines", hint: "Her satır bir adım" },
  ],
  defaults: {
    tag: "FM İpucu",
    title: "Wonderkid nasıl büyütülür?",
    intro: "Potansiyeli yüksek oyuncunun yıldıza dönüşmesi şans değil, plan işi.",
    steps: [
      "18 yaşına kadar altyapıda tutma; A takımla antrenmana al.",
      "Sezonda en az 20 maç oynayacağı bir kulübe kirala.",
      "Bireysel antrenmanda zayıf özelliği değil, rolünü çalıştır.",
      "Kişiliği güçlü bir oyuncuyla mentörlük grubuna koy.",
      "Her 6 ayda antrenör raporunu kontrol et, rolü güncelle.",
      "Maaşını erken yenile; serbest kalma maddesinden kaçın.",
    ],
  },
});
