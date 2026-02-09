import fs from "fs";
import path from "path";

export async function POST(request) {
  try {
    const { message, timestamp } = await request.json();

    // Папка для логов
    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    // Файл для ошибок
    const errorLogFile = path.join(logsDir, "order-errors.txt");

    // Добавляем запись в файл
    fs.appendFileSync(errorLogFile, message + "\n");

    // Также в общий лог
    const allLogFile = path.join(logsDir, "all-orders.txt");
    fs.appendFileSync(allLogFile, message + "\n");

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error writing log:", error);
    return Response.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
