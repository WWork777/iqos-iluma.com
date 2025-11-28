import { fetchPosts } from '@/lib/fetch-posts'
// Генерация метаданных для статьи
export async function generateMetadata({ params }) {
	const { slug } = await params
	const posts = await fetchPosts()
	const post = posts.find(item => item.url == slug)

	if (!post) {
		return {
			title: 'Статья не найдена',
			description: 'Запрошенная статья не существует или была удалена',
		}
	}

	return {
		title: `${post.title} | Название Статьи`,
		description: post.text?.slice(0, 160) || 'Интересная статья в нашем блоге',
		keywords: post.tags?.join(', ') || 'блог, статья',

		openGraph: {
			title: post.title,
			description: post.text?.slice(0, 100) || 'Читайте статью в нашем блоге',
			url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.url}`,
			type: 'article',
			publishedTime: post.date,
			images: [
				{
					url: `${process.env.NEXT_PUBLIC_SITE_URL}/Blog/img/${post.url}.png`,
					width: 1200,
					height: 630,
					alt: post.title,
				},
			],
		},

		twitter: {
			card: 'summary_large_image',
			title: post.title,
			description: post.text?.slice(0, 100) || 'Новая статья в блоге',
			images: [`${process.env.NEXT_PUBLIC_SITE_URL}/Blog/img/${post.slug}.png`],
		},

		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${post.slug}`,
		},
	}
}

import BlogArticle from '../../../../components/Blog/BlogArticle'
import BlogArticleSkeleton from '../../../../components/Blog/BlogArticleSkeleton'

const BlogArticlePage = async ({ params }) => {
	const { slug } = await params
	const posts = await fetchPosts()
	const post = posts.find(item => item.url == slug)
	if (!post) {
		return <BlogArticleSkeleton />
	}
	return <BlogArticle post={post} />
}

export default BlogArticlePage
