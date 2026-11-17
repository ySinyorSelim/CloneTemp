import { Minus, Plus, UserSearch } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { AttributeRows, CardFrame, Flag, Label, Panel, Photo, Stars, nameSize } from "../frame";
import type { Attribute } from "../frame";
import type { Layout, TemplateProps } from "../types";

type PlayerReviewData = {
  tag: string;
  name: string;
  club: string;
  position: string;
  photo: string;
  age: string;
  nation: string;
  nationality: string;
  foot: string;
  height: string;
  value: string;
  ability: number;
  potential: number;
  rating: string;
  technical: Attribute[];
  mental: Attribute[];
  physical: Attribute[];
  pros: string[];
  cons: string[];
  verdict: string;
};

const ATTRIBUTE_ROWS: Record<Layout, number> = { portrait: 6, square: 6, story: 8, wide: 6 };

function AttributeGroup({ title, items, rows }: { title: string; items: Attribute[]; rows: number }) {
  return (
    <Panel className="flex min-w-0 flex-1 flex-col px-6 pt-5 pb-4">
      <Label className="mb-2 text-fm-accent">{title}</Label>
      <AttributeRows items={items} rows={rows} />
    </Panel>
  );
}

function BulletList({ title, items, positive }: { title: string; items: string[]; positive: boolean }) {
  const Icon = positive ? Plus : Minus;
  return (
    <div className="min-w-0 flex-1">
      <Label>{title}</Label>
      <ul className="mt-3 space-y-2.5">
        {items.slice(0, 3).map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-[21px] leading-[1.3]">
            <span
              className={cn(
                "mt-0.5 grid size-[24px] shrink-0 place-items-center rounded-full",
                positive ? "bg-fm-good/20 text-fm-good" : "bg-fm-bad/20 text-fm-bad",
              )}
            >
              <Icon className="size-[16px]" strokeWidth={3} />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RatingBadge({ rating }: { rating: string }) {
  return (
    <div className="flex shrink-0 flex-col items-center rounded-[24px] bg-fm-accent px-5 pt-4 pb-3 text-fm-on-accent">
      <span className="fm-display text-[52px] tracking-normal tabular-nums">{rating}</span>
      <span className="fm-label mt-1 text-[14px]">Puan</span>
    </div>
  );
}

function StarRow({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <Label>{label}</Label>
      <Stars value={value} className="mt-2 text-[32px]" />
    </div>
  );
}

function PlayerReviewCard({ data, format, brand }: TemplateProps<PlayerReviewData>) {
  const layout = format.layout;
  const rows = ATTRIBUTE_ROWS[layout];
  const facts: { label: string; value: string; flag?: string }[] = [
    { label: "Yaş", value: data.age },
    { label: "Uyruk", value: data.nationality, flag: data.nation },
    { label: "Ayak", value: data.foot },
    { label: "Boy", value: data.height },
    { label: "Değer", value: data.value },
  ];

  const identity = (
    <div className="min-w-0">
      <span className="fm-label inline-block rounded-full bg-fm-accent px-4 py-1.5 text-[17px] text-fm-on-accent">
        {data.position}
      </span>
      <h1 className={cn("fm-display mt-4", nameSize(data.name, layout))}>{data.name}</h1>
      <p className="mt-3 text-[27px] text-fm-muted">{data.club}</p>
    </div>
  );

  const attributes = (
    <div className="flex gap-4">
      <AttributeGroup title="Teknik" items={data.technical} rows={rows} />
      <AttributeGroup title="Zihinsel" items={data.mental} rows={rows} />
      <AttributeGroup title="Fiziksel" items={data.physical} rows={rows} />
    </div>
  );

  const prosCons = (
    <div className="flex gap-8">
      <BulletList title="Artılar" items={data.pros} positive />
      <BulletList title="Eksiler" items={data.cons} positive={false} />
    </div>
  );

  if (layout === "wide") {
    return (
      <CardFrame format={format} brand={brand} tag={data.tag}>
        <div className="flex min-h-0 flex-1 gap-10">
          <div className="flex w-[430px] shrink-0 flex-col justify-between">
            <div className="flex gap-5">
              <Photo src={data.photo} alt={data.name} className="h-[230px] w-[200px]" />
              <div className="flex flex-col justify-between">
                <RatingBadge rating={data.rating} />
                <div className="space-y-3">
                  <StarRow label="Mevcut" value={data.ability} />
                  <StarRow label="Potansiyel" value={data.potential} />
                </div>
              </div>
            </div>
            {identity}
            <Panel className="grid grid-cols-3 gap-y-4 px-5 py-4">
              {facts.map((fact) => (
                <div key={fact.label} className="min-w-0">
                  <Label className="text-[14px]">{fact.label}</Label>
                  <p className="flex items-center gap-2 truncate text-[23px] font-semibold">
                    <Flag code={fact.flag} className="h-[0.75em]" />
                    {fact.value}
                  </p>
                </div>
              ))}
            </Panel>
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-between">
            {attributes}
            {prosCons}
            <p className="line-clamp-2 border-l-4 border-fm-accent pl-5 text-[22px] leading-[1.35]">
              {data.verdict}
            </p>
          </div>
        </div>
      </CardFrame>
    );
  }

  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-5">
        <div className="flex gap-9">
          <Photo
            src={data.photo}
            alt={data.name}
            className={layout === "story" ? "h-[380px] w-[320px]" : "h-[300px] w-[270px]"}
          />
          <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
            <div className="flex items-start justify-between gap-4">
              {identity}
              <RatingBadge rating={data.rating} />
            </div>
            <div className="flex gap-10">
              <StarRow label="Mevcut" value={data.ability} />
              <StarRow label="Potansiyel" value={data.potential} />
            </div>
          </div>
        </div>

        <Panel className="grid grid-cols-5 divide-x divide-fm-line py-3.5">
          {facts.map((fact) => (
            <div key={fact.label} className="min-w-0 px-5">
              <Label className="text-[15px]">{fact.label}</Label>
              <p className="mt-1 flex items-center gap-2.5 truncate text-[27px] font-semibold">
                <Flag code={fact.flag} className="h-[0.75em]" />
                {fact.value}
              </p>
            </div>
          ))}
        </Panel>

        {attributes}

        {layout !== "square" ? prosCons : null}

        {layout !== "square" ? (
          <p
            className={cn(
              "shrink-0 border-l-4 border-fm-accent pl-5 leading-[1.35]",
              layout === "story" ? "line-clamp-4 text-[27px]" : "line-clamp-2 text-[23px]",
            )}
          >
            {data.verdict}
          </p>
        ) : null}
      </div>
    </CardFrame>
  );
}

const attributeFields = [
  { key: "name", label: "Özellik", type: "text" as const, size: "grow" as const },
  { key: "value", label: "1-20", type: "number" as const, size: "xs" as const, min: 1, max: 20 },
];

export const playerReview = defineTemplate<PlayerReviewData>({
  id: "player-review",
  name: "Oyuncu İncelemesi",
  category: "Oyuncu",
  description: "Özellikler, artı/eksi ve karar",
  icon: UserSearch,
  Component: PlayerReviewCard,
  fields: [
    { key: "tag", label: "Etiket", type: "text" },
    { key: "name", label: "Oyuncu adı", type: "text" },
    { key: "club", label: "Kulüp", type: "text" },
    { key: "position", label: "Mevki", type: "text" },
    { key: "photo", label: "Oyuncu fotoğrafı", type: "image" },
    { key: "age", label: "Yaş", type: "text" },
    { key: "nation", label: "Bayrak", type: "country" },
    { key: "nationality", label: "Uyruk (yazı)", type: "text" },
    { key: "foot", label: "Ayak", type: "text" },
    { key: "height", label: "Boy", type: "text" },
    { key: "value", label: "Değer", type: "text" },
    { key: "ability", label: "Mevcut yetenek (yıldız)", type: "number", min: 0, max: 5, step: 0.5 },
    { key: "potential", label: "Potansiyel (yıldız)", type: "number", min: 0, max: 5, step: 0.5 },
    { key: "rating", label: "Puan", type: "text" },
    { key: "technical", label: "Teknik özellikler", type: "list", itemLabel: "Özellik", fields: attributeFields },
    { key: "mental", label: "Zihinsel özellikler", type: "list", itemLabel: "Özellik", fields: attributeFields },
    { key: "physical", label: "Fiziksel özellikler", type: "list", itemLabel: "Özellik", fields: attributeFields },
    { key: "pros", label: "Artılar", type: "lines", hint: "Her satır bir madde (en fazla 3)" },
    { key: "cons", label: "Eksiler", type: "lines", hint: "Her satır bir madde (en fazla 3)" },
    { key: "verdict", label: "Karar", type: "textarea" },
  ],
  defaults: {
    tag: "Oyuncu İncelemesi",
    name: "Kerem Aydın",
    club: "Göztepe · Süper Lig",
    position: "OOS (M)",
    photo: "",
    age: "19",
    nation: "tr",
    nationality: "Türkiye",
    foot: "Sol",
    height: "1.78 m",
    value: "€14.5M",
    ability: 3,
    potential: 4.5,
    rating: "8.7",
    technical: [
      { name: "Dripling", value: 16 },
      { name: "İlk Dokunuş", value: 17 },
      { name: "Pas", value: 15 },
      { name: "Teknik", value: 17 },
      { name: "Bitiricilik", value: 13 },
      { name: "Uzaktan Şut", value: 14 },
      { name: "Orta", value: 12 },
      { name: "Kafa", value: 7 },
    ],
    mental: [
      { name: "Vizyon", value: 17 },
      { name: "Özel Yetenek", value: 18 },
      { name: "Soğukkanlılık", value: 15 },
      { name: "Karar Alma", value: 14 },
      { name: "Önsezi", value: 13 },
      { name: "Çalışkanlık", value: 11 },
      { name: "Kararlılık", value: 15 },
      { name: "Takım Oyunu", value: 13 },
    ],
    physical: [
      { name: "Hızlanma", value: 15 },
      { name: "Hız", value: 14 },
      { name: "Çeviklik", value: 16 },
      { name: "Denge", value: 14 },
      { name: "Dayanıklılık", value: 12 },
      { name: "Güç", value: 9 },
      { name: "Zıplama", value: 8 },
      { name: "Kondisyon", value: 13 },
    ],
    pros: [
      "Dar alanda dripling ve ilk dokunuş elit seviyede",
      "Vizyonu yaşına göre çok ileride",
      "Düşük maaş, yüksek satış değeri",
    ],
    cons: ["Fiziksel mücadelede zayıf kalıyor", "Savunma katkısı sınırlı"],
    verdict:
      "İlk iki sezon rotasyonda büyütülürse 23 yaşında dünya klasına ulaşır. €15M altına bulursanız düşünmeden alın.",
  },
});
