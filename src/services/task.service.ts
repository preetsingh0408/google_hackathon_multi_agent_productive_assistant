import { db } from "../db/client.js";
import type { TaskRecord, TaskStatus } from "../types.js";

export function createTask(input: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
}): TaskRecord {
    const createdAt = new Date().toISOString();

    const result = db
        .prepare(
            `
      INSERT INTO tasks (title, description, status, priority, due_date, created_at)
      VALUES (?, ?, 'pending', ?, ?, ?)
    `,
        )
        .run(
            input.title,
            input.description ?? null,
            input.priority ?? null,
            input.dueDate ?? null,
            createdAt,
        );

    return db
        .prepare(`SELECT * FROM tasks WHERE id = ?`)
        .get(result.lastInsertRowid) as TaskRecord;
}

export function listTasks(status?: TaskStatus): TaskRecord[] {
    if (status) {
        return db
            .prepare(`SELECT * FROM tasks WHERE status = ? ORDER BY id DESC`)
            .all(status) as TaskRecord[];
    }

    return db
        .prepare(`SELECT * FROM tasks ORDER BY id DESC`)
        .all() as TaskRecord[];
}

export function updateTaskStatus(id: number, status: TaskStatus) {
    const result = db
        .prepare(`UPDATE tasks SET status = ? WHERE id = ?`)
        .run(status, id);

    if (result.changes === 0) return null;

    return db.prepare(`SELECT * FROM tasks WHERE id = ?`).get(id);
}
