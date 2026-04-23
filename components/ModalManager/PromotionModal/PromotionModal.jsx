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

  return null;
};

export default PromotionModal;