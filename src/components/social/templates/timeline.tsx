import { Route } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { CardFrame, Flag, chunk } from "../frame";
import type { Layout, TemplateProps } from "../types";

type Stop = { season: string; title: string; detail: string; badge: string };

type TimelineData = {
  tag: string;
  title: string;
  subtitle: string;
  nation: string;
  stops: Stop[];
};

function textSize(rowCount: number, layout: Layout): string {
  if (layout === "story") return "text-[30px]";
  if (layout === "square") return rowCount <= 5 ? "text-[28px]" : "text-[23px]";
  return rowCount <= 8 ? "text-[30px]" : "text-[25px]";
}

function TimelineCard({ data, format, brand }: TemplateProps<TimelineData>) {
  const layout = format.layout;
  const total = data.stops.length;
  const perColumn = layout === "wide" && total > 4 ? Math.ceil(total / 2) : Math.max(total, 1);
  const groups = chunk(data.stops, perColumn);

  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      <div className="flex min-h-0 flex-1 flex-col gap-7">
        <div className="min-w-0">
          <h1 className={cn("fm-display", layout === "wide" || layout === "square" ? "text-[52px]" : "text-[64px]")}>
            {data.title}
          </h1>
          <p className="mt-3 flex items-center gap-3 text-[25px] text-fm-muted">
            <Flag code={data.nation} className="h-[0.8em]" />
            {data.subtitle}
          </p>
        </div>
        <div className={cn("flex min-h-0 flex-1 gap-10", textSize(perColumn, layout))}>
          {groups.map((group, groupIndex) => (
            <ol key={groupIndex} className="flex min-w-0 flex-1 flex-col">
              {group.map((stop, i) => (
                <li key={i} className="relative flex max-h-[170px] min-h-0 flex-1 items-center gap-[0.9em] border-l-2 border-fm-line pl-[1.2em]">
                  <span
                    className={cn(
                      "absolute top-1/2 left-[-1px] size-[0.6em] -translate-x-1/2 -translate-y-1/2 rounded-full ring-[0.2em] ring-fm-bg",
                      stop.badge ? "bg-fm-accent" : "bg-fm-muted",
                    )}
                  />
                  <span className="fm-display w-[4em] shrink-0 text-[0.8em] tracking-normal text-fm-accent tabular-nums">
                    {stop.season}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate leading-[1.15] font-semibold">{stop.title}</span>
                    <span className="block truncate text-[0.72em] leading-[1.3] text-fm-muted">{stop.detail}</span>
                  </span>
                  {stop.badge ? (
                    <span className="shrink-0 rounded-full bg-fm-accent px-[0.7em] py-[0.2em] text-[0.7em] font-bold text-fm-on-accent">
                      {stop.badge}
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          ))}
        </div>
      </div>
    </CardFrame>
  );
}

export const timeline = defineTemplate<TimelineData>({
  id: "timeline",
  name: "Kariyer Yolculuğu",
  category: "Maç ve Lig",
  description: "Sezon sezon zaman çizelgesi",
  icon: Route,
  Component: TimelineCard,
  fields: [
    { key: "tag", label: "Etiket", type: "text" },
    { key: "title", label: "Başlık", type: "text" },
    { key: "subtitle", label: "Alt başlık", type: "text" },
    { key: "nation", label: "Bayrak", type: "country" },
    {
      key: "stops",
      label: "Duraklar",
      type: "list",
      itemLabel: "Durak",
      fields: [
        { key: "season", label: "Sezon", type: "text", size: "sm" },
        { key: "title", label: "Başlık", type: "text", size: "grow" },
        { key: "detail", label: "Detay", type: "text", size: "grow" },
        { key: "badge", label: "Rozet", type: "text", size: "sm" },
      ],
    },
  ],
  defaults: {
    tag: "Kariyer",
    title: "3. ligden Avrupa'ya",
    subtitle: "Altınordu ile 7 sezon",
    nation: "tr",
    stops: [
      { season: "24/25", title: "2. Lig · 4. sıra", detail: "Play-off yarı finalinde elendik", badge: "" },
      { season: "25/26", title: "2. Lig · 1. sıra", detail: "92 puan, lig rekoru", badge: "Şampiyon" },
      { season: "26/27", title: "1. Lig · 6. sıra", detail: "Play-off finalinde penaltılar", badge: "" },
      { season: "27/28", title: "1. Lig · 2. sıra", detail: "Altyapıdan 6 oyuncu ilk 11'de", badge: "Yükseldik" },
      { season: "28/29", title: "Süper Lig · 11. sıra", detail: "Ligde kalmak hedefti, rahat tuttuk", badge: "" },
      { season: "29/30", title: "Süper Lig · 5. sıra", detail: "Kulüp tarihinin ilk kupası", badge: "Kupa" },
      { season: "30/31", title: "Süper Lig · 3. sıra", detail: "Avrupa Ligi grup aşaması", badge: "Avrupa" },
    ],
  },
});
