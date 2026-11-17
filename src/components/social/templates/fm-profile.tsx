import { MonitorSmartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { CardFrame, Flag, Label, Panel, Photo, Screenshot } from "../frame";
import type { TemplateProps } from "../types";

type Fact = { label: string; value: string };

type FmProfileData = {
  tag: string;
  name: string;
  nation: string;
  role: string;
  subtitle: string;
  photo: string;
  shot: string;
  facts: Fact[];
  comment: string;
};

/** Built around the in-game profile screenshot: no typing attributes by hand. */
function FmProfileCard({ data, format, brand }: TemplateProps<FmProfileData>) {
  const layout = format.layout;
  const wide = layout === "wide";

  const identity = (
    <div className="min-w-0">
      <span className="fm-label inline-block rounded-full bg-fm-accent px-4 py-1.5 text-[17px] text-fm-on-accent">
        {data.role}
      </span>
      <h1 className={cn("fm-display mt-3", wide ? "text-[42px]" : "text-[52px]")}>{data.name}</h1>
      <p className="mt-3 flex items-center gap-3 text-[25px] text-fm-muted">
        <Flag code={data.nation} className="h-[0.8em]" />
        <span className="truncate">{data.subtitle}</span>
      </p>
    </div>
  );

  const comment = data.comment ? (
    <p className={cn("line-clamp-3 shrink-0 border-l-4 border-fm-accent pl-5 leading-[1.35]", wide ? "text-[20px]" : "text-[23px]")}>{data.comment}</p>
  ) : null;

  if (wide) {
    return (
      <CardFrame format={format} brand={brand} tag={data.tag}>
        <div className="flex min-h-0 flex-1 gap-8">
          <div className="flex w-[380px] shrink-0 flex-col justify-between gap-4">
            <div className="flex items-end gap-5">
              <Photo src={data.photo} alt={data.name} path="photo" className="h-[150px] w-[130px] rounded-[22px]" />
            </div>
            {identity}
            {data.facts.length > 0 ? (
              <Panel className="grid grid-cols-2 gap-y-3 px-5 py-4">
                {data.facts.slice(0, 4).map((fact, i) => (
                  <div key={i} className="min-w-0">
                    <Label className="block truncate text-[14px]">{fact.label}</Label>
                    <p className="truncate text-[23px] font-semibold">{fact.value}</p>
                  </div>
                ))}
              </Panel>
            ) : null}
            {comment}
          </div>
          <Screenshot src={data.shot} path="shot" className="flex-1" />
        </div>
      </CardFrame>
    );
  }

  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      <div className="flex min-h-0 flex-1 flex-col gap-5">
        <div className="flex items-center gap-7">
          <Photo src={data.photo} alt={data.name} path="photo" className="h-[170px] w-[150px] rounded-[24px]" />
          {identity}
        </div>
        <Screenshot src={data.shot} path="shot" className="flex-1" />
        {data.facts.length > 0 ? (
          <Panel className="flex divide-x divide-fm-line py-3.5">
            {data.facts.slice(0, 4).map((fact, i) => (
              <div key={i} className="min-w-0 flex-1 px-5">
                <Label className="block truncate text-[15px]">{fact.label}</Label>
                <p className="mt-1 truncate text-[26px] font-semibold">{fact.value}</p>
              </div>
            ))}
          </Panel>
        ) : null}
        {layout !== "square" ? comment : null}
      </div>
    </CardFrame>
  );
}

export const fmProfile = defineTemplate<FmProfileData>({
  id: "fm-profile",
  name: "FM Profili",
  category: "Oyuncu",
  description: "Oyun içi profil ekran görüntüsüyle kart",
  icon: MonitorSmartphone,
  Component: FmProfileCard,
  fields: [
    { key: "tag", label: "Etiket", type: "text" },
    { key: "name", label: "Oyuncu adı", type: "text" },
    { key: "role", label: "Mevki", type: "text" },
    { key: "nation", label: "Bayrak", type: "country" },
    { key: "subtitle", label: "Alt satır", type: "text" },
    { key: "photo", label: "Oyuncu yüzü", type: "image" },
    {
      key: "shot",
      label: "FM profil ekran görüntüsü",
      type: "image",
      hint: "Oyundaki profil ekranının görüntüsü; kırpılmadan, tam sığacak şekilde yerleşir.",
    },
    {
      key: "facts",
      label: "Bilgi kutuları (en fazla 4)",
      type: "list",
      itemLabel: "Bilgi",
      fields: [
        { key: "label", label: "Başlık", type: "text", size: "grow" },
        { key: "value", label: "Değer", type: "text", size: "grow" },
      ],
    },
    { key: "comment", label: "Yorum", type: "textarea" },
  ],
  defaults: {
    tag: "FM Profili",
    name: "Kerem Aydın",
    nation: "tr",
    role: "OOS (M)",
    subtitle: "Göztepe · 19 yaş",
    photo: "",
    shot: "",
    facts: [
      { label: "Değer", value: "€14.5M" },
      { label: "Maaş", value: "€12K/hf" },
      { label: "Sözleşme", value: "2029" },
      { label: "Potansiyel", value: "★★★★½" },
    ],
    comment: "Profil ekranı her şeyi söylüyor: teknik ve zihinsel özellikler şimdiden üst seviye, fiziksel taraf gelişime açık.",
  },
});
