// 'use client'
// import { Search } from 'lucide-react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { useEffect, useState } from 'react'

// const BlogList = ({ posts = [] }) => {
// 	// Состояние пагинации
// 	const [currentPage, setCurrentPage] = useState(1)
// 	const [searchQuery, setSearchQuery] = useState('')
// 	const [activeCategory, setActiveCategory] = useState('Все статьи')
// 	const postsPerPage = 6
// 	// Защитные проверки и нормализация данных
// 	const safePosts = posts.map(post => ({
// 		id: post.id || '',
// 		title: post.title || '',
// 		text: post.text || '',
// 		tags: Array.isArray(post.tags) ? post.tags : [],
// 		slug: post.url || '',
// 		date: post.date || new Date().toISOString(),
// 		// Добавляем другие необходимые поля с проверками
// 	}))

// 	// Получаем уникальные категории из постов
// 	const categories = [
// 		'Все статьи',
// 		...new Set(posts.flatMap(post => post.tags)),
// 	]

// 	// Фильтрация постов с защитой от ошибок
// 	const filteredPosts = safePosts.filter(post => {
// 		try {
// 			const searchLower = searchQuery.toLowerCase()
// 			const titleLower = post.title?.toLowerCase() || ''
// 			const textLower = post.text?.toLowerCase() || ''

// 			const matchesSearch =
// 				titleLower.includes(searchLower) || textLower.includes(searchLower)
// 			const matchesCategory =
// 				activeCategory === 'Все статьи' ||
// 				(post.tags && post.tags.includes(activeCategory))

// 			return matchesSearch && matchesCategory
// 		} catch (error) {
// 			console.error('Error filtering post:', error, post)
// 			return false
// 		}
// 	})

// 	// Пагинация
// 	const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
// 	const indexOfLastPost = currentPage * postsPerPage
// 	const indexOfFirstPost = indexOfLastPost - postsPerPage
// 	const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

// 	// Сброс пагинации при изменении фильтров
// 	useEffect(() => {
// 		setCurrentPage(1)
// 	}, [searchQuery, activeCategory])

// 	// Функции пагинации
// 	const paginate = pageNumber => setCurrentPage(pageNumber)
// 	const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
// 	const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

// 	const getPageNumbers = () => {
// 		const pageNumbers = []
// 		const maxVisiblePages = 5

// 		if (totalPages <= maxVisiblePages) {
// 			for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
// 		} else {
// 			const leftBound = Math.max(
// 				1,
// 				currentPage - Math.floor(maxVisiblePages / 2)
// 			)
// 			const rightBound = Math.min(totalPages, leftBound + maxVisiblePages - 1)

// 			if (leftBound > 1) {
// 				pageNumbers.push(1)
// 				if (leftBound > 2) pageNumbers.push('...')
// 			}

// 			for (let i = leftBound; i <= rightBound; i++) pageNumbers.push(i)

// 			if (rightBound < totalPages) {
// 				if (rightBound < totalPages - 1) pageNumbers.push('...')
// 				pageNumbers.push(totalPages)
// 			}
// 		}

// 		return pageNumbers
// 	}

// 	return (
// 		<div className='bg-white min-h-screen'>
// 			{/* Hero Section */}
// 			<section className='relative bg-gray-100 py-20 md:pt-32'>
// 				<div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center'>
// 					<h1 className='text-5xl md:text-6xl xl:text-8xl text-bg_color font-cormorant'>
// 						Наш блог
// 					</h1>
// 					<p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto'>
// 						Полезные статьи, кейсы и новости из мира дизайна и разработки
// 					</p>
// 				</div>
// 			</section>

// 			{/* Blog Posts */}
// 			<section className='py-12 md:py-20'>
// 				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
// 					{/* Search and Filters */}
// 					<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12'>
// 						<div className='relative w-full md:w-auto'>
// 							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
// 								<Search className='h-5 w-5 text-gray-400' />
// 							</div>
// 							<input
// 								type='text'
// 								value={searchQuery}
// 								onChange={e => setSearchQuery(e.target.value)}
// 								className='block w-full md:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-accent_color focus:border-accent_color sm:text-sm'
// 								placeholder='Поиск по статьям'
// 							/>
// 						</div>

// 						<div className='flex flex-wrap gap-2'>
// 							{categories.map(category => (
// 								<button
// 									key={category}
// 									onClick={() => setActiveCategory(category)}
// 									className={`px-4 py-2 rounded-full text-sm font-medium transition ${
// 										activeCategory === category
// 											? 'bg-accent_color text-white'
// 											: 'bg-gray-100 hover:bg-gray-200'
// 									}`}
// 								>
// 									{category}
// 								</button>
// 							))}
// 						</div>
// 					</div>

