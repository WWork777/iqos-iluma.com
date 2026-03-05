"use client";
import "./style.scss";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { CartContext } from "@/cart/add/cart";
import Image from "next/image";
// Правильный импорт из public
// import eyeIcon from "/card/eye-closed.webp";

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

const ProductCard = ({ item, addToCart, isAgeVerified, setIsAgeVerified }) => {
  const [activeButton, setActiveButton] = useState(
    item.pricePack === null ? "Блок" : "Пачка",
  );
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(
    item.pricePack === null ? item.image : item.imagePack,
  );
  // const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showAgeModal, setShowAgeModal] = useState(false);

  // useEffect(() => {
  //   const ageVerified = localStorage.getItem("ageVerified") === "true";
  //   setIsAgeVerified(ageVerified);
  // }, []);

  const handleClick = (button) => {
    setActiveButton(button);
    if (button === "Блок") {
      setCurrentImage(item.image);
    } else if (button === "Пачка") {
      setCurrentImage(item.imagePack);
    }
  };

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

  const needsVerification = true;

  return (
    <>
      <div className="product-card">
        <div className="image-container">
          {needsVerification && !isAgeVerified ? (
            <div className="blurred-image" onClick={handleImageClick}>
              <img
                src={needsVerification ? item.image : currentImage}
                alt={item.name}
                className="blurred"
              />
              <div className="eye-overlay">
                <Image
                  src="/card/eye-closed.webp"
                  alt="Возрастное ограничение 18+"
                  width={40}
                  height={40}
                  priority
                />
                {/* <span>Нажмите для подтверждения возраста</span> */}
              </div>
            </div>
          ) : (
            <>
              {item.pricePack === null ? (
                <img
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                />
              ) : item.type === "terea" ? (
                <img
                  src={currentImage}
                  alt={item.name}
                  width={100}
                  height={100}
                />
              ) : (
                <img
                  src={item.image}
                  alt={item.name}
                  width={100}
                  height={100}
                />
              )}
            </>
          )}
        </div>

        {item.nalichie === 1 ? (
          <Link href={`/products/product-info/${item.type}/${item.ref}`}>
            <h3 className="product-name">{item.name}</h3>
          </Link>
        ) : (
          <h3 className="product-name">{item.name}</h3>
        )}

        {item.nalichie === 1 && (
          <>
            {item.type === "iqos" ||
            item.type === "devices" ||
            item.type === "exclusive" ? (
              ""
            ) : (
              <div className="switch">
                {item.pricePack !== null && (
                  <button
                    onClick={() => handleClick("Пачка")}
                    className={`switch-button ${
                      activeButton === "Пачка" ? "active" : ""
                    }`}
                  >
                    Пачка
                  </button>
                )}
                <button
                  onClick={() => handleClick("Блок")}
                  className={`switch-button ${
                    activeButton === "Блок" ? "active" : ""
                  }`}
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
              {item.type === "iqos" ||
              item.type === "devices" ||
              item.type === "exclusive" ? (
                <>
                  <div className="price-container">
                    <s className="product-price-sale">{item.sale_price}</s>
                    <p className="product-price">{item.price} ₽</p>
                  </div>
                </>
              ) : (
                <p className="product-price">
                  {activeButton === "Блок" ? item.price : item.pricePack} ₽
                </p>
              )}
              {item.type === "iqos" ||
              item.type === "devices" ||
              (item.type === "exclusive" && item.pricePack !== null) ? (
                <button
                  className="product-button"
                  onClick={() => addToCart(item, "", quantity, setQuantity)}
                  // disabled={needsVerification && !isAgeVerified}
                >
                  <img
                    src="/card/cart.svg"
                    width={20}
                    height={20}
                    className="cart_add_svg"
                  />
                </button>
              ) : (
                <button
                  className="product-button"
                  onClick={() =>
                    addToCart(item, activeButton, quantity, setQuantity)
                  }
                  // disabled={needsVerification && !isAgeVerified}
                >
                  <img
                    src="/card/cart.svg"
                    width={20}
                    height={20}
                    className="cart_add_svg"
                  />
                </button>
              )}
            </>
          ) : (
            <p className="product-price">Нет в наличии</p>
          )}
        </div>
      </div>

      <AgeVerificationModal
        isOpen={showAgeModal}
        onConfirm={handleAgeVerification}
        onClose={() => setShowAgeModal(false)}
      />
    </>
  );
};

const ProductGrid = ({ items, loading, isAgeVerified, setIsAgeVerified }) => {
  const { addToCart } = useContext(CartContext);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredItems = items.filter((item) => item.nalichie === 1);
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
      behavior: "smooth",
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

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="grid">
      {sortedItems.length > 0 ? (
        <>
          <div className="grid-container">
            {currentItems.map((item) => (
              <ProductCard
                key={item.id}
                item={item}
                addToCart={addToCart}
                isAgeVerified={isAgeVerified}
                setIsAgeVerified={setIsAgeVerified}
              />
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
        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Товары не найдены
        </p>
      )}
    </div>
  );
};

export default ProductGrid;
