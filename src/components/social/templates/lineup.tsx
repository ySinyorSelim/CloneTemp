import { ClipboardList, Globe, Shirt } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { Avatar, CardFrame, Flag, Label, Panel } from "../frame";
import type { Field, Layout, TemplateProps } from "../types";

type LineupPlayer = { name: string; number: string; nation: string; rating: string; photo: string };

type LineupData = {
  tag: string;
  title: string;
  subtitle: string;
  teamNation: string;
  formation: string;
  markerStyle: string;
  coachLabel: string;
  coach: string;
  players: LineupPlayer[];
  benchLabel: string;
  bench: string[];
};

const FORMATIONS = [
  "4-4-2", "4-3-3", "4-2-3-1", "4-1-4-1", "4-4-1-1", "4-3-1-2", "4-1-2-1-2", "4-2-2-2", "4-3-2-1", "4-5-1",
  "3-5-2", "3-4-3", "3-4-2-1", "3-4-1-2", "3-1-4-2", "5-3-2", "5-2-3", "5-4-1", "5-2-1-2",
];

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

/** Keeps long titles inside their column. */
function titleSize(title: string, layout: Layout): string {
  const longest = Math.max(...title.split(/\s+/).map((w) => w.length), 1);
  if (layout === "wide") return longest <= 8 ? "text-[56px]" : longest <= 10 ? "text-[44px]" : "text-[36px]";
  if (layout === "square") return title.length <= 16 ? "text-[56px]" : "text-[44px]";
  return title.length <= 16 ? "text-[68px]" : "text-[54px]";
}

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
  const flagDots = data.markerStyle === "flag";
  const faceDots = data.markerStyle === "photo";
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
              {faceDots ? (
                <Avatar
                  src={player.photo}
                  path={`players.${i}.photo`}
                  className={cn("shadow-[0_8px_24px_rgb(0_0_0/0.35)] ring-4 ring-fm-accent", size.dot)}
                />
              ) : flagDots && player.nation ? (
                <span
                  className={cn(
                    "block overflow-hidden rounded-full shadow-[0_8px_24px_rgb(0_0_0/0.35)] ring-4 ring-fm-accent",
                    size.dot,
                  )}
                >
                  <Flag code={player.nation} round className="size-full ring-0" />
                </span>
              ) : (
                <span
                  className={cn(
                    "fm-display grid place-items-center rounded-full bg-fm-accent tracking-normal text-fm-on-accent shadow-[0_8px_24px_rgb(0_0_0/0.35)] ring-4 ring-fm-bg/60",
                    size.dot,
                  )}
                >
                  <span className={player.number.length > 2 ? "text-[0.66em]" : undefined}>{player.number}</span>
                </span>
              )}
              {!flagDots && player.nation ? (
                <Flag code={player.nation} round className="absolute -bottom-1 -left-3 size-[28px] ring-2 ring-fm-bg" />
              ) : null}
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
              <h1 className={cn("fm-display", titleSize(data.title, layout))}>{data.title}</h1>
              <p className="mt-4 flex items-center gap-3 text-[25px] text-fm-muted">
                <Flag code={data.teamNation} className="h-[0.8em]" />
                {data.subtitle}
              </p>
            </div>
            <div className="flex gap-10">
              <div>
                <Label>Diziliş</Label>
                <p className="fm-display mt-2 text-[40px] tracking-normal text-fm-accent">{data.formation}</p>
              </div>
              {data.coach ? (
                <div className="min-w-0">
                  <Label>{data.coachLabel}</Label>
                  <p className="mt-2 truncate text-[25px] font-semibold">{data.coach}</p>
                </div>
              ) : null}
            </div>
            {data.bench.length > 0 ? (
              <Panel className="px-6 py-5">
                <Label>{data.benchLabel}</Label>
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
            <h1 className={cn("fm-display", titleSize(data.title, layout))}>{data.title}</h1>
            <p className="mt-3 flex items-center gap-3 text-[26px] text-fm-muted">
              <Flag code={data.teamNation} className="h-[0.8em]" />
              {data.subtitle}
            </p>
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
                <Label>{data.benchLabel}</Label>
                <p className="mt-1.5 line-clamp-2 text-[21px] leading-[1.4]">{data.bench.join(" · ")}</p>
              </div>
            ) : null}
            {data.coach ? (
              <div className="shrink-0 text-right">
                <Label>{data.coachLabel}</Label>
                <p className="mt-1.5 text-[23px] font-semibold">{data.coach}</p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </CardFrame>
  );
}

