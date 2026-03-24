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
    default: "rkade - Campus Events & Entertainment Platform",
    template: "%s | rkade"
  },
  description: "Discover and join campus events, entertainment activities, and connect with your university community on rkade. The ultimate platform for student engagement and campus life.",
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
  authors: [{ name: "rkade Team" }],
  creator: "rkade",
  publisher: "rkade",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://rkade.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://rkade.in',
    title: 'rkade - Campus Events & Entertainment Platform',
    description: 'Discover and join campus events, entertainment activities, and connect with your university community on rkade.',
    siteName: 'rkade',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'rkade - Campus Events Platform',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'rkade - Campus Events & Entertainment Platform',
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
              name: 'rkade',
              description: 'Campus Events & Entertainment Platform',
              url: 'https://rkade.in',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://rkade.in/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
              },
              sameAs: [
                'https://twitter.com/rkade',
                'https://facebook.com/rkade',
                'https://instagram.com/rkade'
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