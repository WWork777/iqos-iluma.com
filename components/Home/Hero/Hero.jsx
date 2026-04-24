"use client";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./Hero.scss";

import Image from "next/image";

export default function Hero() {
  return (
    <>
      <div className="hero-container">
        <div className="hero-seo">
          <h1 className="hero-title">
            Магазин IQOS Iluma | Оригинальные устройства и стики Terea
          </h1>
          <p className="hero-subtitle">
            Забронируйте новую IQOS Iluma и стики Terea c доставкой. Официальная
            гарантия, вся Россия.
          </p>
        </div>
        <Swiper
          slidesPerView={"auto"}
          //spaceBetween={30}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Navigation]}
          className="hero"
          breakpoints={{
            140: {
              slidesPerView: "auto",
              spaceBetween: 15,
            },
            640: {
              slidesPerView: 1,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: "auto",
              spaceBetween: 15,
            },
            1024: {
              slidesPerView: "auto",
              spaceBetween: 30,
            },
          }}
        >
          {/* <SwiperSlide>
            <div className="services-card">
              <p>Бронирование</p>
              <span>Дистанционная продаже не осуществляется</span>
              <div className="slide-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <path fill="white" d="M4 16h12v2H4zm-2-5h10v2H2z" />
                  <path
                    fill="white"
                    d="m29.919 16.606l-3-7A.999.999 0 0 0 26 9h-3V7a1 1 0 0 0-1-1H6v2h15v12.556A3.992 3.992 0 0 0 19.142 23h-6.284a4 4 0 1 0 0 2h6.284a3.98 3.98 0 0 0 7.716 0H29a1 1 0 0 0 1-1v-7a.997.997 0 0 0-.081-.394M9 26a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2m14-15h2.34l2.144 5H23Zm0 15a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2m5-3h-1.142A3.995 3.995 0 0 0 23 20v-2h5Z"
                  />
                </svg>
              </div>
              <div className="slide-icon2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <circle cx="21" cy="21" r="2" fill="white" />
                  <circle cx="7" cy="7" r="2" fill="white" />
                  <path
                    fill="white"
                    d="M27 31a4 4 0 1 1 4-4a4.012 4.012 0 0 1-4 4m0-6a2 2 0 1 0 2 2a2.006 2.006 0 0 0-2-2"
                  />
                  <path
                    fill="white"
                    d="M30 16A14.041 14.041 0 0 0 16 2a13.043 13.043 0 0 0-6.8 1.8l1.1 1.7a24.425 24.425 0 0 1 2.4-1A25.135 25.135 0 0 0 10 15H4a11.149 11.149 0 0 1 1.4-4.7L3.9 9A13.842 13.842 0 0 0 2 16a13.998 13.998 0 0 0 14 14a13.366 13.366 0 0 0 5.2-1l-.6-1.9a11.442 11.442 0 0 1-5.2.9A21.071 21.071 0 0 1 12 17h17.9a3.402 3.402 0 0 0 .1-1M12.8 27.6a13.02 13.02 0 0 1-5.3-3.1A12.505 12.505 0 0 1 4 17h6a25.002 25.002 0 0 0 2.8 10.6M12 15a21.446 21.446 0 0 1 3.3-11h1.4A21.446 21.446 0 0 1 20 15Zm10 0a23.278 23.278 0 0 0-2.8-10.6A12.092 12.092 0 0 1 27.9 15Z"
                  />
                </svg>
              </div>
            </div>
          </SwiperSlide> */}
          <SwiperSlide>
            <div className="services-card">
              <p>Акция!</p>
              {/* <span>IQOS ILUMA GALAXY</span> */}
              <ul>
                <li>Уникальная модель Galaxy Blue всего за 14 000 ₽.</li>
                <li>
                  Эксклюзивный цвет. Без чистки. Технология будущего уже здесь.
                </li>
                <li>
                  Успейте Забронировать по специальной цене - предложение
                  ограничено!
                </li>
              </ul>
              <div>
                <Link href={"/products/product-info/iqos/I-Galaxy-Blue"}>
                  забронировать
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m9 6l6 6l-6 6"
                    />
                  </svg>
                </Link>
              </div>
              {/* <Image
              src={"/Home/Hero/IQOS Iluma i Galaxy Blue.png.webp"}
              alt="IQOS Iluma"
              width={1920}
              height={1080}
              loading="lazy"
              priority={false}
            /> */}
              <Image
                src={"/Home/Hero/IQOS Iluma i Galaxy Blue.png.webp"}
                alt="IQOS Iluma"
                width={1920}
                height={1080}
                loading="lazy"
                priority={false}
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="services-card">
              <p>Бронирование</p>
              <span>Дистанционная продаже не осуществляется</span>
              <div className="slide-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <path fill="white" d="M4 16h12v2H4zm-2-5h10v2H2z" />
                  <path
                    fill="white"
                    d="m29.919 16.606l-3-7A.999.999 0 0 0 26 9h-3V7a1 1 0 0 0-1-1H6v2h15v12.556A3.992 3.992 0 0 0 19.142 23h-6.284a4 4 0 1 0 0 2h6.284a3.98 3.98 0 0 0 7.716 0H29a1 1 0 0 0 1-1v-7a.997.997 0 0 0-.081-.394M9 26a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2m14-15h2.34l2.144 5H23Zm0 15a2 2 0 1 1 2-2a2.002 2.002 0 0 1-2 2m5-3h-1.142A3.995 3.995 0 0 0 23 20v-2h5Z"
                  />
                </svg>
              </div>
              <div className="slide-icon2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <circle cx="21" cy="21" r="2" fill="white" />
                  <circle cx="7" cy="7" r="2" fill="white" />
                  <path
                    fill="white"
                    d="M27 31a4 4 0 1 1 4-4a4.012 4.012 0 0 1-4 4m0-6a2 2 0 1 0 2 2a2.006 2.006 0 0 0-2-2"
                  />
                  <path
                    fill="white"
                    d="M30 16A14.041 14.041 0 0 0 16 2a13.043 13.043 0 0 0-6.8 1.8l1.1 1.7a24.425 24.425 0 0 1 2.4-1A25.135 25.135 0 0 0 10 15H4a11.149 11.149 0 0 1 1.4-4.7L3.9 9A13.842 13.842 0 0 0 2 16a13.998 13.998 0 0 0 14 14a13.366 13.366 0 0 0 5.2-1l-.6-1.9a11.442 11.442 0 0 1-5.2.9A21.071 21.071 0 0 1 12 17h17.9a3.402 3.402 0 0 0 .1-1M12.8 27.6a13.02 13.02 0 0 1-5.3-3.1A12.505 12.505 0 0 1 4 17h6a25.002 25.002 0 0 0 2.8 10.6M12 15a21.446 21.446 0 0 1 3.3-11h1.4A21.446 21.446 0 0 1 20 15Zm10 0a23.278 23.278 0 0 0-2.8-10.6A12.092 12.092 0 0 1 27.9 15Z"
                  />
                </svg>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="services-card">
              <div className="services-card">
                <p>Акция!</p>
                {/* <span>IQOS ILUMA GALAXY</span> */}
                <ul>
                  <li>Каждый 11-й блок стиков в подарок!</li>
                  <li>При покупке 10ти блоков - 11й в подарок</li>
                  <li>Распространяется на все страны производители!</li>
                </ul>
                <div>
                  <Link href={"/products/stiki-terea-dlya-iqos-iluma"}>
                    забронировать
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m9 6l6 6l-6 6"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
        <button className="swiper-button-prev"></button>
        <button className="swiper-button-next"></button>
      </div>
    </>
  );
}
