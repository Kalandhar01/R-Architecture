import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter, Manrope } from "next/font/google";
import "./globals.css";
import { SITE_URL, COMPANY_SHORT, SITE_DESCRIPTION, OG_IMAGE, LOGO_IMAGE } from "@/lib/seo";

const siteUrl = SITE_URL;

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap"
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap"
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap"
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#111111",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: COMPANY_SHORT,
    template: `%s | ${COMPANY_SHORT}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: COMPANY_SHORT,
    title: COMPANY_SHORT,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 675,
        alt: COMPANY_SHORT,
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: COMPANY_SHORT,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  keywords: [
    "Ractysh Design",
    "Ractysh Architects",
    "Architecture Company",
    "Luxury Architecture",
    "Interior Design",
    "Commercial Architecture",
    "Residential Architecture",
    "Architects in Tamil Nadu",
    "Architects in Palani",
    "Architects in Dindigul",
    "Architecture Consultancy",
    "Building Design",
    "Villa Design",
    "Interior Design Studio",
    "Modern Architecture",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: LOGO_IMAGE,
    apple: LOGO_IMAGE,
  },
  manifest: "/manifest",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} ${bodoni.variable}`} suppressHydrationWarning>
      <body>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-nearblack focus:outline focus:outline-2 focus:outline-executive-red">
          Skip to main content
        </a>
        <div id="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}
