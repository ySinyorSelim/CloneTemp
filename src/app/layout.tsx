import type { Metadata } from "next";
import {
  Anton,
  Archivo,
  Bebas_Neue,
  DM_Sans,
  Geist,
  Geist_Mono,
  Inter,
  Manrope,
  Montserrat,
  Oswald,
  Sora,
  Space_Grotesk,
} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
});

// Optional fonts for the social card studio. Browsers only download the ones in use.
const sora = Sora({ variable: "--font-sora", subsets: ["latin", "latin-ext"], preload: false });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin", "latin-ext"], preload: false });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin", "latin-ext"], preload: false });
const oswald = Oswald({ variable: "--font-oswald", subsets: ["latin", "latin-ext"], preload: false });
const bebasNeue = Bebas_Neue({ variable: "--font-bebas-neue", subsets: ["latin", "latin-ext"], weight: "400", preload: false });
const anton = Anton({ variable: "--font-anton", subsets: ["latin", "latin-ext"], weight: "400", preload: false });
const inter = Inter({ variable: "--font-inter", subsets: ["latin", "latin-ext"], preload: false });
const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin", "latin-ext"], preload: false });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin", "latin-ext"], preload: false });

const studioFonts = [sora, spaceGrotesk, montserrat, oswald, bebasNeue, anton, inter, manrope, dmSans]
  .map((font) => font.variable)
  .join(" ");

export const metadata: Metadata = {
  title: "Website Clone",
  description: "Pixel-perfect website clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} ${studioFonts} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
