// app/api/orders/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

const normalizePhone = (p) => (p || "").replace(/\D/g, "");

export async function POST(request) {
  try {
    const orderData = await request.json();

    if (!orderData.customer_name || !orderData.phone_number) {
      return NextResponse.json(
        {
          error: "Отсутствуют обязательные поля: customer_name и phone_number",
        },
        { status: 400 },
      );
    }

    // Нормализуем телефон к виду +71111111111
    const digits = normalizePhone(orderData.phone_number);
    const phoneE164 = `+${digits}`;
    orderData.phone_number = phoneE164;

    // Считаем, сколько заказов УЖЕ есть с этим телефоном
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS cnt FROM Orders WHERE phone_number = ?",
      [phoneE164],
    );
    const previous = Number(rows?.[0]?.cnt ?? 0);

    // ВАЖНО: игнорируем то, что пришло с фронта
    const is_first_order = previous === 0 ? 1 : 0;
    orderData.is_first_order = is_first_order;

    // Дальше сохраняй куда тебе нужно (если у тебя внешний сервис всё же нужен)
    const response = await fetch("http://217.198.9.128:8000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Database error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();

    return NextResponse.json(
      {
        success: true,
        message: "Заказ успешно сохранен",
        orderId: result.id || result.order_id,
        is_first_order,
        previous_orders_count: previous,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при сохранении заказа",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
