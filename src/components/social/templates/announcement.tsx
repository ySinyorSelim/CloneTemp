/* eslint-disable @next/next/no-img-element -- cards are rasterised client-side */
import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { CardFrame } from "../frame";
import type { TemplateProps } from "../types";

type AnnouncementData = {
  tag: string;
  kicker: string;
  title: string;
  body: string;
  image: string;
  chips: string[];
};

function AnnouncementCard({ data, format, brand }: TemplateProps<AnnouncementData>) {
  const layout = format.layout;
  const wide = layout === "wide";
  const big = !data.image && !wide;

  const image = data.image ? (
    <div className={cn("min-h-0 overflow-hidden rounded-[28px] border border-fm-line", wide ? "w-[620px] shrink-0" : "flex-1")}>
      <img src={data.image} alt="" className="size-full object-cover" />
    </div>
  ) : null;

  const text = (
    <div className={cn("flex min-w-0 flex-col justify-center", (wide || !data.image) && "flex-1")}>
      {data.kicker ? (
        <p className="fm-label flex items-center gap-3 text-[22px] text-fm-accent">
          <span className="h-[4px] w-[48px] rounded-full bg-fm-accent" />
          {data.kicker}
        </p>
      ) : null}
      <h1
        className={cn(
          "fm-display mt-6",
          big ? (layout === "square" ? "text-[84px]" : "text-[104px]") : wide ? "text-[68px]" : "text-[64px]",
        )}
      >
        {data.title}
      </h1>
      {data.body ? (
        <p className={cn("mt-7 leading-[1.35] text-fm-muted", big ? "text-[32px]" : "text-[27px]")}>{data.body}</p>
      ) : null}
      {data.chips.length > 0 ? (
        <ul className="mt-8 flex flex-wrap gap-3">
          {data.chips.slice(0, 4).map((chip, i) => (
            <li
              key={i}
              className={cn(
                "rounded-full px-6 py-2.5 text-[23px] font-semibold",
                i === 0 ? "bg-fm-accent text-fm-on-accent" : "border border-fm-line bg-fm-surface",
              )}
            >
              {chip}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      <div className={cn("flex min-h-0 flex-1 gap-8", wide ? "flex-row" : "flex-col")}>
        {wide ? (
          <>
            {text}
            {image}
          </>
        ) : (
          <>
            {image}
            {text}
          </>
        )}
      </div>
    </CardFrame>
  );
}

export const announcement = defineTemplate<AnnouncementData>({
  id: "announcement",
  name: "Duyuru",
  category: "İçerik",
  description: "Yeni seri, video, yayın duyurusu",
  icon: Megaphone,
  Component: AnnouncementCard,
  fields: [
    { key: "tag", label: "Etiket", type: "text" },
    { key: "kicker", label: "Üst başlık", type: "text" },
    { key: "title", label: "Başlık", type: "text" },
    { key: "body", label: "Açıklama", type: "textarea" },
    { key: "image", label: "Görsel (isteğe bağlı)", type: "image" },
    { key: "chips", label: "Etiketler", type: "lines", hint: "Her satır bir etiket (en fazla 4)" },
  ],
  defaults: {
    tag: "Duyuru",
    kicker: "Yeni seri",
    title: "Sıfırdan zirveye",
    body: "3. ligden başlayıp Şampiyonlar Ligi'ne uzanan yeni kariyer serisi başlıyor. Transfer yasağı var, altyapı serbest.",
    image: "",
    chips: ["Her cuma 20:00", "Football Manager 26", "1. bölüm yayında"],
  },
});
