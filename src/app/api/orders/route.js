import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const orderData = await request.json();

    // Валидация обязательных полей
    if (!orderData.customer_name || !orderData.phone_number) {
      return NextResponse.json(
        {
          error: "Отсутствуют обязательные поля: customer_name и phone_number",
        },
        { status: 400 }
      );
    }

    // Отправляем заказ в основную базу данных
    const response = await fetch("http://217.198.9.128:8000/orders", {
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

    return NextResponse.json(
      {
        success: true,
        message: "Заказ успешно сохранен",
        orderId: result.id || result.order_id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving order:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Ошибка при сохранении заказа",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "API для работы с заказами" },
    { status: 200 }
  );
}
