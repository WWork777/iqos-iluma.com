"use client";
import "./style.scss";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/cart/add/cart";
import Link from "next/link";
import Image from "next/image";

const AgeVerificationModal = ({ isOpen, onConfirm, onClose }) => {
  const [showError, setShowError] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setShowError(false);
  };

  const handleUnderage = () => {
    setShowError(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="age-modal-overlay" onClick={onClose}>
      <div className="age-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Подтверждение возраста</h3>
        <p>Вам есть 18 лет?</p>
        {showError && (
          <p className="age-error">
            Доступ запрещен. Контент только для лиц старше 18 лет.
          </p>
        )}
        <div className="age-modal-buttons">
          <button onClick={handleConfirm} className="age-confirm">
            Да, мне есть 18
          </button>
          <button onClick={handleUnderage} className="age-deny">
            Нет, мне меньше 18
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ClientFilters({ items: initialItems }) {
  const [product, setProduct] = useState(initialItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeButton, setActiveButton] = useState("Пачка");
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(null);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);

  useEffect(() => {
    // Проверяем, подтвержден ли возраст в localStorage
    const ageVerified = localStorage.getItem("ageVerified") === "true";
    setIsAgeVerified(ageVerified);
  }, []);

  const handleAgeVerification = () => {
    localStorage.setItem("ageVerified", "true");
    setIsAgeVerified(true);
    setShowAgeModal(false);
  };

  const handleImageClick = () => {
    if (!isAgeVerified && needsVerification) {
      setShowAgeModal(true);
    }
  };

  const handleClick = (button) => {
    setActiveButton(button);
    if (button === "Блок") {
      setCurrentImage(product.image);
    } else if (button === "Пачка") {
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
        setActiveButton("Блок");
        setCurrentImage(product.image);
      } else {
        setActiveButton("Пачка");
        setCurrentImage(product.imagePack);
      }
    }
  }, [product]);

  // Проверяем, нужна ли верификация для этого товара
  const needsVerification = true;

  if (loading) {
    return <div className="spinner">Загрузка...</div>;
  }

  if (error) {
    return <p>Произошла ошибка при загрузке данных: {error.message}</p>;
  }

  return (
    <>
      <div className="product-details">
        <div className="product-details__main">
          <div className="product-details__image">
            <div className="image-container-info">
              {needsVerification && !isAgeVerified ? (
                <div className="blurred-image" onClick={handleImageClick}>
                  {product.pricePack === null ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="blurred"
                    />
                  ) : product.type === "terea" ? (
                    <img
                      src={currentImage || product.image}
                      alt={product.name}
                      className="blurred"
                    />
                  ) : (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="blurred"
                    />
                  )}
                  <div className="eye-overlay">
                    <Image
                      src="/card/eye-closed.webp"
                      alt="Возрастное ограничение 18+"
                      width={70}
                      height={70}
                      priority
                    />
                    {/* <span>Нажмите для подтверждения возраста</span> */}
                  </div>
                </div>
              ) : (
                <>
                  {product.pricePack === null ? (
                    <img src={product.image} alt={product.name} />
                  ) : product.type === "terea" ? (
                    <>
                      {currentImage && (
                        <img src={currentImage} alt={product.name} />
                      )}
                    </>
                  ) : (
                    <img src={product.image} alt={product.name} />
                  )}
                </>
              )}
            </div>
          </div>
          <div className="product-details__content">
            <div className="product-details__text-main">
              <h1>{product.name}</h1>

              <p
                dangerouslySetInnerHTML={{
                  __html: product.description.replace(/\n/g, "<br>"),
                }}
              ></p>
              {product.type !== "iqos" &&
                product.type !== "devices" &&
                product.type !== "exclusive" && (
                  <div className="stats">
                    <p>
                      <span>Вкусы: </span>
                      {product.flavor}
                    </p>
                    <p>
                      <span>Крепость: </span>
                      {product.strength}
                    </p>
                  </div>
                )}
              {product.type !== "terea" && product.type !== "devices" && (
                <div className="stats">
                  <p>
                    <span>Модель: </span>
                    {product.model}
                  </p>
                  <p>
                    <span>Цвет: </span>
                    {product.color}
                  </p>
                </div>
              )}
            </div>

            {product.nalichie === 1 ? (
              <>
                {product.type !== "iqos" &&
                  product.type !== "devices" &&
                  product.type !== "exclusive" && (
                    <div className="product-details__text-additional">
                      {product.pricePack !== null && (
                        <button
                          onClick={() => handleClick("Пачка")}
                          className={`choice-button ${activeButton === "Пачка" ? "active" : ""}`}
                          disabled={needsVerification && !isAgeVerified}
                        >
                          Пачка
                        </button>
                      )}
                      <button
                        onClick={() => handleClick("Блок")}
                        className={`choice-button ${activeButton === "Блок" ? "active" : ""}`}
                        disabled={needsVerification && !isAgeVerified}
                      >
                        Блок
                      </button>
                    </div>
                  )}
                <div className="product-details__text-price">
                  <div className="price-count">
                    {product.type === "iqos" || product.type === "devices" ? (
                      <p className="price">{product.price * quantity} ₽</p>
                    ) : (
                      <p className="price">
                        {activeButton === "Блок"
                          ? product.price * quantity
                          : product.pricePack * quantity}{" "}
                        ₽
                      </p>
                    )}
                    <div>
                      <button
                        onClick={decreaseQuantity}
                        disabled={needsVerification && !isAgeVerified}
                      >
                        -
                      </button>
                      <span>{quantity}</span>
                      <button
                        onClick={increaseQuantity}
                        disabled={needsVerification && !isAgeVerified}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {product.type === "iqos" ||
                  product.type === "devices" ||
                  product.type === "exclusive" ? (
                    <button
                      className="buy-button"
                      onClick={() =>
                        addToCart(product, "", quantity, setQuantity)
                      }
                      disabled={needsVerification && !isAgeVerified}
                    >
                      <img
                        src="/card/cart.svg"
                        width={20}
                        height={20}
                        className="cart_add_svg_info"
                      />
                    </button>
                  ) : (
                    <button
                      className="buy-button"
                      onClick={() =>
                        addToCart(product, activeButton, quantity, setQuantity)
                      }
                      disabled={needsVerification && !isAgeVerified}
                    >
                      <img
                        src="/card/cart.svg"
                        width={20}
                        height={20}
                        className="cart_add_svg_info"
                      />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <p style={{ color: "white" }}>Товар скоро появится в наличии</p>
                <button className="buy-button-second">
                  <Link href="/products" style={{ width: "100%" }}>
                    Посмотреть все товары
                  </Link>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <AgeVerificationModal
        isOpen={showAgeModal}
        onConfirm={handleAgeVerification}
        onClose={() => setShowAgeModal(false)}
      />
    </>
  );
}
