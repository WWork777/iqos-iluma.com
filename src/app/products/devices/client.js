"use client";
import DeviceCategory from "../components/devices/devicecategory";
import { useState, useEffect, useCallback } from "react";
import "../style.scss";
import FilterAccordion from "../components/devices/devicefiltr";
import ProductGrid from "../components/productgrid";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams, useRouter } from "next/navigation";

export default function ClientFilters({ items: initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Восстановление из URL
  const [selectedCategory, setSelectedCategory] = useState(
    () => searchParams.getAll("category") || []
  );
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("search") || ""
  );
  const [sortOrder, setSortOrder] = useState(
    () => searchParams.get("sort") || "default"
  );

  const [filters, setFilters] = useState(() => {
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const colors = searchParams.getAll("colors");
    const nalichie = searchParams.get("nalichie");
    const hit = searchParams.get("hit");

    return {
      priceRange: {
        min: priceMin ? parseInt(priceMin) : 0,
        max: priceMax ? parseInt(priceMax) : 10000,
      },
      colors: colors || [],
      nalichie: nalichie ? nalichie === "true" : null,
      hit: hit ? hit === "true" : null,
    };
  });

  const debouncedQuery = useDebounce(searchQuery, 1000);

  // Обновление URL
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    selectedCategory.forEach((cat) => params.append("category", cat));
    if (searchQuery) params.set("search", searchQuery);
    if (sortOrder !== "default") params.set("sort", sortOrder);

    if (filters.priceRange.min > 0)
      params.set("priceMin", filters.priceRange.min);
    if (filters.priceRange.max < 10000)
      params.set("priceMax", filters.priceRange.max);
    filters.colors.forEach((color) => params.append("colors", color));
    if (filters.nalichie !== null) params.set("nalichie", filters.nalichie);
    if (filters.hit !== null) params.set("hit", filters.hit);

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [selectedCategory, searchQuery, sortOrder, filters, router]);

  const fetchFilteredData = useCallback(
    async (filtersArg = filters) => {
      setLoading(true);
      try {
        const res = await fetch("/api/filter/devices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            search: debouncedQuery,
            category: selectedCategory,
            sort: sortOrder,
            filters: filtersArg,
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
    [debouncedQuery, selectedCategory, sortOrder, filters]
  );

  useEffect(() => {
    fetchFilteredData();
  }, [debouncedQuery, selectedCategory, sortOrder, filters]);

  useEffect(() => {
    updateURL();
  }, [selectedCategory, searchQuery, sortOrder, filters, updateURL]);

  const applyFilters = (filtersToApply = filters) => {
    fetchFilteredData(filtersToApply);
  };

  const resetFilters = useCallback(() => {
    const defaultFilters = {
      priceRange: { min: 0, max: 10000 },
      colors: [],
      nalichie: null,
      hit: null,
    };

    setFilters(defaultFilters);
    setSelectedCategory([]);
    setSearchQuery("");
    setSortOrder("default");
    router.replace("?", { scroll: false });

    fetchFilteredData(defaultFilters);
  }, [fetchFilteredData, router]);

  if (error) return <p>{error}</p>;

  return (
    <>
      <DeviceCategory
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        setSortOrder={setSortOrder}
        sortOrder={sortOrder}
        filters={filters}
        setFilters={setFilters}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />

      <div className="products-body">
        <FilterAccordion
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
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
