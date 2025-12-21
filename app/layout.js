import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { seedData } from "@/lib/db";
import FlyToCart from "@/components/ui/FlyToCart";

// Ensure data is seeded
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

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <CartProvider>
          <Header />
          {children}
          <FlyToCart />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

