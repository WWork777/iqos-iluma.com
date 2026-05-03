"use client";
import { useEffect, useState } from "react";
import styles from "./BlockModal.module.scss";

const STORAGE_KEY = "user_confirmed_age";
const CONFIRMATION_DURATION = 3 * 60 * 60 * 1000; // 3 часа в миллисекундах

const BlockModal = ({ allowClose = false, onClose }) => {
  const [isVisible, setIsVisible] = useState(false); // По умолчанию false
  const [currentDate, setCurrentDate] = useState("");
  const [isCheckingStorage, setIsCheckingStorage] = useState(true); // Флаг проверки

  useEffect(() => {
    // Проверяем, подтверждал ли пользователь возраст ранее
    const checkConfirmation = () => {
      const storedData = localStorage.getItem(STORAGE_KEY);

      if (storedData) {
        try {
          const { confirmed, timestamp } = JSON.parse(storedData);

          // Проверяем, подтверждено ли и не истекло ли время
          if (confirmed && timestamp) {
            const now = Date.now();
            const timePassed = now - timestamp;

            if (timePassed < CONFIRMATION_DURATION) {
              // Подтверждение всё ещё действительно, не показываем модалку
              setIsVisible(false);
              setIsCheckingStorage(false);
              return;
            } else {
              // Время истекло, удаляем данные
              localStorage.removeItem(STORAGE_KEY);
            }
          }
        } catch (error) {
          // Если данные повреждены, удаляем их
          localStorage.removeItem(STORAGE_KEY);
        }
      }

      // Если дошли сюда, значит нужно показать модалку
      setIsVisible(true);
      setIsCheckingStorage(false);
    };

    checkConfirmation();
  }, []); // Пустой массив зависимостей, проверяем только при монтировании

  useEffect(() => {
    if (!isCheckingStorage && isVisible) {
      // Форматирование текущей даты
      const now = new Date();
      const formattedDate = now.toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      setCurrentDate(formattedDate);

      // Блокировка скролла
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [isCheckingStorage, isVisible]);

  // Сохраняем подтверждение в localStorage
  const saveConfirmation = () => {
    const data = {
      confirmed: true,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // Обработчик положительного ответа
  const handlePositiveResponse = () => {
    saveConfirmation();
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  // Обработчик отрицательного ответа - перенаправление
  const handleNegativeResponse = () => {
    window.open("https://www.google.com/", "_self");
  };

  // Пока проверяем localStorage, не рендерим ничего
  if (isCheckingStorage) return null;

  // Если модалка не должна быть видна, не рендерим
  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {allowClose && (
          <button
            className={styles.closeButton}
            onClick={handlePositiveResponse} // Сохраняем подтверждение при закрытии
            aria-label="Закрыть уведомление"
          >
            &times;
          </button>
        )}
        <h2>Добро пожаловать в ИлюмаСтор</h2>

        <p>Уважаемые покупатели! Поздравляем вас с весенними праздниками!</p>
        <p>9 мая наш магазин работать не будет. Желаем отличных выходных!</p>

        <div className={styles.buttons}>
          <button
            className={styles.continueButton}
            onClick={handlePositiveResponse}
            aria-label="Подтвердить возраст"
          >
            Закрыть
          </button>
          {/* <button
            className={styles.continueButton}
            onClick={handleNegativeResponse}
            aria-label="Отказаться"
          >
            Нет
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default BlockModal;
