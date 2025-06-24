import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Finder",
  description: "Connect with music studios, artists, and producers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  // Default to light mode unless explicitly set to dark
                  const isDark = theme === 'dark';
                  document.documentElement.classList.toggle('dark', isDark);
                } catch (e) {}
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
