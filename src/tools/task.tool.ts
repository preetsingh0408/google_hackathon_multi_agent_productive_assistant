import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
    createTask,
    listTasks,
    updateTaskStatus,
} from "../services/task.service.js";

export const createTaskTool = tool(
    async ({ title, description, priority, dueDate }) => {
        const task = createTask({
            title,
            description,
            priority,
            dueDate,
        });

        return JSON.stringify({
            success: true,
            message: `Task created: ${task.title}`,
            task,
        });
    },
    {
        name: "create_task",
        description: "Create a task in the local productivity database.",
        schema: z.object({
            title: z.string(),
            description: z.string().optional(),
            priority: z.string().optional(),
            dueDate: z.string().optional(),
        }),
    },
);

export const listTasksTool = tool(
    async ({ status }) => {
        const tasks = listTasks(status);

        return JSON.stringify({
            success: true,
            count: tasks.length,
            tasks,
        });
    },
    {
        name: "list_tasks",
        description: "List tasks from the local productivity database.",
        schema: z.object({
            status: z.enum(["pending", "in_progress", "done"]).optional(),
        }),
    },
);

export const updateTaskStatusTool = tool(
    async ({ id, status }) => {
        const task = updateTaskStatus(id, status);

        if (!task) {
            return JSON.stringify({
                success: false,
                message: `No task found for id ${id}`,
            });
        }

        return JSON.stringify({
            success: true,
            message: `Task ${id} updated to ${status}`,
            task,
        });
    },
    {
        name: "update_task_status",
        description: "Update task status in the local productivity database.",
        schema: z.object({
            id: z.number(),
            status: z.enum(["pending", "in_progress", "done"]),
        }),
    },
);
