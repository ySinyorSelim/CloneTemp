import { MessageCircleQuestion } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { CardFrame, Flag } from "../frame";
import type { TemplateProps } from "../types";

type PollOption = { label: string; nation: string; detail: string };

type PollData = {
  tag: string;
  question: string;
  intro: string;
  options: PollOption[];
  cta: string;
};

const LETTERS = ["A", "B", "C", "D"];

function PollCard({ data, format, brand }: TemplateProps<PollData>) {
  const layout = format.layout;
  const wide = layout === "wide";
  const options = data.options.slice(0, 4);

  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      <div className={cn("flex min-h-0 flex-1 gap-8", wide ? "flex-row items-stretch" : "flex-col")}>
        <div className={cn("min-w-0", wide && "flex w-[560px] shrink-0 flex-col justify-center")}>
          <h1 className={cn("fm-display", wide || layout === "square" ? "text-[54px]" : "text-[68px]")}>{data.question}</h1>
          {data.intro ? <p className="mt-5 text-[26px] leading-[1.35] text-fm-muted">{data.intro}</p> : null}
          {wide && data.cta ? <p className="fm-label mt-8 text-[19px] text-fm-accent">{data.cta}</p> : null}
        </div>
        <ul className={cn("grid min-h-0 flex-1 auto-rows-fr gap-4", layout === "story" || layout === "portrait" ? "grid-cols-1" : "grid-cols-2")}>
          {options.map((option, i) => (
            <li key={i} className="flex min-h-0 items-center gap-6 rounded-[28px] border border-fm-line bg-fm-surface px-7">
              <span className="fm-display grid size-[72px] shrink-0 place-items-center rounded-[20px] bg-fm-accent text-[38px] tracking-normal text-fm-on-accent">
                {LETTERS[i]}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-3 text-[32px] leading-[1.15] font-semibold">
                  <Flag code={option.nation} className="h-[0.7em]" />
                  <span className="truncate">{option.label}</span>
                </span>
                {option.detail ? <span className="mt-1 block truncate text-[22px] text-fm-muted">{option.detail}</span> : null}
              </span>
            </li>
          ))}
        </ul>
        {!wide && data.cta ? <p className="fm-label text-center text-[20px] text-fm-accent">{data.cta}</p> : null}
      </div>
    </CardFrame>
  );
}

export const poll = defineTemplate<PollData>({
  id: "poll",
  name: "Anket",
  category: "İçerik",
  description: "Takipçiye soru, 2-4 seçenek",
  icon: MessageCircleQuestion,
  Component: PollCard,
  fields: [
    { key: "tag", label: "Etiket", type: "text" },
    { key: "question", label: "Soru", type: "text" },
    { key: "intro", label: "Açıklama", type: "textarea" },
    {
      key: "options",
      label: "Seçenekler (en fazla 4)",
      type: "list",
      itemLabel: "Seçenek",
      fields: [
        { key: "label", label: "Seçenek", type: "text", size: "grow" },
        { key: "nation", label: "Ülke", type: "country", size: "md" },
        { key: "detail", label: "Detay", type: "text", size: "grow" },
      ],
    },
    { key: "cta", label: "Çağrı metni", type: "text" },
  ],
  defaults: {
    tag: "Anket",
    question: "Yeni kariyer nerede başlasın?",
    intro: "En çok oy alan kulüple sıfırdan başlıyoruz. İlk bölüm cuma günü.",
    options: [
      { label: "Altınordu", nation: "tr", detail: "Sadece altyapı oyuncularıyla" },
      { label: "Sunderland", nation: "gb-eng", detail: "Düşmüş devi ayağa kaldır" },
      { label: "Parma", nation: "it", detail: "90'ların ruhunu geri getir" },
      { label: "Vélez", nation: "ar", detail: "Güney Amerika wonderkid fabrikası" },
    ],
    cta: "Cevabını yorumlara yaz",
  },
});
