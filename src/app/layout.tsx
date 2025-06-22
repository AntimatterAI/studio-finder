import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Studio Finder - Connect with Artists & Producers",
  description: "Find collaborators, book studio time, and grow your music network. Join the community that's revolutionizing music creation.",
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${manrope.variable} bg-background text-foreground font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
