export const dynamic = "force-dynamic";
import ClientFilters from "./client";

async function safeFetch(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

async function fetchItems(type, ref) {
  const baseUrl =
    process.env.NODE_ENV === "production" && typeof window === "undefined"
      ? "http://localhost:3002"
      : "";

  try {
    const apiUrl =
      typeof window === "undefined"
        ? `${baseUrl}/api/products/getproductinfo/${type}/${ref}`
        : `/api/products/getproductinfo/${type}/${ref}`;

    return await safeFetch(apiUrl, { cache: "no-store" });
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error("Ошибка загрузки товаров");
  }
}

export async function generateMetadata({ params }) {
  const { type, ref } = await params;

  try {
    const items = await fetchItems(type, ref);
    return {
      title: `Купить ${items.name} с доставкой по России`,
      description: items.description || `Купить ${items.name}`,
      alternates: {
        canonical: `https://iqos-iluma.com/products/product-info/${type}/${ref}`,
      },
      openGraph: {
        title: `Купить ${items.name} с доставкой по России`,
        description: items.description || `Купить ${items.name}`,
        url: `https://iqos-iluma.com/products/product-info/${type}/${ref}`,
        images: [
          {
            url: items.image
              ? `/images/${items.image}`
              : `/favicon/web-app-manifest-512x512.png`,
            alt: items.name,
          },
        ],
      },
    };
  } catch (error) {
    console.error("generateMetadata error:", error);
    return {
      title: "Товар не найден",
      description: "Товар не найден",
      robots: { index: false, follow: false },
    };
  }
}

export default async function Page({ params }) {
  const { type, ref } = await params;

  try {
    const items = await fetchItems(type, ref);
    return <ClientFilters items={items} />;
  } catch (error) {
    console.error(`Page error for ${type}/${ref}:`, error);
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Товар не найден</h1>
        <p>Не удалось загрузить информацию о товаре.</p>
        <a href="/products" style={{ color: "blue" }}>
          Вернуться в каталог
        </a>
      </div>
    );
  }
}
