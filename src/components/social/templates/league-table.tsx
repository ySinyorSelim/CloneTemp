import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { CardFrame, chunk } from "../frame";
import type { Layout, TemplateProps } from "../types";

type TableRow = {
  team: string;
  played: string;
  won: string;
  drawn: string;
  lost: string;
  diff: string;
  points: string;
  form: string;
};

type LeagueTableData = {
  tag: string;
  title: string;
  subtitle: string;
  highlight: string;
  topCount: number;
  topLabel: string;
  midCount: number;
  midLabel: string;
  bottomCount: number;
  bottomLabel: string;
  rows: TableRow[];
};

type ColumnKey = "played" | "won" | "drawn" | "lost" | "diff";

const COLUMNS: Record<Layout, ColumnKey[]> = {
  portrait: ["played", "won", "drawn", "lost", "diff"],
  square: ["played", "won", "drawn", "lost", "diff"],
  story: ["played", "won", "drawn", "lost", "diff"],
  wide: ["played", "diff"],
};

const COLUMN_LABEL: Record<ColumnKey, string> = { played: "O", won: "G", drawn: "B", lost: "M", diff: "AV" };

const FORM_COLOR: Record<string, string> = { G: "bg-fm-good", B: "bg-fm-muted", M: "bg-fm-bad" };

function textSize(rowCount: number, layout: Layout): string {
  if (layout === "story") return rowCount <= 14 ? "text-[27px]" : "text-[24px]";
  if (layout === "square") return rowCount <= 10 ? "text-[25px]" : rowCount <= 14 ? "text-[21px]" : "text-[18px]";
  return rowCount <= 10 ? "text-[26px]" : rowCount <= 14 ? "text-[23px]" : "text-[21px]";
}

