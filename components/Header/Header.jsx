'use client'
import './Header.scss'
import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { useRouter } from 'next/navigation';
import {useContext } from 'react';
import { CartContext } from '@/cart/add/cart';
import Image from 'next/image';

export default function Header(){
    const openButtonRef = useRef(null);
    const router = useRouter();
    const {cartItems} = useContext(CartContext);
    const handleLinkClick = (e, href) => {
        e.preventDefault(); // Отменяем стандартное поведение ссылки

        // Симулируем клик по кнопке для открытия/закрытия offcanvas
        if (openButtonRef.current) {
            openButtonRef.current.click();
        }

        // После этого выполняем переход по ссылке
        router.push(href);
    };

 
    const [scrollDirection, setScrollDirection] = useState(null);
    const [lastScrollTop, setLastScrollTop] = useState(0);
    const [isFixed, setIsFixed] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > lastScrollTop) {
            // Скроллим вниз
            setScrollDirection("down");
            setIsFixed(false);
        } else if (currentScrollTop < lastScrollTop) {
            // Скроллим вверх
            setScrollDirection("up");
            setIsFixed(true);
        }

        setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
        window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollTop]);

    return(
      
        <>
            <header className={`${isFixed ? '' : 'absolute'}`}>
                <Link href='/' className='logo-container'>
                    <Image src={'/Header/ilumastorelogo.svg'} alt='ilumastorelogo' width={100} height={100} />
                    <div className='name'>
                        <span>IqosIluma</span>
                    </div>
                </Link>
                <div className='menu'>
                    <Link href='/products/iqos'>Устройства</Link>
                    <Link href='/products/terea'>Стики</Link>
                    <Link href='/products/devices'>Аксессуары</Link>
                    <Link href='/products'>Каталог</Link>
                    <Link href='/contacts'>Контакты</Link>
                </div>
                <div className='cart-menu'>
                    <button className="basket btn-primary position-relative" type="button" data-bs-toggle="offcanvas" data-bs-target="#cart" aria-controls="offcanvasRight">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="white" className="bi bi-cart2" viewBox="0 0 16 16">
                            <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/>
                        </svg>
                        {cartItems.length > 0 ? 
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {cartItems.length}
                        </span>: ''}
                    </button>
                    <button ref={openButtonRef} id='btn-menu' className="btn-menu" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                        </svg>
                    </button>
                
                <div className='contacts-container'>
                    <div className='icons'>
                        <a href='https://t.me/Ilumastore2025'>
                            <svg className='head-tg' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="1000px" height="1000px" viewBox="0 0 1000 1000" version="1.1">
                                <g id="Artboard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <circle id="Oval" fill="#229ED9" cx="500" cy="500" r="500"/>
                                    <path d="M226.328419,494.722069 C372.088573,431.216685 469.284839,389.350049 517.917216,369.122161 C656.772535,311.36743 685.625481,301.334815 704.431427,301.003532 C708.567621,300.93067 717.815839,301.955743 723.806446,306.816707 C728.864797,310.92121 730.256552,316.46581 730.922551,320.357329 C731.588551,324.248848 732.417879,333.113828 731.758626,340.040666 C724.234007,419.102486 691.675104,610.964674 675.110982,699.515267 C668.10208,736.984342 654.301336,749.547532 640.940618,750.777006 C611.904684,753.448938 589.856115,731.588035 561.733393,713.153237 C517.726886,684.306416 492.866009,666.349181 450.150074,638.200013 C400.78442,605.66878 432.786119,587.789048 460.919462,558.568563 C468.282091,550.921423 596.21508,434.556479 598.691227,424.000355 C599.00091,422.680135 599.288312,417.758981 596.36474,415.160431 C593.441168,412.561881 589.126229,413.450484 586.012448,414.157198 C581.598758,415.158943 511.297793,461.625274 375.109553,553.556189 C355.154858,567.258623 337.080515,573.934908 320.886524,573.585046 C303.033948,573.199351 268.692754,563.490928 243.163606,555.192408 C211.851067,545.013936 186.964484,539.632504 189.131547,522.346309 C190.260287,513.342589 202.659244,504.134509 226.328419,494.722069 Z" id="Path-3" fill="#FFFFFF"/>
                                </g>
                            </svg>
                        </a>
                     
                        <a href='https://api.whatsapp.com/send/?phone=79951538019&text=Здравствуйте%21+Хочу+оформить+заказ&type=phone_number&app_absent=0'>
                            <svg className='head-w' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="512px" style={{enableBackground:'new 0 0 512 512'}} version="1.1" viewBox="0 0 512 512" width="512px" xmlSpace="preserve"><g id="_x31_3-whatsapp"><g><g><path d="M256.063,16.75h-0.125C124.379,16.75,17.397,124.051,17.397,256     c0,52.336,16.819,100.848,45.422,140.232l-29.732,88.873l91.716-29.394c37.725,25.063,82.731,39.538,131.26,39.538     c131.559,0,238.541-107.335,238.541-239.25C494.604,124.083,387.621,16.75,256.063,16.75L256.063,16.75z M256.063,16.75" style={{fill:'#5ACF5F'}}/><path d="M394.896,354.596c-5.758,16.304-28.604,29.817-46.824,33.771     c-12.473,2.657-28.754,4.785-83.568-18.006c-70.125-29.127-115.28-100.575-118.795-105.21     c-3.375-4.637-28.336-37.827-28.336-72.165c0-34.331,17.386-51.052,24.398-58.223c5.751-5.897,15.267-8.583,24.394-8.583     c2.954,0,5.606,0.146,7.997,0.267c7.008,0.302,10.524,0.717,15.151,11.813c5.756,13.909,19.77,48.239,21.445,51.771     c1.701,3.53,3.396,8.311,1.012,12.945c-2.24,4.788-4.205,6.91-7.725,10.975c-3.521,4.073-6.865,7.182-10.381,11.544     c-3.219,3.798-6.859,7.867-2.801,14.896c4.055,6.879,18.07,29.812,38.707,48.235c26.641,23.775,48.229,31.372,55.957,34.604     c5.756,2.395,12.615,1.822,16.816-2.663c5.34-5.774,11.938-15.342,18.645-24.759c4.771-6.76,10.795-7.599,17.119-5.208     c6.441,2.244,40.531,19.143,47.541,22.641c7.006,3.529,11.635,5.203,13.334,8.165     C400.652,324.361,400.652,338.271,394.896,354.596L394.896,354.596z M394.896,354.596" style={{fill:"#FCFCFC"}}/></g></g></g><g id="Layer_1"/></svg>
                        </a>
                     
                    </div>
                    <div className='tel'>
                    <a href='tel:+7 (995) 153-80-19'>+7 (995) 153-80-19</a></div>
                </div>
                </div>
            </header>
                <div className="offcanvas offcanvas-end" data-bs-scroll="false" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasRightLabel"></h5>
                    <button type="button" className="btn-close header-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div className='menu'>
                        <div className='logo-container'>
                        <Image src={'/Header/ilumastorelogo.svg'} alt='ilumastorelogo' width={100} height={100} />
                            <div className='name'>
                                <span>IlumaPrime</span>
                            </div>
                        </div>
                        <Link className='link-close' href='/'  onClick={(e) => handleLinkClick(e, '/products/iqos')}>Устройства</Link>
                        <Link className='link-close' href='/portfolio'  onClick={(e) => handleLinkClick(e, '/products/terea')}>Стики</Link>
                        <Link className='link-close' href='/services'  onClick={(e) => handleLinkClick(e, '/products/devices')}>Аксессуары</Link>
                        <Link className='link-close' href='/contacts'  onClick={(e) => handleLinkClick(e, '/products')}>Каталог</Link>
                        <Link className='link-close' href='/contacts'  onClick={(e) => handleLinkClick(e, '/contacts')}>Контакты</Link>
                        <div className='footer-contacts'>
                 
                        <div className='contacts-container'>
                            <div className='icons'>
                                <a href='https://t.me/Ilumastore2025'>
                                    <svg className='head-tg' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="1000px" height="1000px" viewBox="0 0 1000 1000" version="1.1">
                                        <g id="Artboard" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                            <circle id="Oval" fill="#229ED9" cx="500" cy="500" r="500"/>
                                            <path d="M226.328419,494.722069 C372.088573,431.216685 469.284839,389.350049 517.917216,369.122161 C656.772535,311.36743 685.625481,301.334815 704.431427,301.003532 C708.567621,300.93067 717.815839,301.955743 723.806446,306.816707 C728.864797,310.92121 730.256552,316.46581 730.922551,320.357329 C731.588551,324.248848 732.417879,333.113828 731.758626,340.040666 C724.234007,419.102486 691.675104,610.964674 675.110982,699.515267 C668.10208,736.984342 654.301336,749.547532 640.940618,750.777006 C611.904684,753.448938 589.856115,731.588035 561.733393,713.153237 C517.726886,684.306416 492.866009,666.349181 450.150074,638.200013 C400.78442,605.66878 432.786119,587.789048 460.919462,558.568563 C468.282091,550.921423 596.21508,434.556479 598.691227,424.000355 C599.00091,422.680135 599.288312,417.758981 596.36474,415.160431 C593.441168,412.561881 589.126229,413.450484 586.012448,414.157198 C581.598758,415.158943 511.297793,461.625274 375.109553,553.556189 C355.154858,567.258623 337.080515,573.934908 320.886524,573.585046 C303.033948,573.199351 268.692754,563.490928 243.163606,555.192408 C211.851067,545.013936 186.964484,539.632504 189.131547,522.346309 C190.260287,513.342589 202.659244,504.134509 226.328419,494.722069 Z" id="Path-3" fill="#FFFFFF"/>
                                        </g>
                                    </svg>
                                </a>
                            
                                <a href='https://api.whatsapp.com/send/?phone=79951538019&text=Здравствуйте%21+Хочу+оформить+заказ&type=phone_number&app_absent=0'>
                                    <svg className='head-w' xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="512px" style={{enableBackground:'new 0 0 512 512'}} version="1.1" viewBox="0 0 512 512" width="512px" xmlSpace="preserve"><g id="_x31_3-whatsapp"><g><g><path d="M256.063,16.75h-0.125C124.379,16.75,17.397,124.051,17.397,256     c0,52.336,16.819,100.848,45.422,140.232l-29.732,88.873l91.716-29.394c37.725,25.063,82.731,39.538,131.26,39.538     c131.559,0,238.541-107.335,238.541-239.25C494.604,124.083,387.621,16.75,256.063,16.75L256.063,16.75z M256.063,16.75" style={{fill:'#5ACF5F'}}/><path d="M394.896,354.596c-5.758,16.304-28.604,29.817-46.824,33.771     c-12.473,2.657-28.754,4.785-83.568-18.006c-70.125-29.127-115.28-100.575-118.795-105.21     c-3.375-4.637-28.336-37.827-28.336-72.165c0-34.331,17.386-51.052,24.398-58.223c5.751-5.897,15.267-8.583,24.394-8.583     c2.954,0,5.606,0.146,7.997,0.267c7.008,0.302,10.524,0.717,15.151,11.813c5.756,13.909,19.77,48.239,21.445,51.771     c1.701,3.53,3.396,8.311,1.012,12.945c-2.24,4.788-4.205,6.91-7.725,10.975c-3.521,4.073-6.865,7.182-10.381,11.544     c-3.219,3.798-6.859,7.867-2.801,14.896c4.055,6.879,18.07,29.812,38.707,48.235c26.641,23.775,48.229,31.372,55.957,34.604     c5.756,2.395,12.615,1.822,16.816-2.663c5.34-5.774,11.938-15.342,18.645-24.759c4.771-6.76,10.795-7.599,17.119-5.208     c6.441,2.244,40.531,19.143,47.541,22.641c7.006,3.529,11.635,5.203,13.334,8.165     C400.652,324.361,400.652,338.271,394.896,354.596L394.896,354.596z M394.896,354.596" style={{fill:"#FCFCFC"}}/></g></g></g><g id="Layer_1"/></svg>
                                </a>
                            
                            </div>
                            <div className='tel'>
                            <a href='tel:+7 (995) 153-80-19'>+7 (995) 153-80-19</a></div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
        </>
    )
}