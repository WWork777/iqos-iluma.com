/** @type {import('next').NextConfig} */

// Определяем, находимся ли мы в режиме продакшена
const isProd = process.env.NODE_ENV === "production";
const CDN_URL = "https://cdn.iqos-iluma.com";

const nextConfig = {
  // --- ДОБАВЛЕНО ДЛЯ CDN ---
  // В продакшене все пути к статике (_next/static) будут вести на CDN
  assetPrefix: isProd ? CDN_URL : undefined,

  // Если используешь компонент <Image />, нужно разрешить домен CDN
  images: {
    domains: ["cdn.iqos-iluma.com"],
    // Если используешь современные remotePatterns:
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.iqos-iluma.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // -------------------------

  // 1. Твои настройки экспериментальных функций
  experimental: {
    serverComponents: false,
    appDir: false,
    rsc: false,
  },

  // 2. Заголовки безопасности (оставляем как есть)
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

  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/_next/static/chunks/rsc",
          has: [
            {
              type: "header",
              key: "x-rsc-validator",
              value: ".+",
            },
          ],
          destination: "/_next/static/chunks/rsc",
        },
      ],
    };
  },
};

export default nextConfig;
