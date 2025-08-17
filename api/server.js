import express from 'express'
import expressWs from 'express-ws';
import applyWebSocketRoute from './routes/ws/index.js';
import applyPaintMeAPictureRoute from './routes/paintmeapicture/index.js';
import applyCommonRoute from './routes/c/index.js';
import cors from "cors";

const port = process.env.PORT || 3000

// Create http server
const app = express()
expressWs(app); // Расширяем Express для поддержки WebSocket
app.use(express.json());

// WS allow from 5173 middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Разрешить запросы с Svelte-клиента
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  next();
});

app.use(cors({
  origin: 'http://localhost:5173', // разрешить только этот домен
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // разрешенные методы
  allowedHeaders: ['Content-Type', 'Authorization'] // разрешенные заголовки
}));

applyWebSocketRoute(app);
applyPaintMeAPictureRoute(app);
applyCommonRoute(app);

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`)
})