// Простой логгер в txt файл
export const simpleLogger = {
  // Логирование ошибок заказов
  async logOrderError(errorData) {
    try {
      const logEntry = this.formatLogEntry(errorData);

      // Отправляем на сервер для сохранения в файл
      await fetch("/api/log-error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: logEntry,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {
        // Если сервер недоступен, сохраняем локально
        this.saveToLocalStorage(logEntry);
      });

      // Также сохраняем в localStorage как резерв
      this.saveToLocalStorage(logEntry);
    } catch (error) {
      console.error("Failed to log error:", error);
    }
  },

  // Логирование успешных заказов
  async logOrderSuccess(orderData) {
    try {
      const logEntry = this.formatSuccessLog(orderData);

      await fetch("/api/log-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: logEntry,
          timestamp: new Date().toISOString(),
          type: "SUCCESS",
        }),
      }).catch(() => {
        this.saveToLocalStorage(logEntry);
      });

      this.saveToLocalStorage(logEntry);
    } catch (error) {
      console.error("Failed to log success:", error);
    }
  },

  // Форматирование лога ошибки
  formatLogEntry(data) {
    const time = new Date().toLocaleString("ru-RU");
    const phone = data.phoneNumber
      ? data.phoneNumber.substring(0, 4) + "***"
      : "не указан";
    const name = data.customerName || "не указано";
    const amount = data.totalAmount || 0;

    return `[${time}] ОШИБКА: ${data.errorType || "unknown"}
    Клиент: ${name}
    Телефон: ${phone}
    Сумма: ${amount} ₽
    Ошибка: ${data.errorMessage || "нет описания"}
    Детали: ${JSON.stringify(data.details || {})}
    ---\n`;
  },

  // Форматирование лога успеха
  formatSuccessLog(data) {
    const time = new Date().toLocaleString("ru-RU");
    const phone = data.phoneNumber
      ? data.phoneNumber.substring(0, 4) + "***"
      : "не указан";
    const name = data.customerName || "не указано";
    const amount = data.totalAmount || 0;
    const method =
      data.deliveryMethod === "delivery" ? "Доставка" : "Самовывоз";

    return `[${time}] УСПЕШНЫЙ ЗАКАЗ ✅
    Клиент: ${name}
    Телефон: ${phone}
    Способ: ${method}
    Сумма: ${amount} ₽
    Статус: ${data.isFirstOrder ? "Новый клиент" : "Повторный заказ"}
    ---\n`;
  },

  // Сохранение в localStorage как резерв
  saveToLocalStorage(logEntry) {
    try {
      // Храним последние 50 логов
      const logs = JSON.parse(localStorage.getItem("backup_logs") || "[]");
      logs.push({
        entry: logEntry,
        timestamp: new Date().toISOString(),
      });

      if (logs.length > 50) {
        logs.shift(); // Удаляем старый лог
      }

      localStorage.setItem("backup_logs", JSON.stringify(logs));
    } catch (error) {
      console.error("LocalStorage save failed:", error);
    }
  },
};
