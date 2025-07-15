import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/lib/providers/StoreProvider";
import { Inter } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ['latin'] });

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
