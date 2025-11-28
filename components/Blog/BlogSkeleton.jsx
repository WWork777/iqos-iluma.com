// import { Search } from 'lucide-react'
// import Link from 'next/link'

// const BlogSkeletonPage = () => {
// 	// Пример данных статей блога
// 	const blogPosts = [
// 		{
// 			id: 1,
// 			title: 'Как мы создавали 3D-визуализацию для нового бизнес-центра',
// 			excerpt:
// 				'Подробный разбор процесса создания 3D-визуализации с нуля до финального рендера',
// 			date: '15 мая 2024',
// 			category: '3D Визуализация',
// 			slug: '3d-visualization-process',
// 		},
// 		{
// 			id: 2,
// 			title: 'Тренды в веб-дизайне 2024: что будет актуально',
// 			excerpt:
// 				'Обзор главных тенденций в дизайне интерфейсов и веб-разработке в наступившем году',
// 			date: '3 мая 2024',
// 			category: 'Веб-дизайн',
// 			slug: 'web-design-trends-2024',
// 		},
// 		{
// 			id: 3,
// 			title: 'Разработка мобильного приложения: кейс для ресторана',
// 			excerpt:
// 				'Как мы разрабатывали мобильное приложение для сети ресторанов с системой лояльности',
// 			date: '22 апреля 2024',
// 			category: 'Мобильная разработка',
// 			slug: 'mobile-app-case',
// 		},
// 		{
// 			id: 4,
// 			title: 'Оптимизация производительности сайта: практические советы',
// 			excerpt:
// 				'Проверенные методы ускорения загрузки веб-страниц и улучшения Core Web Vitals',
// 			date: '10 апреля 2024',
// 			category: 'Веб-разработка',
// 			slug: 'website-optimization',
// 		},
// 	]

// 	return (
// 		<div className='bg-white min-h-screen'>
// 			{/* Hero Section */}
// 			<section className='relative bg-gray-100 py-20 md:pt-32'>
// 				<div className='container mx-auto px-4 sm:px-6 lg:px-8 text-center '>
// 					<h1 className='text-5xl md:text-6xl  xl:text-8xl text-bg_color font-cormorant'>
// 						Наш блог
// 					</h1>
// 					<p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto'>
// 						Полезные статьи, кейсы и новости из мира дизайна и разработки
// 					</p>
// 				</div>
// 			</section>
// 			<div className='container border-b border-[1px] border-bg_color mt-[2px] '></div>

// 			{/* Blog Posts */}
// 			<section className='py-12 md:py-20'>
// 				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
// 					{/* Search and Filters */}
// 					<div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 md:mb-12'>
// 						{/* Search Bar */}
// 						<div className='relative w-full md:w-auto'>
// 							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
// 								<Search className='h-5 w-5 text-gray-400' />
// 							</div>
// 							<input
// 								type='text'
// 								className='block w-full md:w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
// 								placeholder='Поиск по статьям'
// 							/>
// 						</div>

// 						{/* Categories Filter */}
// 						<div className='flex flex-wrap gap-2'>
// 							<button className='px-4 py-2 bg-accent_color text-white rounded-full text-sm font-medium'>
// 								Все статьи
// 							</button>
// 							<button className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition'>
// 								3D Визуализация
// 							</button>
// 							<button className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition'>
// 								Веб-дизайн
// 							</button>
// 							<button className='px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition'>
// 								Разработка
// 							</button>
// 						</div>
// 					</div>

// 					{/* Posts Grid */}
// 					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
// 						{blogPosts.map(post => (
// 							<article key={post.id} className='group'>
// 								<Link href={'/'} className='block'>
// 									{/* Скелетон для изображения */}
// 									<div className='relative aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-200 animate-pulse'>
// 										<div className='absolute inset-0 flex items-center justify-center'>
// 											<svg
// 												className='w-12 h-12 text-gray-400'
// 												fill='none'
// 												stroke='currentColor'
// 												viewBox='0 0 24 24'
// 											>
// 												<path
// 													strokeLinecap='round'
// 													strokeLinejoin='round'
// 													strokeWidth='1'
// 													d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
// 												/>
// 											</svg>
// 										</div>
// 									</div>

// 									{/* Скелетон для категории */}
// 									<div className='inline-block px-3 py-1 bg-gray-200 rounded-full text-xs font-medium mb-3 animate-pulse'>
// 										&nbsp;
// 									</div>

// 									{/* Скелетон для заголовка */}
// 									<h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
// 										<div className='h-6 bg-gray-200 rounded animate-pulse'></div>
// 									</h2>

