import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "wavr",
  description: "Connect with music studios, artists, and producers worldwide. Find collaborators, book studios, and grow your music career.",
  keywords: ["music", "studio", "producer", "artist", "collaboration", "recording", "wavr"],
  authors: [{ name: "wavr" }],
  creator: "wavr",
  publisher: "wavr",
  
  // Favicon and icons
  icons: {
    icon: [
      { url: "/icon.svg?v=2", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/icon.svg?v=2", sizes: "180x180", type: "image/svg+xml" }
    ],
  },
  
  // Open Graph for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wavr.club",
    title: "wavr - Connect with Music Creators",
    description: "Connect with music studios, artists, and producers worldwide. Find collaborators, book studios, and grow your music career.",
    siteName: "wavr",
    images: [
      {
        url: "/og-image.svg?v=2",
        width: 1200,
        height: 630,
        alt: "wavr - Music Collaboration Platform",
        type: "image/svg+xml",
      },
      {
        url: "/icon.svg?v=2",
        width: 512,
        height: 512, 
        alt: "wavr logo",
        type: "image/svg+xml",
      },
    ],
  },
  
  // Twitter/X Card
  twitter: {
    card: "summary_large_image",
    title: "wavr - Connect with Music Creators",
    description: "Connect with music studios, artists, and producers worldwide. Find collaborators, book studios, and grow your music career.",
    images: ["/og-image.svg?v=2"],
    creator: "@wavr",
  },
  
  // Web App Manifest
  manifest: "/site.webmanifest?v=2",
  
  // Additional meta tags
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "wavr",
    "apple-touch-icon": "/icon.svg?v=2",
    "theme-color": "#1a1a2e",
    "msapplication-navbutton-color": "#1a1a2e",
  },
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
                  // Default to dark mode unless explicitly set to light
                  const isDark = theme !== 'light';
                  document.documentElement.classList.toggle('dark', isDark);
                } catch (e) {
                  // If localStorage fails, default to dark mode
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
