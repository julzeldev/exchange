import type { Metadata } from "next";
import { Merriweather, Lora } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: 'swap',
});

const lora = Lora({
  weight: ['400', '500', '600'],
  subsets: ["latin"],
  variable: "--font-lora",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Cartas",
  description: "Un espacio para intercambiar cartas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${merriweather.variable} ${lora.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
