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

    // Валидация только телефона
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

    // Валидация только Telegram (если указан)
    if (
      formData.telegram.trim() &&
      !/^[@a-zA-Z0-9_]{5,32}$/.test(formData.telegram.replace(/^@/, ""))
    ) {
      newErrors.telegram = "Некорректный формат Telegram username";
    }

    // Убрана валидация имени, города, адреса и согласия с политикой

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let isValid = true;

    if (name === "telegram") {
      // Разрешаем латиницу, цифры, нижние подчеркивания и символ @ в начале
      isValid = /^@?[a-zA-Z0-9_]*$/.test(value);
    } else if (name === "lastName") {
      isValid = /^[a-zA-Zа-яА-ЯёЁ0-9\s-]*$/.test(value);
    } else if (name === "city") {
      isValid = /^[а-яА-ЯёЁ0-9\s-]*$/.test(value);
    } else if (name === "streetAddress") {
      isValid = /^[а-яА-ЯёЁ0-9\s-]*$/.test(value);
    }

    if (isValid) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Очищаем ошибку при вводе
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

  // Функция для сохранения заказа в базу данных
  const saveOrderToDatabase = async (orderData) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Database error: ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log("Order saved to database:", result);
      return result;
    } catch (error) {
      console.error("Error saving order to database:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Минимальная валидация - только телефон
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

    // Форматируем Telegram username (добавляем @ если его нет)
    const telegramUsername = formData.telegram.trim()
      ? formData.telegram.startsWith("@")
        ? formData.telegram
        : `@${formData.telegram}`
      : "не указан";

    // Формируем сообщение в зависимости от города
    let mess = "";
    const isMoscowCity = moscowCities.some((city) =>
      (formData.city || "").toLowerCase().includes(city.toLowerCase()),
    );

    if (selectedMethod === "pickup") {
      mess = `Добрый день!\n\nПолучили ваш заказ ✅\n\nс сайта ${site} ✅\n\nНаш адрес для самовывоза:\nГ.Москва\n\nРимского-Корсакова 11к8\nОриентир пункт «OZON»\n\nОплата наличными ❗️❗️\n\nВажно❗️❗️\nНеобходимо заранее согласовать дату и приблизительное время приезда.\nПри желании, можем отправить ваш заказ Яндекс курьером или Доставистой. В таком случае, оплатить заказ необходимо переводом на карту.\n\nКорзина:\n${formattedCart}\n\nИмя: ${formData.lastName || "Не указано"}\nТелефон: +${formData.phoneNumber}\nTelegram: ${telegramUsername}`;
    } else if (selectedMethod === "delivery" && isMoscowCity) {
      mess = `Здравствуйте!\n\nПолучили ваш заказ с сайта ${site} ✅\n\nЗаказы отправляем через Яндекс или Достависту, предварительно согласовав с вами стоимость доставки. Оплата за заказ - переводом на карту.\n\nМожем отправить в любое удобное для Вас время.\n\n❗️Первый заказ можно оплатить при получении курьеру Достависты (в пределах МКАД)\n\nКогда Вам было бы удобно принять заказ? 😊\n\nКорзина:\n${formattedCart}\n\nАдрес:\nГород: ${formData.city || "Не указан"}\nАдрес: ${formData.streetAddress || "Не указан"}\n\nКонтактные данные:\nИмя: ${formData.lastName || "Не указано"}\nТелефон: +${formData.phoneNumber}\nTelegram: ${telegramUsername}`;
    } else if (selectedMethod === "delivery") {
      mess = `Здравствуйте!\nПолучили ваш заказ с сайта ${site} ✅\n\nВ регионы отправляем через CDEK. Процесс следующий:\n\nВысылаем фото вашего заказа и накладную Cdek (отправка по договору, тарифы минимальные, доставка будет оплачена нами сразу и включена в общий счет).\nВысылаем вам реквизиты для оплаты.\n\nВсе посылки отправляются в день заказа.\nОтправка из Москвы ❗️\nНаложенным платежом не отправляем ❌❌❌\n\nОт Вас нужны след данные:\n\nФИО\nАдрес ближ ПВЗ СДЭК\n\nКорзина:\n${formattedCart}\n\nКонтактные данные:\nИмя: ${formData.lastName || "Не указано"}\nТелефон: +${formData.phoneNumber}\nTelegram: ${telegramUsername}\nАдрес доставки:\nГород: ${formData.city || "Не указан"}\nАдрес: ${formData.streetAddress || "Не указан"}`;
    }

    try {
      // Сохраняем заказ локально на случай сбоя
      const localOrder = {
        formData,
        cartItems,
        totalPrice,
        timestamp: new Date().toISOString(),
        site,
      };
      localStorage.setItem("last_order_backup", JSON.stringify(localOrder));

      // Основное сообщение для Telegram/Email
      const message = `
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

      // Функция для отправки с повторными попытками
      const sendWithRetry = async (sendFn, serviceName, maxRetries = 3) => {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            console.log(`${serviceName}: попытка ${attempt} из ${maxRetries}`);
            const result = await sendFn();
            console.log(`${serviceName}: успешно отправлено`);
            return { success: true, service: serviceName, attempt };
          } catch (error) {
            console.error(
              `${serviceName}: ошибка на попытке ${attempt}:`,
              error,
            );
            if (attempt === maxRetries) {
              return {
                success: false,
                service: serviceName,
                error: error.message,
              };
            }
            // Ждем перед следующей попыткой (1s, 2s, 4s)
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)),
            );
          }
        }
        return {
          success: false,
          service: serviceName,
          error: "Все попытки провалились",
        };
      };

      // Отправляем во ВСЕ каналы параллельно
      const sendPromises = [];

      // 1. Telegram
      sendPromises.push(
        sendWithRetry(async () => {
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
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status: ${response.status}, ${errorText}`);
          }
          return await response.json();
        }, "Telegram"),
      );

      // 2. Email
      sendPromises.push(
        sendWithRetry(async () => {
          const response = await fetch("/api/email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: message }),
          });
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status: ${response.status}, ${errorText}`);
          }
          return response;
        }, "Email"),
      );

      // 3. WhatsApp (если номер валидный)
      if (phoneDigits.length >= 11) {
        sendPromises.push(
          sendWithRetry(async () => {
            const response = await fetch(
              `https://api.green-api.com/waInstance1103290542/SendMessage/65dee4a31f1342768913a5557afc548591af648dffc44259a6`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  chatId: `${formData.phoneNumber}@c.us`,
                  message: mess,
                }),
              },
            );
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Status: ${response.status}, ${errorText}`);
            }
            return await response.json();
          }, "WhatsApp"),
        );
      }

      // Ждем результаты всех отправок
      const results = await Promise.allSettled(sendPromises);

      // Анализируем результаты
      const successfulSends = results.filter(
        (r) => r.status === "fulfilled" && r.value?.success === true,
      );

      const failedSends = results.filter(
        (r) => r.status === "fulfilled" && r.value?.success === false,
      );

      console.log("Результаты отправки:", {
        успешно: successfulSends.length,
        неудачно: failedSends.length,
        детали: results.map((r) => ({
          service: r.status === "fulfilled" ? r.value.service : "unknown",
          success: r.status === "fulfilled" ? r.value.success : false,
          error: r.status === "fulfilled" ? r.value.error : "promise rejected",
        })),
      });

      // Сохраняем в базу данных (если получится, но не критично)
      try {
        const phoneE164 = `+${phoneDigits}`;
        const orderData = {
          customer_name: formData.lastName || "Не указано",
          phone_number: phoneE164,
          is_delivery: selectedMethod === "delivery",
          city:
            formData.city ||
            (selectedMethod === "delivery" ? "Не указано" : "Москва"),
          total_amount: totalPrice,
          address:
            formData.streetAddress ||
            (selectedMethod === "delivery" ? "Не указано" : "Самовывоз"),
          ordered_items: cartItems.map((item) => ({
            product_name: `${item.name} (${item.type || "обычный"})`,
            quantity: item.quantity,
            price_at_time_of_order: item.price,
          })),
          is_first_order: 1,
          channels_sent: successfulSends.map((s) =>
            s.status === "fulfilled" ? s.value.service : "unknown",
          ),
          timestamp: new Date().toISOString(),
        };

        const dbResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        if (dbResponse.ok) {
          console.log("Заказ сохранен в базу данных");
        } else {
          console.log("Заказ не сохранен в базу (но это не критично)");
        }
      } catch (dbError) {
        console.error("Ошибка при сохранении в базу:", dbError);
        // Продолжаем, даже если база не сохранилась
      }

      // Проверяем, отправилось ли хотя бы в один канал
      if (successfulSends.length > 0) {
        console.log(
          `Заказ успешно отправлен в ${successfulSends.length} канал(ов)`,
        );
        alert(
          "Ваш заказ был отправлен!\nВ ближайшее время с вами свяжется наш менеджер.",
        );
      } else {
        console.warn("Заказ не отправлен ни в один канал");
        // Сохраняем заказ для ручной отправки
        localStorage.setItem(
          "failed_order",
          JSON.stringify({
            message,
            mess,
            timestamp: new Date().toISOString(),
            phone: formData.phoneNumber,
          }),
        );
        alert(
          "Заказ сохранен! С вами свяжутся в ближайшее время для подтверждения.",
        );
      }

      // Перенаправляем на главную и очищаем корзину
      window.location.href = "/";
      clearCart();
    } catch (error) {
      console.error("Критическая ошибка при обработке заказа:", error);

      // Сохраняем заказ для последующей обработки
      localStorage.setItem(
        "failed_order",
        JSON.stringify({
          formData,
          cartItems,
          totalPrice,
          timestamp: new Date().toISOString(),
          error: error.message,
        }),
      );

      alert(
        "Заказ сохранен! С вами свяжутся в ближайшее время для подтверждения.",
      );
      window.location.href = "/";
      clearCart();
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
                // Если поле пустое или не начинается с @, добавляем @
                const value = formData.telegram;
                if (!value.startsWith("@")) {
                  setFormData((prev) => ({
                    ...prev,
                    telegram: "@" + (value || ""),
                  }));

                  // Устанавливаем курсор после @
                  setTimeout(() => {
                    e.target.setSelectionRange(1, 1);
                  }, 0);
                }
              }}
              onBlur={(e) => {
                // Если только @, очищаем поле
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
                {errors.city && (
                  <p className="error" style={{ color: "red" }}>
                    {errors.city}
                  </p>
                )}

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
                {errors.streetAddress && (
                  <p className="error" style={{ color: "red" }}>
                    {errors.streetAddress}
                  </p>
                )}
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
            {/* Убрана секция с чекбоксом согласия */}
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
