import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import FlyToCart from "@/components/ui/FlyToCart";
import SystemStatus from "@/components/ui/SystemStatus";

// Ensure seed data runs to update products with new prices
seedData();

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
  title: "Trà Thái Nguyên - Tinh Hoa Trà Việt",
  description: "Thưởng thức hương vị trà Thái Nguyên thượng hạng. Đậm đà bản sắc Việt.",
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

