// db-init.js
import fs from 'fs';
import sqlite3 from 'sqlite3';
const sql = sqlite3.verbose();

const DB_FILE = 'data.db';

if (!fs.existsSync(DB_FILE)) {
    console.log('Creating new database file...');
    const db = new sql.Database(DB_FILE);

    db.serialize(() => {
        // 1. Создаём таблицы (IF NOT EXISTS для идемпотентности)
        db.run(`
            CREATE TABLE IF NOT EXISTS pixels (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            board_id TEXT DEFAULT 'main',
            colors TEXT NOT NULL,
            is_current BOOLEAN DEFAULT TRUE
            );
        `);

        db.run(`
            CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pixels_id INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (pixels_id) REFERENCES pixels(id)
            );
        `);

        // 2. Проверяем, есть ли уже текущие пиксели
        db.get(`SELECT id FROM pixels WHERE is_current = TRUE LIMIT 1;`, (err, row) => {
            
            if (err) return console.error("Check error:", err);

            // 3. Если текущих нет - вставляем начальные данные
            if (!row) {
                db.run(
                    `INSERT INTO pixels (colors, is_current) VALUES (?, TRUE);`,
                    [JSON.stringify((new Array(256)).fill("#ffffff"))],
                    function (err) {
                        if (err) console.error("Insert error:", err);
                        else console.log("Initial pixels inserted, ID:", this.lastID);
                    }
                );
            } else {
                db.close();
            }
        });
    });
}