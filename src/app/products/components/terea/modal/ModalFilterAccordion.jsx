import React from 'react';

const ModalFilterAccordion = ({ filters, updateLocalFilter }) => {
    return (
        <div className="modal-filters">
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
                        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne">
                            <div className="accordion-body">
                                <input
                                    type="range"
                                    min="0"
                                    max="12000"
                                    value={filters.priceRange.min}
                                    onChange={(e) =>
                                        updateLocalFilter('priceRange', { ...filters.priceRange, min: parseInt(e.target.value, 10) })
                                    }
                                />
                                <input
                                    type="range"
                                    min="0"
                                    max="12000"
                                    value={filters.priceRange.max}
                                    onChange={(e) =>
                                        updateLocalFilter('priceRange', { ...filters.priceRange, max: parseInt(e.target.value, 10) })
                                    }
                                />
                                <p>Выбрано: {filters.priceRange.min} - {filters.priceRange.max} ₽</p>
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
                        <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo">
                            <div className="accordion-body">
                                {['Табачный вкус', 'Фруктовый вкус', 'Ментол', 'Экзотические'].map((flavor) => (
                                    <label key={flavor}>
                                        <input
                                            type="checkbox"
                                            checked={filters.flavors.includes(flavor)}
                                            onChange={() =>
                                                updateLocalFilter(
                                                    'flavors',
                                                    filters.flavors.includes(flavor)
                                                        ? filters.flavors.filter((f) => f !== flavor)
                                                        : [...filters.flavors, flavor]
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
                    <div id="collapseNine" className="accordion-collapse collapse" aria-labelledby="headingNine">
                        <div className="accordion-body">
                            {['Terea', 'Heets', 'Delia'].map((brend) => (
                                <label key={brend}>
                                    <input
                                        type="checkbox"
                                        checked={filters.brend.includes(brend)} 
                                        onChange={() =>
                                            updateLocalFilter(
                                                'brend', 
                                                filters.brend.includes(brend)
                                                    ? filters.brend.filter((f) => f !== brend)
                                                    : [...filters.brend, brend]
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
                        <div id="collapseSix" className="accordion-collapse collapse" aria-labelledby="headingSix">
                            <div className="accordion-body">
                                <label>
                                    <input
                                        type="radio"
                                        name="hit"
                                        value="true"
                                        onChange={() => updateLocalFilter('hit', true)}
                                        checked={filters.hit === true}
                                    />
                                    Да
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="hit"
                                        value="false"
                                        onChange={() => updateLocalFilter('hit', false)}
                                        checked={filters.hit === false}
                                    />
                                    Нет
                                </label>
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
                        <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree">
                            <div className="accordion-body">
                                {['Легкие', 'Средние', 'Крепкие'].map((strength) => (
                                    <label key={strength}>
                                        <input
                                            type="checkbox"
                                            checked={filters.strengths.includes(strength)}
                                            onChange={() =>
                                                updateLocalFilter(
                                                    'strengths',
                                                    filters.strengths.includes(strength)
                                                        ? filters.strengths.filter((s) => s !== strength)
                                                        : [...filters.strengths, strength]
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
                        <div id="collapseFour" className="accordion-collapse collapse" aria-labelledby="headingFour">
                            <div className="accordion-body">
                                <label>
                                    <input
                                        type="radio"
                                        name="hasCapsule"
                                        value="true"
                                        onChange={() => updateLocalFilter('hasCapsule', true)}
                                        checked={filters.hasCapsule === true}
                                    />
                                    Есть
                                </label>
                                <label>
                                    <input
                                        type="radio"
                                        name="hasCapsule"
                                        value="false"
                                        onChange={() => updateLocalFilter('hasCapsule', false)}
                                        checked={filters.hasCapsule === false}
                                    />
                                    Нет
                                </label>
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    );
};

export default ModalFilterAccordion;