"use client";
import React, { useState, useEffect } from "react";

const FilterAccordion = ({
  filters,
  setFilters,
  applyFilters,
  resetFilters,
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Синхронизируем localFilters с filters из родителя
  useEffect(() => {
    setLocalFilters(filters); // синхронизация при изменении родителя
  }, [filters]);

  const updateLocalFilter = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(localFilters); // обновляем родителя
    applyFilters(localFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      priceRange: { min: 0, max: 12000 },
      flavors: [],
      strengths: [],
      hasCapsule: null,
      nalichie: null,
      hit: null,
      brend: [],
    };
    resetFilters();
  };

  return (
    <div className="filter-main">
      <div>
        <div className="accordion" id="accordionExample">
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
                  max="12000"
                  value={localFilters.priceRange?.min || 0}
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
                  max="12000"
                  value={localFilters.priceRange?.max || 12000}
                  onChange={(e) =>
                    updateLocalFilter("priceRange", {
                      ...localFilters.priceRange,
                      max: parseInt(e.target.value, 10),
                    })
                  }
                />
                <p>
                  Выбрано: {localFilters.priceRange?.min || 0} -{" "}
                  {localFilters.priceRange?.max || 12000} ₽
                </p>
              </div>
            </div>
          </div>

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
                Вкус
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="headingTwo"
            >
              <div className="accordion-body">
                {[
                  "Табачный вкус",
                  "Фруктовый вкус",
                  "Ментол",
                  "Экзотические",
                ].map((flavor) => (
                  <label key={flavor}>
                    <input
                      type="checkbox"
                      checked={localFilters.flavors?.includes(flavor) || false}
                      onChange={() =>
                        updateLocalFilter(
                          "flavors",
                          localFilters.flavors?.includes(flavor)
                            ? localFilters.flavors.filter((f) => f !== flavor)
                            : [...(localFilters.flavors || []), flavor]
                        )
                      }
                    />
                    {flavor}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="headingNine">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseNine"
                aria-expanded="false"
                aria-controls="collapseNine"
              >
                Бренд
              </button>
            </h2>
            <div
              id="collapseNine"
              className="accordion-collapse collapse"
              aria-labelledby="headingNine"
            >
              <div className="accordion-body">
                {["Terea", "Heets", "Delia"].map((brend) => (
                  <label key={brend}>
                    <input
                      type="checkbox"
                      checked={localFilters.brend?.includes(brend) || false}
                      onChange={() =>
                        updateLocalFilter(
                          "brend",
                          localFilters.brend?.includes(brend)
                            ? localFilters.brend.filter((f) => f !== brend)
                            : [...(localFilters.brend || []), brend]
                        )
                      }
                    />
                    {brend}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header" id="headingThree">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                Крепость
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              aria-labelledby="headingThree"
            >
              <div className="accordion-body">
                {["Легкие", "Средние", "Крепкие"].map((strength) => (
                  <label key={strength}>
                    <input
                      type="checkbox"
                      checked={
                        localFilters.strengths?.includes(strength) || false
                      }
                      onChange={() =>
                        updateLocalFilter(
                          "strengths",
                          localFilters.strengths?.includes(strength)
                            ? localFilters.strengths.filter(
                                (s) => s !== strength
                              )
                            : [...(localFilters.strengths || []), strength]
                        )
                      }
                    />
                    {strength}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingSix">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseSix"
                aria-expanded="false"
                aria-controls="collapseSix"
              >
                Хит продаж
              </button>
            </h2>
            <div
              id="collapseSix"
              className="accordion-collapse collapse"
              aria-labelledby="headingSix"
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
          <div className="accordion-item">
            <h2 className="accordion-header" id="headingFour">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFour"
                aria-expanded="false"
                aria-controls="collapseFour"
              >
                Капсула
              </button>
            </h2>
            <div
              id="collapseFour"
              className="accordion-collapse collapse"
              aria-labelledby="headingFour"
            >
              <div className="accordion-body">
                <label>
                  <input
                    type="radio"
                    name="hasCapsule"
                    value="true"
                    onChange={() => updateLocalFilter("hasCapsule", true)}
                    checked={localFilters.hasCapsule === true}
                  />
                  Есть
                </label>
                <label>
                  <input
                    type="radio"
                    name="hasCapsule"
                    value="false"
                    onChange={() => updateLocalFilter("hasCapsule", false)}
                    checked={localFilters.hasCapsule === false}
                  />
                  Нет
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="buttons">
        <button className="apply-button" onClick={handleApplyFilters}>
          Применить
        </button>
        <button className="reset-button" onClick={handleResetFilters}>
          Сбросить
        </button>
      </div>
    </div>
  );
};

export default FilterAccordion;
