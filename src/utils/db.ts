let db: any = null;

export const initDB = async (): Promise<any> => {
    if (db) return db;

    try {
        console.log('Initializing database...');

        // 动态加载 sql.js
        const initSqlJs = await new Promise<any>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
            script.onload = () => {
                const win = window as any;
                if (win.initSqlJs) {
                    resolve(win.initSqlJs);
                } else {
                    reject(new Error('initSqlJs not found on window'));
                }
            };
            script.onerror = () => reject(new Error('Failed to load sql.js from CDN'));
            document.head.appendChild(script);
        });

        const SqlJs = await initSqlJs({
            locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });

        // 从 localStorage 加载或创建新数据库
        const savedDb = localStorage.getItem('scheduler_db');
        if (savedDb) {
            try {
                const uint8Array = new Uint8Array(JSON.parse(savedDb));
                db = new SqlJs.Database(uint8Array as any);
                console.log('Loaded existing database from localStorage');
            } catch (e) {
                console.warn('Failed to load database from localStorage, creating new one', e);
                db = new SqlJs.Database();
            }
        } else {
            db = new SqlJs.Database();
            console.log('Created new database');
        }

        // 创建日程表
        db.run(`
        CREATE TABLE IF NOT EXISTS schedules (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          date TEXT NOT NULL,
          startTime TEXT,
          endTime TEXT,
          priority TEXT DEFAULT 'medium',
          completed BOOLEAN DEFAULT 0,
          createdAt TEXT DEFAULT (datetime('now')),
          updatedAt TEXT DEFAULT (datetime('now'))
        )
      `);

        saveDB();
        console.log('Database initialized successfully');
        return db;
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
};

export const saveDB = () => {
    if (!db) return;
    const data = db.export();
    const arr: number[] = [];
    for (let i = 0; i < data.length; i++) {
        arr.push(data[i]);
    }
    localStorage.setItem('scheduler_db', JSON.stringify(arr));
};

export const getDB = (): any => {
    if (!db) {
        throw new Error('Database not initialized. Call initDB() first.');
    }
    return db;
};
