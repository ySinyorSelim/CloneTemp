import { Goal, ListOrdered, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { CardFrame, Flag, chunk } from "../frame";
import type { Layout, TemplateProps } from "../types";

type ListItem = { name: string; nation: string; detail: string; value: string };

type TopListData = {
  tag: string;
  title: string;
  subtitle: string;
  valueLabel: string;
  items: ListItem[];
};

function textSize(rowCount: number, layout: Layout): string {
  if (layout === "story") return "text-[30px]";
  if (layout === "square") return rowCount <= 6 ? "text-[28px]" : rowCount <= 8 ? "text-[25px]" : "text-[22px]";
  return rowCount <= 6 ? "text-[30px]" : "text-[26px]";
}

function TopListCard({ data, format, brand }: TemplateProps<TopListData>) {
  const layout = format.layout;
  const total = data.items.length;
  const perColumn = layout === "wide" && total > 5 ? Math.ceil(total / 2) : Math.max(total, 1);
  const groups = chunk(data.items, perColumn);

  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <div className="flex items-end justify-between gap-8">
          <div className="min-w-0">
            <h1 className={cn("fm-display", layout === "wide" || layout === "square" ? "text-[52px]" : "text-[64px]")}>
              {data.title}
            </h1>
            <p className="mt-3 text-[25px] text-fm-muted">{data.subtitle}</p>
          </div>
          {data.valueLabel ? (
            <span className="fm-label shrink-0 pb-1 text-[17px] text-fm-muted">{data.valueLabel}</span>
          ) : null}
        </div>

        <div className={cn("flex min-h-0 flex-1 gap-6", textSize(perColumn, layout))}>
          {groups.map((group, groupIndex) => (
            <ol key={groupIndex} className="flex min-w-0 flex-1 flex-col gap-[0.4em]">
              {group.map((item, i) => {
                const rank = groupIndex * perColumn + i + 1;
                return (
                  <li
                    key={i}
                    className="flex max-h-[132px] min-h-0 flex-1 items-center gap-[0.8em] rounded-[20px] border border-fm-line bg-fm-surface px-[0.9em]"
                  >
                    <span
                      className={cn(
                        "fm-display w-[1.5em] text-[1.35em] tracking-normal tabular-nums",
                        rank <= 3 ? "text-fm-accent" : "text-fm-muted",
                      )}
                    >
                      {String(rank).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-[0.4em] leading-[1.15] font-semibold">
                        <Flag code={item.nation} className="h-[0.7em]" />
                        <span className="truncate">{item.name}</span>
                      </span>
                      <span className="block truncate text-[0.72em] leading-[1.25] text-fm-muted">{item.detail}</span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-[0.7em] py-[0.2em] text-[0.85em] font-bold tabular-nums",
                        rank <= 3 ? "bg-fm-accent text-fm-on-accent" : "bg-fm-line",
                      )}
                    >
                      {item.value}
                    </span>
                  </li>
                );
              })}
            </ol>
          ))}
        </div>
      </div>
    </CardFrame>
  );
}

