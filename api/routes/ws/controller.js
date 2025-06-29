import { getPixels, updatePixels, savePixels } from "../../state.js"

// Хранилище всех активных подключений
const clients = new Set();

export default function wsController(ws, req) {

    if (!clients.has(ws)) {
        clients.add(ws);
        console.log(`Новое подключение. Всего клиентов: ${clients.size}`);
    }
    // Обработка сообщений от клиента
    ws.on('message', (message) => {
        let msg = JSON.parse(message);
        console.log(msg)
        switch (msg.action) {
            case "getPixels":
                let pixels = getPixels();
                msg.data = pixels;
                ws.send(JSON.stringify(msg));
                break;
            case "paint":
                updatePixels(msg.data);
                broadcast({ action: "pixelsUpdate", data: msg.data }); // Рассылаем всем
                break;
        }
    });

    // Обработка закрытия соединения
    //     ws.on('close', () => {
    //         console.log('Соединение закрыто');
    //     });

    // Функция рассылки сообщения всем клиентам
    function broadcast(message) {
        const jsonMsg = JSON.stringify(message);
        console.log(clients);
        clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(jsonMsg);
            }
        });
    }
}