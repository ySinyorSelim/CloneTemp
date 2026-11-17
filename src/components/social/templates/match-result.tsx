import { Goal, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { CardFrame, Crest, Label, Panel, toNumber } from "../frame";
import type { Layout, TemplateProps } from "../types";

type MatchStat = { label: string; home: string; away: string };

type MatchResultData = {
  tag: string;
  competition: string;
  info: string;
  homeName: string;
  homeCode: string;
  homeLogo: string;
  homeScore: string;
  awayName: string;
  awayCode: string;
  awayLogo: string;
  awayScore: string;
  homeScorers: string[];
  awayScorers: string[];
  stats: MatchStat[];
  motm: string;
  motmRating: string;
};

const STAT_ROWS: Record<Layout, number> = { portrait: 5, square: 4, story: 6, wide: 6 };

function Team({ name, code, logo, path, crestClass }: { name: string; code: string; logo: string; path: string; crestClass: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-4">
      <Crest src={logo} code={code} path={path} className={crestClass} />
      <span className="max-w-full truncate text-[30px] font-semibold">{name}</span>
    </div>
  );
}

function Scorers({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-1.5 text-[21px] text-fm-muted", className)}>
      {items.slice(0, 4).map((item, i) => (
        <li key={i} className="flex items-center justify-center gap-2.5">
          <Goal className="size-[20px] shrink-0 text-fm-accent" />
          <span className="truncate">{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Stats({ stats, rows }: { stats: MatchStat[]; rows: number }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col justify-around">
      {stats.slice(0, rows).map((stat, i) => {
        const home = toNumber(stat.home);
        const away = toNumber(stat.away);
        const empty = home + away === 0;
        return (
          <div key={i}>
            <div className="flex items-baseline justify-between text-[25px] font-bold tabular-nums">
              <span>{stat.home}</span>
              <Label className="text-[15px]">{stat.label}</Label>
              <span>{stat.away}</span>
            </div>
            <div className="mt-2 flex h-[8px] gap-1.5">
              <span className="rounded-full bg-fm-accent" style={{ flexGrow: empty ? 1 : home, flexBasis: 8 }} />
              <span className="rounded-full bg-fm-text/30" style={{ flexGrow: empty ? 1 : away, flexBasis: 8 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ManOfTheMatch({ name, rating }: { name: string; rating: string }) {
  if (!name) return null;
  return (
    <div className="flex items-center gap-4">
      <span className="grid size-[52px] shrink-0 place-items-center rounded-full bg-fm-accent text-fm-on-accent">
        <Star className="size-[26px] fill-current" />
      </span>
      <div className="min-w-0 flex-1">
        <Label className="text-[15px]">Maçın Adamı</Label>
        <p className="truncate text-[27px] font-semibold">{name}</p>
      </div>
      {rating ? <span className="fm-display text-[40px] tracking-normal text-fm-accent">{rating}</span> : null}
    </div>
  );
}

function MatchResultCard({ data, format, brand }: TemplateProps<MatchResultData>) {
  const layout = format.layout;
  const wide = layout === "wide";
  const crestClass = wide || layout === "square" ? "size-[124px] text-[36px]" : "size-[150px] text-[44px]";

  const scoreboard = (
    <div>
      <div className="text-center">
        <p className="fm-label text-[20px] text-fm-accent">{data.competition}</p>
        <p className="mt-2 text-[23px] text-fm-muted">{data.info}</p>
      </div>
      <div className={cn("grid grid-cols-[1fr_auto_1fr] items-center gap-4", wide || layout === "square" ? "mt-6" : "mt-9")}>
        <Team name={data.homeName} code={data.homeCode} logo={data.homeLogo} path="homeLogo" crestClass={crestClass} />
        <div
          className={cn(
            "fm-display flex items-center gap-5 tracking-normal tabular-nums",
            wide || layout === "square" ? "text-[130px]" : "text-[168px]",
          )}
        >
          <span>{data.homeScore}</span>
          <span className="h-[10px] w-[36px] rounded-full bg-fm-accent" />
          <span>{data.awayScore}</span>
        </div>
        <Team name={data.awayName} code={data.awayCode} logo={data.awayLogo} path="awayLogo" crestClass={crestClass} />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-10">
        <Scorers items={data.homeScorers} />
        <Scorers items={data.awayScorers} />
      </div>
    </div>
  );

  if (wide) {
    return (
      <CardFrame format={format} brand={brand} tag={data.tag}>
        <div className="flex min-h-0 flex-1 items-stretch gap-10">
          <div className="flex min-w-0 flex-1 flex-col justify-center">{scoreboard}</div>
          <Panel className="flex w-[560px] shrink-0 flex-col gap-5 px-8 py-6">
            <Stats stats={data.stats} rows={STAT_ROWS[layout]} />
            {data.motm ? <div className="border-t border-fm-line pt-5"><ManOfTheMatch name={data.motm} rating={data.motmRating} /></div> : null}
          </Panel>
        </div>
      </CardFrame>
    );
  }

  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      <div className="flex min-h-0 flex-1 flex-col gap-8">
        {scoreboard}
        <Panel className="flex min-h-0 flex-1 flex-col px-9 py-6">
          <Stats stats={data.stats} rows={STAT_ROWS[layout]} />
        </Panel>
        {layout !== "square" && data.motm ? (
          <Panel className="px-7 py-5">
            <ManOfTheMatch name={data.motm} rating={data.motmRating} />
          </Panel>
        ) : null}
      </div>
    </CardFrame>
  );
}

export const matchResult = defineTemplate<MatchResultData>({
  id: "match-result",
  name: "Maç Sonucu",
  category: "Maç ve Lig",
  description: "Skor, gol atanlar ve istatistikler",
  icon: Goal,
  Component: MatchResultCard,
  fields: [
    { key: "tag", label: "Etiket", type: "text" },
    { key: "competition", label: "Organizasyon", type: "text" },
    { key: "info", label: "Maç bilgisi", type: "text" },
    { key: "homeName", label: "Ev sahibi", type: "text" },
    { key: "homeCode", label: "Ev sahibi kısaltma", type: "text" },
    { key: "homeLogo", label: "Ev sahibi logo", type: "image" },
    { key: "homeScore", label: "Ev sahibi skor", type: "text" },
    { key: "awayName", label: "Deplasman", type: "text" },
    { key: "awayCode", label: "Deplasman kısaltma", type: "text" },
    { key: "awayLogo", label: "Deplasman logo", type: "image" },
    { key: "awayScore", label: "Deplasman skor", type: "text" },
    { key: "homeScorers", label: "Ev sahibi golleri", type: "lines", hint: "Her satır bir gol (en fazla 4)" },
    { key: "awayScorers", label: "Deplasman golleri", type: "lines", hint: "Her satır bir gol (en fazla 4)" },
    {
      key: "stats",
      label: "İstatistikler",
      type: "list",
      itemLabel: "İstatistik",
      fields: [
        { key: "home", label: "Ev", type: "text", size: "sm" },
        { key: "label", label: "Başlık", type: "text", size: "grow" },
        { key: "away", label: "Dep", type: "text", size: "sm" },
      ],
    },
    { key: "motm", label: "Maçın adamı", type: "text" },
    { key: "motmRating", label: "Maçın adamı puanı", type: "text" },
  ],
  defaults: {
    tag: "Maç Sonucu",
    competition: "Süper Lig",
    info: "12. Hafta · Gürsel Aksel Stadyumu",
    homeName: "Göztepe",
    homeCode: "GÖZ",
    homeLogo: "",
    homeScore: "3",
    awayName: "Beşiktaş",
    awayCode: "BJK",
    awayLogo: "",
    awayScore: "1",
    homeScorers: ["Aydın 14'", "Kahveci 52'", "Aydın 77'"],
    awayScorers: ["Yıldız 63'"],
    stats: [
      { home: "%54", label: "Topla oynama", away: "%46" },
      { home: "17", label: "Şut", away: "9" },
      { home: "8", label: "İsabetli şut", away: "3" },
      { home: "2.41", label: "Gol beklentisi (xG)", away: "0.87" },
      { home: "%88", label: "Pas isabeti", away: "%81" },
      { home: "6", label: "Korner", away: "4" },
    ],
    motm: "Kerem Aydın",
    motmRating: "9.1",
  },
});
