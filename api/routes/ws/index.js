import wsController from "./controller.js";

export default function applyWebSocketRoute(app) {
    // WebSocket-роут
    app.ws('/ws', wsController);
}