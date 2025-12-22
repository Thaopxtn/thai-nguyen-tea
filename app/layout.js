import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import FlyToCart from "@/components/ui/FlyToCart";
import SystemStatus from "@/components/ui/SystemStatus";

// seedData removed
// seedData();

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://thai-nguyen-tea.vercel.app'), // Replace with actual domain if different
  title: {
    default: "Trà Thái Nguyên - Tinh Hoa Trà Việt",
    template: "%s | Trà Thái Nguyên"
  },
  description: "Thưởng thức hương vị trà Thái Nguyên thượng hạng. Đậm đà bản sắc Việt. Cung cấp các loại trà Tân Cương, chè búp tươi ngon nhất.",
  keywords: ["trà thái nguyên", "chè thái nguyên", "trà tân cương", "trà bắc", "trà xanh", "quà biếu tết"],
  openGraph: {
    title: "Trà Thái Nguyên - Tinh Hoa Trà Việt",
    description: "Thưởng thức hương vị trà Thái Nguyên thượng hạng. Đậm đà bản sắc Việt.",
    url: 'https://thai-nguyen-tea.vercel.app',
    siteName: 'Trà Thái Nguyên',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/images/hero-bg.png', // Fallback OG image
        width: 1200,
        height: 630,
        alt: 'Trà Thái Nguyên',
      },
    ],
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
  alternates: {
    canonical: '/',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Trà Thái Nguyên',
  url: 'https://thai-nguyen-tea.vercel.app',
  logo: 'https://thai-nguyen-tea.vercel.app/favicon.ico',
  description: 'Chuyên cung cấp các loại trà Thái Nguyên thượng hạng, trà búp, trà xanh chính hiệu.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Thái Nguyên',
    addressCountry: 'VN'
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+84 987 654 321',
    contactType: 'customer service'
  }
};

import AnalyticsTracker from "@/components/AnalyticsTracker";

export default async function RootLayout({ children }) {
  let isOffline = false;
  try {
    // Lazy check: if dbConnect returns null, we are offline
    const { default: dbConnect } = await import('@/lib/mongodb');
    const conn = await dbConnect();
    if (!conn) isOffline = true;
  } catch (e) {
    isOffline = true;
  }

  return (
    <html lang="vi">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>
          <AnalyticsTracker />
          <SystemStatus isOffline={isOffline} />
          <Header />
          {children}
          <FlyToCart />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

