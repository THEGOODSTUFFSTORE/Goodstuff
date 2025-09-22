import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/providers/StoreProvider";
import { Inter } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Metadata } from 'next';
import Script from 'next/script';
import AgeVerificationModal from './components/AgeVerificationModal';
import WhatsAppFloat from './components/WhatsAppFloat';

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
  keywords: ['wine', 'spirits', 'beer', 'gin', 'whisky', 'vodka', 'cream liqueurs', 'market', 'premium drinks', 'Kenya'],
  authors: [{ name: 'The Goodstuff Team' }],
  creator: 'The Goodstuff',
  publisher: 'The Goodstuff',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://thegoodstuffdrinks.delivery'),
  alternates: {
    canonical: '/',
  },
  other: {
    'X-Content-Type-Options': 'nosniff',
  },
  openGraph: {
    title: 'The Goodstuff - Premium Wines & Spirits',
    description: 'Discover premium wines, spirits, and more at The Goodstuff. We offer a curated selection of fine wines, craft spirits, and exclusive market items.',
    url: 'https://thegoodstuffdrinks.delivery',
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

export const dynamic = 'force-dynamic';

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
        {/* Preload critical resources */}
        <link rel="preload" href="/hero.webp" as="image" type="image/webp" />
        <link rel="preload" href="/logo.png" as="image" type="image/png" />
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
        <AgeVerificationModal />
        <WhatsAppFloat />
        </StoreProvider>
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-65BEX1ZEVP"
          strategy="afterInteractive"
        />
        <Script id="ga-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);} 
            gtag('js', new Date());

            gtag('config', 'G-65BEX1ZEVP');
          `}
        </Script>

        {/* Meta Pixel Code */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1159663612722997');
fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img height="1" width="1" style={{ display: 'none' }} src="https://www.facebook.com/tr?id=1159663612722997&ev=PageView&noscript=1" />
        </noscript>
        {/* End Meta Pixel Code */}

        {/* Service Worker Registration */}
        {process.env.NODE_ENV === 'production' && (
          <Script id="sw-registration" strategy="afterInteractive">
            {`
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                  }).then(function(registration) {
                    console.log('SW registered: ', registration);
                  }).catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                  });
                });
              }
            `}
          </Script>
        )}
      </body>
    </html>
  );
}
