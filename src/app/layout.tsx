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
        url: "/wavr-social-share.png",
        width: 1200,
        height: 630,
        alt: "wavr - Music Collaboration Platform",
        type: "image/png",
      },
      {
        url: "/wavr_icon_dark_512.png",
        width: 512,
        height: 512, 
        alt: "wavr logo",
        type: "image/png",
      },
    ],
  },
  
  // Twitter/X Card
  twitter: {
    card: "summary_large_image",
    title: "wavr - Connect with Music Creators",
    description: "Connect with music studios, artists, and producers worldwide. Find collaborators, book studios, and grow your music career.",
    images: ["/wavr-social-share.png"],
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
    <html lang="en" suppressHydrationWarning className="dark" style={{backgroundColor: '#0f0f23', colorScheme: 'dark'}}>
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
        <meta property="og:image" content="/wavr-social-share.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="wavr - Music Collaboration Platform" />
        <meta name="twitter:image" content="/wavr-social-share.png" />
        <meta name="twitter:image:alt" content="wavr - Music Collaboration Platform" />
        <style dangerouslySetInnerHTML={{__html: `
          /* NUCLEAR dark mode enforcement - force dark mode everywhere */
          * { 
            color-scheme: dark !important; 
          }
          :root { 
            color-scheme: dark !important; 
            --background: #0f0f23 !important;
            --foreground: #ffffff !important;
          }
          html, html.dark { 
            color-scheme: dark !important; 
            background-color: #0f0f23 !important;
            background: #0f0f23 !important;
            color: #ffffff !important;
          }
          body, body.dark { 
            background-color: #0f0f23 !important; 
            background: #0f0f23 !important;
            color: #ffffff !important;
          }
          
          /* Only allow light mode when explicitly set */
          html.light { 
            color-scheme: light !important; 
            background-color: #ffffff !important;
            background: #ffffff !important;
            color: #000000 !important;
            --background: #ffffff !important;
            --foreground: #000000 !important;
          }
          html.light body { 
            background-color: #ffffff !important; 
            background: #ffffff !important;
            color: #000000 !important;
          }
          
          /* Force dark mode on desktop browsers */
          @media (prefers-color-scheme: dark), (prefers-color-scheme: no-preference) {
            html:not(.light) { 
              color-scheme: dark !important;
              background-color: #0f0f23 !important;
            }
          }
        `}} />
      </head>
      <body className="font-sans antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                console.log('🌙 NUCLEAR DARK MODE INITIALIZATION');
                
                // STEP 1: IMMEDIATE VISUAL FORCE - before any other code runs
                document.documentElement.style.setProperty('background-color', '#0f0f23', 'important');
                document.documentElement.style.setProperty('color-scheme', 'dark', 'important');
                document.documentElement.style.setProperty('color', '#ffffff', 'important');
                
                // STEP 2: Force HTML classes immediately
                document.documentElement.classList.remove('light');
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'dark');
                
                // STEP 3: Body styling when available
                function forceBodyDark() {
                  if (document.body) {
                    document.body.style.setProperty('background-color', '#0f0f23', 'important');
                    document.body.style.setProperty('color', '#ffffff', 'important');
                    document.body.classList.add('dark');
                    document.body.classList.remove('light');
                  }
                }
                
                // Apply immediately if body exists, otherwise wait
                if (document.body) {
                  forceBodyDark();
                } else {
                  document.addEventListener('DOMContentLoaded', forceBodyDark);
                }
                
                // STEP 4: localStorage logic with aggressive fallback
                try {
                  const savedTheme = localStorage.getItem('theme');
                  console.log('💾 Saved theme:', savedTheme);
                  
                  // ULTRA DEFENSIVE: Only allow light mode if EXPLICITLY saved as 'light'
                  if (savedTheme === 'light') {
                    console.log('☀️ User explicitly chose light mode');
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.style.setProperty('background-color', '#ffffff', 'important');
                    document.documentElement.style.setProperty('color-scheme', 'light', 'important');
                    document.documentElement.style.setProperty('color', '#000000', 'important');
                    
                    if (document.body) {
                      document.body.style.setProperty('background-color', '#ffffff', 'important');
                      document.body.style.setProperty('color', '#000000', 'important');
                      document.body.classList.remove('dark');
                      document.body.classList.add('light');
                    }
                  } else {
                    // EVERYTHING ELSE = DARK MODE (null, undefined, 'dark', invalid values)
                    console.log('🌙 Enforcing dark mode (default)');
                    localStorage.setItem('theme', 'dark');
                    // Dark mode styles already applied above
                  }
                } catch (error) {
                  console.error('❌ localStorage error, forcing dark mode:', error);
                  localStorage.setItem('theme', 'dark');
                  // Dark mode styles already applied above
                }
                
                console.log('✅ DARK MODE INITIALIZATION COMPLETE');
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
