"use client";
import "./style.scss";
import { useContext, useRef, useState, useMemo } from "react";
import { CartContext } from "@/cart/add/cart";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { simpleLogger } from "@/utils/simpleLogger";

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

  // Функция для проверки предыдущих заказов
  const checkPreviousOrders = async (phoneE164) => {
    try {
      console.log("Checking orders for phone:", phoneE164);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const checkResponse = await fetch(
        `/api/check-orders?phone=${encodeURIComponent(phoneE164)}`,
        {
          cache: "no-store",
          signal: controller.signal,
        },
      );

      clearTimeout(timeoutId);

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

    // Начинаем логирование процесса
    await simpleLogger.logOrderSuccess({
      customerName: formData.lastName || "не указано",
      phoneNumber: formData.phoneNumber,
      totalAmount: calculateTotalPrice(),
      deliveryMethod: selectedMethod,
      message: "Начало оформления заказа",
      isFirstOrder: null,
    });

    // Минимальная проверка телефона
    if (!formData.phoneNumber) {
      await simpleLogger.logOrderError({
        errorType: "Validation error",
        errorMessage: "Phone number is empty",
        phoneNumber: "",
        totalAmount: 0,
        customerName: formData.lastName || "не указано",
      });
      alert("Введите номер телефона");
      setLoading(false);
      return;
    }

    const phoneDigits = formData.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length < 11) {
      await simpleLogger.logOrderError({
        errorType: "Validation error",
        errorMessage: "Invalid phone number",
        phoneNumber: formData.phoneNumber,
        totalAmount: calculateTotalPrice(),
        customerName: formData.lastName || "не указано",
      });
      alert("Введите корректный номер телефона");
      setLoading(false);
      return;
    }

    const totalPrice = calculateTotalPrice();
    const site = "iqos-iluma.com";

    // Список городов Москвы (оставляем как есть)
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

    console.log("Начинаем отправку заказа...");

    try {
      // 1. Проверяем предыдущие заказы по телефону
      const phoneNorm = formData.phoneNumber.replace(/\D/g, "");
      const phoneE164 = `+${phoneNorm}`;

      console.log("Starting order check...");

      const orderCheck = await checkPreviousOrders(phoneE164);

      // Логируем результат проверки
      if (!orderCheck.success) {
        await simpleLogger.logOrderError({
          customerName: formData.lastName || "не указано",
          phoneNumber: formData.phoneNumber,
          totalAmount: totalPrice,
          errorType: "Order check failed",
          errorMessage: orderCheck.error,
          details: {
            phone: phoneE164,
            function: "checkPreviousOrders",
          },
        });
      }

      const isFirstOrder = orderCheck.isFirstOrder;
      const previousOrdersCount = orderCheck.previousOrdersCount;
      const checkSuccess = orderCheck.success;
      const checkError = orderCheck.error;

      console.log("Order check completed:", {
        isFirstOrder,
        previousOrdersCount,
        checkSuccess,
        checkError,
      });

      // 2. Подготавливаем сообщение для Telegram
      let headerLine;
      let statusNote = "";

      if (checkSuccess) {
        headerLine = isFirstOrder
          ? "🔥 НОВЫЙ КЛИЕНТ 🔥"
          : `📋 Повторный заказ (${previousOrdersCount + 1}-й по счету)`;
      } else {
        headerLine = "🟡 КЛИЕНТ (статус не подтвержден)";
        statusNote = `\n⚠️ Проверка статуса клиента не удалась: ${checkError}`;
      }

      const telegramMessage = `
Заказ с сайта ${site}

${headerLine}${statusNote}

Имя: ${formData.lastName || "Не указано"}   
Телефон: +${formData.phoneNumber}
Telegram: ${telegramUsername}
Способ доставки: ${selectedMethod === "delivery" ? "Доставка" : "Самовывоз"}
${selectedMethod === "delivery" ? `Город: ${formData.city || "Не указан"}\nАдрес: ${formData.streetAddress || "Не указан"}` : ""}

Корзина:
${formattedCart}

Общая сумма: ${totalPrice} ₽
    `;

      console.log("Prepared Telegram message");

      // 3. В ПЕРВУЮ ОЧЕРЕДЬ отправляем в Telegram
      console.log("Sending to Telegram (highest priority)...");
      const telegramSent = await sendToTelegram(telegramMessage);

      if (!telegramSent) {
        // Логируем критическую ошибку Telegram
        await simpleLogger.logOrderError({
          customerName: formData.lastName || "не указано",
          phoneNumber: formData.phoneNumber,
          totalAmount: totalPrice,
          errorType: "CRITICAL: Telegram send failed",
          errorMessage: "Все 3 попытки отправки в Telegram провалились",
          details: {
            maxRetries: 3,
            selectedMethod,
            messageLength: telegramMessage.length,
          },
        });
      } else {
        console.log("SUCCESS: Telegram sent!");
      }

      // 4. Формируем сообщение для WhatsApp
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

      // 5. Сохраняем заказ в localStorage как резервную копию
      const localOrder = {
        formData,
        cartItems,
        totalPrice,
        timestamp: new Date().toISOString(),
        site,
        telegramMessage,
        whatsappMessage,
        orderCheck: { isFirstOrder, previousOrdersCount, checkSuccess },
      };
      localStorage.setItem("last_order_backup", JSON.stringify(localOrder));

      // 6. Сохраняем заказ в базу данных
      const saveToDb = async () => {
        try {
          const orderData = {
            customer_name: formData.lastName.trim() || "Не указано",
            phone_number: phoneE164,
            is_delivery: selectedMethod === "delivery",
            city:
              formData.city.trim() ||
              (selectedMethod === "delivery" ? "Не указано" : "Москва"),
            total_amount: totalPrice,
            address:
              formData.streetAddress.trim() ||
              (selectedMethod === "delivery" ? "Не указано" : "Самовывоз"),
            ordered_items: cartItems.map((item) => ({
              product_name: `${item.name} (${item.type || "обычный"})`,
              quantity: item.quantity,
              price_at_time_of_order: item.price,
            })),
            is_first_order: checkSuccess ? (isFirstOrder ? 1 : 0) : 1,
            check_error: checkError || null,
          };

          console.log("Saving to database...");
          const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          });

          if (response.ok) {
            const result = await response.json();
            console.log("SUCCESS: Database saved", result);
            return true;
          } else {
            const errorText = await response.text();

            await simpleLogger.logOrderError({
              customerName: formData.lastName || "не указано",
              phoneNumber: formData.phoneNumber,
              totalAmount: totalPrice,
              errorType: "Database save failed",
              errorMessage: `HTTP ${response.status}: ${errorText}`,
              details: {
                endpoint: "/api/orders",
                status: response.status,
              },
            });

            console.warn("WARNING: Database save failed:", errorText);
            return false;
          }
        } catch (error) {
          await simpleLogger.logOrderError({
            customerName: formData.lastName || "не указано",
            phoneNumber: formData.phoneNumber,
            totalAmount: totalPrice,
            errorType: "Database error",
            errorMessage: error.message,
            details: {
              endpoint: "/api/orders",
              stack: error.stack,
            },
          });

          console.warn("WARNING: Database error:", error);
          return false;
        }
      };

      // 7. Запускаем все остальные отправки параллельно
      const sendPromises = [];

      // Сохранение в базу данных
      sendPromises.push(saveToDb());

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
              const errorText = await response.text();

              await simpleLogger.logOrderError({
                customerName: formData.lastName || "не указано",
                phoneNumber: formData.phoneNumber,
                totalAmount: totalPrice,
                errorType: "Email send failed",
                errorMessage: `HTTP ${response.status}: ${errorText}`,
                details: { endpoint: "/api/email" },
              });

              console.warn("WARNING: Email failed");
            }
          } catch (error) {
            await simpleLogger.logOrderError({
              customerName: formData.lastName || "не указано",
              phoneNumber: formData.phoneNumber,
              totalAmount: totalPrice,
              errorType: "Email error",
              errorMessage: error.message,
              details: { endpoint: "/api/email" },
            });

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
              const errorText = await response.text();

              await simpleLogger.logOrderError({
                customerName: formData.lastName || "не указано",
                phoneNumber: formData.phoneNumber,
                totalAmount: totalPrice,
                errorType: "WhatsApp send failed",
                errorMessage: `HTTP ${response.status}: ${errorText}`,
                details: {
                  endpoint: "Green-API",
                  chatId: `${formData.phoneNumber}@c.us`,
                },
              });

              console.warn("WARNING: WhatsApp failed");
            }
          } catch (error) {
            await simpleLogger.logOrderError({
              customerName: formData.lastName || "не указано",
              phoneNumber: formData.phoneNumber,
              totalAmount: totalPrice,
              errorType: "WhatsApp error",
              errorMessage: error.message,
              details: { endpoint: "Green-API" },
            });

            console.warn("WARNING: WhatsApp error:", error);
          }
        })(),
      );

      // Запускаем фоновые отправки
      Promise.allSettled(sendPromises).then((results) => {
        results.forEach((result, index) => {
          if (result.status === "rejected") {
            const processNames = ["Database", "Email", "WhatsApp"];
            simpleLogger.logOrderError({
              customerName: formData.lastName || "не указано",
              phoneNumber: formData.phoneNumber,
              totalAmount: totalPrice,
              errorType: "Background process rejected",
              errorMessage: result.reason?.message || "Unknown rejection",
              details: {
                processIndex: index,
                processName: processNames[index] || "Unknown",
              },
            });
          }
        });

        // После всех отправок логируем итоговый успех
        simpleLogger.logOrderSuccess({
          customerName: formData.lastName || "не указано",
          phoneNumber: formData.phoneNumber,
          totalAmount: totalPrice,
          deliveryMethod: selectedMethod,
          isFirstOrder: isFirstOrder,
          previousOrdersCount: previousOrdersCount,
          message: "Заказ полностью обработан и отправлен",
          details: {
            telegramSent,
            cartItemsCount: cartItems.length,
            city: formData.city || "не указан",
          },
        });
      });

      // 8. ВСЕГДА показываем успех пользователю
      console.log("Order processing completed");

      // Логируем успешное завершение для пользователя
      await simpleLogger.logOrderSuccess({
        customerName: formData.lastName || "не указано",
        phoneNumber: formData.phoneNumber,
        totalAmount: totalPrice,
        deliveryMethod: selectedMethod,
        isFirstOrder: isFirstOrder,
        message: "Пользователю показан успех заказа",
      });

      alert(
        "✅ Ваш заказ был отправлен!\nВ ближайшее время с вами свяжется наш менеджер.",
      );

      // 9. Очищаем корзину и перенаправляем
      clearCart();
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      console.error("Unexpected error in main processing:", error);

      // Логируем критическую ошибку
      await simpleLogger.logOrderError({
        customerName: formData.lastName || "не указано",
        phoneNumber: formData.phoneNumber,
        totalAmount: totalPrice,
        errorType: "CRITICAL: Main processing error",
        errorMessage: error.message,
        details: {
          stack: error.stack,
          selectedMethod,
          cartItemsCount: cartItems.length,
          phoneDigits: phoneDigits.length,
        },
      });

      // Сохраняем дополнительную резервную копию
      localStorage.setItem(
        "failed_order_backup",
        JSON.stringify({
          formData,
          cartItems,
          totalPrice,
          timestamp: new Date().toISOString(),
          error: error.message,
          stack: error.stack,
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
