// server/state.js
import fs from 'node:fs/promises';
import path from 'path';
import publisher from './mqtt/publisher.js';
import db from './data/db.js';

const PIXELS_FILE_PATH = path.resolve('data', 'pixels.json'); // Путь к файлу данных
const HISTORY_FILE_PATH = path.resolve('data', 'history.json');
let pixels;
let history = [];

// Загружаем пиксели из файла при старте
async function loadPixels() {
  try {
    // const data = await fs.readFile(PIXELS_FILE_PATH, 'utf-8');
    const data = await db.getCurrentPixels();
    pixels = data.colors;
    console.log('Loaded pixels from file');
  } catch (error) {
    console.log(error);
    console.log('No saved pixels, using default');
  }
}

let isSaving = false;
let lastSaveTime = 0;
const SAVE_INTERVAL = 1000; // 1 секунда между сохранениями

async function savePixels() {
  const now = Date.now();
  if (isSaving || now - lastSaveTime < SAVE_INTERVAL) {
    return; // Пропускаем вызов, если сохранение уже идёт или интервал не прошёл
  }

  isSaving = true;
  lastSaveTime = now;

  try {
    await db.updateCurrentPixels(pixels);
    console.log('Pixels saved at', new Date().toISOString());
  } catch (error) {
    console.error('Save error:', error);
  } finally {
    isSaving = false;
  }
}

// Загружаем историю из файла при старте
async function loadHistory() {
  try {
    // const data = await fs.readFile(HISTORY_FILE_PATH, 'utf-8');
    const data = await db.getAllHistory();
    history = data;
    console.log('Loaded history from file');
  } catch (error) {
    console.log('No saved history, using default');
  }
}

async function saveHistory() {
  try {
    await db.addHistoryRecord(history[history.length - 1].data);
  } catch (error) {
    console.log("Error while saving history")
  }
}

// Геттер и сеттер
const getPixels = () => pixels;
let lastUpdateTime = 0;
const updateThrottle = 100; // Минимальная задержка между обновлениями (мс)
let updateTimeout = null;
const updatePixels = async (_pixels) => {
  pixels = _pixels;
  if(publisher.connectionStatus != "connected"){
    return {pixels};
  }
  const now = Date.now();
  const timeSinceLastUpdate = now - lastUpdateTime;

  // Отменяем предыдущий отложенный вызов, если есть
  if (updateTimeout) {
    clearTimeout(updateTimeout);
    updateTimeout = null;
  }

  // Немедленная публикация, если прошло достаточно времени
  if (timeSinceLastUpdate >= updateThrottle) {
    try {
      await publisher.publish(pixels);
      lastUpdateTime = now;
    } catch (err) {
      console.error('Failed to publish pixels:', err);
      // Запланировать повторную попытку
      updateTimeout = setTimeout(() => updatePixels(pixels), updateThrottle);
    }
  } else {
    // Отложенная публикация
    updateTimeout = setTimeout(async () => {
      try {
        await publisher.publish(pixels);
        lastUpdateTime = Date.now();
      } catch (err) {
        console.error('Failed to publish pixels (delayed):', err);
      }
      updateTimeout = null;
    }, updateThrottle - timeSinceLastUpdate);
  }

  return { pixels };
};
const getHistory = () => history;
const appendHistory = (fragment) => {
  history.push(fragment);
}
const updateHistoryStatus = async (id, status, time) => {
  history = history.map((v) => { v.id == id ? time ? { ...v, status: status, publishedAt: time } : { ...v, status: status } : v })
  if(status == "published"){
    saveHistory();
  }
}


export { getPixels, updatePixels, savePixels, getHistory, appendHistory, updateHistoryStatus, saveHistory };

// Инициализация
loadPixels();
loadHistory();