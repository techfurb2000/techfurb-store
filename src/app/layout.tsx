import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import AdSense from "@/components/ads/AdSense";
import AdBanner from "@/components/ads/AdBanner";
import { GoogleAnalytics } from "@next/third-parties/google";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "TechFurb - Premium Refurbished Laptops",
    template: "%s | TechFurb"
  },
  description: "High-performance, fully tested, and certified refurbished laptops for business, gaming, and everyday use at unbeatable prices.",
  keywords: ["refurbished laptops", "used laptops", "gaming laptops", "cheap laptops", "TechFurb"],
  openGraph: {
    title: "TechFurb - Premium Refurbished Laptops",
    description: "High-performance, fully tested, and certified refurbished laptops for business, gaming, and everyday use at unbeatable prices.",
    url: "/",
    siteName: "TechFurb",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TechFurb - Premium Refurbished Laptops",
    description: "High-performance, fully tested, and certified refurbished laptops for business, gaming, and everyday use at unbeatable prices.",
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        
        {/* Ad below main content, before footer */}
        <div className="container mx-auto px-4 my-8">
          <AdBanner 
            dataAdSlot="8765432109" 
            dataAdFormat="auto" 
            dataFullWidthResponsive={true} 
          />
        </div>
        
        <Footer />
        <AdSense pId={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT_ID || ""} />
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID} />
        )}
      </body>
    </html>
  );
}
