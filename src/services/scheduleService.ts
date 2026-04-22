import { getDB, saveDB } from '../utils/db';

export interface Schedule {
    id?: number;
    title: string;
    description?: string;
    date: string;
    startTime?: string;
    endTime?: string;
    priority?: 'low' | 'medium' | 'high';
    completed?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export const scheduleService = {
    // 获取所有日程
    getAll: (): Schedule[] => {
        const db = getDB();
        const result = db.exec('SELECT * FROM schedules ORDER BY date ASC, startTime ASC');

        if (result.length === 0) return [];

        const columns = result[0].columns;
        const values = result[0].values;

        return values.map((row: any) => {
            const schedule: any = {};
            columns.forEach((col: any, idx: any) => {
                schedule[col] = row[idx];
            });
            return schedule as Schedule;
        });
    },

    // 根据日期获取日程
    getByDate: (date: string): Schedule[] => {
        const db = getDB();
        const result = db.exec('SELECT * FROM schedules WHERE date = ? ORDER BY startTime ASC', [date]);

        if (result.length === 0) return [];

        const columns = result[0].columns;
        const values = result[0].values;

        return values.map((row: any) => {
            const schedule: any = {};
            columns.forEach((col: any, idx: any) => {
                schedule[col] = row[idx];
            });
            return schedule as Schedule;
        });
    },

    // 添加日程
    add: (schedule: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Schedule => {
        try {
            const db = getDB();
            const now = new Date().toISOString();

            console.log('Inserting schedule into database...');
            db.run(
                `INSERT INTO schedules (title, description, date, startTime, endTime, priority, completed, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    schedule.title,
                    schedule.description || null,
                    schedule.date,
                    schedule.startTime || null,
                    schedule.endTime || null,
                    schedule.priority || 'medium',
                    schedule.completed ? 1 : 0,
                    now,
                    now
                ]
            );

            saveDB();

            // 获取新插入的 ID
            const result = db.exec('SELECT last_insert_rowid() as id');
            const id = result[0]?.values[0]?.[0] as number;

            console.log('Schedule added with ID:', id);
            return { ...schedule, id, createdAt: now, updatedAt: now };
        } catch (error) {
            console.error('Error adding schedule:', error);
            throw error;
        }
    },

    // 更新日程
    update: (id: number, updates: Partial<Schedule>): Schedule => {
        const db = getDB();
        const now = new Date().toISOString();

        const fields: string[] = [];
        const values: any[] = [];

        if (updates.title !== undefined) {
            fields.push('title = ?');
            values.push(updates.title);
        }
        if (updates.description !== undefined) {
            fields.push('description = ?');
            values.push(updates.description || null);
        }
        if (updates.date !== undefined) {
            fields.push('date = ?');
            values.push(updates.date);
        }
        if (updates.startTime !== undefined) {
            fields.push('startTime = ?');
            values.push(updates.startTime || null);
        }
        if (updates.endTime !== undefined) {
            fields.push('endTime = ?');
            values.push(updates.endTime || null);
        }
        if (updates.priority !== undefined) {
            fields.push('priority = ?');
            values.push(updates.priority);
        }
        if (updates.completed !== undefined) {
            fields.push('completed = ?');
            values.push(updates.completed ? 1 : 0);
        }

        fields.push('updatedAt = ?');
        values.push(now);
        values.push(id);

        db.run(`UPDATE schedules SET ${fields.join(', ')} WHERE id = ?`, values);
        saveDB();

        // 返回更新后的日程
        const result = db.exec('SELECT * FROM schedules WHERE id = ?', [id]);
        if (result.length === 0) throw new Error('Schedule not found');

        const columns = result[0].columns;
        const row = result[0].values[0];
        const schedule: any = {};
        columns.forEach((col: any, idx: any) => {
            schedule[col] = row[idx];
        });

        return schedule as Schedule;
    },

    // 删除日程
    delete: (id: number): void => {
        const db = getDB();
        db.run('DELETE FROM schedules WHERE id = ?', [id]);
        saveDB();
    },

    // 切换完成状态
    toggleComplete: (id: number): Schedule => {
        const db = getDB();
        const result = db.exec('SELECT completed FROM schedules WHERE id = ?', [id]);

        if (result.length === 0) throw new Error('Schedule not found');

        const currentCompleted = result[0].values[0][0];
        const newCompleted = currentCompleted ? 0 : 1;

        return scheduleService.update(id, { completed: newCompleted === 1 });
    }
};
