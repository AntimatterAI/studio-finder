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
      { url: "/icon.svg?v=3", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/icon.svg?v=3", sizes: "180x180", type: "image/svg+xml" },
      { url: "/icon.svg?v=3", sizes: "152x152", type: "image/svg+xml" },
      { url: "/icon.svg?v=3", sizes: "120x120", type: "image/svg+xml" },
      { url: "/icon.svg?v=3", sizes: "76x76", type: "image/svg+xml" }
    ],
  },
  
  // Open Graph for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://studio-finder-git-main-pauls-projects-a3e85521.vercel.app",
    title: "wavr - Connect with Music Creators",
    description: "Connect with music studios, artists, and producers worldwide. Find collaborators, book studios, and grow your music career.",
    siteName: "wavr",
    images: [
      {
        url: "/og-image.svg?v=3",
        width: 1200,
        height: 630,
        alt: "wavr - Music Collaboration Platform",
        type: "image/svg+xml",
      },
      {
        url: "/icon.svg?v=3",
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
    images: ["/og-image.svg?v=3"],
    creator: "@wavr",
  },
  
  // Web App Manifest
  manifest: "/site.webmanifest?v=3",
  
  // Additional meta tags
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "wavr",
    "theme-color": "#1a1a2e",
    "msapplication-navbutton-color": "#1a1a2e",
    "format-detection": "telephone=no",
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
                // Force dark mode immediately to prevent flash
                document.documentElement.classList.add('dark');
                
                try {
                  const theme = localStorage.getItem('theme');
                  // Only switch to light if explicitly set to light
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // If localStorage fails, stay in dark mode (already set above)
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
