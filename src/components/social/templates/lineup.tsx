import { Shirt } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { CardFrame, Label, Panel } from "../frame";
import type { Layout, TemplateProps } from "../types";

type LineupPlayer = { name: string; number: string; rating: string };

type LineupData = {
  tag: string;
  title: string;
  subtitle: string;
  formation: string;
  coach: string;
  players: LineupPlayer[];
  bench: string[];
};

type Spot = { depth: number; lateral: number };

/** "4-2-3-1" → pitch spots, goalkeeper first, then each line left to right. */
function formationSpots(formation: string): Spot[] {
  let lines = formation
    .split(/[^0-9]+/)
    .map(Number)
    .filter((n) => n > 0 && n <= 6);
  if (lines.length < 2 || lines.reduce((a, b) => a + b, 0) !== 10) lines = [4, 4, 2];

  const spots: Spot[] = [{ depth: 0.085, lateral: 0.5 }];
  lines.forEach((count, lineIndex) => {
    const depth = 0.26 + (lineIndex / (lines.length - 1)) * 0.6;
    const span = Math.min(0.8, 0.27 * (count - 1));
    for (let i = 0; i < count; i++) {
      const lateral = count === 1 ? 0.5 : 0.5 - span / 2 + (span * i) / (count - 1);
      spots.push({ depth, lateral });
    }
  });
  return spots;
}

const MARKER: Record<Layout, { dot: string; name: string }> = {
  portrait: { dot: "size-[74px] text-[28px]", name: "text-[20px]" },
  square: { dot: "size-[62px] text-[24px]", name: "text-[18px]" },
  story: { dot: "size-[84px] text-[32px]", name: "text-[23px]" },
  wide: { dot: "size-[60px] text-[23px]", name: "text-[18px]" },
};

function PitchLines({ wide }: { wide: boolean }) {
  // Drawn for a vertical 68×105 pitch; the wide variant swaps the axes.
  const rect = (x: number, y: number, w: number, h: number) =>
    wide ? { x: y, y: x, width: h, height: w } : { x, y, width: w, height: h };
  const half = wide ? { x1: 52.5, y1: 1, x2: 52.5, y2: 67 } : { x1: 1, y1: 52.5, x2: 67, y2: 52.5 };
  return (
    <svg
      viewBox={wide ? "0 0 105 68" : "0 0 68 105"}
      preserveAspectRatio="none"
      className="absolute inset-0 size-full fill-none stroke-fm-text/20"
    >
      <g strokeWidth={2} vectorEffect="non-scaling-stroke">
        {[rect(1, 1, 66, 103), rect(13.85, 1, 40.3, 16.5), rect(24.85, 1, 18.3, 5.5), rect(13.85, 87.5, 40.3, 16.5), rect(24.85, 98.5, 18.3, 5.5)].map(
          (r, i) => (
            <rect key={i} {...r} vectorEffect="non-scaling-stroke" />
          ),
        )}
        <line {...half} vectorEffect="non-scaling-stroke" />
        <ellipse cx={wide ? 52.5 : 34} cy={wide ? 34 : 52.5} rx={wide ? 8 : 10} ry={wide ? 10 : 8} vectorEffect="non-scaling-stroke" />
      </g>
    </svg>
  );
}

