"use client";
import { useEffect, useState } from "react";
// import PromotionModal from "./PromotionModal/PromotionModal";
import BlockModal from "./BlockModal/BlockModal";

const ModalManager = () => {
  const [shouldShowBlockModal, setShouldShowBlockModal] = useState(false);

  useEffect(() => {
    // Проверяем, нужно ли показывать возрастную модалку
    const checkIfNeeded = () => {
      const storedData = localStorage.getItem("user_confirmed_age");

      if (!storedData) {
        // Если нет подтверждения, планируем показ через 3 секунды
        const timer = setTimeout(() => {
          setShouldShowBlockModal(true);
        }, 3000);

        return () => clearTimeout(timer);
      }

      try {
        const { confirmed, timestamp } = JSON.parse(storedData);
        const now = Date.now();
        const timePassed = now - timestamp;
        const threeHours = 3 * 60 * 60 * 1000;

        if (!confirmed || timePassed >= threeHours) {
          // Подтверждение устарело или отсутствует, планируем показ через 3 секунды
          const timer = setTimeout(() => {
            setShouldShowBlockModal(true);
          }, 3000);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        // Ошибка парсинга, показываем модалку через 3 секунды
        const timer = setTimeout(() => {
          setShouldShowBlockModal(true);
        }, 3000);

        return () => clearTimeout(timer);
      }

      // Если подтверждение актуально, не показываем модалку
      return () => {};
    };

    const cleanup = checkIfNeeded();
    return cleanup;
  }, []);

  const handleCloseBlock = () => {
    setShouldShowBlockModal(false);
    // Здесь можно показать промо-модалку
  };

  const handleClosePromo = () => {
    // Закрытие промо-модалки
  };

  return (
    <>
      {shouldShowBlockModal && (
        <BlockModal allowClose={false} onClose={handleCloseBlock} />
      )}
    </>
  );
};

export default ModalManager;