// 					{/* Posts Grid */}
// 					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
// 						{currentPosts.length > 0 ? (
// 							currentPosts.map(post => (
// 								<article key={post.id} className='group'>
// 									<Link href={`/blog/${post.slug}`} className='block'>
// 										<div className='relative aspect-[4/3] mb-4 overflow-hidden rounded-lg'>
// 											<Image
// 												src={`/blog/img/${post.slug}.png`}
// 												alt={post.title}
// 												fill
// 												className='object-cover transition duration-300 group-hover:scale-105'
// 												placeholder='blur'
// 												blurDataURL='data:image/svg+xml;base64,...'
// 											/>
// 										</div>

// 										<span className='inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium mb-3'>
// 											{post.tags[0]}
// 										</span>

// 										<h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition'>
// 											{post.title}
// 										</h2>

// 										<p className='text-gray-600 mb-3 line-clamp-2'>
// 											{post.text}
// 										</p>

// 										<time
// 											dateTime={post.date}
// 											className='text-sm text-gray-500'
// 										>
// 											{new Date(post.date).toLocaleDateString('ru-RU', {
// 												day: 'numeric',
// 												month: 'long',
// 												year: 'numeric',
// 											})}
// 										</time>
// 									</Link>
// 								</article>
// 							))
// 						) : (
// 							<div className='col-span-full text-center py-12'>
// 								<p className='text-gray-500 text-lg'>Ничего не найдено</p>
// 								<button
// 									onClick={() => {
// 										setSearchQuery('')
// 										setActiveCategory('Все статьи')
// 									}}
// 									className='mt-4 text-red-500 hover:underline'
// 								>
// 									Сбросить фильтры
// 								</button>
// 							</div>
// 						)}
// 					</div>

// 					{/* Pagination */}
// 					{totalPages > 1 && (
// 						<div className='flex justify-center mt-12 md:mt-16'>
// 							<nav className='flex items-center space-x-2'>
// 								<button
// 									onClick={prevPage}
// 									disabled={currentPage === 1}
// 									className={`px-4 py-2 border border-gray-300 rounded-md font-medium ${
// 										currentPage === 1
// 											? 'text-gray-400 cursor-not-allowed'
// 											: 'text-gray-700 hover:bg-gray-50'
// 									}`}
// 								>
// 									Назад
// 								</button>

// 								{getPageNumbers().map((number, index) =>
// 									number === '...' ? (
// 										<span key={`ellipsis-${index}`} className='px-4 py-2'>
// 											...
// 										</span>
// 									) : (
// 										<button
// 											key={number}
// 											onClick={() => paginate(number)}
// 											className={`px-4 py-2 border rounded-md font-medium ${
// 												number === currentPage
// 													? 'bg-gray-900 text-white border-gray-900'
// 													: 'border-gray-300 text-gray-700 hover:bg-gray-50'
// 											}`}
// 										>
// 											{number}
// 										</button>
// 									)
// 								)}

// 								<button
// 									onClick={nextPage}
// 									disabled={currentPage === totalPages}
// 									className={`px-4 py-2 border border-gray-300 rounded-md font-medium ${
// 										currentPage === totalPages
// 											? 'text-gray-400 cursor-not-allowed'
// 											: 'text-gray-700 hover:bg-gray-50'
// 									}`}
// 								>
// 									Вперед
// 								</button>
// 							</nav>
// 						</div>
// 					)}
// 				</div>
// 			</section>
// 		</div>
// 	)
// }

// export default BlogList

