'use client';
import './style.scss';
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/cart/add/cart';
import Link from 'next/link';

export default function ClientFilters({ items: initialItems }) {
    const [product, setProduct] = useState(initialItems);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeButton, setActiveButton] = useState('Пачка');
    const { addToCart } = useContext(CartContext);
    const [quantity, setQuantity] = useState(1);
    const [currentImage, setCurrentImage] = useState(null);

    const handleClick = (button) => {
        setActiveButton(button);
        if (button === 'Блок') {
            setCurrentImage(product.image);
        } else if (button === 'Пачка') {
            setCurrentImage(product.imagePack);
        }
    };

    const increaseQuantity = () => {
        setQuantity((prev) => prev + 1);
    };

    const decreaseQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    useEffect(() => {
        if (initialItems) {
            setProduct(initialItems);
            setLoading(false); 
        }
    }, [initialItems]);

    useEffect(() => {
        if (product) {
            if (product.pricePack === null) {
                setActiveButton('Блок');
                setCurrentImage(product.image);
            } else {
                setActiveButton('Пачка');
                setCurrentImage(product.imagePack);
            }
        }
    }, [product]);

    if (loading) {
        return <div className="spinner">Загрузка...</div>;
    }

    if (error) {
        return <p>Произошла ошибка при загрузке данных: {error.message}</p>;
    }

    return (
        <div className="product-details">
            <div className="product-details__main">
                <div className="product-details__image">
                    {product.pricePack === null ? (
                        <img src={product.image} alt={product.name} />
                    ) : (
                        product.type === 'terea' ? (
                            <>
                                {currentImage && <img src={currentImage} alt={product.name} />}
                            </>
                        ) : (
                            <img src={product.image} alt={product.name} />
                        )
                    )}
                </div>
                <div className="product-details__content">
                    <div className="product-details__text-main">
                        <h1>{product.name}</h1>
                        <p dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br>') }}></p>
                        {product.type !== 'iqos' && product.type !== 'devices' && product.type !== 'exclusive' && (
                            <div className="stats">
                                <p><span>Вкусы: </span>{product.flavor}</p>
                                <p><span>Крепость: </span>{product.strength}</p>
                            </div>
                        )}
                        {product.type !== 'terea' && product.type !== 'devices' && (
                            <div className="stats">
                                <p><span>Модель: </span>{product.model}</p>
                                <p><span>Цвет: </span>{product.color}</p>
                            </div>
                        )}
                    </div>
                    
                    {product.nalichie === 1 ? (
                        <>
                            {product.type !== 'iqos' && product.type !== 'devices' && product.type !== 'exclusive' && (
                                <div className="product-details__text-additional">
                                    {product.pricePack !== null && (
                                        <button 
                                            onClick={() => handleClick('Пачка')} 
                                            className={`choice-button ${activeButton === 'Пачка' ? 'active' : ''}`}
                                        >
                                            Пачка
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleClick('Блок')} 
                                        className={`choice-button ${activeButton === 'Блок' ? 'active' : ''}`}
                                    >
                                        Блок
                                    </button>
                                </div>
                            )}
                            <div className="product-details__text-price">
                                <div className="price-count">
                                    {product.type === 'iqos' || product.type === 'devices' ? (
                                        <p className="price">
                                            {product.price * quantity} ₽ 
                                        </p>
                                    ) : (
                                        <p className="price">
                                            {activeButton === 'Блок' ? product.price * quantity : product.pricePack * quantity} ₽ 
                                        </p>
                                    )}
                                    <div>
                                        <button onClick={decreaseQuantity}>-</button>
                                        <span>{quantity}</span>
                                        <button onClick={increaseQuantity}>+</button>
                                    </div>
                                </div>
                                {product.type === 'iqos' || product.type === 'devices' || product.type === 'exclusive' ? (
                                    <button className="buy-button" onClick={() => addToCart(product, "", quantity, setQuantity)}>
                                        В корзину
                                    </button>
                                ) : (
                                    <button className="buy-button" onClick={() => addToCart(product, activeButton, quantity, setQuantity)}>
                                        В корзину
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <p style={{color:'black'}}>Товар скоро появится в наличии</p>
                            <button className="buy-button-second">
                                <Link href="/products" style={{with: "100%"}}>
                                    Посмотреть все товары
                                </Link>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}