// const BlogArticleSkeleton = () => {
// 	return (
// 		<div className='bg-white min-h-screen animate-pulse'>
// 			{/* Скелетон с сообщением об ошибке */}
// 			<section className='relative py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center'>
// 				<div className='mb-8'>
// 					<Link
// 						href='/blog'
// 						className='inline-flex items-center text-accent_color hover:text-blue-800 transition'
// 					>
// 						<ArrowLeft className='mr-2' size={18} />
// 						Назад к блогу
// 					</Link>
// 				</div>

// 				<div className='space-y-6'>
// 					<div className='h-12 bg-gray-200 rounded w-3/4 mx-auto mb-6'></div>

// 					{/* Скелетон контента */}
// 					<div className='space-y-4'>
// 						<div className='h-6 bg-gray-200 rounded w-full'></div>
// 						{/* <div className='h-6 bg-gray-200 rounded w-5/6 mx-auto'></div>
// 							<div className='h-6 bg-gray-200 rounded w-2/3 mx-auto'></div> */}
// 					</div>
// 				</div>

// 				{/* Скелетон изображения */}
// 				<div className='relative aspect-[16/9] w-full rounded-lg overflow-hidden my-8 bg-gray-200 flex justify-center items-center'>
// 					{/* Сообщение об ошибке */}
// 					<div className='py-12'>
// 						<h2 className='text-2xl font-bold text-gray-800 mb-4'>
// 							Пост не найден
// 						</h2>
// 						<p className='text-gray-600 mb-6'>
// 							Запрошенная статья не существует или была удалена
// 						</p>

// 						{/* Кнопка возврата */}
// 						<Link
// 							href='/blog'
// 							className='inline-flex items-center px-6 py-3 bg-accent_color text-white rounded-lg hover:bg-blue-700 transition'
// 						>
// 							<ArrowLeft className='mr-2' size={18} />
// 							Вернуться к списку статей
// 						</Link>
// 					</div>
// 				</div>

// 				{/* Скелетон текста */}
// 				<div className='space-y-4 mt-8'>
// 					{[...Array(5)].map((_, i) => (
// 						<div key={i} className='space-y-2'>
// 							<div className='h-4 bg-gray-200 rounded w-full'></div>
// 							<div className='h-4 bg-gray-200 rounded w-11/12'></div>
// 							<div className='h-4 bg-gray-200 rounded w-10/12'></div>
// 						</div>
// 					))}
// 				</div>
// 			</section>
// 		</div>
// 	)
// }

// export default BlogArticleSkeleton

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import './BlogArticleSkeleton.css'

const BlogArticleSkeleton = () => {
	return (
		<div className='blogArticleSkeleton'>
			{/* Скелетон с сообщением об ошибке */}
			<section className='section'>
				<div className='backLinkContainer'>
					<Link href='/blog' className='backLink'>
						<ArrowLeft className='backLinkIcon' size={18} />
						Назад к блогу
					</Link>
				</div>

				<div className='contentContainer'>
					<div className='titleSkeleton'></div>

					{/* Скелетон контента */}
					<div className='contentSkeleton'>
						<div className='contentLine'></div>
					</div>
				</div>

				{/* Скелетон изображения */}
				<div className='imageSkeleton'>
					{/* Сообщение об ошибке */}
					<div className='errorMessage'>
						<h2 className='errorTitle'>Пост не найден</h2>
						<p className='errorText'>
							Запрошенная статья не существует или была удалена
						</p>

						{/* Кнопка возврата */}
						<Link href='/blog' className='returnButton'>
							<ArrowLeft className='returnButtonIcon' size={18} />
							Вернуться к списку статей
						</Link>
					</div>
				</div>

				{/* Скелетон текста */}
				<div className='textSkeleton'>
					{[...Array(5)].map((_, i) => (
						<div key={i} className='textParagraph'>
							<div className='textLine' style={{ width: '100%' }}></div>
							<div className='textLine' style={{ width: '91.67%' }}></div>
							<div className='textLine' style={{ width: '83.33%' }}></div>
						</div>
					))}
				</div>
			</section>
		</div>
	)
}

export default BlogArticleSkeleton
