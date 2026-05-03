import { NextResponse } from "next/server";
import pool from "@/lib/db"; // Ваш коннектор к БД

export async function POST(request) {
  try {
    const orderData = await request.json();

    // 1. Валидация
    if (!orderData.customer_name || !orderData.phone_number) {
      return NextResponse.json(
        { error: "Отсутствуют данные" },
        { status: 400 },
      );
    }

    // 2. Проверка истории заказов
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS cnt FROM Orders WHERE phone_number = ?",
      [orderData.phone_number],
    );
    const is_first_order = Number(rows[0].cnt) === 0 ? 1 : 0;

    // 3. ПРЯМАЯ ЗАПИСЬ В БАЗУ ДАННЫХ
    // Учитываем ваши поля: id, is_first_order, customer_name, phone_number, is_delivery, city, address, total_amount
    const query = `
      INSERT INTO Orders (
        is_first_order, customer_name, phone_number, 
        is_delivery, city, address, total_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      is_first_order,
      orderData.customer_name,
      orderData.phone_number,
      orderData.is_delivery ? 1 : 0,
      orderData.city || null,
      orderData.address || null,
      orderData.total_amount,
    ];

    const [result] = await pool.execute(query, values);

    return NextResponse.json(
      {
        success: true,
        orderId: result.insertId,
        is_first_order,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Ошибка записи в базу",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
