'use client';
import IqosCategory from '../components/iqos/iqoscategory';
import { useState, useEffect, useCallback } from 'react';
import '../style.scss';
import FilterAccordion from '../components/iqos/iqosfiltr';
import ProductGrid from '../components/productgrid';
import useDebounce from '../../hooks/useDebounce';

export default function ClientFilters({ items: initialItems }) {
    const [items, setItems] = useState(initialItems);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('default');
    const [filters, setFilters] = useState({
        priceRange: { min: 0, max: 35000 },
        colors: [],
        nalichie: null,
        models: [],
        exclusive: true,
        hit: null
    });

    const debouncedQuery = useDebounce(searchQuery, 1000);


    const fetchFilteredData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/filter/iqos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    search: debouncedQuery,
                    category: selectedCategory,
                    sort: sortOrder,
                    filters: filters,
                }),
            });

            if (!res.ok) throw new Error('Ошибка фильтрации');
            const result = await res.json();
            setItems(result);
        } catch (error) {
            console.error(error);
            setError('Не удалось выполнить фильтрацию');
        } finally {
            setLoading(false);
        }
    }, [debouncedQuery, selectedCategory, sortOrder, filters]);
    
    useEffect(() => {
        if (
            debouncedQuery ||
            selectedCategory.length > 0 ||
            sortOrder !== 'default' ||
            Object.values(filters).some(v => v !== null)
        ) {
            fetchFilteredData();
        }
    }, [debouncedQuery, selectedCategory, sortOrder, filters, fetchFilteredData]);
    
    const resetFilters = () => {
        const defaultFilters = {
            priceRange: { min: 0, max: 35000 },
            colors: [],
            nalichie: null,
            models: [],
            exclusive: null,
            hit: null
        };
        setFilters(defaultFilters);
        setSelectedCategory([]);
        setSearchQuery('');
        setSortOrder('default');
    };
    if (error) return <p>{error}</p>;
    return (
        <>
        <IqosCategory
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
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
                    <ProductGrid items={items} loading={loading} />
                )}
            </div>
        </>
    );
};

