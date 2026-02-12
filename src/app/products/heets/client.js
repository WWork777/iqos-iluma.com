"use client";
import "../style.scss";
import TereaCountry from "../components/terea/tereacountry";
import { useState, useEffect, useCallback } from "react";
import FilterAccordion from "../components/terea/tereafiltr";
import ProductGrid from "../components/productgrid";
import useDebounce from "../../hooks/useDebounce";

export default function ClientFilters({ items: initialItems }) {
  const [items, setItems] = useState(initialItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [sortOrder, setSortOrder] = useState("default");
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 12000 },
    flavors: [],
    strengths: [],
    hasCapsule: null,
    nalichie: null,
    countrys: [],
    hit: null,
    brend: ["Heets"],
  });

  const debouncedQuery = useDebounce(searchQuery, 1000);

  const fetchFilteredData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/filter/stiki-terea-dlya-iqos-iluma", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          search: debouncedQuery,
          countries: selectedCountries,
          sort: sortOrder,
          filters: filters,
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
  }, [debouncedQuery, selectedCountries, sortOrder, filters]);

  useEffect(() => {
    if (
      debouncedQuery ||
      selectedCountries.length > 0 ||
      sortOrder !== "default" ||
      Object.values(filters).some((v) => v !== null)
    ) {
      fetchFilteredData();
    }
  }, [
    debouncedQuery,
    selectedCountries,
    sortOrder,
    filters,
    fetchFilteredData,
  ]);

  const resetFilters = () => {
    setFilters({
      priceRange: { min: 0, max: 10000 },
      flavors: [],
      strengths: [],
      hasCapsule: null,
      nalichie: null,
      countrys: [],
      hit: null,
      brend: [],
    });
    setSelectedCountries([]);
    setSelectedCategory([]);
    setSearchQuery("");
    setSortOrder("default");
    fetchFilteredData();
  };

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
