import localFont from "next/font/local";
import "./globals.scss";
import Header from "../../components/Header/Header";
import Bootstrap from "../../components/Bootstrap/Bootstrap";
import { CartProvider } from "@/cart/add/cart";
import Footer from "../../components/Footer/Footer";
import Cart from "../../components/Cart/cart";
import CartButton from "../../components/CartButton/CartButton";
import YandexMetrika from "../../components/YandexMetrika/YandexMEtrika";
import YandexAd from "../../components/YandexAd/YandexAd";
// import BlockModal from "../../components/BlockModal/BlockModal";
import Script from "next/script";

const montserrat = localFont({
  src: "./fonts/Montserrat-VariableFont_wght.ttf",
  variable: "--font-montserrat",
  weight: "100 900",
});

export const metadata = {
  icons: {
    icon: [
      { rel: "icon", type: "image/svg+xml", url: "/favicon/favicon.svg" },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        url: "/favicon/favicon-96x96.png",
      },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable}`}>
        <CartProvider>
          <YandexMetrika />
          <Bootstrap />
          <Header />
          {children}
          <Footer />
          <Cart />
          <CartButton />
          {/* <BlockModal allowClose={true}/> */}
        </CartProvider>
      </body>
    </html>
  );
}