const fields: Field[] = [
  { key: "tag", label: "Etiket", type: "text" },
  { key: "title", label: "Başlık", type: "text" },
  { key: "subtitle", label: "Alt başlık", type: "text" },
  { key: "teamNation", label: "Takım bayrağı", type: "country" },
  { key: "formation", label: "Diziliş", type: "select", options: FORMATIONS.map((f) => ({ value: f, label: f })) },
  {
    key: "markerStyle",
    label: "Oyuncu simgesi",
    type: "select",
    options: [
      { value: "number", label: "Numara / rol" },
      { value: "flag", label: "Ülke bayrağı" },
      { value: "photo", label: "Oyuncu yüzü" },
    ],
  },
  { key: "coachLabel", label: "Sağ alt başlık", type: "text" },
  { key: "coach", label: "Sağ alt değer", type: "text" },
  {
    key: "players",
    label: "Oyuncular",
    type: "list",
    itemLabel: "Oyuncu",
    hint: "Sıra: kaleci, sonra her hat soldan sağa. Simge \"Oyuncu yüzü\" iken önizlemede oyuncuya tıklayarak da yüz yükleyebilirsin.",
    fields: [
      { key: "photo", label: "Oyuncu yüzü", type: "image" },
      { key: "number", label: "No", type: "text", size: "xs" },
      { key: "name", label: "İsim", type: "text", size: "grow" },
      { key: "nation", label: "Ülke", type: "country", size: "md" },
      { key: "rating", label: "Puan", type: "text", size: "xs" },
    ],
  },
  { key: "benchLabel", label: "Alt liste başlığı", type: "text" },
  { key: "bench", label: "Alt liste", type: "lines", hint: "Her satır bir madde" },
];

const player = (number: string, name: string, nation = "", rating = ""): LineupPlayer => ({ number, name, nation, rating, photo: "" });

export const lineup = defineTemplate<LineupData>({
  id: "lineup",
  name: "İlk 11",
  category: "Kadro ve Taktik",
  description: "Dizilişe göre otomatik saha yerleşimi",
  icon: Shirt,
  Component: LineupCard,
  fields,
  defaults: {
    tag: "İlk 11",
    title: "Haftanın 11'i",
    subtitle: "Süper Lig · 12. Hafta",
    teamNation: "",
    formation: "4-2-3-1",
    markerStyle: "number",
    coachLabel: "Teknik Direktör",
    coach: "S. Yalçın",
    players: [
      player("1", "Günok", "", "7.4"),
      player("3", "Elmalı", "", "7.1"),
      player("4", "Bardakcı", "", "7.8"),
      player("5", "Demiral", "", "7.3"),
      player("2", "Çelik", "", "7.0"),
      player("6", "Kökçü", "", "7.6"),
      player("8", "Yüksek", "", "7.2"),
      player("11", "Yıldız", "", "8.4"),
      player("10", "Aydın", "", "9.1"),
      player("7", "Aktürkoğlu", "", "7.7"),
      player("9", "Kahveci", "", "8.0"),
    ],
    benchLabel: "Yedekler",
    bench: ["Çakır", "Kabak", "Müldür", "Özcan", "Akgün", "Ünder", "Tosun"],
  },
});

export const nationsLineup = defineTemplate<LineupData>({
  id: "nations-lineup",
  name: "Ülkeler 11'i",
  category: "Kadro ve Taktik",
  description: "Her oyuncu kendi ülke bayrağıyla",
  icon: Globe,
  Component: LineupCard,
  fields,
  defaults: {
    tag: "Dünya Karması",
    title: "11 ülke, 11 wonderkid",
    subtitle: "Her ülkeden tek oyuncu · 21 yaş altı",
    teamNation: "",
    formation: "4-3-3",
    markerStyle: "flag",
    coachLabel: "Toplam değer",
    coach: "€148M",
    players: [
      player("1", "Åkesson", "se"),
      player("3", "Varela", "pt"),
      player("4", "Kovač", "hr"),
      player("5", "Brandt", "de"),
      player("2", "Sané", "sn"),
      player("6", "Soylu", "tr"),
      player("8", "Morales", "es"),
      player("10", "Ferreyra", "ar"),
      player("11", "Mensah", "gh"),
      player("9", "Okafor", "ng"),
      player("7", "Walker", "gb-eng"),
    ],
    benchLabel: "Yedekler",
    bench: ["Dubois (Fransa)", "Rossi (İtalya)", "Silva (Brezilya)", "Tanaka (Japonya)", "De Vries (Hollanda)"],
  },
});

export const tactic = defineTemplate<LineupData>({
  id: "tactic",
  name: "Taktik",
  category: "Kadro ve Taktik",
  description: "Roller ve takım talimatları",
  icon: ClipboardList,
  Component: LineupCard,
  fields,
  defaults: {
    tag: "Taktik",
    title: "Gegenpress 4-3-3",
    subtitle: "Alt lig takımları için test edildi · 3 sezon",
    teamNation: "",
    formation: "4-3-3",
    markerStyle: "number",
    coachLabel: "Mentalite",
    coach: "Pozitif",
    players: [
      player("SK", "Süpürücü Kaleci"),
      player("KB", "Kanat Bek · D"),
      player("STP", "Stoper · S"),
      player("OKS", "Oyun Kuran Stoper"),
      player("KB", "Kanat Bek · H"),
      player("MZ", "Mezzala · D"),
      player("DOS", "Derin Oyun Kurucu"),
      player("BBM", "Box to Box"),
      player("İF", "İçe Kat Eden · H"),
      player("ÇF", "Çalışkan Forvet"),
      player("KO", "Kanat Oyuncusu · D"),
    ],
    benchLabel: "Takım talimatları",
    bench: ["Çok yüksek pres", "Yüksek savunma hattı", "Kısa pas", "Yüksek tempo", "Topu kaybedince karşı pres"],
  },
});
