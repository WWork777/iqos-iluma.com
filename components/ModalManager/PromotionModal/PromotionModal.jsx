'use client'
import { useEffect, useState } from 'react';
import styles from "./PromotionModal.module.scss"

const PromotionModal = ({ allowClose = false, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Устанавливаем таймер на 3 секунды
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    
    // Очищаем таймер при размонтировании компонента
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  // Функция для полного закрытия
  const handleClose = () => {
    setIsVisible(false);
    // Вызываем колбэк из родителя
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
            onClick={handleClose} // Используем handleClose вместо setIsVisible(false)
            aria-label="Закрыть уведомление"
          >
            &times;
          </button>
        )}
        <a href="https://t.me/Ilumastore2025">
          <div className={styles.leftHalf}>
            <h2>Подписывайтесь на Телеграм канал</h2>
            <p>Первыми узнавайте о поступлении товара, новых скидках и спецпредложениях.</p>
            <p>t.me/Ilumastore2025</p>
          </div>
          <div className={styles.rightHalf}>
            <img src="/Promotion/tg.png" alt="" />
          </div>
        </a>
      </div>
    </div>
  );
};

export default PromotionModal;