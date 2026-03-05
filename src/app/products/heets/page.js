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

async function fetchItems() {
  const baseUrl =
    process.env.NODE_ENV === "production" && typeof window === "undefined"
      ? "http://localhost:3002"
      : "";

  try {
    const apiUrl =
      typeof window === "undefined"
        ? `${baseUrl}/api/products/getterea`
        : `/api/products/getterea`;

    return await safeFetch(apiUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error("Ошибка загрузки товаров");
  }
}

export async function generateMetadata() {
  const title = "Купить стики Heets в IqosIluma с доставкой по России";
  return {
    title,
    description:
      "Каталог стиков Heets с доставкой по всей России. Лучший выбор вкусов и брендов!",
    alternates: {
      canonical: `https://iqos-iluma.com/products/heets`,
    },
    openGraph: {
      title: `Купить стики Heets в IlumaPrime с доставкой по России`,
      description: `Каталог стиков Heets с доставкой по всей России. Лучший выбор вкусов и брендов!`,
      url: `https://iqos-iluma.com/products/heets`,
      images: [
        {
          url: `/favicon/web-app-manifest-512x512.png`,
          alt: `IqosIluma`,
        },
      ],
    },
  };
}

export default async function Page() {
  let items = [];

  try {
    items = await fetchItems();
  } catch (error) {
    console.error("Page error:", error);
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Ошибка загрузки данных</h1>
        <p>Не удалось загрузить информацию о стиках Heets.</p>
        <a href="/products" style={{ color: "blue" }}>
          Вернуться в каталог
        </a>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h1 style={{ position: "absolute", zIndex: "-9999" }}>Стики Heets</h1>
      <ClientFilters items={items} />
    </div>
  );
}
