import { Award, BadgeCheck, Binoculars, Check, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { AttributeRows, CardFrame, Flag, Label, Panel, Photo, nameSize } from "../frame";
import type { Attribute } from "../frame";
import type { Field, Layout, TemplateProps } from "../types";

type Fact = { label: string; value: string };

/** One flexible "person card" behind several templates: recommendations, awards… */
type ProfileData = {
  tag: string;
  name: string;
  nation: string;
  role: string;
  subtitle: string;
  photo: string;
  priceLabel: string;
  price: string;
  facts: Fact[];
  attributesTitle: string;
  attributes: Attribute[];
  reasonsTitle: string;
  reasons: string[];
  summary: string;
};

const ATTRIBUTE_ROWS: Record<Layout, number> = { portrait: 7, square: 6, story: 9, wide: 7 };
const REASON_ROWS: Record<Layout, number> = { portrait: 4, square: 3, story: 5, wide: 4 };

function ProfileCard({ data, format, brand }: TemplateProps<ProfileData>) {
  const layout = format.layout;
  const wide = layout === "wide";

  const identity = (
    <div className="min-w-0">
      <span className="fm-label inline-block rounded-full bg-fm-accent px-4 py-1.5 text-[17px] text-fm-on-accent">
        {data.role}
      </span>
      <h1 className={cn("fm-display mt-4", nameSize(data.name, layout))}>{data.name}</h1>
      <p className="mt-3 flex items-center gap-3 text-[27px] text-fm-muted">
        <Flag code={data.nation} className="h-[0.8em]" />
        <span className="truncate">{data.subtitle}</span>
      </p>
    </div>
  );

  const price = data.price ? (
    <div className="flex items-center justify-between gap-4 rounded-[22px] bg-fm-accent px-6 py-3 text-fm-on-accent">
      <span className="fm-label text-[16px]">{data.priceLabel}</span>
      <span className="fm-display text-[40px] tracking-normal tabular-nums">{data.price}</span>
    </div>
  ) : null;

  const facts =
    data.facts.length > 0 ? (
      <Panel className="flex divide-x divide-fm-line py-3.5">
        {data.facts.slice(0, 5).map((fact, i) => (
          <div key={i} className="min-w-0 flex-1 px-5">
            <Label className="block truncate text-[15px]">{fact.label}</Label>
            <p className="mt-1 truncate text-[26px] font-semibold">{fact.value}</p>
          </div>
        ))}
      </Panel>
    ) : null;

  const columns = (
    <div className="grid min-h-0 flex-1 grid-cols-2 gap-4">
      <Panel className="flex flex-col justify-center px-6 py-4">
        <Label className="mb-2 text-fm-accent">{data.attributesTitle}</Label>
        <AttributeRows items={data.attributes} rows={ATTRIBUTE_ROWS[layout]} barClass="w-[90px]" />
      </Panel>
      <Panel className="flex flex-col justify-center px-6 py-4">
        <Label className="mb-3 text-fm-accent">{data.reasonsTitle}</Label>
        <ul className="space-y-3">
          {data.reasons.slice(0, REASON_ROWS[layout]).map((reason, i) => (
            <li key={i} className="flex items-start gap-3 text-[22px] leading-[1.3]">
              <span className="mt-0.5 grid size-[26px] shrink-0 place-items-center rounded-full bg-fm-accent text-fm-on-accent">
                <Check className="size-[17px]" strokeWidth={3.5} />
              </span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );

  const summary = data.summary ? (
    <p
      className={cn(
        "shrink-0 border-l-4 border-fm-accent pl-5 leading-[1.35]",
        layout === "story" ? "line-clamp-4 text-[27px]" : "line-clamp-2 text-[23px]",
      )}
    >
      {data.summary}
    </p>
  ) : null;

  if (wide) {
    return (
      <CardFrame format={format} brand={brand} tag={data.tag}>
        <div className="flex min-h-0 flex-1 gap-10">
          <div className="flex w-[430px] shrink-0 flex-col justify-between gap-5">
            <Photo src={data.photo} alt={data.name} path="photo" className="min-h-0 w-full flex-1" />
            {identity}
            {price}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-5">
            {facts}
            {columns}
            {summary}
          </div>
        </div>
      </CardFrame>
    );
  }

  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      <div className="flex min-h-0 flex-1 flex-col gap-5">
        <div className="flex gap-9">
          <Photo
            src={data.photo}
            alt={data.name}
            path="photo"
            className={layout === "story" ? "h-[380px] w-[320px]" : "h-[300px] w-[270px]"}
          />
          <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
            {identity}
            {price}
          </div>
        </div>
        {facts}
        {columns}
        {layout !== "square" ? summary : null}
      </div>
    </CardFrame>
  );
}

const fields: Field[] = [
  { key: "tag", label: "Etiket", type: "text" },
  { key: "name", label: "İsim", type: "text" },
  { key: "role", label: "Rol / mevki", type: "text" },
  { key: "nation", label: "Bayrak", type: "country" },
  { key: "subtitle", label: "Alt satır", type: "text" },
  { key: "photo", label: "Fotoğraf", type: "image" },
  { key: "priceLabel", label: "Vurgu başlığı", type: "text" },
  { key: "price", label: "Vurgu değeri", type: "text" },
  {
    key: "facts",
    label: "Bilgi kutuları (en fazla 5)",
    type: "list",
    itemLabel: "Bilgi",
    fields: [
      { key: "label", label: "Başlık", type: "text", size: "grow" },
      { key: "value", label: "Değer", type: "text", size: "grow" },
    ],
  },
  { key: "attributesTitle", label: "Özellik başlığı", type: "text" },
  {
    key: "attributes",
    label: "Özellikler",
    type: "list",
    itemLabel: "Özellik",
    fields: [
      { key: "name", label: "Özellik", type: "text", size: "grow" },
      { key: "value", label: "1-20", type: "number", size: "xs", min: 1, max: 20 },
    ],
  },
  { key: "reasonsTitle", label: "Madde başlığı", type: "text" },
  { key: "reasons", label: "Maddeler", type: "lines", hint: "Her satır bir madde" },
  { key: "summary", label: "Özet cümle", type: "textarea" },
];

export const playerRecommendation = defineTemplate<ProfileData>({
  id: "player-recommendation",
  name: "Oyuncu Önerisi",
  category: "Oyuncu",
  description: "Fiyat, kilit özellikler, neden almalı",
  icon: UserPlus,
  Component: ProfileCard,
  fields,
  defaults: {
    tag: "Oyuncu Önerisi",
    name: "Mateo Ferreyra",
    nation: "ar",
    role: "FV (M) · Kelepir",
    subtitle: "Vélez Sarsfield · 18 yaş",
    photo: "",
    priceLabel: "Bonservis",
    price: "€9M",
    facts: [
      { label: "Maaş", value: "€6K/hf" },
      { label: "Sözleşme", value: "2028" },
      { label: "Ayak", value: "Sağ" },
      { label: "Potansiyel", value: "★★★★★" },
    ],
    attributesTitle: "Kilit özellikler",
    attributes: [
      { name: "Bitiricilik", value: 15 },
      { name: "Topsuz Alan", value: 16 },
      { name: "Soğukkanlılık", value: 14 },
      { name: "Hızlanma", value: 16 },
      { name: "Hız", value: 15 },
      { name: "İlk Dokunuş", value: 14 },
      { name: "Önsezi", value: 15 },
      { name: "Kararlılık", value: 17 },
      { name: "Çalışkanlık", value: 13 },
    ],
    reasonsTitle: "Neden almalı?",
    reasons: [
      "Serbest kalma bedeli piyasa değerinin altında",
      "İlk sezondan forma giyebilecek seviyede",
      "İki sezonda değeri 4 katına çıkıyor",
      "AB dışı kontenjanı tutmayan liglerde ideal",
      "Kişiliği profesyonel, gelişimi hızlı",
    ],
    summary: "Orta bütçeli kulüpler için sezonun en iyi santrfor fırsatı. İlk transfer döneminde alın, çalışma izni bekletmeyin.",
  },
});

export const staffRecommendation = defineTemplate<ProfileData>({
  id: "staff-recommendation",
  name: "Personel Önerisi",
  category: "Kadro ve Taktik",
  description: "Antrenör, scout, sportif direktör…",
  icon: BadgeCheck,
  Component: ProfileCard,
  fields,
  defaults: {
    tag: "Personel Önerisi",
    name: "Paolo Ricci",
    nation: "it",
    role: "Yardımcı Antrenör",
    subtitle: "Serbest · 44 yaş",
    photo: "",
    priceLabel: "Beklenen maaş",
    price: "€9K/hf",
    facts: [
      { label: "Lisans", value: "UEFA Pro" },
      { label: "Tercih", value: "4-3-3" },
      { label: "Tazminat", value: "Yok" },
      { label: "İtibar", value: "Ulusal" },
    ],
    attributesTitle: "Antrenörlük",
    attributes: [
      { name: "Taktik Bilgisi", value: 17 },
      { name: "Hücum", value: 16 },
      { name: "Oyuncu Yönetimi", value: 18 },
      { name: "Motivasyon", value: 16 },
      { name: "Kararlılık", value: 17 },
      { name: "Disiplin", value: 15 },
      { name: "Genç Geliştirme", value: 14 },
      { name: "Mevcut Yet. Değ.", value: 16 },
      { name: "Potansiyel Değ.", value: 15 },
    ],
    reasonsTitle: "Neden almalı?",
    reasons: [
      "Sözleşmesi yok, tazminatsız geliyor",
      "Oyuncu yönetimi soyunma odasını toparlıyor",
      "Taktik tavsiyeleri isabetli",
      "Alt lig bütçesine uygun maaş",
      "Basın toplantılarını devredebilirsiniz",
    ],
    summary: "Kariyerin ilk günü imzalatılacak isimlerden. Yardımcı antrenör olarak 5 yıldızlı, maaşı ise 3 yıldızlı.",
  },
});

export const award = defineTemplate<ProfileData>({
  id: "award",
  name: "Ayın Oyuncusu",
  category: "Oyuncu",
  description: "Ödül, performans ve istatistikler",
  icon: Award,
  Component: ProfileCard,
  fields,
  defaults: {
    tag: "Ayın Oyuncusu",
    name: "Kerem Aydın",
    nation: "tr",
    role: "Kasım 2026",
    subtitle: "Göztepe · OOS (M)",
    photo: "",
    priceLabel: "Ortalama puan",
    price: "8.42",
    facts: [
      { label: "Maç", value: "5" },
      { label: "Gol", value: "6" },
      { label: "Asist", value: "3" },
      { label: "Maçın adamı", value: "3" },
    ],
    attributesTitle: "Öne çıkan özellikler",
    attributes: [
      { name: "Özel Yetenek", value: 18 },
      { name: "Vizyon", value: 17 },
      { name: "İlk Dokunuş", value: 17 },
      { name: "Teknik", value: 17 },
      { name: "Dripling", value: 16 },
      { name: "Çeviklik", value: 16 },
      { name: "Soğukkanlılık", value: 15 },
      { name: "Pas", value: 15 },
      { name: "Hızlanma", value: 15 },
    ],
    reasonsTitle: "Ayın özeti",
    reasons: [
      "Derbide 2 gol, 1 asist",
      "Üst üste 4 maçta skor katkısı",
      "Maç başına 3.2 kilit pas",
      "Takım 5 maçta 13 puan topladı",
      "Değeri bir ayda €4M arttı",
    ],
    summary: "19 yaşında ligin en değerli oyuncusu olma yolunda. Devre arasında teklifler yağacak.",
  },
});

export const scoutReport = defineTemplate<ProfileData>({
  id: "scout-report",
  name: "Scout Raporu",
  category: "Oyuncu",
  description: "Haftalık keşif: gizli kalmış isimler",
  icon: Binoculars,
  Component: ProfileCard,
  fields,
  defaults: {
    tag: "Scout Raporu",
    name: "Ibrahima Sané",
    nation: "sn",
    role: "OK (SĞ) · Keşif",
    subtitle: "Metz · 18 yaş",
    photo: "",
    priceLabel: "Scout notu",
    price: "A-",
    facts: [
      { label: "Değer", value: "€6.5M" },
      { label: "Maaş", value: "€4K/hf" },
      { label: "Kişilik", value: "Hırslı" },
      { label: "İlgi", value: "3 kulüp" },
    ],
    attributesTitle: "Scout gözünden",
    attributes: [
      { name: "Hız", value: 17 },
      { name: "Hızlanma", value: 17 },
      { name: "Dripling", value: 15 },
      { name: "Orta", value: 14 },
      { name: "Çeviklik", value: 16 },
      { name: "Özel Yetenek", value: 15 },
      { name: "Karar Alma", value: 10 },
      { name: "Çalışkanlık", value: 14 },
      { name: "Dayanıklılık", value: 13 },
    ],
    reasonsTitle: "Rapor özeti",
    reasons: [
      "Ligin en hızlı üç kanadından biri",
      "Karar alma zayıf, antrenmanla gelişir",
      "Büyük maçlarda performansı düşmüyor",
      "Çalışma izni sorunu yok",
      "Sözleşmesinde serbest kalma maddesi var",
    ],
    summary: "Ham ama pahalı değil. Kontra atak oynayan takımlar için hemen, top hâkimiyeti oynayanlar için iki sezon sonra hazır.",
  },
});
