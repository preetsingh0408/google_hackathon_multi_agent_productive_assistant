export type TaskStatus = "pending" | "in_progress" | "done";

export interface TaskRecord {
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: string | null;
    due_date: string | null;
    created_at: string;
}

export interface NoteRecord {
    id: number;
    title: string | null;
    content: string;
    created_at: string;
}
