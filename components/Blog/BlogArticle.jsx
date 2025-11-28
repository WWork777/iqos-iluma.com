// import { ArrowLeft, CalendarDays, Clock } from 'lucide-react'
// import Image from 'next/image'
// import Link from 'next/link'
// const BlogArticle = ({ post = [] }) => {
// 	return (
// 		<div className='bg-white min-h-screen'>
// 			{/* Оригинальный контент статьи */}
// 			<section className='relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto'>
// 				<div className='mb-8'>
// 					<Link
// 						href='/blog'
// 						className='inline-flex items-center text-accent_color hover:text-blue-800 transition'
// 					>
// 						<ArrowLeft className='mr-2' size={18} />
// 						Назад к блогу
// 					</Link>
// 				</div>

// 				<div className='flex items-center text-sm text-gray-500 mb-4'>
// 					<span className='inline-flex items-center mr-4'>
// 						<CalendarDays className='mr-1' size={14} />
// 						<time dateTime={post.date} className='text-sm text-gray-500'>
// 							{new Date(post.date).toLocaleDateString('ru-RU', {
// 								day: 'numeric',
// 								month: 'long',
// 								year: 'numeric',
// 							})}
// 						</time>
// 					</span>
// 					<span className='inline-flex items-center'>
// 						<Clock className='mr-1' size={14} />5 мин чтения
// 					</span>
// 				</div>

// 				<h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-cormorant'>
// 					{post.title}
// 				</h1>

// 				<div className='flex flex-wrap gap-2 mb-8'>
// 					{post.tags?.map((tag, index) => (
// 						<span
// 							key={index}
// 							className='px-3 py-1 bg-gray-100 rounded-full text-xs font-medium'
// 						>
// 							{tag}
// 						</span>
// 					))}
// 				</div>

// 				<div className='relative aspect-[16/9] w-full rounded-lg overflow-hidden mb-8'>
// 					<Image
// 						src={`/Blog/img/${post.url}.png`}
// 						alt={post.title}
// 						fill
// 						className='object-cover'
// 						priority
// 					/>
// 				</div>
// 			</section>

// 			<article className='prose prose-lg max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24'>
// 				<div
// 					className='font-medium'
// 					dangerouslySetInnerHTML={{
// 						__html: post.articlestext.replace(/\n\n/g, '<br>'),
// 					}}
// 				/>
// 			</article>
// 		</div>
// 	)
// }

// export default BlogArticle

import { ArrowLeft, CalendarDays, Clock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import './BlogArticle.css'

const BlogArticle = ({ post = [] }) => {
	return (
		<div className='blog-article'>
			{/* Оригинальный контент статьи */}
			<section className='article-container'>
				<div className='back-link-container'>
					<Link href='/blog' className='back-link'>
						<ArrowLeft className='back-icon' size={18} />
						Назад к блогу
					</Link>
				</div>

				<div className='meta-info'>
					<span className='meta-item'>
						<CalendarDays className='meta-icon' size={14} />
						<time dateTime={post.date} className='date-text'>
							{new Date(post.date).toLocaleDateString('ru-RU', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
							})}
						</time>
					</span>
					<span className='meta-item'>
						<Clock className='meta-icon' size={14} />5 мин чтения
					</span>
				</div>

				<h1 className='article-title'>{post.title}</h1>

				<div className='tags-container'>
					{post.tags?.map((tag, index) => (
						<span key={index} className='tag'>
							{tag}
						</span>
					))}
				</div>

				<div className='image-container'>
					<Image
						src={`/Blog/img/${post.url}.png`}
						alt={post.title}
						fill
						className='article-image'
						priority
					/>
				</div>
			</section>

			<article className='article-content'>
				<div
					className='article-text'
					dangerouslySetInnerHTML={{
						__html: post.articlestext.replace(/\n\n/g, '<br>'),
					}}
				/>
			</article>
		</div>
	)
}

export default BlogArticle
