import sqlite3 from "sqlite3";
const sql = sqlite3.verbose();

class DB {
    constructor(dbPath = ':memory:') {
        this.db = new sql.Database(dbPath);
        // Инициализация таблиц
        // this.initTables();
    }

    initTables() {
        this.db.serialize(() => {
            this.db.run(`
                CREATE TABLE IF NOT EXISTS pixels (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    board_id TEXT DEFAULT 'main',
                    colors TEXT NOT NULL,
                    is_current BOOLEAN DEFAULT TRUE
                )
            `);

            this.db.run(`
                CREATE TABLE IF NOT EXISTS history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    pixels_id INTEGER NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (pixels_id) REFERENCES pixels(id)
            `);
        });
    }



    // 1. Получить текущую запись пикселей
    getCurrentPixels() {
        return new Promise((resolve, reject) => {
            this.db.get(
                "SELECT * FROM pixels WHERE is_current = TRUE LIMIT 1",
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row ? { ...row, colors: JSON.parse(row.colors) } : null);
                }
            );
        });
    }

    updateCurrentPixels(colors) {
        return new Promise((resolve, reject) => {
            this.db.run(
                "UPDATE pixels SET colors = ?, is_current = TRUE WHERE is_current = TRUE",
                [JSON.stringify(colors)],
                function (err) {
                    if (err) reject(err);
                    else resolve(this.changes); // Количество обновленных строк
                }
            );
        });
    }

    addHistoryRecord(pixels) {
        return new Promise((resolve, reject) => {
            // Сохраняем ссылку на db
            const db = this.db;

            this.db.run(
                "INSERT INTO pixels (colors, is_current) VALUES (?, FALSE)",
                [JSON.stringify(pixels)],
                function (err) {
                    if (err) return reject(err);

                    // this.lastID - от Statement
                    const pixelsId = this.lastID;

                    // Используем сохранённую ссылку на db
                    db.run(
                        "INSERT INTO history (pixels_id) VALUES (?)",
                        [pixelsId],
                        function (err) {
                            if (err) reject(err);
                            else resolve(this.lastID); // this от нового Statement
                        }
                    );
                }
            );
        });
    }

    // 4. Получить все записи истории
    getAllHistory() {
        return new Promise((resolve, reject) => {
            this.db.all(
                `SELECT h.*, p.colors 
                 FROM history h
                 JOIN pixels p ON h.pixels_id = p.id
                 ORDER BY h.created_at DESC`,
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows.map(row => ({
                        ...row,
                        data: JSON.parse(row.colors)
                    })));
                }
            );
        });
    }

    // Закрытие соединения
    close() {
        this.db.close();
    }
}
const db = new DB("data.db");
export default db;