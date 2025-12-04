// app/blog/[slug]/page.jsx
import posts from '@/data/blogData.json'
import './ArticlePage.scss'

export default function ArticlePage({ params }) {
  const article = posts.find(p => p.slug === params.slug)

  if (!article) return <div className="article-not-found">Статья не найдена</div>

  return (
    <section className="article-page">
      <div className="container">
        <h1 className="title">{article.title}</h1>

        <div className="meta">
          <span>{article.category}</span>
          <span className="dot">•</span>
          <span>{article.date}</span>
        </div>

        <div className="cover">
          <img src={article.imageUrl} alt={article.title} />
        </div>

        <article className="content">{article.text} </article>
      </div>
    </section>
  )
}