function Pitch({ data, layout }: { data: LineupData; layout: Layout }) {
  const wide = layout === "wide";
  const spots = formationSpots(data.formation);
  const size = MARKER[layout];
  return (
    <div
      className={cn(
        "relative min-h-0 flex-1 overflow-hidden rounded-[28px] border border-fm-line",
        wide ? "fm-pitch-wide" : "fm-pitch",
      )}
    >
      <PitchLines wide={wide} />
      {spots.map((spot, i) => {
        const player = data.players[i];
        if (!player) return null;
        const position = wide
          ? { left: `${spot.depth * 100}%`, top: `${(0.48 + (spot.lateral - 0.5) * 0.84) * 100}%` }
          : { left: `${spot.lateral * 100}%`, top: `${(1 - spot.depth) * 100}%` };
        return (
          <div
            key={i}
            className="absolute flex w-[220px] -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={position}
          >
            <span className="relative">
              <span
                className={cn(
                  "fm-display grid place-items-center rounded-full bg-fm-accent tracking-normal text-fm-on-accent shadow-[0_8px_24px_rgb(0_0_0/0.35)] ring-4 ring-fm-bg/60",
                  size.dot,
                )}
              >
                {player.number}
              </span>
              {player.rating ? (
                <span className="absolute -top-2 -right-7 rounded-full bg-fm-text px-2 py-0.5 text-[15px] font-bold text-fm-bg tabular-nums">
                  {player.rating}
                </span>
              ) : null}
            </span>
            <span
              className={cn(
                "mt-2 max-w-full truncate rounded-full bg-fm-bg/85 px-3.5 py-1 font-semibold",
                size.name,
              )}
            >
              {player.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function LineupCard({ data, format, brand }: TemplateProps<LineupData>) {
  const layout = format.layout;

  if (layout === "wide") {
    return (
      <CardFrame format={format} brand={brand} tag={data.tag}>
        <div className="flex min-h-0 flex-1 gap-10">
          <div className="flex w-[400px] shrink-0 flex-col justify-between">
            <div>
              <h1 className="fm-display text-[58px]">{data.title}</h1>
              <p className="mt-4 text-[25px] text-fm-muted">{data.subtitle}</p>
            </div>
            <div className="flex gap-10">
              <div>
                <Label>Diziliş</Label>
                <p className="fm-display mt-2 text-[40px] tracking-normal text-fm-accent">{data.formation}</p>
              </div>
              {data.coach ? (
                <div className="min-w-0">
                  <Label>Teknik Direktör</Label>
                  <p className="mt-2 truncate text-[25px] font-semibold">{data.coach}</p>
                </div>
              ) : null}
            </div>
            {data.bench.length > 0 ? (
              <Panel className="px-6 py-5">
                <Label>Yedekler</Label>
                <p className="mt-2 line-clamp-4 text-[21px] leading-[1.45]">{data.bench.join(" · ")}</p>
              </Panel>
            ) : null}
          </div>
          <Pitch data={data} layout={layout} />
        </div>
      </CardFrame>
    );
  }

  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      <div className="flex min-h-0 flex-1 flex-col gap-7">
        <div className="flex items-end justify-between gap-8">
          <div className="min-w-0">
            <h1 className={cn("fm-display", layout === "square" ? "text-[56px]" : "text-[68px]")}>{data.title}</h1>
            <p className="mt-3 text-[26px] text-fm-muted">{data.subtitle}</p>
          </div>
          <div className="shrink-0 text-right">
            <Label>Diziliş</Label>
            <p className="fm-display mt-1 text-[44px] tracking-normal text-fm-accent">{data.formation}</p>
          </div>
        </div>

        <Pitch data={data} layout={layout} />

        {layout !== "square" && (data.bench.length > 0 || data.coach) ? (
          <div className="flex items-start gap-8">
            {data.bench.length > 0 ? (
              <div className="min-w-0 flex-1">
                <Label>Yedekler</Label>
                <p className="mt-1.5 line-clamp-2 text-[21px] leading-[1.4]">{data.bench.join(" · ")}</p>
              </div>
            ) : null}
            {data.coach ? (
              <div className="shrink-0 text-right">
                <Label>Teknik Direktör</Label>
                <p className="mt-1.5 text-[23px] font-semibold">{data.coach}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </CardFrame>
  );
}

export const lineup = defineTemplate<LineupData>({
  id: "lineup",
  name: "İlk 11",
  description: "Dizilişe göre otomatik saha yerleşimi",
  icon: Shirt,
  Component: LineupCard,
  fields: [
    { key: "tag", label: "Etiket", type: "text" },
    { key: "title", label: "Başlık", type: "text" },
    { key: "subtitle", label: "Alt başlık", type: "text" },
    { key: "formation", label: "Diziliş", type: "text", hint: "Örn. 4-2-3-1, 4-4-2, 3-5-2 (toplam 10 saha oyuncusu)" },
    { key: "coach", label: "Teknik direktör", type: "text" },
    {
      key: "players",
      label: "Oyuncular",
      type: "list",
      itemLabel: "Oyuncu",
      hint: "Sıra: kaleci, sonra her hat soldan sağa",
      fields: [
        { key: "number", label: "No", type: "text", size: "xs" },
        { key: "name", label: "İsim", type: "text", size: "grow" },
        { key: "rating", label: "Puan", type: "text", size: "xs" },
      ],
    },
    { key: "bench", label: "Yedekler", type: "lines", hint: "Her satır bir oyuncu" },
  ],
  defaults: {
    tag: "İlk 11",
    title: "Haftanın 11'i",
    subtitle: "Süper Lig · 12. Hafta",
    formation: "4-2-3-1",
    coach: "S. Yalçın",
    players: [
      { number: "1", name: "Günok", rating: "7.4" },
      { number: "3", name: "Elmalı", rating: "7.1" },
      { number: "4", name: "Bardakcı", rating: "7.8" },
      { number: "5", name: "Demiral", rating: "7.3" },
      { number: "2", name: "Çelik", rating: "7.0" },
      { number: "6", name: "Kökçü", rating: "7.6" },
      { number: "8", name: "Yüksek", rating: "7.2" },
      { number: "11", name: "Yıldız", rating: "8.4" },
      { number: "10", name: "Aydın", rating: "9.1" },
      { number: "7", name: "Aktürkoğlu", rating: "7.7" },
      { number: "9", name: "Kahveci", rating: "8.0" },
    ],
    bench: ["Çakır", "Kabak", "Müldür", "Özcan", "Akgün", "Ünder", "Tosun"],
  },
});
