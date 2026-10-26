import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MOSAIC-MONTAGE 2026 | IIIM Jaipur",
  description: "The 27th Annual Management & IT Fest at IIIM Jaipur. A meeting ground for bold ideas. 20–21 November 2026.",
  metadataBase: new URL("https://www.icfia.org"),
  openGraph: {
    title: "MOSAIC-MONTAGE 2026",
    description: "A meeting ground for bold ideas — 20–21 November 2026, IIIM Jaipur.",
    type: "website"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
