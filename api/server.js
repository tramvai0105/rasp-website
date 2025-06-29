import express from 'express'
import expressWs from 'express-ws';
import applyWebSocketRoute from './routes/ws/index.js';
import applyPaintMeAPictureRoute from './routes/paintmeapicture/index.js';

const port = process.env.PORT || 3000

// Create http server
const app = express()
expressWs(app); // Расширяем Express для поддержки WebSocket

// WS allow from 5173 middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Разрешить запросы с Svelte-клиента
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

applyWebSocketRoute(app);
applyPaintMeAPictureRoute(app);

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})