'use client'
import { Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import './BlogList.css'

const BlogList = ({ posts = [] }) => {
	// State declarations
	const [currentPage, setCurrentPage] = useState(1)
	const [searchQuery, setSearchQuery] = useState('')
	const [activeCategory, setActiveCategory] = useState('Все статьи')

	const postsPerPage = 6

	// Rest of your component logic...
	const safePosts = posts.map(post => ({
		id: post.id || '',
		title: post.title || '',
		text: post.text || '',
		tags: Array.isArray(post.tags) ? post.tags : [],
		slug: post.url || '',
		date: post.date || new Date().toISOString(),
	}))

	const categories = [
		'Все статьи',
		...new Set(posts.flatMap(post => post.tags)),
	]

	const filteredPosts = safePosts.filter(post => {
		try {
			const searchLower = searchQuery.toLowerCase()
			const titleLower = post.title?.toLowerCase() || ''
			const textLower = post.text?.toLowerCase() || ''

			const matchesSearch =
				titleLower.includes(searchLower) || textLower.includes(searchLower)
			const matchesCategory =
				activeCategory === 'Все статьи' ||
				(post.tags && post.tags.includes(activeCategory))

			return matchesSearch && matchesCategory
		} catch (error) {
			console.error('Error filtering post:', error, post)
			return false
		}
	})

	const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
	const indexOfLastPost = currentPage * postsPerPage
	const indexOfFirstPost = indexOfLastPost - postsPerPage
	const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)

	useEffect(() => {
		setCurrentPage(1)
	}, [searchQuery, activeCategory])

	const paginate = pageNumber => setCurrentPage(pageNumber)
	const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
	const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))

	const getPageNumbers = () => {
		const pageNumbers = []
		const maxVisiblePages = 5

		if (totalPages <= maxVisiblePages) {
			for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
		} else {
			const leftBound = Math.max(
				1,
				currentPage - Math.floor(maxVisiblePages / 2)
			)
			const rightBound = Math.min(totalPages, leftBound + maxVisiblePages - 1)

			if (leftBound > 1) {
				pageNumbers.push(1)
				if (leftBound > 2) pageNumbers.push('...')
			}

			for (let i = leftBound; i <= rightBound; i++) pageNumbers.push(i)

			if (rightBound < totalPages) {
				if (rightBound < totalPages - 1) pageNumbers.push('...')
				pageNumbers.push(totalPages)
			}
		}

		return pageNumbers
	}

	return (
		<div className='blog-container'>
			{/* Hero Section */}
			<section className='hero-section'>
				<div className='container text-center'>
					<h1 className='title'>Наш блог</h1>
					<p className='subtitle'>
						Информация о разных аспектах использования стиков. Сравнения,
						оценки, инструкции!
					</p>
				</div>
			</section>

			{/* Blog Posts */}
			<section className='blog-section'>
				<div className='container'>
					{/* Search and Filters */}
					<div className='filters-container'>
						<div className='search-container'>
							<div className='search-icon'>
								<Search />
							</div>
							<input
								type='text'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								className='search-input'
								placeholder='Поиск по статьям'
							/>
						</div>

						<div className='categories-container'>
							{categories.map(category => (
								<button
									key={category}
									onClick={() => setActiveCategory(category)}
									className={`category-button ${
										activeCategory === category ? 'active' : 'inactive'
									}`}
								>
									{category}
								</button>
							))}
						</div>
					</div>

					{/* Posts Grid */}
					<div className='posts-grid'>
						{currentPosts.length > 0 ? (
							currentPosts.map(post => (
								<article key={post.id} className='post-article'>
									<Link href={`/blog/${post.slug}`} className='block'>
										<div className='post-image-container'>
											<Image
												src={`/Blog/img/${post.slug}.png`}
												alt={post.title}
												fill
												className='post-image'
												placeholder='blur'
												blurDataURL='data:image/svg+xml;base64,...'
											/>
										</div>

										<span className='post-tag'>{post.tags[0]}</span>

										<h2 className='post-title'>{post.title}</h2>

										<p className='post-excerpt'>{post.text}</p>

										<time dateTime={post.date} className='post-date'>
											{new Date(post.date).toLocaleDateString('ru-RU', {
												day: 'numeric',
												month: 'long',
												year: 'numeric',
											})}
										</time>
									</Link>
								</article>
							))
						) : (
							<div className='no-results'>
								<p className='no-results-text'>Ничего не найдено</p>
								<button
									onClick={() => {
										setSearchQuery('')
										setActiveCategory('Все статьи')
									}}
									className='reset-button'
								>
									Сбросить фильтры
								</button>
							</div>
						)}
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className='pagination-container'>
							<nav className='pagination-nav'>
								<button
									onClick={prevPage}
									disabled={currentPage === 1}
									className={`pagination-button ${
										currentPage === 1 ? 'disabled' : ''
									}`}
								>
									Назад
								</button>

								{getPageNumbers().map((number, index) =>
									number === '...' ? (
										<span
											key={`ellipsis-${index}`}
											className='pagination-ellipsis'
										>
											...
										</span>
									) : (
										<button
											key={number}
											onClick={() => paginate(number)}
											className={`pagination-button ${
												number === currentPage ? 'pagination-active' : ''
											}`}
										>
											{number}
										</button>
									)
								)}

								<button
									onClick={nextPage}
									disabled={currentPage === totalPages}
									className={`pagination-button ${
										currentPage === totalPages ? 'disabled' : ''
									}`}
								>
									Вперед
								</button>
							</nav>
						</div>
					)}
				</div>
			</section>
		</div>
	)
}

export default BlogList
