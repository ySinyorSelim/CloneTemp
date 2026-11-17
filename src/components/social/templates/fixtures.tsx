import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { CardFrame, chunk } from "../frame";
import type { Layout, TemplateProps } from "../types";

type Match = { date: string; home: string; score: string; away: string; note: string };

type FixturesData = {
  tag: string;
  title: string;
  subtitle: string;
  highlight: string;
  matches: Match[];
};

function textSize(rowCount: number, layout: Layout): string {
  if (layout === "story") return "text-[28px]";
  if (layout === "square") return rowCount <= 6 ? "text-[26px]" : rowCount <= 8 ? "text-[23px]" : "text-[21px]";
  return rowCount <= 6 ? "text-[28px]" : "text-[25px]";
}

/** Colours the score for the highlighted team: win / draw / loss. */
function scoreTone(match: Match, highlight: string): string {
  const goals = match.score.match(/(\d+)\D+(\d+)/);
  if (!goals || !highlight || (match.home !== highlight && match.away !== highlight)) return "bg-fm-line";
  const [home, away] = [Number(goals[1]), Number(goals[2])];
  if (home === away) return "bg-fm-muted/30";
  const won = (home > away) === (match.home === highlight);
  return won ? "bg-fm-good/25 text-fm-good" : "bg-fm-bad/25 text-fm-bad";
}

function FixturesCard({ data, format, brand }: TemplateProps<FixturesData>) {
  const layout = format.layout;
  const total = data.matches.length;
  const perColumn = layout === "wide" && total > 6 ? Math.ceil(total / 2) : Math.max(total, 1);
  const groups = chunk(data.matches, perColumn);

  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <div className="min-w-0">
          <h1 className={cn("fm-display", layout === "wide" || layout === "square" ? "text-[52px]" : "text-[64px]")}>
            {data.title}
          </h1>
          <p className="mt-3 text-[25px] text-fm-muted">{data.subtitle}</p>
        </div>
        <div className={cn("flex min-h-0 flex-1 gap-6", textSize(perColumn, layout))}>
          {groups.map((group, groupIndex) => (
            <ul key={groupIndex} className="flex min-w-0 flex-1 flex-col gap-[0.4em]">
              {group.map((match, i) => (
                <li
                  key={i}
                  className="flex max-h-[120px] min-h-0 flex-1 items-center gap-[0.6em] rounded-[20px] border border-fm-line bg-fm-surface px-[0.8em]"
                >
                  <span className="w-[4.4em] shrink-0 truncate">
                    <span className="fm-label text-[0.58em] text-fm-muted">{match.date}</span>
                  </span>
                  <span className={cn("min-w-0 flex-1 truncate text-right font-semibold", match.home === data.highlight && "text-fm-accent")}>
                    {match.home}
                  </span>
                  <span
                    className={cn(
                      "min-w-[3.4em] shrink-0 rounded-[0.5em] px-[0.5em] py-[0.12em] text-center font-bold tabular-nums",
                      scoreTone(match, data.highlight),
                    )}
                  >
                    {match.score}
                  </span>
                  <span className={cn("min-w-0 flex-1 truncate font-semibold", match.away === data.highlight && "text-fm-accent")}>
                    {match.away}
                  </span>
                  <span className="w-[4.4em] shrink-0 truncate text-right">
                    <span className="text-[0.62em] text-fm-muted">{match.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </CardFrame>
  );
}

export const fixtures = defineTemplate<FixturesData>({
  id: "fixtures",
  name: "Fikstür / Sonuçlar",
  category: "Maç ve Lig",
  description: "Aylık sonuçlar ya da sıradaki maçlar",
  icon: CalendarDays,
  Component: FixturesCard,
  fields: [
    { key: "tag", label: "Etiket", type: "text" },
    { key: "title", label: "Başlık", type: "text" },
    { key: "subtitle", label: "Alt başlık", type: "text" },
    { key: "highlight", label: "Vurgulanacak takım", type: "text", hint: "Skor rengi bu takıma göre belirlenir" },
    {
      key: "matches",
      label: "Maçlar",
      type: "list",
      itemLabel: "Maç",
      hint: "Oynanmamış maçlar için skora saat yazabilirsiniz (20:00)",
      fields: [
        { key: "date", label: "Tarih", type: "text", size: "sm" },
        { key: "home", label: "Ev sahibi", type: "text", size: "grow" },
        { key: "score", label: "Skor", type: "text", size: "xs" },
        { key: "away", label: "Deplasman", type: "text", size: "grow" },
        { key: "note", label: "Not", type: "text", size: "sm" },
      ],
    },
  ],
  defaults: {
    tag: "Sonuçlar",
    title: "Kasım ayı",
    subtitle: "Göztepe · 5 galibiyet, 1 beraberlik, 1 mağlubiyet",
    highlight: "Göztepe",
    matches: [
      { date: "1 Kas", home: "Göztepe", score: "3-1", away: "Beşiktaş", note: "Süper Lig" },
      { date: "5 Kas", home: "Braga", score: "1-2", away: "Göztepe", note: "Avrupa Ligi" },
      { date: "9 Kas", home: "Konyaspor", score: "0-0", away: "Göztepe", note: "Süper Lig" },
      { date: "22 Kas", home: "Göztepe", score: "4-0", away: "Rizespor", note: "Süper Lig" },
      { date: "26 Kas", home: "Göztepe", score: "2-1", away: "Freiburg", note: "Avrupa Ligi" },
      { date: "29 Kas", home: "Fenerbahçe", score: "2-1", away: "Göztepe", note: "Süper Lig" },
      { date: "3 Ara", home: "Göztepe", score: "5-0", away: "Bodrum FK", note: "Türkiye Kupası" },
      { date: "7 Ara", home: "Göztepe", score: "20:00", away: "Trabzonspor", note: "Süper Lig" },
    ],
  },
});
