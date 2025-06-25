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
      { url: "/wavr-icon-1750892236.svg", type: "image/svg+xml" },
      { url: "/wavr-icon-1750892236.svg", sizes: "32x32" },
      { url: "/wavr-icon-1750892236.svg", sizes: "16x16" }
    ],
    apple: [
      { url: "/wavr-icon-1750892236.svg", sizes: "180x180", type: "image/svg+xml" },
      { url: "/wavr-icon-1750892236.svg", sizes: "152x152", type: "image/svg+xml" },
      { url: "/wavr-icon-1750892236.svg", sizes: "120x120", type: "image/svg+xml" },
      { url: "/wavr-icon-1750892236.svg", sizes: "76x76", type: "image/svg+xml" }
    ],
    shortcut: "/wavr-icon-1750892236.svg",
    other: [
      {
        url: "/wavr-icon-1750892236.svg",
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
        url: "/wavr-icon-1750892236.svg",
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
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/wavr-icon-1750892236.svg" type="image/svg+xml" />
        <link rel="icon" href="/wavr-icon-1750892236.svg" sizes="32x32" />
        <link rel="icon" href="/wavr-icon-1750892236.svg" sizes="16x16" />
        <link rel="apple-touch-icon" href="/wavr-icon-1750892236.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/wavr-icon-1750892236.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/wavr-icon-1750892236.svg" />
        <link rel="apple-touch-icon" sizes="120x120" href="/wavr-icon-1750892236.svg" />
        <link rel="apple-touch-icon" sizes="76x76" href="/wavr-icon-1750892236.svg" />
        <link rel="mask-icon" href="/wavr-icon-1750892236.svg" color="#9333ea" />
        <link rel="shortcut icon" href="/wavr-icon-1750892236.svg" />
        <meta name="apple-mobile-web-app-title" content="wavr" />
        <meta name="application-name" content="wavr" />
        <meta name="apple-touch-icon" content="/wavr-icon-1750892236.svg" />
        <meta name="msapplication-TileImage" content="/wavr-icon-1750892236.svg" />
        <meta name="msapplication-TileColor" content="#9333ea" />
        <meta name="theme-color" content="#0f0f23" />
        <meta name="color-scheme" content="dark" />
        <meta property="og:image" content="/wavr-icon-1750892236.svg" />
        <meta property="og:image:type" content="image/svg+xml" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <style dangerouslySetInnerHTML={{__html: `
          /* Force dark mode immediately */
          html { 
            color-scheme: dark !important; 
            background-color: #0f0f23 !important;
          }
          body { 
            background-color: #0f0f23 !important; 
            color: #ffffff !important;
          }
          
          /* Light mode override when explicitly chosen */
          html.light { 
            color-scheme: light !important; 
            background-color: #ffffff !important;
          }
          html.light body { 
            background-color: #ffffff !important; 
            color: #000000 !important;
          }
        `}} />
      </head>
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Force dark mode IMMEDIATELY
                document.documentElement.style.backgroundColor = '#0f0f23';
                document.documentElement.style.colorScheme = 'dark';
                
                try {
                  const theme = localStorage.getItem('theme');
                  console.log('Theme from localStorage:', theme);
                  
                  if (theme === 'light') {
                    // User explicitly wants light mode
                    console.log('Switching to light mode');
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.style.backgroundColor = '#ffffff';
                    document.documentElement.style.colorScheme = 'light';
                  } else {
                    // Stay in dark mode
                    console.log('Staying in dark mode');
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {
                  console.log('LocalStorage error, forcing dark mode:', e);
                  // If localStorage fails, force dark mode
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
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
