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
      { url: "/wavr-icon.svg", type: "image/svg+xml" },
      { url: "/wavr-icon.svg", sizes: "32x32" },
      { url: "/wavr-icon.svg", sizes: "16x16" }
    ],
    apple: [
      { url: "/wavr-icon.svg", sizes: "180x180", type: "image/svg+xml" },
      { url: "/wavr-icon.svg", sizes: "152x152", type: "image/svg+xml" },
      { url: "/wavr-icon.svg", sizes: "120x120", type: "image/svg+xml" },
      { url: "/wavr-icon.svg", sizes: "76x76", type: "image/svg+xml" }
    ],
    shortcut: "/wavr-icon.svg",
    other: [
      {
        url: "/wavr-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
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
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "wavr - Music Collaboration Platform",
        type: "image/svg+xml",
      },
      {
        url: "/wavr-icon.svg",
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
    images: ["/og-image.svg"],
    creator: "@wavr",
  },
  
  // Web App Manifest
  manifest: "/site.webmanifest",
  
  // Additional meta tags
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "theme-color": "#1a1a2e",
    "msapplication-navbutton-color": "#1a1a2e",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/wavr-icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/wavr-icon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/wavr-icon.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/wavr-icon.svg" />
        <link rel="apple-touch-icon" sizes="120x120" href="/wavr-icon.svg" />
        <link rel="apple-touch-icon" sizes="76x76" href="/wavr-icon.svg" />
        <meta name="apple-mobile-web-app-title" content="wavr" />
        <meta name="application-name" content="wavr" />
      </head>
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  // Default to dark mode unless explicitly set to light
                  if (theme === 'light') {
                    // User wants light mode - don't add dark class
                    document.documentElement.classList.remove('dark');
                    document.documentElement.style.setProperty('color-scheme', 'light');
                  } else {
                    // Default to dark mode (theme is null, undefined, 'dark', or anything else)
                    document.documentElement.classList.add('dark');
                    document.documentElement.style.setProperty('color-scheme', 'dark');
                  }
                } catch (e) {
                  // If localStorage fails, default to dark mode
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.setProperty('color-scheme', 'dark');
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
