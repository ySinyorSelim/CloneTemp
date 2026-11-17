import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { CardFrame, Flag, Label, Panel, Photo, toNumber } from "../frame";
import type { Layout, TemplateProps } from "../types";

type CompareRow = { label: string; a: string; b: string };

type ComparisonData = {
  tag: string;
  title: string;
  aName: string;
  aNation: string;
  aInfo: string;
  aPhoto: string;
  bName: string;
  bNation: string;
  bInfo: string;
  bPhoto: string;
  rows: CompareRow[];
  verdict: string;
};

const ROWS: Record<Layout, number> = { portrait: 9, square: 7, story: 12, wide: 8 };

function Side({ name, nation, info, photo, path, photoClass }: { name: string; nation: string; info: string; photo: string; path: string; photoClass: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center text-center">
      <Photo src={photo} alt={name} path={path} className={photoClass} />
      <h2 className="fm-display mt-5 max-w-full truncate text-[34px]">{name}</h2>
      <p className="mt-2 flex max-w-full items-center gap-2.5 text-[22px] text-fm-muted">
        <Flag code={nation} className="h-[0.8em]" />
        <span className="truncate">{info}</span>
      </p>
    </div>
  );
}

function Bar({ share, winner, reverse }: { share: number; winner: boolean; reverse?: boolean }) {
  return (
    <span className={cn("flex h-[8px] overflow-hidden rounded-full bg-fm-line", reverse && "justify-end")}>
      <span
        className={cn("rounded-full", winner ? "bg-fm-accent" : "bg-fm-muted")}
        style={{ width: `${Math.round(share * 100)}%` }}
      />
    </span>
  );
}

function ComparisonCard({ data, format, brand }: TemplateProps<ComparisonData>) {
  const layout = format.layout;

  const rows = (
    <Panel className="flex min-h-0 flex-1 flex-col justify-around px-8 py-4">
      {data.rows.slice(0, ROWS[layout]).map((row, i) => {
        const a = toNumber(row.a);
        const b = toNumber(row.b);
        const max = Math.max(a, b, 1);
        return (
          <div key={i} className="grid grid-cols-[2.6em_1fr_210px_1fr_2.6em] items-center gap-4 text-[26px] font-bold tabular-nums">
            <span className={cn(a > b && "text-fm-accent")}>{row.a}</span>
            <Bar share={a / max} winner={a >= b} reverse />
            <Label className="truncate text-center text-[15px]">{row.label}</Label>
            <Bar share={b / max} winner={b >= a} />
            <span className={cn("text-right", b > a && "text-fm-accent")}>{row.b}</span>
          </div>
        );
      })}
    </Panel>
  );

  const verdict = data.verdict ? (
    <p className="line-clamp-2 shrink-0 border-l-4 border-fm-accent pl-5 text-[23px] leading-[1.35]">{data.verdict}</p>
  ) : null;

  if (layout === "wide") {
    return (
      <CardFrame format={format} brand={brand} tag={data.tag}>
        <div className="flex min-h-0 flex-1 items-center gap-8">
          <div className="w-[300px] shrink-0">
            <Side name={data.aName} nation={data.aNation} info={data.aInfo} photo={data.aPhoto} path="aPhoto" photoClass="h-[300px] w-[260px]" />
          </div>
          <div className="flex h-full min-w-0 flex-1 flex-col gap-4">
            <h1 className="fm-display text-center text-[36px]">{data.title}</h1>
            {rows}
            {verdict}
          </div>
          <div className="w-[300px] shrink-0">
            <Side name={data.bName} nation={data.bNation} info={data.bInfo} photo={data.bPhoto} path="bPhoto" photoClass="h-[300px] w-[260px]" />
          </div>
        </div>
      </CardFrame>
    );
  }

  const photoClass = layout === "story" ? "h-[300px] w-[270px]" : layout === "square" ? "h-[190px] w-[180px]" : "h-[240px] w-[220px]";
  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      <div className="flex min-h-0 flex-1 flex-col gap-5">
        <h1 className={cn("fm-display text-center", layout === "square" ? "text-[40px]" : "text-[48px]")}>{data.title}</h1>
        <div className="flex items-center gap-4">
          <Side name={data.aName} nation={data.aNation} info={data.aInfo} photo={data.aPhoto} path="aPhoto" photoClass={photoClass} />
          <span className="fm-display shrink-0 text-[44px] tracking-normal text-fm-accent">VS</span>
          <Side name={data.bName} nation={data.bNation} info={data.bInfo} photo={data.bPhoto} path="bPhoto" photoClass={photoClass} />
        </div>
        {rows}
        {layout !== "square" ? verdict : null}
      </div>
    </CardFrame>
  );
}

export const comparison = defineTemplate<ComparisonData>({
  id: "comparison",
  name: "Karşılaştırma",
  category: "Oyuncu",
  description: "İki oyuncu yan yana, özellik özellik",
  icon: Scale,
  Component: ComparisonCard,
  fields: [
    { key: "tag", label: "Etiket", type: "text" },
    { key: "title", label: "Başlık", type: "text" },
    { key: "aName", label: "1. oyuncu", type: "text" },
    { key: "aInfo", label: "1. oyuncu bilgi", type: "text" },
    { key: "aNation", label: "1. oyuncu bayrak", type: "country" },
    { key: "aPhoto", label: "1. oyuncu fotoğraf", type: "image" },
    { key: "bName", label: "2. oyuncu", type: "text" },
    { key: "bInfo", label: "2. oyuncu bilgi", type: "text" },
    { key: "bNation", label: "2. oyuncu bayrak", type: "country" },
    { key: "bPhoto", label: "2. oyuncu fotoğraf", type: "image" },
    {
      key: "rows",
      label: "Karşılaştırma satırları",
      type: "list",
      itemLabel: "Satır",
      fields: [
        { key: "a", label: "1.", type: "text", size: "sm" },
        { key: "label", label: "Başlık", type: "text", size: "grow" },
        { key: "b", label: "2.", type: "text", size: "sm" },
      ],
    },
    { key: "verdict", label: "Karar", type: "textarea" },
  ],
  defaults: {
    tag: "Karşılaştırma",
    title: "Hangisini alırdın?",
    aName: "Aydın",
    aNation: "tr",
    aInfo: "19 · €14.5M",
    aPhoto: "",
    bName: "Morales",
    bNation: "es",
    bInfo: "20 · €18M",
    bPhoto: "",
    rows: [
      { a: "16", label: "Dripling", b: "14" },
      { a: "15", label: "Pas", b: "17" },
      { a: "17", label: "Vizyon", b: "16" },
      { a: "13", label: "Bitiricilik", b: "12" },
      { a: "18", label: "Özel Yetenek", b: "14" },
      { a: "15", label: "Hızlanma", b: "13" },
      { a: "11", label: "Çalışkanlık", b: "16" },
      { a: "9", label: "Güç", b: "13" },
      { a: "14", label: "Karar Alma", b: "16" },
      { a: "15", label: "Soğukkanlılık", b: "15" },
      { a: "14", label: "Hız", b: "12" },
      { a: "12", label: "Dayanıklılık", b: "15" },
    ],
    verdict: "Yaratıcılık istiyorsan Aydın, sistem oyuncusu istiyorsan Morales. Fiyat farkı Aydın'dan yana.",
  },
});
