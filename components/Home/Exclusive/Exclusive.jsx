'use client';
import './Exclusive.scss';
import '../New/New.scss'
import { useEffect, useState, useContext } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { CartContext } from '@/cart/add/cart';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';

const ProductCard = ({ item }) => {
    const { addToCart } = useContext(CartContext);
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
                            <p className="product-price">{item.price} ₽</p>
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

export default function Exclusive() {
    const { addToCart } = useContext(CartContext);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);
    const [activeButton, setActiveButton] = useState('Блок');
    const availableItems = items.filter(item => item.nalichie === 1);
    const handleClick = (button) => {
        setActiveButton(button);
    };

    const fetchExclusive = async () => {
        try {
            const res = await fetch('/api/products/gethit');
            const data = await res.json();

            if (res.ok) {
                const combinedItems = [...(data.terea || []), ...(data.iqos || []), ...(data.device || [])];
                setItems(combinedItems);
            } else {
                setError("Ошибка при получении данных");
            }
        } catch (error) {
            setError("Ошибка выполнения запроса");
        }
    };

    useEffect(() => {
        fetchExclusive();
    }, []);

    return (
        <div id='popular' className="new">
               <h1>Хит продаж</h1>
               <Swiper
                   slidesPerView={'auto'}
                   spaceBetween={30}
                   navigation={{
                       nextEl: ".swiper-button-next-new",
                       prevEl: ".swiper-button-prev-new",
                   }}
                   modules={[Navigation]}
                   className="promo-catalog"  
               >
                   {availableItems.map(item => (
                       <SwiperSlide key={item.id}>
                           <ProductCard item={item} /> 
                       </SwiperSlide>
                   ))}
                   <button className="swiper-button-prev-new"></button>
                   <button className="swiper-button-next-new"></button>
               </Swiper>
           </div>
    );
}
