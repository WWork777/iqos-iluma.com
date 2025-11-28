import React, { useState, useEffect } from "react";

const FilterAccordion = ({
  filters,
  setFilters,
  applyFilters,
  resetFilters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Обновляем локальные фильтры, если внешние изменились
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateLocalFilter = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    // Передаём локальные фильтры напрямую — без задержки
    setFilters(localFilters);
    applyFilters(localFilters);
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const handleColorChange = (color) => {
    const newColors = localFilters.colors.includes(color)
      ? localFilters.colors.filter((c) => c !== color)
      : [...localFilters.colors, color];

    updateLocalFilter("colors", newColors);
  };

  return (
    <div className="filter-main">
      <div className="accordion" id="accordionExample">
        {/* Цена */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Цена
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
          >
            <div className="accordion-body">
              <input
                type="range"
                min="0"
                max="10000"
                value={localFilters.priceRange.min}
                onChange={(e) =>
                  updateLocalFilter("priceRange", {
                    ...localFilters.priceRange,
                    min: parseInt(e.target.value, 10),
                  })
                }
              />
              <input
                type="range"
                min="0"
                max="10000"
                value={localFilters.priceRange.max}
                onChange={(e) =>
                  updateLocalFilter("priceRange", {
                    ...localFilters.priceRange,
                    max: parseInt(e.target.value, 10),
                  })
                }
              />
              <p>
                Выбрано: {localFilters.priceRange.min} -{" "}
                {localFilters.priceRange.max} ₽
              </p>
            </div>
          </div>
        </div>

        {/* Хит продаж */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingSeven">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseSeven"
              aria-expanded="false"
              aria-controls="collapseSeven"
            >
              Хит продаж
            </button>
          </h2>
          <div
            id="collapseSeven"
            className="accordion-collapse collapse"
            aria-labelledby="headingSeven"
          >
            <div className="accordion-body">
              <label>
                <input
                  type="radio"
                  name="hit"
                  value="true"
                  onChange={() => updateLocalFilter("hit", true)}
                  checked={localFilters.hit === true}
                />
                Да
              </label>
              <label>
                <input
                  type="radio"
                  name="hit"
                  value="false"
                  onChange={() => updateLocalFilter("hit", false)}
                  checked={localFilters.hit === false}
                />
                Нет
              </label>
            </div>
          </div>
        </div>

        {/* Цвет */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Цвет
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
          >
            <div className="accordion-body">
              {[
                "Красный",
                "Черный",
                "Бежевый",
                "Синий",
                "Оранжевый",
                "Зеленый",
                "Фиолетовый",
                "Желтый",
                "Серый",
              ].map((color) => (
                <label key={color} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={localFilters.colors.includes(color)}
                    onChange={() => handleColorChange(color)}
                  />
                  {color}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="buttons">
        <button className="apply-button" onClick={handleApplyFilters}>
          Применить
        </button>
        <button className="apply-button" onClick={handleResetFilters}>
          Сбросить
        </button>
      </div>
    </div>
  );
};

export default FilterAccordion;
