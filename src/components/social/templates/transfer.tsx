import { ArrowRight, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { defineTemplate } from "../define";
import { CardFrame, Crest, Flag, Label, Panel, Photo, nameSize } from "../frame";
import type { TemplateProps } from "../types";

type Fact = { label: string; value: string };

type TransferData = {
  tag: string;
  status: string;
  name: string;
  nation: string;
  position: string;
  photo: string;
  fromName: string;
  fromCode: string;
  fromLogo: string;
  toName: string;
  toCode: string;
  toLogo: string;
  feeLabel: string;
  fee: string;
  facts: Fact[];
  note: string;
};

function Club({ name, code, logo, label, path }: { name: string; code: string; logo: string; label: string; path: string }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-5">
      <Crest src={logo} code={code} path={path} className="size-[96px] text-[27px]" />
      <div className="min-w-0">
        <Label className="text-[15px]">{label}</Label>
        <p className="truncate text-[30px] font-semibold">{name}</p>
      </div>
    </div>
  );
}

function TransferCard({ data, format, brand }: TemplateProps<TransferData>) {
  const layout = format.layout;

  const identity = (
    <div className="min-w-0">
      <p className="fm-display flex items-center gap-3 text-[30px] tracking-normal text-fm-accent">
        <span className="size-[12px] rounded-full bg-fm-accent" />
        {data.status}
      </p>
      <h1 className={cn("fm-display mt-5", nameSize(data.name, layout))}>{data.name}</h1>
      <p className="mt-4 flex items-center gap-3 text-[27px] text-fm-muted">
        <Flag code={data.nation} className="h-[0.8em]" />
        <span className="truncate">{data.position}</span>
      </p>
    </div>
  );

  const clubs = (
    <Panel className="flex items-center gap-5 px-7 py-5">
      <Club name={data.fromName} code={data.fromCode} logo={data.fromLogo} label="Eski kulüp" path="fromLogo" />
      <span className="grid size-[60px] shrink-0 place-items-center rounded-full bg-fm-accent text-fm-on-accent">
        <ArrowRight className="size-[32px]" strokeWidth={2.5} />
      </span>
      <Club name={data.toName} code={data.toCode} logo={data.toLogo} label="Yeni kulüp" path="toLogo" />
    </Panel>
  );

  const fee = (
    <div className="flex items-center justify-between gap-6 rounded-[28px] bg-fm-accent px-8 py-5 text-fm-on-accent">
      <span className="fm-label text-[19px]">{data.feeLabel}</span>
      <span className={cn("fm-display tracking-normal tabular-nums", layout === "wide" ? "text-[64px]" : "text-[84px]")}>
        {data.fee}
      </span>
    </div>
  );

  const facts =
    data.facts.length > 0 ? (
      <Panel className="flex divide-x divide-fm-line py-3.5">
        {data.facts.slice(0, 4).map((fact, i) => (
          <div key={i} className="min-w-0 flex-1 px-5">
            <Label className="block truncate text-[15px]">{fact.label}</Label>
            <p className="mt-1 truncate text-[26px] font-semibold">{fact.value}</p>
          </div>
        ))}
      </Panel>
    ) : null;

  const note = data.note ? (
    <p className="line-clamp-3 border-l-4 border-fm-accent pl-5 text-[24px] leading-[1.35]">{data.note}</p>
  ) : null;

  if (layout === "wide") {
    return (
      <CardFrame format={format} brand={brand} tag={data.tag}>
        <div className="flex min-h-0 flex-1 gap-10">
          <Photo src={data.photo} alt={data.name} path="photo" className="w-[400px]" />
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
            {identity}
            {clubs}
            {fee}
            {facts}
          </div>
        </div>
      </CardFrame>
    );
  }

  return (
    <CardFrame format={format} brand={brand} tag={data.tag}>
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-5">
        <div className="flex min-h-0 flex-1 gap-9">
          <Photo
            src={data.photo}
            alt={data.name}
            path="photo"
            className={cn("min-h-[240px]", layout === "story" ? "w-[380px]" : "w-[330px]")}
          />
          <div className="flex min-w-0 flex-1 flex-col justify-center">{identity}</div>
        </div>
        {clubs}
        {fee}
        {facts}
        {layout !== "square" ? note : null}
      </div>
    </CardFrame>
  );
}

export const transfer = defineTemplate<TransferData>({
  id: "transfer",
  name: "Transfer",
  category: "Oyuncu",
  description: "İmza duyurusu, bonservis ve detaylar",
  icon: ArrowRightLeft,
  Component: TransferCard,
  fields: [
    { key: "tag", label: "Etiket", type: "text" },
    { key: "status", label: "Durum", type: "text" },
    { key: "name", label: "Oyuncu adı", type: "text" },
    { key: "position", label: "Mevki / yaş", type: "text" },
    { key: "nation", label: "Bayrak", type: "country" },
    { key: "photo", label: "Oyuncu fotoğrafı", type: "image" },
    { key: "fromName", label: "Eski kulüp", type: "text" },
    { key: "fromCode", label: "Eski kulüp kısaltma", type: "text" },
    { key: "fromLogo", label: "Eski kulüp logo", type: "image" },
    { key: "toName", label: "Yeni kulüp", type: "text" },
    { key: "toCode", label: "Yeni kulüp kısaltma", type: "text" },
    { key: "toLogo", label: "Yeni kulüp logo", type: "image" },
    { key: "feeLabel", label: "Bedel başlığı", type: "text" },
    { key: "fee", label: "Bedel", type: "text" },
    {
      key: "facts",
      label: "Detaylar (en fazla 4)",
      type: "list",
      itemLabel: "Detay",
      fields: [
        { key: "label", label: "Başlık", type: "text", size: "grow" },
        { key: "value", label: "Değer", type: "text", size: "grow" },
      ],
    },
    { key: "note", label: "Not", type: "textarea" },
  ],
  defaults: {
    tag: "Transfer",
    status: "Resmî",
    name: "Mateo Ferreyra",
    nation: "ar",
    position: "Santrfor · 18 yaş",
    photo: "",
    fromName: "Vélez",
    fromCode: "VEL",
    fromLogo: "",
    toName: "Göztepe",
    toCode: "GÖZ",
    toLogo: "",
    feeLabel: "Bonservis",
    fee: "€9M",
    facts: [
      { label: "Sözleşme", value: "5 yıl" },
      { label: "Maaş", value: "€18K/hf" },
      { label: "Serbest kalma", value: "€45M" },
      { label: "Sonraki satış", value: "%15" },
    ],
    note: "Kulüp tarihinin en pahalı transferi. Üç scout raporu, iki ay takip ve son gün gelen imza.",
  },
});
