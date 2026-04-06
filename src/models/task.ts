export type TaskStatus = "pending" | "in_progress" | "done";

export interface Task {
    id?: string;
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: string;
    due_date?: string;
    calendar_event_id?: string;
    created_at?: string;
    updated_at?: string;
}
