// server/state.js
import fs from 'fs/promises';
import path from 'path';
import generateInterpolatedImage from './utils/picture.js';

const PIXELS_FILE_PATH = path.resolve('data', 'pixels.json'); // Путь к файлу данных
const PICTURE_FILE_PATH = path.resolve('data', 'picture.json'); // Путь к файлу данных
let isSaving = false; // Флаг для защиты от частых сохранений
let pixels;
let pictureCanvas;

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

// Асинхронно сохраняем пиксели в файл (с троттлингом)
async function savePixels() {
  if (isSaving) return;
  isSaving = true;

  try {
    await fs.writeFile(PIXELS_FILE_PATH, JSON.stringify(pixels));
    console.log('Pixels saved');
  } catch (error) {
    console.error('Save error:', error);
  } finally {
    isSaving = false;
  }
}

// Геттер и сеттер
const getPixels = () => pixels;
const updatePixels = async (_pixels) => {
  pixels = _pixels;
  // pictureCanvas = generateInterpolatedImage(_pixels, 16, 16, 460, 460)
  return {pixels: pixels, picture: pictureCanvas}
};

// Загружаем пиксели из файла при старте
async function loadPicture() {
  try {
    const data = await fs.readFile(PICTURE_FILE_PATH, 'utf-8');
    pictureCanvas = JSON.parse(data);
    console.log('Loaded picture from file');
  } catch (error) {
    console.log('No saved picture, using default');
  }
}

// Асинхронно сохраняем пиксели в файл (с троттлингом)
async function savePicture() {
  if (isSaving) return;
  isSaving = true;
  try {
    await fs.writeFile(PICTURE_FILE_PATH, JSON.stringify(pictureCanvas));
    console.log('Picture saved');
  } catch (error) {
    console.error('Save error:', error);
  } finally {
    isSaving = false;
  }
}

// Геттер и сеттер
const getPicture = () => {
  if (pictureCanvas.lenght == 0) { picture = generateInterpolatedImage(pixels, 16, 16, 460, 460) }
  return pictureCanvas
};

export { getPixels, updatePixels, savePixels, getPicture };

// Инициализация
loadPixels();
loadPicture();