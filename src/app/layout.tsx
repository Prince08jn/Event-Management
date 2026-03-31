import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import Footer from "@/components/home/footer";
import HomeButton from "@/components/home/HomeButton";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "EventoraX - Campus Events & Entertainment Platform",
    template: "%s | EventoraX"
  },
  description: "Discover and join campus events, entertainment activities, and connect with your university community on EventoraX. The ultimate platform for student engagement and campus life.",
  keywords: [
    "campus events",
    "university entertainment",
    "student activities",
    "college events",
    "campus life",
    "event management",
    "student community",
    "university platform"
  ],
  authors: [{ name: "EventoraX Team" }],
  creator: "EventoraX",
  publisher: "EventoraX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://eventorax.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://eventorax.in',
    title: 'EventoraX - Campus Events & Entertainment Platform',
    description: 'Discover and join campus events, entertainment activities, and connect with your university community on EventoraX.',
    siteName: 'EventoraX',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'EventoraX - Campus Events Platform',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EventoraX - Campus Events & Entertainment Platform',
    description: 'Discover and join campus events, entertainment activities, and connect with your university community.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <script src="/sw-register.js" defer></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'EventoraX',
              description: 'Campus Events & Entertainment Platform',
              url: 'https://eventorax.in',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://eventorax.in/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              },
              sameAs: [
                'https://twitter.com/eventorax',
                'https://facebook.com/eventorax',
                'https://instagram.com/eventorax'
              ]
            })
          }}
        />
      </head>
      <body
        className={`${inter.variable} antialiased`}
      >
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        )}
        <AuthProvider>
          {children}
          <HomeButton />
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}