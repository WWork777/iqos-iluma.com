"use client";
import { useEffect, useState } from "react";
import PromotionModal from "./PromotionModal/PromotionModal";
import BlockModal from "./BlockModal/BlockModal";

const ModalManager = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Устанавливаем задержку перед появлением первой модалки
    const timer = setTimeout(() => {
      setCurrentStep(1);
    }, 3000); // 3 секунды

    return () => clearTimeout(timer);
  }, []);

  const handleCloseBlock = () => {
    setCurrentStep(2);
  };

  const handleClosePromo = () => {
    setCurrentStep(0);
  };

  return (
    <>
      {currentStep === 1 && (
        <BlockModal allowClose={false} onClose={handleCloseBlock} />
      )}

      {/* {currentStep === 2 && (
        <PromotionModal 
          allowClose={true}
          onClose={handleClosePromo}
        />
      )} */}
    </>
  );
};

export default ModalManager;
