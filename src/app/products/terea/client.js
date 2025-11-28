"use client";
import "../style.scss";
import TereaCountry from "../components/terea/tereacountry";
import { useState, useEffect, useCallback } from "react";
import FilterAccordion from "../components/terea/tereafiltr";
import ProductGrid from "../components/productgrid";
import useDebounce from "../../hooks/useDebounce";
import { useSearchParams, useRouter } from "next/navigation";

export default function ClientFilters({ items: initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // --- Инициализация состояния с защитой от undefined ---
  const [selectedCountries, setSelectedCountries] = useState(
    searchParams.getAll("countries") || []
  );

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );

  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sort") || "default"
  );

  const [filters, setFilters] = useState(() => {
    const priceMin = parseInt(searchParams.get("priceMin")) || 0;
    const priceMax = parseInt(searchParams.get("priceMax")) || 12000;

    return {
      priceRange: { min: priceMin, max: priceMax },
      flavors: searchParams.getAll("flavors") || [],
      strengths: searchParams.getAll("strengths") || [],
      hasCapsule:
        searchParams.get("hasCapsule") === "true"
          ? true
          : searchParams.get("hasCapsule") === "false"
          ? false
          : null,
      nalichie:
        searchParams.get("nalichie") === "true"
          ? true
          : searchParams.get("nalichie") === "false"
          ? false
          : null,
      countrys: searchParams.getAll("countrys") || [],
      hit:
        searchParams.get("hit") === "true"
          ? true
          : searchParams.get("hit") === "false"
          ? false
          : null,
      brend: searchParams.getAll("brend") || [],
    };
  });

  const debouncedQuery = useDebounce(searchQuery, 800);

  // --- Обновление URL ---
  const updateURL = useCallback(() => {
    const params = new URLSearchParams();

    (selectedCountries || []).forEach((c) => params.append("countries", c));
    if (searchQuery) params.set("search", searchQuery);
    if (sortOrder && sortOrder !== "default") params.set("sort", sortOrder);

    if (filters?.priceRange?.min > 0)
      params.set("priceMin", filters.priceRange.min);
    if (filters?.priceRange?.max < 12000)
      params.set("priceMax", filters.priceRange.max);

    (filters?.flavors || []).forEach((f) => params.append("flavors", f));
    (filters?.strengths || []).forEach((s) => params.append("strengths", s));
    (filters?.countrys || []).forEach((c) => params.append("countrys", c));
    (filters?.brend || []).forEach((b) => params.append("brend", b));

    if (filters?.hasCapsule !== null)
      params.set("hasCapsule", filters.hasCapsule);
    if (filters?.nalichie !== null) params.set("nalichie", filters.nalichie);
    if (filters?.hit !== null) params.set("hit", filters.hit);

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [selectedCountries, searchQuery, sortOrder, filters, router]);

  useEffect(() => {
    updateURL();
  }, [selectedCountries, searchQuery, sortOrder, filters, updateURL]);

  // --- Фильтрация данных ---
  const fetchFilteredData = useCallback(
    async (currentFilters = filters) => {
      setLoading(true);
      try {
        const res = await fetch("/api/filter/terea", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            search: debouncedQuery,
            countries: selectedCountries,
            sort: sortOrder,
            filters: currentFilters,
          }),
        });
        if (!res.ok) throw new Error("Ошибка фильтрации");
        const result = await res.json();
        setItems(result);
      } catch (e) {
        console.error(e);
        setError("Не удалось выполнить фильтрацию");
      } finally {
        setLoading(false);
      }
    },
    [debouncedQuery, selectedCountries, sortOrder, filters]
  );

  useEffect(() => {
    fetchFilteredData();
  }, [
    debouncedQuery,
    selectedCountries,
    sortOrder,
    filters,
    fetchFilteredData,
  ]);

  // --- Сброс фильтров ---
  const resetFilters = useCallback(() => {
    const defaultFilters = {
      priceRange: { min: 0, max: 12000 },
      flavors: [],
      strengths: [],
      hasCapsule: null,
      nalichie: null,
      countrys: [],
      hit: null,
      brend: [],
    };
    setFilters(defaultFilters);
    setSelectedCountries([]);
    setSearchQuery("");
    setSortOrder("default");

    router.replace("?", { scroll: false });
    fetch("/api/filter/terea", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        search: "",
        countries: [],
        sort: "default",
        filters: defaultFilters,
      }),
    })
      .then((res) => res.json())
      .then((result) => setItems(result))
      .catch((err) => console.error(err));
  }, [router]);

  if (error) return <p>{error}</p>;

  return (
    <>
      <TereaCountry
        setSelectedCountries={setSelectedCountries}
        selectedCountries={selectedCountries}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        setSortOrder={setSortOrder}
        sortOrder={sortOrder}
        filters={filters}
        setFilters={setFilters}
        applyFilters={fetchFilteredData}
        resetFilters={resetFilters}
      />
      <div className="products-body">
        <FilterAccordion
          filters={filters}
          setFilters={setFilters}
          applyFilters={fetchFilteredData}
          resetFilters={resetFilters}
        />
        {loading ? (
          <div className="spinner-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <ProductGrid items={items} />
        )}
      </div>
    </>
  );
}
