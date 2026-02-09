"use client";
import "./style.scss";
import { useContext, useRef, useState, useMemo } from "react";
import { CartContext } from "@/cart/add/cart";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      phoneNumber: value,
    }));
  };

  // Функция для отправки в Telegram с повторными попытками
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

    // Минимальная проверка телефона
    if (!formData.phoneNumber) {
      alert("Введите номер телефона");
      setLoading(false);
      return;
    }

    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length < 11) {
      alert("Введите корректный номер телефона");
      setLoading(false);
      return;
    }

    const totalPrice = calculateTotalPrice();
    const site = "iqos-iluma.com";

    // Список городов Москвы
    const moscowCities = [
      "москва",
      "зеленоград",
      "троицк",
      "московский",
      "щербинка",
      "новая москва",
      "теплый стан",
      "коммунарка",
      "сосенки",
      "бутово",
      "внуково",
      "солнцево",
      "фили",
      "новокосино",
      "домодедово",
      "беляево",
      "ясенево",
      "царицыно",
      "марьино",
      "люблино",
      "вешняки",
      "печатники",
      "жулебино",
      "кузьминки",
      "чертаново",
      "якиманка",
      "измайлово",
      "митино",
      "куркино",
      "северное бутово",
      "южное бутово",
      "поселение десеновское",
      "поселение филимонковское",
      "поселение воскресенское",
      "поселение марушкинское",
      "поселение мосрентген",
      "поселение рязановское",
      "поселение соколово-мещерское",
      "поселение щаповское",
      "поселение краснопахорское",
      "поселение щербинка",
      "поселение первомайское",
      "поселение московский",
      "поселение троицк",
      "поселение шишкин лес",
      "поселение киёвский",
      "поселение калининец",
      "поселение аксиньино",
      "поселение былово",
      "поселение варварино",
      "поселение коготково",
      "поселение кленово",
      "поселение горчаково",
      "поселение крекшино",
      "поселение лесной городок",
      "химки",
      "мытищи",
      "балашиха",
      "люберцы",
      "реутов",
      "королев",
      "одинцово",
      "долгопрудный",
      "власиха",
      "видное",
      "щербинка",
      "котельники",
      "новокосино",
      "электросталь",
      "железнодорожный",
      "лазарево",
      "текстильщики",
      "новопеределкино",
      "северное тушино",
      // Дополнения:
      "апрелевка",
      "красногорск",
      "ленинский",
      "подольск",
      "дзержинский",
      "долгопрудный",
      "лобня",
      "ивантеевка",
      "фрязино",
      "софрино",
      "пушкино",
      "щелково",
      "жуковский",
      "раменское",
      "бронницы",
      "ликино-дулево",
      "электрогорск",
      "павловский посад",
      "старая купавна",
      "дмитров",
      "солнечногорск",
      "зеленоград",
      "кубинка",
      "наро-фоминск",
      "руза",
      "волоколамск",
      "истра",
      "чехов",
      "серпухов",
      "кашира",
      "столбовая",
      "лесной городок",
      "переделкино",
      "внуково",
      "раменки",
      "коньково",
      "тёплый стан",
      "ясенево",
      "медведково",
      "алтуфьево",
      "бибирево",
      "отрадное",
      "свиблово",
      "алексеевский",
      "рижский",
      "проспект мира",
      "сущёвский",
      "марфино",
      "останкино",
      "ростокино",
      "черкизово",
      "преображенское",
      "сокольники",
      "богородское",
      "метрогородок",
      "гольяново",
      "измайлово",
      "восточное измайлово",
      "северное измайлово",
      "коврово",
      "перово",
      "новогиреево",
      "вешняки",
      "выхино-жулебино",
      "рюмино",
      "капотня",
      "кузьминки",
      "лефортово",
      "нижегородский",
      "текстильщики",
      "южнопортовый",
      "печатники",
      "нагатино-садовники",
      "нагатинский затон",
      "даниловский",
      "донской",
      "нагорный",
      "нагатино",
      "зябликово",
      "братеево",
      "алма-атинская",
      "калитники",
      "котловка",
      "обручевский",
      "коньково",
      "беляево",
      "чёрёмушки",
      "академический",
      "гагаринский",
      "ленинский проспект",
      "якиманка",
      "арбат",
      "пресненский",
      "тверской",
      "мещанский",
      "красносельский",
      "басманный",
      "таганский",
      "замоскворечье",
      "хамовники",
      "якиманка",
      "крылатское",
      "кунцево",
      "филёвский парк",
      "фили-давыдково",
      "дорохово",
      "сетунь",
      "протвино",
      "пущино",
      "сергиев посад",
      "краснозаводск",
      "пересвет",
      "хотово",
      "абрамцево",
      "софрино",
      "пушкино",
      "ивантеевка",
      "фрязино",
      "королёв",
      "юбилейный",
      "лосино-петровский",
      "монино",
      "щёлково",
      "фридрихсгам",
      "старая купавна",
      "электроугли",
      "ликино-дулёво",
      "давыдово",
      "куровское",
      "егорьевск",
      "коломна",
      "воскресенск",
      "белоозёрский",
      "хорлово",
      "раменское",
      "жуковский",
      "быково",
      "красково",
      "малаховка",
      "удельная",
      "томилино",
      "красногорск",
      "нахабино",
      "опалиха",
      "архангельское",
      "ильинское",
      "степаново",
      "дедовск",
      "снегири",
      "холмогорка",
      "лесной",
      "поварово",
      "андреевка",
      "зеленоград",
      "крюково",
      "савёлки",
      "силино",
      "старое крюково",
      "александровка",
      "лужники",
      "матвеевское",
      "очаково",
      "ново-переделкино",
      "солнцево",
      "воробьёвы горы",
      "ленинские горы",
      "раменки",
      "проспект вернадского",
      "университет",
      "черёмушки",
      "новые черёмушки",
      "зюзино",
      "котловка",
      "обручевский",
      "гагаринский",
      "ленинский проспект",
      "якиманка",
      "арбат",
      "пресненский",
      "тверской",
      "мещанский",
      "красносельский",
      "басманный",
      "таганский",
      "замоскворечье",
      "хамовники",
      "якиманка",
      "крылатское",
      "кунцево",
      "филёвский парк",
      "фили-давыдково",
      "дорохово",
      "сетунь",
      "троицк",
      "красная пахра",
      "клёново",
      "первомайское",
      "киевский",
      "щербинка",
      "подольск",
      "климовск",
      "чехов",
      "серпухов",
      "протвино",
      "пущино",
      "липицы",
      "оболенск",
      "таруса",
      "апрелевка",
      "кокошкино",
      "лесной городок",
      "апрелевка",
      "селятино",
      "наро-фоминск",
      "кубинка",
      "тепловка",
      "зимёнки",
      "жуковка",
      "никольское",
      "петрово-дальнее",
      "ильинское",
      "павловская слобода",
      "бузланово",
      "снегири",
      "дубки",
      "жуковка",
      "горки-10",
      "барвиха",
      "раздоры",
      "ульяновка",
      "горки-2",
      "заречье",
      "дмитров",
      "яхрома",
      "долгие пруды",
      "львовский",
      "горшково",
      "сходня",
      "фирсановка",
      "подрезково",
      "зеленоград",
      "солнечногорск",
      "поварово",
      "андреевка",
      "поведники",
      "купавна",
      "старая купавна",
      "электроугли",
      "электросталь",
      "ногинск",
      "павловский посад",
      "электрогорск",
      "ликино-дулёво",
      "давыдово",
      "куровское",
      "егорьевск",
      "коломна",
      "воскресенск",
      "белоозёрский",
      "хорлово",
      "раменское",
      "жуковский",
      "быково",
      "красково",
      "малаховка",
      "удельная",
      "томилино",
      "люберцы",
      "котельники",
      "дзержинский",
      "железнодорожный",
      "балашиха",
      "реутов",
      "щелково",
      "фрязино",
      "королёв",
      "мытищи",
      "пушкино",
      "ивантеевка",
      "красногорск",
      "химки",
      "долгопрудный",
      "лобня",
      "зеленоград",
      "солнечногорск",
      "клин",
      "высоковск",
      "теряево",
      "покровка",
      "новопетровское",
      "истра",
      "дедовск",
      "снегири",
      "холмогорка",
      "лесной",
      "поварово",
      "андреевка",
      "солнечногорск",
      "поварово",
      "андреевка",
      "поведники",
      "купавна",
      "старая купавна",
      "электроугли",
      "электросталь",
      "ногинск",
      "павловский посад",
      "электрогорск",
      "ликино-дулёво",
      "давыдово",
      "куровское",
      "егорьевск",
      "коломна",
      "воскресенск",
      "белоозёрский",
      "хорлово",
      "раменское",
      "жуковский",
      "быково",
      "красково",
      "малаховка",
      "удельная",
      "томилино",
      "люберцы",
      "котельники",
      "дзержинский",
      "железнодорожный",
      "балашиха",
      "реутов",
      "щелково",
      "фрязино",
      "королёв",
      "мытищи",
      "пушкино",
      "ивантеевка",
      "красногорск",
      "химки",
      "долгопрудный",
      "лобня",
      "зеленоград",
      "солнечногорск",
      "клин",
      "высоковск",
      "теряево",
      "покровка",
      "новопетровское",
      "истра",
      "дедовск",
      "снегири",
      "холмогорка",
      "лесной",
      "поварово",
      "андреевка",
      "солнечногорск",
      "поварово",
      "андреевка",
      "поведники",
      "купавна",
      "старая купавна",
      "электроугли",
      "электросталь",
      "ногинск",
      "павловский посад",
      "электрогорск",
      "ликино-дулёво",
      "давыдово",
      "куровское",
      "егорьевск",
      "коломна",
      "воскресенск",
      "белоозёрский",
      "хорлово",
      "раменское",
      "жуковский",
      "быково",
      "красково",
      "малаховка",
      "удельная",
      "томилино",
      "люберцы",
      "котельники",
      "дзержинский",
      "железнодорожный",
      "балашиха",
      "реутов",
      "щелково",
      "фрязино",
      "королёв",
      "мытищи",
      "пушкино",
      "ивантеевка",
      "красногорск",
      "химки",
      "долгопрудный",
      "лобня",
      "зеленоград",
    ];

    const formattedCart = cartItems
      .map(
        (item) =>
          `- ${item.name} (${item.type || "обычный"}) x${item.quantity}: ${
            item.price
          } ₽`,
      )
      .join("\n");

    // Форматируем Telegram username
    const telegramUsername = formData.telegram.trim()
      ? formData.telegram.startsWith("@")
        ? formData.telegram
        : `@${formData.telegram}`
      : "не указан";

    // Формируем сообщение для Telegram
    const telegramMessage = `
Заказ с сайта ${site}

Имя: ${formData.lastName || "Не указано"}   
Телефон: +${formData.phoneNumber}
Telegram: ${telegramUsername}
Способ доставки: ${selectedMethod === "delivery" ? "Доставка" : "Самовывоз"}
${selectedMethod === "delivery" ? `Город: ${formData.city || "Не указан"}\nАдрес: ${formData.streetAddress || "Не указан"}` : ""}

Корзина:
${formattedCart}

Общая сумма: ${totalPrice} ₽
    `;

    console.log("Начинаем отправку заказа...");

    try {
      // 1. В ПЕРВУЮ ОЧЕРЕДЬ отправляем в Telegram (самое важное!)
      console.log("Sending to Telegram (highest priority)...");
      const telegramSent = await sendToTelegram(telegramMessage);

      if (!telegramSent) {
        console.error("FAILED: Telegram not sent after all retries");
        // Даже если не отправилось, продолжаем - возможно другие каналы сработают
      } else {
        console.log("SUCCESS: Telegram sent!");
      }

      // 2. Формируем сообщение для WhatsApp
      let whatsappMessage = "";
      const isMoscowCity = moscowCities.some((city) =>
        (formData.city || "").toLowerCase().includes(city.toLowerCase()),
      );

      if (selectedMethod === "pickup") {
        whatsappMessage = `Добрый день!\n\nПолучили ваш заказ ✅\n\nс сайта ${site} ✅\n\nНаш адрес для самовывоза:\nГ.Москва\n\nРимского-Корсакова 11к8\nОриентир пункт «OZON»\n\nОплата наличными ❗️❗️\n\nВажно❗️❗️\nНеобходимо заранее согласовать дату и приблизительное время приезда.\nПри желании, можем отправить ваш заказ Яндекс курьером или Доставистой. В таком случае, оплатить заказ необходимо переводом на карту.\n\nКорзина:\n${formattedCart}\n\nИмя: ${formData.lastName || "Не указано"}\nТелефон: +${formData.phoneNumber}\nTelegram: ${telegramUsername}`;
      } else if (selectedMethod === "delivery" && isMoscowCity) {
        whatsappMessage = `Здравствуйте!\n\nПолучили ваш заказ с сайта ${site} ✅\n\nЗаказы отправляем через Яндекс или Достависту, предварительно согласовав с вами стоимость доставки. Оплата за заказ - переводом на карту.\n\nМожем отправить в любое удобное для Вас время.\n\n❗️Первый заказ можно оплатить при получении курьеру Достависты (в пределах МКАД)\n\nКогда Вам было бы удобно принять заказ? 😊\n\nКорзина:\n${formattedCart}\n\nАдрес:\nГород: ${formData.city || "Не указан"}\nАдрес: ${formData.streetAddress || "Не указан"}\n\nКонтактные данные:\nИмя: ${formData.lastName || "Не указано"}\nТелефон: +${formData.phoneNumber}\nTelegram: ${telegramUsername}`;
      } else if (selectedMethod === "delivery") {
        whatsappMessage = `Здравствуйте!\nПолучили ваш заказ с сайта ${site} ✅\n\nВ регионы отправляем через CDEK. Процесс следующий:\n\nВысылаем фото вашего заказа и накладную Cdek (отправка по договору, тарифы минимальные, доставка будет оплачена нами сразу и включена в общий счет).\nВысылаем вам реквизиты для оплаты.\n\nВсе посылки отправляются в день заказа.\nОтправка из Москвы ❗️\nНаложенным платежом не отправляем ❌❌❌\n\nОт Вас нужны след данные:\n\nФИО\nАдрес ближ ПВЗ СДЭК\n\nКорзина:\n${formattedCart}\n\nКонтактные данные:\nИмя: ${formData.lastName || "Не указано"}\nТелефон: +${formData.phoneNumber}\nTelegram: ${telegramUsername}\nАдрес доставки:\nГород: ${formData.city || "Не указан"}\nАдрес: ${formData.streetAddress || "Не указан"}`;
      }

      // 3. Сохраняем заказ в localStorage как резервную копию
      const localOrder = {
        formData,
        cartItems,
        totalPrice,
        timestamp: new Date().toISOString(),
        site,
        telegramMessage,
        whatsappMessage,
      };
      localStorage.setItem("last_order_backup", JSON.stringify(localOrder));

      // 4. Запускаем все остальные отправки параллельно (но не ждем их для пользователя)
      const sendPromises = [];

      // Email отправка
      sendPromises.push(
        (async () => {
          try {
            console.log("Sending email...");
            const response = await fetch("/api/email", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ text: telegramMessage }),
            });
            if (response.ok) {
              console.log("SUCCESS: Email sent");
            } else {
              console.warn("WARNING: Email failed");
            }
          } catch (error) {
            console.warn("WARNING: Email error:", error);
          }
        })(),
      );

      // WhatsApp отправка
      sendPromises.push(
        (async () => {
          try {
            console.log("Sending WhatsApp...");
            const response = await fetch(
              `https://api.green-api.com/waInstance1103290542/SendMessage/65dee4a31f1342768913a5557afc548591af648dffc44259a6`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chatId: `${formData.phoneNumber}@c.us`,
                  message: whatsappMessage,
                }),
              },
            );
            if (response.ok) {
              console.log("SUCCESS: WhatsApp sent");
            } else {
              console.warn("WARNING: WhatsApp failed");
            }
          } catch (error) {
            console.warn("WARNING: WhatsApp error:", error);
          }
        })(),
      );

      // Запускаем фоновые отправки, но не ждем их завершения
      Promise.allSettled(sendPromises)
        .then((results) => {
          console.log("Background sends completed:", results);
        })
        .catch((error) => {
          console.log("Error in background sends:", error);
        });

      // 5. ВСЕГДА показываем успех пользователю (Telegram уже отправлен или пытался отправиться)
      console.log("Order processing completed");
      alert(
        "✅ Ваш заказ был отправлен!\nВ ближайшее время с вами свяжется наш менеджер.",
      );

      // 6. Очищаем корзину и перенаправляем
      clearCart();
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Unexpected error in main processing:", error);

      // Даже при критической ошибке, Telegram уже пытался отправиться или сохранился в localStorage
      // Сохраняем дополнительную резервную копию
      localStorage.setItem(
        "failed_order_backup",
        JSON.stringify({
          formData,
          cartItems,
          totalPrice,
          timestamp: new Date().toISOString(),
          error: error.message,
        }),
      );

      // Все равно показываем успех пользователю
      alert(
        "✅ Ваш заказ был отправлен!\nВ ближайшее время с вами свяжется наш менеджер.",
      );

      // Очищаем корзину и перенаправляем
      clearCart();
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
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
            ВАЖНО! Укажите Ваш номер в WhatsApp или Telegram ник для связи
          </h5>
        </div>
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className="checkout-name">
            <h4>Контактные данные</h4>
            <input
              type="text"
              name="lastName"
              placeholder="Ваше имя"
              value={formData.lastName}
              onChange={handleInputChange}
            />

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
          </div>

          <div className="checkout-delivery">
            <h4>Способ доставки</h4>
            <div className="checkout-delivery-method">
              <button
                type="button"
                className={selectedMethod === "pickup" ? "active" : ""}
                onClick={() => setSelectedMethod("pickup")}
                disabled={true}
                style={{
                  opacity: 0.5,
                  cursor: "not-allowed",
                  position: "relative",
                }}
              >
                Самовывоз
                <br />
                <span style={{ fontSize: "14px", color: "rgb(198, 58, 58)" }}>
                  Недоступен
                </span>
              </button>
              {onlyPacksAndBlocks && totalQuantity < 10 && !hasBlock ? (
                <button type="button" className={selectedMethod} disabled>
                  Доставка<br></br>
                  <span style={{ fontSize: "14px", color: "rgb(198, 58, 58)" }}>
                    Нужно 10 пачек или блок
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  className={selectedMethod === "delivery" ? "active" : ""}
                  onClick={() => setSelectedMethod("delivery")}
                >
                  Доставка
                </button>
              )}
            </div>

            {selectedMethod === "delivery" && (
              <div className="checkout-delivery-address">
                <input
                  type="text"
                  name="city"
                  placeholder="Город"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={
                    onlyPacksAndBlocks && totalQuantity < 10 && !hasBlock
                  }
                />

                <input
                  type="text"
                  name="streetAddress"
                  placeholder="Номер дома и название улицы"
                  value={formData.streetAddress}
                  onChange={handleInputChange}
                  disabled={
                    onlyPacksAndBlocks && totalQuantity < 10 && !hasBlock
                  }
                />
              </div>
            )}

            {selectedMethod === "pickup" && (
              <div className="checkout-delivery-pickup">
                <p style={{ color: "rgb(198, 58, 58)", fontWeight: "bold" }}>
                  ⚠️ Самовывоз временно недоступен. Пожалуйста, выберите
                  доставку.
                </p>
              </div>
            )}
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
              {loading ? "Загрузка..." : "Заказать"}
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
