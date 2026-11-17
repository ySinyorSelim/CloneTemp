/** Flag files available in /public/flags (flag-icons, MIT). */
const CODES = [
  "ad", "ae", "af", "ag", "ai", "al", "am", "ao", "aq", "ar", "arab", "as", "asean", "at",
  "au", "aw", "ax", "az", "ba", "bb", "bd", "be", "bf", "bg", "bh", "bi", "bj", "bl",
  "bm", "bn", "bo", "bq", "br", "bs", "bt", "bv", "bw", "by", "bz", "ca", "cc", "cd",
  "cefta", "cf", "cg", "ch", "ci", "ck", "cl", "cm", "cn", "co", "cp", "cr", "cu", "cv",
  "cw", "cx", "cy", "cz", "de", "dg", "dj", "dk", "dm", "do", "dz", "eac", "ec", "ee",
  "eg", "eh", "er", "es-ct", "es-ga", "es-pv", "es", "et", "eu", "fi", "fj", "fk", "fm", "fo",
  "fr", "ga", "gb-eng", "gb-nir", "gb-sct", "gb-wls", "gb", "gd", "ge", "gf", "gg", "gh", "gi", "gl",
  "gm", "gn", "gp", "gq", "gr", "gs", "gt", "gu", "gw", "gy", "hk", "hm", "hn", "hr",
  "ht", "hu", "ic", "id", "ie", "il", "im", "in", "io", "iq", "ir", "is", "it", "je",
  "jm", "jo", "jp", "ke", "kg", "kh", "ki", "km", "kn", "kp", "kr", "kw", "ky", "kz",
  "la", "lb", "lc", "li", "lk", "lr", "ls", "lt", "lu", "lv", "ly", "ma", "mc", "md",
  "me", "mf", "mg", "mh", "mk", "ml", "mm", "mn", "mo", "mp", "mq", "mr", "ms", "mt",
  "mu", "mv", "mw", "mx", "my", "mz", "na", "nc", "ne", "nf", "ng", "ni", "nl", "no",
  "np", "nr", "nu", "nz", "om", "pa", "pc", "pe", "pf", "pg", "ph", "pk", "pl", "pm",
  "pn", "pr", "ps", "pt", "pw", "py", "qa", "re", "ro", "rs", "ru", "rw", "sa", "sb",
  "sc", "sd", "se", "sg", "sh-ac", "sh-hl", "sh-ta", "sh", "si", "sj", "sk", "sl", "sm", "sn",
  "so", "sr", "ss", "st", "sv", "sx", "sy", "sz", "tc", "td", "tf", "tg", "th", "tj",
  "tk", "tl", "tm", "tn", "to", "tr", "tt", "tv", "tw", "tz", "ua", "ug", "um", "un",
  "us", "uy", "uz", "va", "vc", "ve", "vg", "vi", "vn", "vu", "wf", "ws", "xk", "xx",
  "ye", "yt", "za", "zm", "zw",
];

/** Football nations and regions that Intl.DisplayNames does not know. */
const CUSTOM_NAMES: Record<string, string> = {
  "gb-eng": "İngiltere",
  "gb-sct": "İskoçya",
  "gb-wls": "Galler",
  "gb-nir": "Kuzey İrlanda",
  gb: "Birleşik Krallık",
  eu: "Avrupa Birliği",
  xk: "Kosova",
};

export type Country = { code: string; name: string };

function buildCountries(): Country[] {
  const names = new Intl.DisplayNames(["tr"], { type: "region", fallback: "none" });
  const list: Country[] = [];
  for (const code of CODES) {
    let name = CUSTOM_NAMES[code];
    if (!name && code.length === 2) {
      try {
        name = names.of(code.toUpperCase()) ?? "";
      } catch {
        name = "";
      }
    }
    if (name) list.push({ code, name });
  }
  return list.sort((a, b) => a.name.localeCompare(b.name, "tr"));
}

export const COUNTRIES: Country[] = buildCountries();

export function countryName(code: string): string {
  return COUNTRIES.find((c) => c.code === code)?.name ?? "";
}
