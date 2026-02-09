import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const { message, timestamp, type } = await request.json();

    // Папка для логов
    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Общий файл всех заказов
    const allLogFile = path.join(logsDir, "all-orders.txt");
    fs.appendFileSync(allLogFile, message + "\n");

    // Отдельный файл для успешных заказов
    if (type === "SUCCESS") {
      const successLogFile = path.join(logsDir, "success-orders.txt");
      fs.appendFileSync(successLogFile, message + "\n");
    }

    // Ежедневный лог файл
    const today = new Date().toISOString().split("T")[0];
    const dailyLogFile = path.join(logsDir, `orders-${today}.txt`);
    fs.appendFileSync(dailyLogFile, message + "\n");

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error writing log:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
