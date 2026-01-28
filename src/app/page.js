import Image from "next/image";
import "./main.scss";
import Hero from "../../components/Home/Hero/Hero";
import Poster from "../../components/Home/Poster/Poster";
import Preview from "../../components/Home/Preview/Preview";
import About from "../../components/Home/About/About";
import New from "../../components/Home/New/New";
import Exclusive from "../../components/Home/Exclusive/Exclusive";
import Reviews from "../../components/Home/Reviews/Reviews";

export const metadata = {
  title: "IQOS купить | IQOS ILUMA Москва",
  description:
    "IQOS ILUMA - купить оригинальные устройства и стики в Москве. Гарантия, проверенное качество, доставка.",
  alternates: {
    canonical: "https://iqos-iluma.com",
  },
  openGraph: {
    title: "IQOS купить | IQOS ILUMA Москва",
    description:
      "IQOS ILUMA - купить оригинальные устройства и стики в Москве. Гарантия, проверенное качество, доставка.",
    url: "https://iqos-iluma.com",
    type: "website",
    images: [
      {
        url: "https://iqos-iluma.com/favicon/og-image.png", // обязательно PNG или JPG
        width: 512,
        height: 512,
        alt: "Iluma Store — IQOS Iluma и стики Terea",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IQOS купить | IQOS ILUMA Москва",
    description:
      "IQOS ILUMA - купить оригинальные устройства и стики в Москве. Гарантия, проверенное качество, доставка.",
    images: ["https://iqos-iluma.com/favicon/og-image.png"],
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Store",
            name: "Iqos Iluma",
            url: "https://iqos-iluma.com",
            description:
              "Официальный магазин IQOS Iluma и стиков Terea с доставкой по России",
            address: {
              "@type": "PostalAddress",
              addressCountry: "RU",
              addressLocality: "Москва",
            },
          }),
        }}
      />
      <main>
        <section>
          <Hero />
        </section>
        <section>
          <Poster />
        </section>
        <section>
          <Preview />
        </section>

        <section>
          <Exclusive />
        </section>

        <section>
          <New />
        </section>

        <section>
          <About />
        </section>

        <section>
          <Reviews />
        </section>
      </main>
    </>
  );
}
