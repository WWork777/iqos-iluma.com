"use client";
import "./style.scss";
import { useContext, useRef, useState, useMemo } from "react";
import { CartContext } from "@/cart/add/cart";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import Link from "next/link";
import moscowCities from "./city.js";

// Создаем Set для быстрой проверки городов
const moscowCitiesSet = new Set(
  moscowCities.map((city) => city.toLowerCase().trim()),
);

const CheckoutPage = () => {
  const [selectedMethod, setSelectedMethod] = useState("delivery");
  const [loading, setLoading] = useState(false);
  const {
    cartItems,
    removeFromCart,
    clearCart,
    addOne,
    deleteOne,
    calculateTotalPrice,
    hasSticks,
  } = useContext(CartContext);
  const totalPrice = useMemo(() => calculateTotalPrice(), [cartItems]);
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    lastName: "",
    phoneNumber: "",
    telegram: "",
    city: "",
    streetAddress: "",
  });

  const totalQuantity = cartItems
    .filter((item) => item.type === "Пачка")
    .reduce((acc, item) => acc + item.quantity, 0);

  const hasBlock = cartItems.some((item) => item.type === "Блок");

  const onlyPacksAndBlocks = cartItems.every(
    (item) => item.type === "Пачка" || item.type === "Блок",
  );

  const [errors, setErrors] = useState({});

  const scroolTo = (element) => {
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      element.focus();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let element;

    // Валидация телефона
    if (!formData.phoneNumber) {
      element = document.querySelector(
        `[placeholder="Введите номер телефона"]`,
      );
      scroolTo(element);
      newErrors.phoneNumber = "Введите номер телефона";
    } else if (formData.phoneNumber.replace(/\D/g, "").length < 11) {
      element = document.querySelector(
        `[placeholder="Введите номер телефона"]`,
      );
      scroolTo(element);
      newErrors.phoneNumber = "Некорректный номер телефона";
    }

    // Валидация города для доставки
    if (selectedMethod === "delivery") {
      if (!formData.city.trim()) {
        element = document.querySelector(`[name="city"]`);
        scroolTo(element);
        newErrors.city = "Введите ваш город";
      } else if (!/^[a-zA-Zа-яА-ЯёЁ0-9\s-]+$/.test(formData.city)) {
        element = document.querySelector(`[name="city"]`);
        scroolTo(element);
        newErrors.city =
          "Город может содержать только буквы, цифры, пробелы и дефисы";
      }
    }

    // Валидация Telegram (если указан)
    if (
      formData.telegram.trim() &&
      !/^[@a-zA-Z0-9_]{5,32}$/.test(formData.telegram.replace(/^@/, ""))
    ) {
      newErrors.telegram = "Некорректный формат Telegram username";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let isValid = true;

    if (name === "telegram") {
      isValid = /^@?[a-zA-Z0-9_]*$/.test(value);
    } else if (name === "lastName") {
      isValid = /^[a-zA-Zа-яА-ЯёЁ0-9\s-]*$/.test(value);
    } else if (name === "city") {
      isValid = /^[a-zA-Zа-яА-ЯёЁ0-9\s-]*$/.test(value); // Добавлены английские буквы
    } else if (name === "streetAddress") {
      isValid = /^[а-яА-ЯёЁ0-9\s-]*$/.test(value);
    }

    if (isValid) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value,
    }));
    if (errors.phoneNumber) {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: "",
      }));
    }
  };

  // Функция для проверки предыдущих заказов
  const checkPreviousOrders = async (phoneE164) => {
    try {
      console.log("Checking orders for phone:", phoneE164);

      const checkResponse = await fetch(
        `/api/check-orders?phone=${encodeURIComponent(phoneE164)}`,
        {
          cache: "no-store",
          signal: AbortSignal.timeout(5000), // Таймаут 5 секунд
        },
      );

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        console.log("Check orders API response:", checkData);

        // Безопасное извлечение данных
        const previousOrdersCount =
          parseInt(checkData.previous_orders_count) || 0;
        const isFirstOrder = previousOrdersCount === 0;

        console.log("Parsed order info:", {
          previousOrdersCount,
          isFirstOrder,
        });

        return {
          isFirstOrder,
          previousOrdersCount,
          success: true,
          error: null,
        };
      } else {
        const errorText = await checkResponse.text();
        console.warn(
          "API check-orders failed:",
          checkResponse.status,
          errorText,
        );

        return {
          isFirstOrder: true, // По умолчанию считаем новым
          previousOrdersCount: 0,
          success: false,
          error: `API error: ${checkResponse.status}`,
        };
      }
    } catch (error) {
      console.warn("Error checking previous orders:", error);

      // Определяем тип ошибки
      let errorType = "network_error";
      if (error.name === "AbortError") {
        errorType = "timeout_error";
      } else if (error.name === "TypeError") {
        errorType = "network_error";
      }

      return {
        isFirstOrder: true, // По умолчанию считаем новым
        previousOrdersCount: 0,
        success: false,
        error: `${errorType}: ${error.message}`,
      };
    }
  };

  // Функция для отправки в Telegram
  const sendToTelegram = async (message, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Telegram attempt ${attempt}/${maxRetries}`);

        const response = await fetch("/api/telegram-proxi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: "-1002155675591",
            text: message,
            parse_mode: "HTML",
          }),
        });

        if (response.ok) {
          console.log(`Telegram sent successfully on attempt ${attempt}`);
          return true;
        } else {
          console.warn(
            `Telegram attempt ${attempt} failed: ${response.status}`,
          );
        }
      } catch (error) {
        console.warn(`Telegram attempt ${attempt} error:`, error);
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }
    }

    console.error("All Telegram attempts failed");
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const phoneNorm = formData.phoneNumber.replace(/\D/g, "");
    const totalPrice = calculateTotalPrice();
    const site = "iqos-iluma.com";

    // 1. Форматируем список товаров
    const formattedCart = cartItems
      .map(
        (item) =>
          `- ${item.name} (${item.type || "обычный"}) x${item.quantity}: ${item.price} ₽`,
      )
      .join("\n");

    const telegramUsername = formData.telegram.trim()
      ? formData.telegram.startsWith("@")
        ? formData.telegram
        : `@${formData.telegram}`
      : "не указан";

    // 2. Текст для TELEGRAM и EMAIL (Полный отчет для менеджера)
    const tgMessage = `Заказ с сайта ${site}

📋 <b>НОВЫЙ ЗАКАЗ</b>

<b>Имя:</b> ${formData.lastName || "Не указано"}
<b>Телефон:</b> +${formData.phoneNumber}
<b>Telegram:</b> ${telegramUsername}
<b>Способ доставки:</b> Доставка
<b>Город:</b> ${formData.city || "Не указан"}

<b>Корзина:</b>
${formattedCart}

<b>Общая сумма:</b> ${totalPrice} ₽`;

    // 3. Текст для WHATSAPP (Клиентский формат)
    const isMoscow = moscowCitiesSet.has(formData.city?.toLowerCase().trim());
    const autoReply = !isMoscow
      ? "Здравствуйте! Получили ваше бронирование. \n\nВ регионы отправляем через CDEK. \n\nВсе посылки отправляются в день заказа.\nОтправка из Москвы ❗️\nНаложенным платежом не отправляем ❌❌❌\n\nОт Вас нужны следующие данные:\n\nФио \nТел получателя \nГород\nАдрес ближ пвз сдэк"
      : "Здравствуйте! \n\nПолучили ваше бронирование. \n*❗️КОГДА И ПО КАКОМУ АДРЕСУ ВАМ УДОБНО ПОЛУЧИТЬ ЗАКАЗ?❗️*\n*❗️СТОИМОСТЬ ДОСТАВКИ ЗАВИСИТ ОТ АДРЕСА И БУДЕТ С ВАМИ СОГЛАСОВАНА❗️*";

    const orderInfo = `📦 СОСТАВ ЗАКАЗА:\n${formattedCart}\n\n💰 Сумма: ${totalPrice} ₽\n\n👤 Контактные данные:\nИмя: ${formData.lastName || "Не указано"}\nТелефон: +${formData.phoneNumber}\nTelegram: ${telegramUsername}\n${formData.city ? `🏙 Город: ${formData.city}` : ""}`;
    const waMessage = `${autoReply}\n\n${orderInfo}`;

    try {
      // 1. Проверка заказа
      const orderCheck = await checkPreviousOrders(`+${phoneNorm}`);

      // 2. Сохранение в БД
      const dbResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.lastName,
          phone_number: `+${phoneNorm}`,
          total_amount: totalPrice,
          ordered_items: cartItems.map((i) => ({
            product_name: `${i.name} (${i.type || "обычный"})`,
            quantity: i.quantity,
            price_at_time_of_order: i.price,
          })),
          is_first_order: orderCheck.isFirstOrder ? 1 : 0,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!dbResponse.ok) throw new Error("Database save failed");

      // 3. Параллельная отправка уведомлений (Не ждем их, чтобы ускорить интерфейс)
      const idInstance = "1103290542";
      const apiTokenInstance =
        "65dee4a31f1342768913a5557afc548591af648dffc44259a6";

      Promise.allSettled([
        // WhatsApp
        fetch(
          `https://api.green-api.com/waInstance${idInstance}/SendMessage/${apiTokenInstance}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chatId: `${phoneNorm}@c.us`,
              message: waMessage,
            }),
          },
        ),
        // Telegram
        sendToTelegram(tgMessage),
        // Email
        fetch("/api/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: tgMessage }),
        }),
      ]);

      alert(
        "✅ Ваш заказ был отправлен!\nВ ближайшее время с вами свяжется наш менеджер.",
      );
      clearCart();
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    } catch (error) {
      console.error("Critical error:", error);
      alert("⚠️ Произошла ошибка. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleExternalSubmit = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-form">
        <div className="plitka">
          <h1>Оформление заказа</h1>
          <h5>
            Уважаемые покупатели, в связи с обновлением требований
            законодательства со страницы бронирования товара убраны возможности
            выбора способов доставки.
          </h5>
        </div>
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="checkout-name">
            <h4>Контактные данные</h4>
            <h5>ВАЖНО! Укажите ваш номер и ваш username в Telegram.</h5>

            <input
              type="text"
              name="lastName"
              placeholder="Ваше имя"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            {errors.lastName && (
              <p className="error" style={{ color: "red" }}>
                {errors.lastName}
              </p>
            )}

            <input
              type="text"
              name="telegram"
              placeholder="Telegram username (необязательно)"
              value={formData.telegram}
              onChange={handleInputChange}
              onFocus={(e) => {
                const value = formData.telegram;
                if (!value.startsWith("@")) {
                  setFormData((prev) => ({
                    ...prev,
                    telegram: "@" + (value || ""),
                  }));

                  setTimeout(() => {
                    e.target.setSelectionRange(1, 1);
                  }, 0);
                }
              }}
              onBlur={(e) => {
                if (formData.telegram === "@") {
                  setFormData((prev) => ({
                    ...prev,
                    telegram: "",
                  }));
                }
              }}
            />
            {errors.telegram && (
              <p className="error" style={{ color: "red" }}>
                {errors.telegram}
              </p>
            )}

            <PhoneInput
              country={"ru"}
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              disableDropdown={true}
              onlyCountries={["ru"]}
              inputStyle={{
                width: "100%",
                fontSize: "16px",
                padding: "10px 20px",
                fontFamily: "inherit",
              }}
              placeholder="Введите номер телефона"
            />
            {errors.phoneNumber && (
              <p className="error" style={{ color: "red" }}>
                {errors.phoneNumber}
              </p>
            )}

            <div style={{ position: "relative", width: "100%" }}>
              <input
                type="text"
                name="city"
                placeholder="Город *"
                value={formData.city}
                onChange={handleInputChange}
                disabled={onlyPacksAndBlocks && totalQuantity < 10 && !hasBlock}
              />
              {errors.city && (
                <p
                  style={{
                    color: "red",
                    fontSize: "14px",
                    marginTop: "5px",
                    marginBottom: "0",
                    fontWeight: "500",
                  }}
                >
                  {errors.city}
                </p>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="checkout-table">
        <h4>Ваша корзина</h4>
        {cartItems.length > 0 ? (
          <div>
            <ul className="cart-list">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-name">
                      <p>{item.name}</p>
                      {item.type === "default" ? "" : <p>({item.type})</p>}
                    </div>
                    <div className="price">
                      <p>Количество: {item.quantity}</p>
                      <p>Цена: {item.price} ₽</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="checkout-total">
              <p>Итого:</p>
              <p>{calculateTotalPrice()} ₽</p>
            </div>
            <button
              onClick={handleExternalSubmit}
              disabled={loading || selectedMethod === "pickup"}
              style={{
                opacity: selectedMethod === "pickup" ? 0.5 : 1,
                cursor: selectedMethod === "pickup" ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Загрузка..." : "Оформить заказ"}
            </button>
            {selectedMethod === "pickup" && (
              <p
                style={{
                  color: "rgb(198, 58, 58)",
                  fontSize: "14px",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                Самовывоз недоступен. Выберите доставку для оформления заказа.
              </p>
            )}
          </div>
        ) : (
          <div>
            <h5 style={{ textAlign: "center", marginTop: "30%" }}>
              Корзина пуста
            </h5>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
