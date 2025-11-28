'use client'
import { useEffect, useState } from 'react';
import './BlockModal.scss';

const BlockModal = ({ allowClose = false }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    document.body.style.overflow = isVisible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContent">
		{allowClose && (
          <button 
            className="closeButton"
            onClick={() => setIsVisible(false)}
            aria-label="Закрыть уведомление"
          >
            &times;
          </button>
        )}
        <h2>Сайт временно не работает</h2>
        <p>Сегодня 23.08 наш магазин по техническим причинам не работает. Принимаем заказы на завтра и желаем всем отличного дня! </p>
      </div>
    </div>
  );
};

export default BlockModal;