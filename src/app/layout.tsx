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
      { url: "/icon.svg?v=4", type: "image/svg+xml" },
      { url: "/icon.svg?v=4", sizes: "32x32" },
      { url: "/icon.svg?v=4", sizes: "16x16" }
    ],
    apple: [
      { url: "/icon.svg?v=4", sizes: "180x180", type: "image/svg+xml" },
      { url: "/icon.svg?v=4", sizes: "152x152", type: "image/svg+xml" },
      { url: "/icon.svg?v=4", sizes: "120x120", type: "image/svg+xml" },
      { url: "/icon.svg?v=4", sizes: "76x76", type: "image/svg+xml" }
    ],
    shortcut: "/icon.svg?v=4",
    other: [
      {
        url: "/icon.svg?v=4",
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
        url: "/og-image.svg?v=4",
        width: 1200,
        height: 630,
        alt: "wavr - Music Collaboration Platform",
        type: "image/svg+xml",
      },
      {
        url: "/icon.svg?v=4",
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
    images: ["/og-image.svg?v=4"],
    creator: "@wavr",
  },
  
  // Web App Manifest
  manifest: "/site.webmanifest?v=4",
  
  // Additional meta tags
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "wavr",
    "theme-color": "#1a1a2e",
    "msapplication-navbutton-color": "#1a1a2e",
    "format-detection": "telephone=no",
    // Force iOS to recognize our custom icon
    "mobile-web-app-capable": "yes",
    "application-name": "wavr",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="font-sans antialiased dark">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Force dark mode at multiple levels immediately
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
                document.body && document.body.classList.add('dark');
                
                // Set CSS custom property for immediate effect
                document.documentElement.style.setProperty('color-scheme', 'dark');
                
                try {
                  const theme = localStorage.getItem('theme');
                  // Only switch to light if explicitly set to light
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.body && document.body.classList.remove('dark');
                    document.documentElement.style.setProperty('color-scheme', 'light');
                  }
                } catch (e) {
                  // If localStorage fails, ensure dark mode
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
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
