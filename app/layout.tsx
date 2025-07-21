import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/providers/StoreProvider";
import { Inter } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: 'The Goodstuff - Premium Wines & Spirits',
    template: '%s | The Goodstuff'
  },
  description: 'Discover premium wines, spirits, and more at The Goodstuff. We offer a curated selection of fine wines, craft spirits, and exclusive market items.',
  keywords: ['wine', 'spirits', 'beer', 'gin', 'bourbon', 'vodka', 'cream liqueurs', 'market', 'premium drinks', 'Kenya'],
  authors: [{ name: 'The Goodstuff Team' }],
  creator: 'The Goodstuff',
  publisher: 'The Goodstuff',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://thegoodstuff.co.ke'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'The Goodstuff - Premium Wines & Spirits',
    description: 'Discover premium wines, spirits, and more at The Goodstuff. We offer a curated selection of fine wines, craft spirits, and exclusive market items.',
    url: 'https://thegoodstuff.co.ke',
    siteName: 'The Goodstuff',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'The Goodstuff Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Goodstuff - Premium Wines & Spirits',
    description: 'Discover premium wines, spirits, and more at The Goodstuff. We offer a curated selection of fine wines, craft spirits, and exclusive market items.',
    images: ['/logo.png'],
    creator: '@thegoodstuff',
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
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code
  },
  category: 'shopping',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#EF4444" />
        <meta name="msapplication-TileColor" content="#EF4444" />
        {/* PWA specific */}
        <meta name="application-name" content="The Goodstuff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="The Goodstuff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.className} antialiased`}>
        <StoreProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </StoreProvider>
      </body>
    </html>
  );
}
