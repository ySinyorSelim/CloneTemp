import { BarChart3, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { CardFrame, Flag, Label, Panel } from "../frame";
import type { Layout, TemplateProps } from "../types";

type Tile = { value: string; label: string; note: string };

type StatTilesData = {
  tag: string;
  title: string;
  subtitle: string;
  nation: string;
  tiles: Tile[];
  highlightsTitle: string;
  highlights: string[];
};

const TILE_COUNT: Record<Layout, number> = { portrait: 9, square: 6, story: 10, wide: 8 };
const GRID: Record<Layout, string> = {
  portrait: "grid-cols-3",
  square: "grid-cols-3",
  story: "grid-cols-2",
  wide: "grid-cols-4",
};

function StatTilesCard({ data, format, brand }: TemplateProps<StatTilesData>) {
  const layout = format.layout;
  const wide = layout === "wide";

  const highlights =
    data.highlights.length > 0 && layout !== "square" ? (
      <Panel className={cn("px-7 py-5", wide && "flex w-[380px] shrink-0 flex-col justify-center")}>
        <Label className="text-fm-accent">{data.highlightsTitle}</Label>
        <ul className={cn("mt-3", wide ? "space-y-4" : "grid grid-cols-2 gap-x-6 gap-y-2.5")}>
          {data.highlights.slice(0, wide ? 6 : 4).map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[22px] leading-[1.3]">
              <Trophy className="mt-1 size-[22px] shrink-0 text-fm-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Panel>
    ) : null;

  const tiles = (
    <div className={cn("grid min-h-0 flex-1 auto-rows-fr gap-4", GRID[layout])}>
      {data.tiles.slice(0, TILE_COUNT[layout]).map((tile, i) => (
        <div
          key={i}
          className={cn(
            "flex min-h-0 flex-col justify-between rounded-[28px] border px-6 py-5",
            i === 0 ? "border-transparent bg-fm-accent text-fm-on-accent" : "border-fm-line bg-fm-surface",
          )}
        >
          <span className={cn("fm-label text-[16px]", i !== 0 && "text-fm-muted")}>{tile.label}</span>
          <div>
            <p className={cn("fm-display tracking-normal tabular-nums", wide || layout === "square" ? "text-[52px]" : "text-[60px]")}>
              {tile.value}
            </p>
            {tile.note ? (
              <p className={cn("mt-1.5 truncate text-[19px]", i === 0 ? "opacity-75" : "text-fm-muted")}>{tile.note}</p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <div className="min-w-0">
          <h1 className={cn("fm-display", wide || layout === "square" ? "text-[52px]" : "text-[64px]")}>{data.title}</h1>
          <p className="mt-3 flex items-center gap-3 text-[25px] text-fm-muted">
            <Flag code={data.nation} className="h-[0.8em]" />
            {data.subtitle}
          </p>
        </div>
        {wide ? (
          <div className="flex min-h-0 flex-1 gap-4">
            {tiles}
            {highlights}
          </div>
        ) : (
          <>
            {tiles}
            {highlights}
          </>
        )}
      </div>
    </CardFrame>
  );
}

export const statTiles = defineTemplate<StatTilesData>({
  id: "season-review",
  name: "Sezon Özeti",
  category: "Maç ve Lig",
  description: "Büyük rakamlarla kariyer güncellemesi",
  icon: BarChart3,
  Component: StatTilesCard,
  fields: [
    { key: "tag", label: "Etiket", type: "text" },
    { key: "title", label: "Başlık", type: "text" },
    { key: "subtitle", label: "Alt başlık", type: "text" },
    { key: "nation", label: "Bayrak", type: "country" },
    {
      key: "tiles",
      label: "İstatistik kutuları",
      type: "list",
      itemLabel: "Kutu",
      hint: "İlk kutu vurgulu gösterilir",
      fields: [
        { key: "value", label: "Değer", type: "text", size: "sm" },
        { key: "label", label: "Başlık", type: "text", size: "grow" },
        { key: "note", label: "Not", type: "text", size: "grow" },
      ],
    },
    { key: "highlightsTitle", label: "Öne çıkanlar başlığı", type: "text" },
    { key: "highlights", label: "Öne çıkanlar", type: "lines", hint: "Her satır bir madde" },
  ],
  defaults: {
    tag: "Sezon Özeti",
    title: "2026/27 sezonu",
    subtitle: "Göztepe · Kariyerin 3. sezonu",
    nation: "tr",
    tiles: [
      { value: "2.", label: "Lig sırası", note: "Tahmin: 7." },
      { value: "81", label: "Puan", note: "Kulüp rekoru" },
      { value: "25", label: "Galibiyet", note: "34 maçta" },
      { value: "78", label: "Atılan gol", note: "Ligin en iyisi" },
      { value: "31", label: "Yenilen gol", note: "Ligin 3.'sü" },
      { value: "€42M", label: "Transfer kârı", note: "3 satış" },
      { value: "23.4", label: "Yaş ortalaması", note: "Ligin en genci" },
      { value: "7.12", label: "Ort. puan", note: "Takım geneli" },
      { value: "%58", label: "Topla oynama", note: "Sezon ortalaması" },
      { value: "19", label: "Gol kralı", note: "Kahveci" },
    ],
    highlightsTitle: "Öne çıkanlar",
    highlights: [
      "Türkiye Kupası şampiyonu",
      "Şampiyonlar Ligi ön eleme bileti",
      "Aydın: Yılın Genç Oyuncusu",
      "Altyapıdan 3 oyuncu A takımda",
      "Yönetim güveni: A+",
      "Stat kapasitesi artırıldı",
    ],
  },
});
