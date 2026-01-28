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
  const title = "Стики Iqos Iluma Terea Москва";
  return {
    title,
    description:
      "Стики Terea для Iqos Iluma. Большой выбор вкусов, доставка по России.",
    alternates: {
      canonical: `https://iqos-iluma.com/products/stiki-terea-dlya-iqos-iluma`,
    },
    openGraph: {
      title: `Купить стики Terea в IlumaPrime с доставкой по России`,
      description: `Купить стики Terea с доставкой. Лучший выбор вкусов и брендов!`,
      url: `https://iqos-iluma.com/products/stiki-terea-dlya-iqos-iluma`,
      images: [
        {
          url: `/favicon/web-app-manifest-512x512.png`,
          alt: `IqosILuma`,
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
        <p>Не удалось загрузить информацию о стиках.</p>
        <a href="/products" style={{ color: "blue" }}>
          Вернуться в каталог
        </a>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h1 className="page-title">
        Купить стики Terea для IQOS ILUMA в Москве и России
      </h1>
      <ClientFilters items={items} />
    </div>
  );
}