export const topList = defineTemplate<TopListData>({
  id: "top-list",
  name: "Liste / Sıralama",
  category: "İçerik",
  description: "Wonderkid, kelepir, gol krallığı…",
  icon: ListOrdered,
  Component: TopListCard,
  fields: [
    { key: "tag", label: "Etiket", type: "text" },
    { key: "title", label: "Başlık", type: "text" },
    { key: "subtitle", label: "Alt başlık", type: "text" },
    { key: "valueLabel", label: "Değer sütunu adı", type: "text" },
    {
      key: "items",
      label: "Maddeler",
      type: "list",
      itemLabel: "Madde",
      fields: [
        { key: "nation", label: "Ülke", type: "country", size: "md" },
        { key: "name", label: "İsim", type: "text", size: "grow" },
        { key: "detail", label: "Detay", type: "text", size: "grow" },
        { key: "value", label: "Değer", type: "text", size: "sm" },
      ],
    },
  ],
  defaults: {
    tag: "Wonderkid",
    title: "En iyi 10 wonderkid",
    subtitle: "21 yaş altı · Orta saha ve hücum",
    valueLabel: "Bonservis",
    items: [
      { name: "Kerem Aydın", nation: "tr", detail: "Göztepe · OOS (M) · 19", value: "€14.5M" },
      { name: "Mateo Ferreyra", nation: "ar", detail: "Vélez · FV (M) · 18", value: "€9M" },
      { name: "Lucas Brandt", nation: "de", detail: "Freiburg · OS (M) · 20", value: "€22M" },
      { name: "Ibrahima Sané", nation: "sn", detail: "Metz · OK (SĞ) · 18", value: "€6.5M" },
      { name: "Tiago Varela", nation: "pt", detail: "Braga · SF (M) · 19", value: "€11M" },
      { name: "Emre Soylu", nation: "tr", detail: "Altınordu · DOS · 17", value: "€2.8M" },
      { name: "Nils Åkesson", nation: "se", detail: "Malmö · OK (SL) · 19", value: "€4M" },
      { name: "Javi Morales", nation: "es", detail: "Betis · OS (M) · 20", value: "€18M" },
      { name: "Kofi Mensah", nation: "gh", detail: "Nordsjælland · SF (M) · 18", value: "€5.5M" },
      { name: "Dario Kovač", nation: "hr", detail: "Dinamo Zagreb · OOS (M) · 19", value: "€8M" },
    ],
  },
});

export const topScorers = defineTemplate<TopListData>({
  id: "top-scorers",
  name: "Gol Krallığı",
  category: "Maç ve Lig",
  description: "Gol, asist, puan sıralamaları",
  icon: Goal,
  Component: TopListCard,
  fields: topList.fields,
  defaults: {
    tag: "Gol Krallığı",
    title: "Gol krallığı",
    subtitle: "Süper Lig · 12. hafta sonu",
    valueLabel: "Gol",
    items: [
      { name: "Kahveci", nation: "tr", detail: "Göztepe · 12 maç", value: "11" },
      { name: "Okafor", nation: "ng", detail: "Galatasaray · 11 maç", value: "10" },
      { name: "Silva", nation: "br", detail: "Fenerbahçe · 12 maç", value: "9" },
      { name: "Kerem Aydın", nation: "tr", detail: "Göztepe · 12 maç", value: "8" },
      { name: "Rossi", nation: "it", detail: "Beşiktaş · 10 maç", value: "7" },
      { name: "Dubois", nation: "fr", detail: "Trabzonspor · 12 maç", value: "7" },
      { name: "Tanaka", nation: "jp", detail: "Samsunspor · 11 maç", value: "6" },
      { name: "De Vries", nation: "nl", detail: "Başakşehir · 12 maç", value: "6" },
    ],
  },
});

export const youthIntake = defineTemplate<TopListData>({
  id: "youth-intake",
  name: "Altyapı Jenerasyonu",
  category: "Kadro ve Taktik",
  description: "Yeni gelen gençler ve potansiyelleri",
  icon: Sprout,
  Component: TopListCard,
  fields: topList.fields,
  defaults: {
    tag: "Altyapı",
    title: "2027 jenerasyonu",
    subtitle: "Altyapı sorumlusu: \"Altın jenerasyon\"",
    valueLabel: "Potansiyel",
    items: [
      { name: "Emre Soylu", nation: "tr", detail: "DOS · 15 yaş · Model vatandaş", value: "★★★★★" },
      { name: "Barış Tekin", nation: "tr", detail: "STP · 16 yaş · Kararlı", value: "★★★★½" },
      { name: "Deniz Uçar", nation: "tr", detail: "OK (SL) · 15 yaş · Hırslı", value: "★★★★" },
      { name: "Yusuf Kara", nation: "de", detail: "SF · 16 yaş · Dengeli", value: "★★★½" },
      { name: "Ali Öztürk", nation: "tr", detail: "KL · 15 yaş · Profesyonel", value: "★★★½" },
      { name: "Mert Arslan", nation: "tr", detail: "OOS · 16 yaş · Dengeli", value: "★★★" },
    ],
  },
});