function LeagueTableCard({ data, format, brand }: TemplateProps<LeagueTableData>) {
  const layout = format.layout;
  const total = data.rows.length;
  const perColumn = layout === "wide" && total > 10 ? Math.ceil(total / 2) : Math.max(total, 1);
  const groups = chunk(data.rows, perColumn);
  const columns = COLUMNS[layout];
  const showForm = layout !== "square";
  const size = textSize(perColumn, layout);

  const zone = (position: number) => {
    if (position <= data.topCount) return "bg-fm-accent";
    if (position <= data.topCount + data.midCount) return "bg-fm-warn";
    if (position > total - data.bottomCount) return "bg-fm-bad";
    return "bg-transparent";
  };

  const legend = [
    { label: data.topLabel, color: "bg-fm-accent", show: data.topCount > 0 },
    { label: data.midLabel, color: "bg-fm-warn", show: data.midCount > 0 },
    { label: data.bottomLabel, color: "bg-fm-bad", show: data.bottomCount > 0 },
  ].filter((item) => item.show && item.label);

  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      <div className="flex min-h-0 flex-1 flex-col gap-5">
        <div className="flex items-end justify-between gap-8">
          <div className="min-w-0">
            <h1 className={cn("fm-display", layout === "wide" || layout === "square" ? "text-[52px]" : "text-[64px]")}>
              {data.title}
            </h1>
            <p className="mt-3 text-[25px] text-fm-muted">{data.subtitle}</p>
          </div>
          {legend.length > 0 ? (
            <ul className={cn("flex shrink-0 gap-x-6 gap-y-1 text-[18px] text-fm-muted", layout === "wide" ? "flex-row" : "flex-col")}>
              {legend.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5">
                  <span className={cn("size-[10px] rounded-full", item.color)} />
                  {item.label}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className={cn("flex min-h-0 flex-1 gap-8", size)}>
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex min-w-0 flex-1 flex-col">
              <div className="fm-label flex items-center pb-2 pl-[22px] pr-5 text-[0.62em] text-fm-muted">
                <span className="w-[3.4em]">#</span>
                <span className="flex-1">Takım</span>
                {columns.map((key) => (
                  <span key={key} className="w-[3.4em] text-center">
                    {COLUMN_LABEL[key]}
                  </span>
                ))}
                <span className="w-[3.6em] text-center">P</span>
                {showForm ? <span className="w-[8.4em] text-right">Form</span> : null}
              </div>
              {group.map((row, i) => {
                const position = groupIndex * perColumn + i + 1;
                const highlighted = data.highlight !== "" && row.team === data.highlight;
                return (
                  <div
                    key={i}
                    className={cn(
                      "relative flex max-h-[84px] min-h-0 flex-1 items-center rounded-[14px] pl-[22px] pr-5",
                      highlighted
                        ? "bg-fm-accent/15 ring-2 ring-fm-accent/50 ring-inset"
                        : i % 2 === 0
                          ? "bg-fm-surface"
                          : "",
                    )}
                  >
                    <span className={cn("absolute inset-y-[22%] left-[7px] w-[5px] rounded-full", zone(position))} />
                    <span className="w-[2.1em] font-semibold text-fm-muted tabular-nums">{position}</span>
                    <span className={cn("min-w-0 flex-1 truncate font-semibold", highlighted && "text-fm-accent")}>
                      {row.team}
                    </span>
                    {columns.map((key) => (
                      <span key={key} className="w-[2.1em] text-center text-fm-muted tabular-nums">
                        {row[key]}
                      </span>
                    ))}
                    <span className="w-[2.2em] text-center font-bold tabular-nums">{row.points}</span>
                    {showForm ? (
                      <span className="flex w-[5.2em] justify-end gap-[0.22em]">
                        {row.form
                          .toLocaleUpperCase("tr")
                          .split("")
                          .slice(0, 5)
                          .map((result, j) => (
                            <span
                              key={j}
                              className={cn("size-[0.6em] rounded-full", FORM_COLOR[result] ?? "bg-fm-line")}
                            />
                          ))}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </CardFrame>
  );
}

const row = (team: string, won: number, drawn: number, lost: number, diff: number, form: string): TableRow => ({
  team,
  played: String(won + drawn + lost),
  won: String(won),
  drawn: String(drawn),
  lost: String(lost),
  diff: diff > 0 ? `+${diff}` : String(diff),
  points: String(won * 3 + drawn),
  form,
});

export const leagueTable = defineTemplate<LeagueTableData>({
  id: "league-table",
  name: "Puan Tablosu",
  category: "Maç ve Lig",
  description: "Lig sıralaması, bölgeler ve form",
  icon: Trophy,
  Component: LeagueTableCard,
  fields: [
    { key: "tag", label: "Etiket", type: "text" },
    { key: "title", label: "Başlık", type: "text" },
    { key: "subtitle", label: "Alt başlık", type: "text" },
    { key: "highlight", label: "Vurgulanacak takım", type: "text", hint: "Takım adıyla birebir aynı yazın" },
    { key: "topCount", label: "Üst bölge (takım sayısı)", type: "number", min: 0, max: 10 },
    { key: "topLabel", label: "Üst bölge adı", type: "text" },
    { key: "midCount", label: "İkinci bölge (takım sayısı)", type: "number", min: 0, max: 10 },
    { key: "midLabel", label: "İkinci bölge adı", type: "text" },
    { key: "bottomCount", label: "Alt bölge (takım sayısı)", type: "number", min: 0, max: 10 },
    { key: "bottomLabel", label: "Alt bölge adı", type: "text" },
    {
      key: "rows",
      label: "Takımlar",
      type: "list",
      itemLabel: "Takım",
      hint: "Form: G / B / M harfleri, en eskiden en yeniye (örn. GGBMG)",
      fields: [
        { key: "team", label: "Takım", type: "text", size: "grow" },
        { key: "played", label: "O", type: "text", size: "xs" },
        { key: "won", label: "G", type: "text", size: "xs" },
        { key: "drawn", label: "B", type: "text", size: "xs" },
        { key: "lost", label: "M", type: "text", size: "xs" },
        { key: "diff", label: "AV", type: "text", size: "xs" },
        { key: "points", label: "P", type: "text", size: "xs" },
        { key: "form", label: "Form", type: "text", size: "sm" },
      ],
    },
  ],
  defaults: {
    tag: "Puan Tablosu",
    title: "Süper Lig",
    subtitle: "2026/27 · 12. hafta sonu",
    highlight: "Göztepe",
    topCount: 2,
    topLabel: "Şampiyonlar Ligi",
    midCount: 2,
    midLabel: "Avrupa kupaları",
    bottomCount: 3,
    bottomLabel: "Küme düşme",
    rows: [
      row("Galatasaray", 10, 1, 1, 21, "GGGBG"),
      row("Fenerbahçe", 9, 2, 1, 18, "GBGGG"),
      row("Göztepe", 8, 2, 2, 11, "GGMGG"),
      row("Beşiktaş", 7, 3, 2, 9, "BGGMG"),
      row("Trabzonspor", 6, 4, 2, 6, "GBBGM"),
      row("Samsunspor", 6, 2, 4, 4, "MGGBG"),
      row("Başakşehir", 5, 4, 3, 3, "BGMGB"),
      row("Eyüpspor", 5, 2, 5, 0, "MGMGG"),
      row("Kasımpaşa", 4, 4, 4, -1, "BBGMB"),
      row("Konyaspor", 4, 3, 5, -2, "GMBMG"),
      row("Antalyaspor", 4, 2, 6, -5, "MMGBM"),
      row("Rizespor", 3, 4, 5, -4, "BMBGM"),
      row("Alanyaspor", 3, 3, 6, -6, "MBMGB"),
      row("Gaziantep FK", 3, 2, 7, -8, "MMGMB"),
      row("Kayserispor", 2, 4, 6, -9, "BMMBG"),
      row("Kocaelispor", 2, 3, 7, -10, "MBMMB"),
      row("Gençlerbirliği", 2, 2, 8, -12, "MMBMM"),
      row("Karagümrük", 1, 3, 8, -15, "MBMMM"),
    ],
  },
});
