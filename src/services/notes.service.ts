import { db } from "../db/client.js";
import type { NoteRecord } from "../types.js";

export function createNote(input: {
    title?: string;
    content: string;
}): NoteRecord {
    const createdAt = new Date().toISOString();

    const result = db
        .prepare(
            `
      INSERT INTO notes (title, content, created_at)
      VALUES (?, ?, ?)
    `,
        )
        .run(input.title ?? null, input.content, createdAt);

    return db
        .prepare(`SELECT * FROM notes WHERE id = ?`)
        .get(result.lastInsertRowid) as NoteRecord;
}

export function listNotes(): NoteRecord[] {
    return db
        .prepare(`SELECT * FROM notes ORDER BY id DESC`)
        .all() as NoteRecord[];
}
