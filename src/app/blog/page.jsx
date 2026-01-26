// BlogPage.jsx
import "./BlogPage.scss";
import Image from "next/image";
import Link from "next/link";
// Adjust the path to your JSON feed as needed
import posts from "@/data/blogData.json";

// BlogPage.jsx - добавить вверху файла или в layout/page.js
export const metadata = {
  title: "Блог об IQOS Iluma и стиках Terea | Обзоры, инструкции, новости",
  description:
    "Экспертные статьи об IQOS Iluma: инструкции по использованию, обзоры моделей, сравнение стиков Terea, советы по уходу и последние новости о продукции.",
  keywords:
    "блог IQOS, обзор Iluma, инструкция Terea, новости IQOS, сравнение стиков, уход за IQOS, отзывы Iluma",
  alternates: {
    canonical: "https://iqos-iluma.com/blog",
  },
  openGraph: {
    title: "Блог о IQOS Iluma | Полезные материалы и инструкции",
    description:
      "Читайте экспертные статьи: как пользоваться IQOS Iluma, обзоры новых моделей, сравнение вкусов Terea, ответы на частые вопросы",
    url: "https://iqos-iluma.com/blog",
    type: "website",
    siteName: "IQOS Iluma | Блог",
    locale: "ru_RU",
    images: [
      {
        url: "https://iqos-iluma.com/images/blog-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Блог об IQOS Iluma и стиках Terea",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Блог об IQOS Iluma — полезные материалы",
    description:
      "Инструкции, обзоры и советы по использованию IQOS Iluma и стиков Terea",
    images: ["https://iqos-iluma.com/images/blog-twitter-card.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function BlogPageCombined() {
  return (
    <section className="blog-page">
      <div className="container">
        {/* <h1 className="blog-title">Блог</h1>
    <p className="blog-subtitle">Обзоры, инструкции и полезные материалы о IQOS, ILUMA и стиках Terea.</p> */}

        <div className="blog-grid">
          {posts.map((post) => (
            <article key={post.id} className="blog-card">
              <Link href={`/blog/${post.slug}`} className="img-link">
                <div className="img-wrap">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(max-width: 600px) 100vw, 33vw"
                  />
                </div>

                <div className="card-body">
                  <div className="meta">
                    <span>{post.category}</span>
                    <span className="dot">•</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="title">{post.title}</h3>
                  <p className="desc">{post.description}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
