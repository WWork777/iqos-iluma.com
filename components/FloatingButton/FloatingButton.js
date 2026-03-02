"use client";
import Image from "next/image";
import Link from "next/link";
import "./FloatingButton.scss";

const FloatingButton = () => {
  return (
    <div className="floating-button-container">
      <Link
        href="https://t.me/ilumaStore_official_bot" // Замените на ссылку вашего TG бота
        target="_blank"
        rel="noopener noreferrer"
        className="floating-button"
      >
        <div className="floating-button-content">
          <span className="button-text">
            Заказывай в <br></br>TG боте
          </span>
        </div>
      </Link>
    </div>
  );
};

export default FloatingButton;
