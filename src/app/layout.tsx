import type { Metadata } from "next";
import { Roboto, Manrope } from "next/font/google";
import "./globals.css";

const display = Roboto({ subsets: ["latin"], variable: "--font-hero", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
export const metadata: Metadata = {
  title: "Raffaela Forasteira — Social Media",
  description: "Transformando redes sociais em máquinas de vendas. Conheça Raffaela Forasteira.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${display.variable} ${sans.variable}`}>{children}</body></html>;
}
