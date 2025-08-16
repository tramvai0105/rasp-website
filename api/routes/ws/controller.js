import { getPixels, updatePixels, savePixels } from "../../state.js"

// Хранилище всех активных подключений
const clients = new Set();

export default function wsController(ws, req) {

    if (!clients.has(ws)) {
        clients.add(ws);
        console.log(`Новое подключение. Всего клиентов: ${clients.size}`);
    }
    // Обработка сообщений от клиента
    ws.on('message', async (message) => {
        let msg = JSON.parse(message);
        switch (msg.action) {
            case "getPixels":
                let pixels = getPixels();
                msg.data = pixels;
                ws.send(JSON.stringify(msg));
                break;
            case "paint":
                const updatePixelsData = await updatePixels(msg.data);
                msg.data = updatePixelsData.pixels;
                broadcast({ action: "pixelsUpdate", data: msg.data }); // Рассылаем всем
                break;
        }
    });

    // Обработка закрытия соединения
    ws.on('close', () => {
        clients.delete(ws);
        console.log('Соединение закрыто');
    });

    // Функция рассылки сообщения всем клиентам
    function broadcast(message) {
        const jsonMsg = JSON.stringify(message);
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(jsonMsg);
            }
        });
    }
}