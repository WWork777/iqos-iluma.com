"use client";
import IqosCategory from "../components/iqos/iqoscategory";
import { useState, useEffect, useCallback } from "react";
import "../style.scss";
import FilterAccordion from "../components/iqos/iqosfiltr";
import ProductGrid from "../components/productgrid";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams, useRouter } from "next/navigation";

export default function ClientFilters({ items: initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Восстановление состояния из URL параметров
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const category = searchParams.getAll("category");
    return category || [];
  });

  const [searchQuery, setSearchQuery] = useState(() => {
    return searchParams.get("search") || "";
  });

  const [sortOrder, setSortOrder] = useState(() => {
    return searchParams.get("sort") || "default";
  });

  const [filters, setFilters] = useState(() => {
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const colors = searchParams.getAll("colors");
    const models = searchParams.getAll("models");
    const nalichie = searchParams.get("nalichie");
    const exclusive = searchParams.get("exclusive");
    const hit = searchParams.get("hit");

    return {
      priceRange: {
        min: priceMin ? parseInt(priceMin) : 0,
        max: priceMax ? parseInt(priceMax) : 35000,
      },
      colors: colors || [],
      models: models || [],
      nalichie: nalichie ? nalichie === "true" : null,
      exclusive: exclusive ? exclusive === "true" : null,
      hit: hit ? hit === "true" : null,
    };
  });

  const debouncedQuery = useDebounce(searchQuery, 1000);

  // Функция для обновления URL со всеми параметрами
  const updateURL = useCallback(
    (updates = {}) => {
      const params = new URLSearchParams();

      // Категории
      if (selectedCategory.length > 0) {
        selectedCategory.forEach((cat) => params.append("category", cat));
      }

      // Поиск
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      // Сортировка
      if (sortOrder !== "default") {
        params.set("sort", sortOrder);
      }

      // Фильтры
      if (filters.priceRange.min > 0) {
        params.set("priceMin", filters.priceRange.min.toString());
      }
      if (filters.priceRange.max < 35000) {
        params.set("priceMax", filters.priceRange.max.toString());
      }
      if (filters.colors.length > 0) {
        filters.colors.forEach((color) => params.append("colors", color));
      }
      if (filters.models.length > 0) {
        filters.models.forEach((model) => params.append("models", model));
      }
      if (filters.nalichie !== null) {
        params.set("nalichie", filters.nalichie.toString());
      }
      if (filters.exclusive !== null) {
        params.set("exclusive", filters.exclusive.toString());
      }
      if (filters.hit !== null) {
        params.set("hit", filters.hit.toString());
      }

      // Применяем обновления
      Object.entries(updates).forEach(([key, value]) => {
        if (value && value.length > 0) {
          if (Array.isArray(value)) {
            params.delete(key);
            value.forEach((v) => params.append(key, v));
          } else {
            params.set(key, value);
          }
        } else {
          params.delete(key);
        }
      });

      const newUrl = `?${params.toString()}`;
      router.replace(newUrl, { scroll: false });
    },
    [selectedCategory, searchQuery, sortOrder, filters, router],
  );

  const fetchFilteredData = useCallback(
    async (overrideFilters = null) => {
      setLoading(true);
      try {
        const activeFilters = overrideFilters || filters;

        const res = await fetch("/api/filter/ustrojstva-iqos-iluma", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            search: debouncedQuery,
            category: selectedCategory,
            sort: sortOrder,
            filters: activeFilters,
          }),
        });

        if (!res.ok) throw new Error("Ошибка фильтрации");
        const result = await res.json();
        setItems(result);
      } catch (error) {
        console.error(error);
        setError("Не удалось выполнить фильтрацию");
      } finally {
        setLoading(false);
      }
    },
    [debouncedQuery, selectedCategory, sortOrder, filters],
  );

  // Обновление URL при изменении состояния
  useEffect(() => {
    updateURL();
  }, [selectedCategory, searchQuery, sortOrder, filters, updateURL]);

  // Автоматическое применение фильтров при изменении
  useEffect(() => {
    const hasActiveFilters =
      debouncedQuery ||
      selectedCategory.length > 0 ||
      sortOrder !== "default" ||
      filters.priceRange.min > 0 ||
      filters.priceRange.max < 35000 ||
      filters.colors.length > 0 ||
      filters.models.length > 0 ||
      filters.nalichie !== null ||
      filters.exclusive !== null ||
      filters.hit !== null;

    if (hasActiveFilters) {
      fetchFilteredData();
    }
  }, [debouncedQuery, selectedCategory, sortOrder, filters, fetchFilteredData]);

  const resetFilters = useCallback(() => {
    const defaultFilters = {
      priceRange: { min: 0, max: 35000 },
      colors: [],
      models: [],
      nalichie: null,
      exclusive: null,
      hit: null,
    };

    // Сначала сбрасываем все состояния
    setFilters(defaultFilters);
    setSelectedCategory([]);
    setSearchQuery("");
    setSortOrder("default");

    // Затем обновляем URL
    router.replace("?", { scroll: false });

    // И загружаем все товары
    setLoading(true);
    fetch("/api/filter/iqos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        search: "",
        category: [],
        sort: "default",
        filters: defaultFilters,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка сброса");
        return res.json();
      })
      .then((result) => {
        setItems(result);
      })
      .catch((error) => {
        console.error("Ошибка при сбросе фильтров:", error);
        setError("Не удалось сбросить фильтры");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  // Обновленные функции для синхронизации с URL
  const handleSetSelectedCategory = (category) => {
    setSelectedCategory(category);
  };

  const handleSetSearchQuery = (query) => {
    setSearchQuery(query);
  };

  const handleSetSortOrder = (order) => {
    setSortOrder(order);
  };

  const handleSetFilters = (newFilters) => {
    setFilters(newFilters);
  };

  if (error) return <p>{error}</p>;

  return (
    <>
      <IqosCategory
        setSelectedCategory={handleSetSelectedCategory}
        selectedCategory={selectedCategory}
        setSearchQuery={handleSetSearchQuery}
        searchQuery={searchQuery}
        setSortOrder={handleSetSortOrder}
        sortOrder={sortOrder}
        filters={filters}
        setFilters={handleSetFilters}
        applyFilters={fetchFilteredData}
        resetFilters={resetFilters}
      />
      <div className="products-body">
        <FilterAccordion
          filters={filters}
          setFilters={handleSetFilters}
          applyFilters={fetchFilteredData}
          resetFilters={resetFilters}
        />
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <ProductGrid items={items} loading={loading} />
        )}
      </div>
    </>
  );
}
