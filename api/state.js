// server/state.js
import fs from 'node:fs/promises';
import path from 'path';
import publisher from './mqtt/publisher.js';

const PIXELS_FILE_PATH = path.resolve('data', 'pixels.json'); // Путь к файлу данных
const HISTORY_FILE_PATH = path.resolve('data', 'history.json');
let pixels;
let history = [];

// Загружаем пиксели из файла при старте
async function loadPixels() {
  try {
    const data = await fs.readFile(PIXELS_FILE_PATH, 'utf-8');
    pixels = JSON.parse(data);
    console.log('Loaded pixels from file');
  } catch (error) {
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
    await fs.promises.writeFile(PIXELS_FILE_PATH, JSON.stringify(pixels));
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
    const data = await fs.readFile(HISTORY_FILE_PATH, 'utf-8');
    history = JSON.parse(data);
    console.log('Loaded history from file');
  } catch (error) {
    console.log('No saved history, using default');
  }
}

async function saveHistory() {
  try {
    await fs.writeFile(HISTORY_FILE_PATH, JSON.stringify(history));
  } catch (error) {
    console.log("Error while saving history")
  }
}

// Геттер и сеттер
const getPixels = () => pixels;
let lastUpdateTime = 0;
const updateThrottle = 100; // Минимальная задержка между обновлениями (мс)
let updateTimeout = null;
const updatePixels = (_pixels) => {
  pixels = _pixels;

  // Троттлинг публикации
  const now = Date.now();
  const timeSinceLastUpdate = now - lastUpdateTime;

  if (timeSinceLastUpdate >= updateThrottle) {
    // Если прошло достаточно времени, публикуем сразу
    publisher.publish(pixels);
    lastUpdateTime = now;
    if (updateTimeout) {
      clearTimeout(updateTimeout);
      updateTimeout = null;
    }
  } else if (!updateTimeout) {
    // Если обновление слишком частое, планируем на оставшееся время
    updateTimeout = setTimeout(() => {
      publisher.publish(pixels);
      lastUpdateTime = Date.now();
      updateTimeout = null;
    }, updateThrottle - timeSinceLastUpdate);
  }

  return { pixels: pixels };
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