"use client";
import { useEffect, useState } from "react";
import styles from "./BlockModal.module.scss";

const BlockModal = ({ allowClose = false, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Форматирование текущей даты
    const now = new Date();
    const formattedDate = now.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setCurrentDate(formattedDate);

    // Блокировка скролла
    document.body.style.overflow = isVisible ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isVisible]);

  // Исправленная функция закрытия
  const handleClose = () => {
    setIsVisible(false);
    // Вызываем колбэк onClose, если он передан
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {allowClose && (
          <button
            className={styles.closeButton}
            onClick={handleClose} // Изменено с setIsVisible(false) на handleClose
            aria-label="Закрыть уведомление"
          >
            &times;
          </button>
        )}
        <h2>Добро пожаловать в Iqos Iluma</h2>

        <p>
          <br />
          Мы не осуществляем дистанционную розничную продажу никотиносодержащей
          продукции и устройств для потребления никотиносодержащей продукции.
          <br />
          Информация на сайте не предназначена для несовершеннолетних.
          Подтвердите, что вам исполнилось 18 лет
          <br />
        </p>

        {/* <p>
          Сегодня <strong>{currentDate}</strong> наш магазин начнет работать с{' '}
          <strong>14:00</strong> по московскому времени. Желаем всем отличного
          дня!{' '}
        </p> */}
        <div className={styles.buttons}>
          <button
            className={styles.continueButton}
            onClick={handleClose} // Изменено с setIsVisible(false) на handleClose
            aria-label="Закрыть уведомление"
          >
            Да
          </button>
          <button
            className={styles.continueButton}
            onClick={() => window.open("https://www.google.com/", "_self")}
            aria-label="Закрыть уведомление"
          >
            Нет
          </button>
        </div>
        <p>
          Сайт представляет собой интернет-витрину, позволяет ознакомиться с
          ассортиментом товаров и оформить бронирование для покупки в
          стационарном магазине. Информация на сайте не является рекламой и
          публичной офертой.
        </p>
      </div>
    </div>
  );
};

export default BlockModal;
