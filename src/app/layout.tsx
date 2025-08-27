import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jamm App",
  description: "Jamm App Landing Page",
  manifest: "/jammLetter.png",
  openGraph: {
    title: "Jamm App",
    description: "Jamm App Landing Page",
    url: "https://www.jamm.company/",
    images: [
      {
        url: "https://www.jamm.company/jammLetter.png",
        width: 1200,
        height: 1200,
        alt: "Jamm App Preview",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
