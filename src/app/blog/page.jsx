// BlogPage.jsx
import './BlogPage.scss'
import Image from 'next/image'
import Link from 'next/link'
// Adjust the path to your JSON feed as needed
import posts from '@/data/blogData.json'

export default function BlogPageCombined(){
return (
<section className="blog-page">
  <div className="container">
    {/* <h1 className="blog-title">Блог</h1>
    <p className="blog-subtitle">Обзоры, инструкции и полезные материалы о IQOS, ILUMA и стиках Terea.</p> */}


  <div className="blog-grid">
    {posts.map(post => (
    <article key={post.id} className="blog-card">
      <Link href={`/blog/${post.slug}`} className="img-link">
      <div className="img-wrap">
      <Image src={post.imageUrl} alt={post.title} fill sizes="(max-width: 600px) 100vw, 33vw" />
        </div>
      


        <div className="card-body">
        <div className="meta">
        <span>{post.category}</span>
        <span className="dot">•</span>
        <span>{post.date}</span>
        </div>
        <h3 className="title">
        {post.title}
        </h3>
        <p className="desc">{post.description}</p>
        </div>
      </Link>
    </article>
    ))}
    </div>
  </div>
</section>
)
}