// 									{/* Скелетон для описания */}
// 									<div className='text-gray-600 mb-3'>
// 										<div className='h-4 bg-gray-200 rounded animate-pulse mb-2'></div>
// 										<div className='h-4 bg-gray-200 rounded animate-pulse w-5/6'></div>
// 									</div>

// 									{/* Скелетон для даты */}
// 									<time className='text-sm text-gray-500'>
// 										<div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div>
// 									</time>
// 								</Link>
// 							</article>
// 						))}
// 					</div>

// 					{/* Pagination */}
// 					{/* <div className='flex justify-center mt-12 md:mt-16'>
// 						<nav className='flex items-center space-x-2'>
// 							<button className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50'>
// 								Назад
// 							</button>
// 							<button className='px-4 py-2 bg-gray-900 text-white rounded-md font-medium'>
// 								1
// 							</button>
// 							<button className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50'>
// 								2
// 							</button>
// 							<button className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50'>
// 								3
// 							</button>
// 							<button className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50'>
// 								Вперед
// 							</button>
// 						</nav>
// 					</div> */}
// 				</div>
// 			</section>
// 		</div>
// 	)
// }

// export default BlogSkeletonPage
'use client'
import { Search } from 'lucide-react'
import Link from 'next/link'
import './BlogSkeleton.css'

const BlogSkeleton = () => {
	// Пример данных статей блога
	const blogPosts = [
		{
			id: 1,
			title: 'Как мы создавали 3D-визуализацию для нового бизнес-центра',
			excerpt:
				'Подробный разбор процесса создания 3D-визуализации с нуля до финального рендера',
			date: '15 мая 2024',
			category: '3D Визуализация',
			slug: '3d-visualization-process',
		},
		{
			id: 2,
			title: 'Тренды в веб-дизайне 2024: что будет актуально',
			excerpt:
				'Обзор главных тенденций в дизайне интерфейсов и веб-разработке в наступившем году',
			date: '3 мая 2024',
			category: 'Веб-дизайн',
			slug: 'web-design-trends-2024',
		},
		{
			id: 3,
			title: 'Разработка мобильного приложения: кейс для ресторана',
			excerpt:
				'Как мы разрабатывали мобильное приложение для сети ресторанов с системой лояльности',
			date: '22 апреля 2024',
			category: 'Мобильная разработка',
			slug: 'mobile-app-case',
		},
		{
			id: 4,
			title: 'Оптимизация производительности сайта: практические советы',
			excerpt:
				'Проверенные методы ускорения загрузки веб-страниц и улучшения Core Web Vitals',
			date: '10 апреля 2024',
			category: 'Веб-разработка',
			slug: 'website-optimization',
		},
	]

	return (
		<div className='blog-skeleton'>
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
			<div className='container divider'></div>

			{/* Blog Posts */}
			<section className='blog-posts'>
				<div className='container'>
					{/* Search and Filters */}
					<div className='filters'>
						{/* Search Bar */}
						<div className='search-container'>
							<div className='search-icon'>
								<Search className='h-5 w-5 text-gray-400' />
							</div>
							<input
								type='text'
								className='search-input'
								placeholder='Поиск по статьям'
							/>
						</div>

						{/* Categories Filter */}
						<div className='categories'>
							<button className='category-btn active'>Все статьи</button>
							<button className='category-btn inactive'>Стики</button>
							<button className='category-btn inactive'>IQOS</button>
							<button className='category-btn inactive'>Аксессуары</button>
						</div>
					</div>

					{/* Posts Grid */}
					<div className='posts-grid'>
						{blogPosts.map(post => (
							<article key={post.id} className='post-article'>
								<Link href={'/'} className='post-link'>
									{/* Скелетон для изображения */}
									<div className='image-skeleton'>
										<div className='image-placeholder'>
											<svg
												className='w-12 h-12 text-gray-400'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth='1'
													d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
												/>
											</svg>
										</div>
									</div>

									{/* Скелетон для категории */}
									<div className='category-skeleton'>&nbsp;</div>

									{/* Скелетон для заголовка */}
									<h2 className='title-skeleton'></h2>

									{/* Скелетон для описания */}
									<div className='excerpt-skeleton'></div>
									<div className='excerpt-skeleton short'></div>

									{/* Скелетон для даты */}
									<div className='date-skeleton'></div>
								</Link>
							</article>
						))}
					</div>
				</div>
			</section>
		</div>
	)
}

export default BlogSkeleton
