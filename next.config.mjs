/** @type {import('next').NextConfig} */

const nextConfig = {
  // 1. Настройки изображений (теперь только локальные или стандартные)
  images: {
    remotePatterns: [],
  },

  // 2. Экспериментальные функции (очищено от невалидных ключей)
  experimental: {
    // В Next.js 15 appDir и rsc включены по умолчанию, удаляем их отсюда
  },

  // 3. Заголовки безопасности
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  poweredByHeader: false,
  generateEtags: true,

  // serverRuntimeConfig устаревает, но пока можно оставить,
  // если твой код на него опирается.
  serverRuntimeConfig: {
    maxRequestBodySize: "10mb",
  },

  compress: true,

  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/login",
        permanent: false,
      },
    ];
  },

  // Убрали сложные rewrites для RSC, так как в стандартном режиме
  // Next.js сам управляет этими путями
};

export default nextConfig;
