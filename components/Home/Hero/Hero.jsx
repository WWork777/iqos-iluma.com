'use client';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './Hero.scss';

import Image from 'next/image';

export default function Hero() {
  return (
    <>
      <div className='hero-container'>
        <Swiper
          slidesPerView={'auto'}
          //spaceBetween={30}
          navigation={{
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }}
          modules={[Navigation]}
          className='hero'
          breakpoints={{
            140: {
              slidesPerView: 'auto',
              spaceBetween: 15,
            },
            640: {
              slidesPerView: 'auto',
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 'auto',
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: 'auto',
              spaceBetween: 30,
            },
          }}
        >
          {/* <SwiperSlide>
                <div className="services-card first">
                      <p className="discount">Скидка 5%</p>
                      <span>Оформи заказ со скидкой 5% <br></br>через телеграмм-бота  </span>
                      <br></br>
                    <div>
                      <Link href='https://t.me/iluma_store_bot'>
                      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
                        <path d="M5.83,23.616c12.568-5.529,28.832-12.27,31.077-13.203c5.889-2.442,7.696-1.974,6.795,3.434 c-0.647,3.887-2.514,16.756-4.002,24.766c-0.883,4.75-2.864,5.313-5.979,3.258c-1.498-0.989-9.059-5.989-10.7-7.163 c-1.498-1.07-3.564-2.357-0.973-4.892c0.922-0.903,6.966-6.674,11.675-11.166c0.617-0.59-0.158-1.559-0.87-1.086 c-6.347,4.209-15.147,10.051-16.267,10.812c-1.692,1.149-3.317,1.676-6.234,0.838c-2.204-0.633-4.357-1.388-5.195-1.676 C1.93,26.43,2.696,24.995,5.83,23.616z"></path>
                      </svg>
                      <div>
                        <span>Промокод «Весна»</span>
                        <span>TelegramBot</span>
                      </div>
                      </Link>
                    </div>
                </div>
              </SwiperSlide> */}
          <SwiperSlide>
            <div className='services-card'>
              <p>Акция!</p>
              <span>
                Оставьте отзыв о покупке, пришлите скриншот — и получите скидку
                500 рублей!
              </span>
              <div>
                <Link href='https://yandex.ru/maps/org/ilyuma_stor/197216417279/'>
                  Оставить отзыв
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m9 6l6 6l-6 6'
                    />
                  </svg>
                </Link>
                <Link href='https://t.me/Ilumastore2025'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    x='0px'
                    y='0px'
                    width='100'
                    height='100'
                    viewBox='0 0 48 48'
                  >
                    <path d='M5.83,23.616c12.568-5.529,28.832-12.27,31.077-13.203c5.889-2.442,7.696-1.974,6.795,3.434 c-0.647,3.887-2.514,16.756-4.002,24.766c-0.883,4.75-2.864,5.313-5.979,3.258c-1.498-0.989-9.059-5.989-10.7-7.163 c-1.498-1.07-3.564-2.357-0.973-4.892c0.922-0.903,6.966-6.674,11.675-11.166c0.617-0.59-0.158-1.559-0.87-1.086 c-6.347,4.209-15.147,10.051-16.267,10.812c-1.692,1.149-3.317,1.676-6.234,0.838c-2.204-0.633-4.357-1.388-5.195-1.676 C1.93,26.43,2.696,24.995,5.83,23.616z'></path>
                  </svg>
                  <div>
                    Telegram
                    <span>@Ilumastore2025</span>
                  </div>
                </Link>
              </div>
            </div>
            <Image
              src={'/Home/Hero/sale.png'}
              className='sale-img'
              alt='IQOS Iluma'
              width={1000}
              height={1000}
              style={{ width: '800px', right: '-13%', top: '-12%' }}
            />
          </SwiperSlide>
          <SwiperSlide>
            <div className='services-card'>
              <p>Гарантия качества</p>
              <span>В нашем магазине только оригинальная продукция</span>
              <div className='slide-icon'>
                <svg
                  width='100px'
                  height='100px'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                  <g
                    id='SVGRepo_tracerCarrier'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  ></g>
                  <g id='SVGRepo_iconCarrier'>
                    {' '}
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M3.37752 5.08241C3 5.62028 3 7.21907 3 10.4167V11.9914C3 17.6294 7.23896 20.3655 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C16.761 20.3655 21 17.6294 21 11.9914V10.4167C21 7.21907 21 5.62028 20.6225 5.08241C20.245 4.54454 18.7417 4.02996 15.7351 3.00079L15.1623 2.80472C13.595 2.26824 12.8114 2 12 2C11.1886 2 10.405 2.26824 8.83772 2.80472L8.26491 3.00079C5.25832 4.02996 3.75503 4.54454 3.37752 5.08241ZM15.0595 10.4995C15.3353 10.1905 15.3085 9.71642 14.9995 9.44055C14.6905 9.16467 14.2164 9.19151 13.9405 9.50049L10.9286 12.8739L10.0595 11.9005C9.78358 11.5915 9.30947 11.5647 9.00049 11.8405C8.69151 12.1164 8.66467 12.5905 8.94055 12.8995L10.3691 14.4995C10.5114 14.6589 10.7149 14.75 10.9286 14.75C11.1422 14.75 11.3457 14.6589 11.488 14.4995L15.0595 10.4995Z'
                      fill='#ffffff'
                    ></path>{' '}
                  </g>
                </svg>
              </div>
              <div className='slide-icon2'>
                <svg
                  width='100px'
                  height='100px'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
                  <g
                    id='SVGRepo_tracerCarrier'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  ></g>
                  <g id='SVGRepo_iconCarrier'>
                    {' '}
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M21.8382 11.1263L21.609 13.5616C21.2313 17.5742 21.0425 19.5805 19.8599 20.7902C18.6773 22 16.9048 22 13.3599 22H10.6401C7.09517 22 5.32271 22 4.14009 20.7902C2.95748 19.5805 2.76865 17.5742 2.391 13.5616L2.16181 11.1263C1.9818 9.2137 1.8918 8.25739 2.21899 7.86207C2.39598 7.64823 2.63666 7.5172 2.89399 7.4946C3.36968 7.45282 3.96708 8.1329 5.16187 9.49307C5.77977 10.1965 6.08872 10.5482 6.43337 10.6027C6.62434 10.6328 6.81892 10.6018 6.99526 10.5131C7.31351 10.3529 7.5257 9.91812 7.95007 9.04852L10.1869 4.46486C10.9888 2.82162 11.3898 2 12 2C12.6102 2 13.0112 2.82162 13.8131 4.46485L16.0499 9.04851C16.4743 9.91812 16.6865 10.3529 17.0047 10.5131C17.1811 10.6018 17.3757 10.6328 17.5666 10.6027C17.9113 10.5482 18.2202 10.1965 18.8381 9.49307C20.0329 8.1329 20.6303 7.45282 21.106 7.4946C21.3633 7.5172 21.604 7.64823 21.781 7.86207C22.1082 8.25739 22.0182 9.2137 21.8382 11.1263ZM12.9524 12.699L12.8541 12.5227C12.4741 11.841 12.2841 11.5002 12 11.5002C11.7159 11.5002 11.5259 11.841 11.1459 12.5227L11.0476 12.699C10.9397 12.8927 10.8857 12.9896 10.8015 13.0535C10.7173 13.1174 10.6125 13.1411 10.4028 13.1886L10.2119 13.2318C9.47396 13.3987 9.10501 13.4822 9.01723 13.7645C8.92945 14.0468 9.18097 14.3409 9.68403 14.9291L9.81418 15.0813C9.95713 15.2485 10.0286 15.3321 10.0608 15.4355C10.0929 15.5389 10.0821 15.6504 10.0605 15.8734L10.0408 16.0765C9.96476 16.8613 9.92674 17.2538 10.1565 17.4282C10.3864 17.6027 10.7318 17.4436 11.4227 17.1255L11.6014 17.0432C11.7978 16.9528 11.8959 16.9076 12 16.9076C12.1041 16.9076 12.2022 16.9528 12.3986 17.0432L12.5773 17.1255C13.2682 17.4436 13.6136 17.6027 13.8435 17.4282C14.0733 17.2538 14.0352 16.8613 13.9592 16.0765L13.9395 15.8734C13.9179 15.6504 13.9071 15.5389 13.9392 15.4355C13.9714 15.3321 14.0429 15.2485 14.1858 15.0813L14.316 14.9291C14.819 14.3409 15.0706 14.0468 14.9828 13.7645C14.895 13.4822 14.526 13.3987 13.7881 13.2318L13.5972 13.1886C13.3875 13.1411 13.2827 13.1174 13.1985 13.0535C13.1143 12.9896 13.0603 12.8927 12.9524 12.699Z'
                      fill='#ffffff'
                    ></path>{' '}
                  </g>
                </svg>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className='services-card'>
              <p>IQOS ILUMA</p>
              <span>от 8 500 ₽</span>
              <ul>
                <li>инновационная технология нагревания табака</li>
                <li>встроенный нейронный процессор</li>
                <li>приложение для смартфона</li>
              </ul>
              <div>
                <Link href='/products/iqos'>
                  Смотреть
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                  >
                    <path
                      fill='none'
                      stroke='currentColor'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='m9 6l6 6l-6 6'
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <Image
              src={'/Home/Hero/iluma.png'}
              alt='IQOS Iluma'
              width={1000}
              height={1000}
            />
          </SwiperSlide>
          <SwiperSlide>
            <div className='services-card'>
              <p>Быстрая доставка</p>
              <span>Отправка в день заказа</span>
              <div className='slide-icon'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                >
                  <path fill='white' d='M4 16h12v2H4zm-2-5h10v2H2z' />
                  <path
                    fill='white'
                    d='m29.919 16.606l-3-7A.999.999 0 0 0 26 9h-3V7a1 1 0 0 0-1-1H6v2h15v12.556A3.992 3.992 0 0 0 19.142 23h-6.284a4 4 0 1 0 0 2h6.284a3.98 3.98 0 0 0 7.716 0H29a1 1 0 0 0 1-1v-7a.997.997 0 0 0-.081-.394M9 26a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2m14-15h2.34l2.144 5H23Zm0 15a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2m5-3h-1.142A3.995 3.995 0 0 0 23 20v-2h5Z'
                  />
                </svg>
              </div>
              <div className='slide-icon2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='32'
                  height='32'
                  viewBox='0 0 32 32'
                >
                  <circle cx='21' cy='21' r='2' fill='white' />
                  <circle cx='7' cy='7' r='2' fill='white' />
                  <path
                    fill='white'
                    d='M27 31a4 4 0 1 1 4-4a4.012 4.012 0 0 1-4 4m0-6a2 2 0 1 0 2 2a2.006 2.006 0 0 0-2-2'
                  />
                  <path
                    fill='white'
                    d='M30 16A14.041 14.041 0 0 0 16 2a13.043 13.043 0 0 0-6.8 1.8l1.1 1.7a24.425 24.425 0 0 1 2.4-1A25.135 25.135 0 0 0 10 15H4a11.149 11.149 0 0 1 1.4-4.7L3.9 9A13.842 13.842 0 0 0 2 16a13.998 13.998 0 0 0 14 14a13.366 13.366 0 0 0 5.2-1l-.6-1.9a11.442 11.442 0 0 1-5.2.9A21.071 21.071 0 0 1 12 17h17.9a3.402 3.402 0 0 0 .1-1M12.8 27.6a13.02 13.02 0 0 1-5.3-3.1A12.505 12.505 0 0 1 4 17h6a25.002 25.002 0 0 0 2.8 10.6M12 15a21.446 21.446 0 0 1 3.3-11h1.4A21.446 21.446 0 0 1 20 15Zm10 0a23.278 23.278 0 0 0-2.8-10.6A12.092 12.092 0 0 1 27.9 15Z'
                  />
                </svg>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        <button className='swiper-button-prev'></button>
        <button className='swiper-button-next'></button>
      </div>
    </>
  );
}
