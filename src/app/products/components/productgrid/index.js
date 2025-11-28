'use client'
import './style.scss'
import { useContext, useState, useEffect } from 'react';
import Link from 'next/link';
import { CartContext } from '@/cart/add/cart';

const ProductCard = ({ item, addToCart }) => {
    const [activeButton, setActiveButton] = useState(item.pricePack === null ? 'Блок' : 'Пачка');
    const [quantity, setQuantity] = useState(1);
    const [currentImage, setCurrentImage] = useState(item.pricePack === null ? item.image : item.imagePack);

    const handleClick = (button) => {
        setActiveButton(button);
        if (button === 'Блок') {
            setCurrentImage(item.image);
        } else if (button === 'Пачка') {
            setCurrentImage(item.imagePack);
        }
    };

    return (
        <div className="product-card">
            {item.pricePack === null ? (
                <img src={item.image} alt={item.name} width={100} height={100} />
            ) : (
                item.type === 'terea' ? (
                    <img src={currentImage} alt={item.name} width={100} height={100} />
                ) : (
                    <img src={item.image} alt={item.name} width={100} height={100} />
                )
            )}

            {item.nalichie === 1 ? (
                <Link href={`/products/product-info/${item.type}/${item.ref}`}>
                    <h2 className="product-name">{item.name}</h2>
                </Link>
            ) : (
                <h2 className="product-name">{item.name}</h2>
            )}

            {item.nalichie === 1 && (
                <>
                    {(item.type === 'iqos' || item.type === 'devices' || item.type === 'exclusive') ? (
                        ''
                    ) : (
                        <div className="switch">
                            {item.pricePack !== null && (
                                <button 
                                    onClick={() => handleClick('Пачка')} 
                                    className={`switch-button ${activeButton === 'Пачка' ? 'active' : ''}`}
                                >
                                    Пачка
                                </button>
                            )}
                            <button 
                                onClick={() => handleClick('Блок')} 
                                className={`switch-button ${activeButton === 'Блок' ? 'active' : ''}`}
                            >
                                Блок
                            </button>
                        </div>
                    )}
                </>
            )}

            <div className="product-info">
                {item.nalichie === 1 ? (
                    <>
                        {(item.type === 'iqos' || item.type === 'devices' || item.type === 'exclusive') ? (
                            <>
                            <div className="price-container">
                            <s className="product-price-sale">{item.sale_price}</s>
                            <p className="product-price">{item.price} ₽</p>
                            </div>
                            </>
                        ) : (
                            <p className="product-price">
                                {activeButton === 'Блок' ? item.price : item.pricePack} ₽
                            </p>
                        )}
                        {(item.type === 'iqos' || item.type === 'devices' || item.type === 'exclusive' && item.pricePack !== null) ? (
                            <button className="product-button" onClick={() => addToCart(item, "", quantity, setQuantity)}>
                                В корзину
                            </button>
                        ) : (
                            <button className="product-button" onClick={() => addToCart(item, activeButton, quantity, setQuantity)}>
                                В корзину
                            </button>
                        )}
                    </>
                ) : (
                    <p className="product-price">Нет в наличии</p>
                )}
            </div>
        </div>
    );
};

const ProductGrid = ({ items, loading }) => {
    const { addToCart } = useContext(CartContext);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredItems = items.filter(item => item.nalichie === 1);
    const sortedItems = filteredItems.sort((a, b) => {
        if (a.nalichie === 0 && b.nalichie !== 0) {
            return 1; 
        } else if (a.nalichie !== 0 && b.nalichie === 0) {
            return -1; 
        } else {
            return 0; 
        }
    });

    const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = sortedItems.slice(startIndex, startIndex + itemsPerPage);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            scrollToTop();
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            scrollToTop();
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 1300) {
                setItemsPerPage(8); 
            } 
        };
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="grid">
            {sortedItems.length > 0 ? (
                <>
                    <div className="grid-container">
                        {currentItems.map((item) => (
                            <ProductCard key={item.id} item={item} addToCart={addToCart} />
                        ))}
                    </div>
                    <div className="pagination">
                        <button 
                            onClick={handlePreviousPage} 
                            className="pagination-button"
                            disabled={currentPage === 1}
                        >
                            Назад
                        </button>
                        <span className="pagination-info">
                            Страница {currentPage} из {totalPages}
                        </span>
                        <button 
                            onClick={handleNextPage} 
                            disabled={currentPage === totalPages}
                            className="pagination-button"
                        >
                            Вперед
                        </button>
                    </div>
                </>
            ) : (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>Товары не найдены</p>
            )}
        </div>
    );
};

export default ProductGrid;