export async function fetchPosts() {
	const isServer = typeof window === 'undefined'
	const baseUrl = isServer
		? process.env.NEXT_PUBLIC_SITE_URL
		: window.location.origin

	const res = await fetch(`${baseUrl}/api/posts`, {
		cache: 'no-store',
		next: { tags: ['live'] },
		headers: {
			'Cache-Control': 'no-store, must-revalidate',
			'CDN-Cache-Control': 'no-store',
		},
	})

	if (!res.ok) {
		return
	} else {
		return res.json()
	}
}
