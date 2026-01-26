export const dynamic = "force-dynamic";
import ClientFilters from "./client";

async function fetchItems() {
  const res = await fetch("https://iqos-iluma.com/api/products/getdevices", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Ошибка загрузки товаров");
  return res.json();
}

export async function generateMetadata() {
  const title = "Аксессуары Iqos Iluma";
  return {
    title,
    description:
      "Аксессуары для Iqos Iluma. Все для удобного и безопастного использования.",
    alternates: {
      canonical: `https://iqos-iluma.com/products/aksesuary-dlya-iqos-iluma`,
    },
    openGraph: {
      title: `Купить аксессуары для IQOS ILUMA в IlumaPrime с доставкой по России`,
      description: `Каталог аксессуаров для устройств IQOS ILUMA с доставкой по всей России. Лучший выбор вкусов и брендов!`,
      url: `https://iqos-iluma.com/products/aksesuary-dlya-iqos-iluma`,
      images: [
        {
          url: `/favicon/web-app-manifest-512x512`,
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
    console.error(error);
    return <p>Ошибка загрузки данных</p>;
  }

  return (
    <div className="products-container">
      <h1 className="page-title">
        Аксессуары для IQOS ILUMA в Москве и России
      </h1>
      <ClientFilters items={items} />
    </div>
  );
}
