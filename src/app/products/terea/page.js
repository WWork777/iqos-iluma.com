export const dynamic = "force-dynamic";
import ClientFilters from "./client";

async function fetchItems() {
  const res = await fetch("https://iqos-iluma.com/api/products/getterea", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Ошибка загрузки товаров");
  return res.json();
}

export async function generateMetadata() {
  const title = "Купить стики Terea в IqosIluma с доставкой по России";
  return {
    title,
    description:
      "Купить стики Terea с доставкой. Лучший выбор вкусов и брендов!",
    alternates: {
      canonical: `https://iqos-iluma.com/products/terea`,
    },
    openGraph: {
      title: `Купить стики Terea в IlumaPrime с доставкой по России`,
      description: `Купить стики Terea с доставкой. Лучший выбор вкусов и брендов!`,
      url: `https://iqos-iluma.com/products/terea`,
      images: [
        {
          url: `/favicon/web-app-manifest-512x512`,
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
    console.error(error);
    return <p>Ошибка загрузки данных</p>;
  }

  return (
    <div className="products-container">
      <h1 style={{ position: "absolute", zIndex: "-9999" }}>Стики Terea</h1>
      <ClientFilters items={items} />
    </div>
  );
}
