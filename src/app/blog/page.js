import { fetchPosts } from '@/lib/fetch-posts'
import BlogList from '../../../components/Blog/BlogList'
import BlogSkeleton from '../../../components/Blog/BlogSkeleton'

export async function generateMetadata() {
	try {
		const posts = await fetchPosts()
		const latestPost = posts?.[0]
		const descriptionText = latestPost?.text
			? latestPost.text.slice(0, 100)
			: 'Полезные статьи и новости'
		const defaultImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/og/og.jpg`

		return {
			title: 'Iqos-Iluma.ru | Блог',
			description:
				'Информация о разных аспектах использования стиков. Сравнения, оценки, инструкции!',
			keywords: ['блог', 'стики', 'айкос', 'terea', 'купить iqos'],

			openGraph: {
				title: 'Iqos-Iluma.ru | Блог',
				description: latestPost
					? `Последняя статья: ${latestPost.title} - ${descriptionText}...`
					: 'Полезные статьи и новости',
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
				type: 'website',
				images: latestPost?.imageUrl
					? [{ url: latestPost.imageUrl, width: 1200, height: 630 }]
					: [{ url: defaultImageUrl, width: 1200, height: 630 }],
			},

			twitter: {
				card: 'summary_large_image',
				title: 'Iqos-Iluma.ru | Блог',
				description: 'Читайте полезные статьи в нашем блоге',
				images: latestPost?.imageUrl || defaultImageUrl,
			},

			alternates: {
				canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/blog`,
			},
		}
	} catch (error) {
		console.error('Error generating metadata:', error)
		return {
			title: 'Iqos-Iluma.ru | Блог',
			description:
				'Информация о разных аспектах использования стиков. Сравнения, оценки, инструкции!',
		}
	}
}

async function BlogPage() {
	try {
		const blogPosts = await fetchPosts()
		if (!blogPosts || blogPosts.length === 0) {
			return <BlogSkeleton />
		}
		return <BlogList posts={blogPosts} />
	} catch (error) {
		console.error('Ошибка загрузки постов:', error)
		return <BlogSkeleton />
	}
}

export default BlogPage
