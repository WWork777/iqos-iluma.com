// app/blog/[slug]/page.jsx
import posts from "@/data/blogData.json";
import "./ArticlePage.scss";
import { notFound } from "next/navigation";

// Генерация метаданных
export async function generateMetadata({ params }) {
  const article = posts.find((p) => p.slug === params.slug);

  if (!article) {
    return {
      title: "Статья не найдена",
      description: "Запрошенная статья не существует",
    };
  }

  // Формируем ключевые слова на основе категории и тегов
  const baseKeywords = ["IQOS", "Iluma", "Terea", "блог", "статья"];
  const categoryKeywords = article.category ? [article.category] : [];
  const tagKeywords = article.tags || [];
  const allKeywords = [...baseKeywords, ...categoryKeywords, ...tagKeywords];

  return {
    title: `${article.title} | Блог об IQOS Iluma`,
    description:
      article.metaDescription ||
      article.description ||
      `Читайте статью "${article.title}" в блоге об IQOS Iluma и стиках Terea`,
    keywords: allKeywords.join(", "),
    alternates: {
      canonical: `https://iqos-iluma.com/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.metaDescription || article.description,
      url: `https://iqos-iluma.com/blog/${article.slug}`,
      type: "article",
      publishedTime: article.date,
      modifiedTime: article.updatedDate || article.date,
      authors: article.author ? [article.author] : ["Эксперт IQOS"],
      tags: [
        "IQOS",
        "Iluma",
        "Terea",
        article.category,
        ...(article.tags || []),
      ],
      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.metaDescription || article.description,
      images: [article.imageUrl],
      creator: "@iqos_iluma", // Добавьте ваш Twitter аккаунт
    },
    robots: {
      index: true,
      follow: true,
    },
    // Breadcrumb structured data will be added in the component
  };
}

export default function ArticlePage({ params }) {
  const article = posts.find((p) => p.slug === params.slug);

  if (!article) notFound();

  // Формируем breadcrumb данные
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Главная",
        item: "https://iqos-iluma.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Блог",
        item: "https://iqos-iluma.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://iqos-iluma.com/blog/${article.slug}`,
      },
    ],
  };

  // Schema для статьи
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.metaDescription || article.description,
    image: article.imageUrl,
    datePublished: article.date,
    dateModified: article.updatedDate || article.date,
    author: {
      "@type": "Person",
      name: article.author || "Эксперт IQOS",
      url: "https://iqos-iluma.com",
    },
    publisher: {
      "@type": "Organization",
      name: "IQOS Iluma Store",
      logo: {
        "@type": "ImageObject",
        url: "https://iqos-iluma.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://iqos-iluma.com/blog/${article.slug}`,
    },
  };

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <section className="article-page">
        <div className="container">
          <h1 className="title">{article.title}</h1>

          <div className="meta">
            <span className="category">{article.category}</span>
            <span className="dot">•</span>
            <time dateTime={article.date}>{article.date}</time>
            {article.readingTime && (
              <>
                <span className="dot">•</span>
                <span>{article.readingTime} мин чтения</span>
              </>
            )}
          </div>

          <div className="cover">
            <img src={article.imageUrl} alt={article.title} loading="eager" />
          </div>

          <article className="content">{article.text}</article>

          {/* Теги статьи */}
          {article.tags && article.tags.length > 0 && (
            <div className="article-tags">
              <strong>Теги:</strong>
              {article.tags.map((tag) => (
                <span key={tag} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Навигация по статьям */}
        </div>
      </section>
    </>
  );
}
