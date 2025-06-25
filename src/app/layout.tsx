import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

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
      { url: "/favicon.ico", sizes: "any" },
      { url: "/wavr_favicon_32.svg", type: "image/svg+xml" },
      { url: "/wavr_favicon_32.svg", sizes: "32x32" },
      { url: "/wavr_favicon_32.svg", sizes: "16x16" },
      { url: "/wavr_icon_192.svg", sizes: "192x192", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/wavr_icon_dark_512.svg", sizes: "512x512", type: "image/svg+xml" },
      { url: "/wavr_icon_dark_512.svg", sizes: "180x180", type: "image/svg+xml" },
      { url: "/wavr_icon_dark_512.svg", sizes: "152x152", type: "image/svg+xml" },
      { url: "/wavr_icon_dark_512.svg", sizes: "120x120", type: "image/svg+xml" },
      { url: "/wavr_icon_dark_512.svg", sizes: "76x76", type: "image/svg+xml" }
    ],
    shortcut: "/wavr_favicon_32.svg",
    other: [
      {
        url: "/wavr_icon_192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
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
        url: "/wavr_logo_dark.svg",
        width: 1200,
        height: 630,
        alt: "wavr - Music Collaboration Platform",
        type: "image/svg+xml",
      },
      {
        url: "/wavr_icon_dark_512.svg",
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
    images: ["/wavr_logo_dark.svg"],
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/wavr_favicon_32.svg" type="image/svg+xml" />
        <link rel="icon" href="/wavr_favicon_32.svg" sizes="32x32" />
        <link rel="icon" href="/wavr_favicon_32.svg" sizes="16x16" />
        <link rel="icon" href="/wavr_icon_192.svg" sizes="192x192" />
        <link rel="apple-touch-icon" href="/wavr_icon_dark_512.svg" />
        <link rel="apple-touch-icon" sizes="512x512" href="/wavr_icon_dark_512.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/wavr_icon_dark_512.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/wavr_icon_dark_512.svg" />
        <link rel="apple-touch-icon" sizes="120x120" href="/wavr_icon_dark_512.svg" />
        <link rel="apple-touch-icon" sizes="76x76" href="/wavr_icon_dark_512.svg" />
        <link rel="mask-icon" href="/wavr_icon_dark_512.svg" color="#9333ea" />
        <link rel="shortcut icon" href="/wavr_favicon_32.svg" />
        <meta name="apple-mobile-web-app-title" content="wavr" />
        <meta name="application-name" content="wavr" />
        <meta name="apple-touch-icon" content="/wavr_icon_dark_512.svg" />
        <meta name="msapplication-TileImage" content="/wavr_icon_dark_512.svg" />
        <meta name="msapplication-TileColor" content="#9333ea" />
        <meta name="theme-color" content="#0f0f23" />
        <meta name="color-scheme" content="dark" />
        <meta property="og:image" content="/wavr_logo_dark.svg" />
        <meta property="og:image:type" content="image/svg+xml" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
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
                // ULTRA AGGRESSIVE DARK MODE FORCE
                document.documentElement.style.backgroundColor = '#0f0f23';
                document.documentElement.style.colorScheme = 'dark';
                document.documentElement.style.color = '#ffffff';
                document.body && (document.body.style.backgroundColor = '#0f0f23');
                document.body && (document.body.style.color = '#ffffff');
                
                // Force dark class immediately
                document.documentElement.classList.add('dark');
                document.documentElement.classList.remove('light');
                
                // Set localStorage default to dark if not set
                try {
                  const theme = localStorage.getItem('theme');
                  console.log('Theme from localStorage:', theme);
                  
                  if (theme === null || theme === undefined) {
                    // No theme set, default to dark
                    localStorage.setItem('theme', 'dark');
                    console.log('Set default theme to dark');
                  }
                  
                  // INVERTED LOGIC: Only switch to light if explicitly set to 'light'
                  if (theme === 'light') {
                    // User explicitly chose light mode
                    console.log('User chose light mode - switching to light');
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.style.backgroundColor = '#ffffff';
                    document.documentElement.style.colorScheme = 'light';
                    document.documentElement.style.color = '#000000';
                    document.body && (document.body.style.backgroundColor = '#ffffff');
                    document.body && (document.body.style.color = '#000000');
                  } else {
                    // Default to dark mode (everything else including 'dark', null, undefined)
                    console.log('Using dark mode (default)');
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  }
                } catch (e) {
                  console.log('LocalStorage error, forcing dark mode:', e);
                  // If localStorage fails, force dark mode
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                  localStorage.setItem('theme', 'dark');
                }
              })();
            `,
          }}
        />
        <Header />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
