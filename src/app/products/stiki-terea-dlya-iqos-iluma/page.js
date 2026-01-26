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
  const title = "Стики Iqos Iluma Terea";
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
      <h1 className="page-title">
        Купить стики Terea для IQOS ILUMA в Москве и России
      </h1>
      <ClientFilters items={items} />
    </div>
  );
}
