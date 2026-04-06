import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
    createTaskViaMcp,
    listTasksViaMcp,
    updateTaskViaMcp,
    deleteTaskViaMcp,
} from "../services/productivityMcp.service.js";

export const createTaskTool = tool(
    async (input: any) => JSON.stringify(await createTaskViaMcp(input)),
    {
        name: "create_task",
        description: "Create a task",
        schema: z.object({
            title: z.string(),
            description: z.string().optional(),
            status: z.enum(["pending", "in_progress", "done"]).optional(),
            priority: z.string().optional(),
            due_date: z.string().optional(),
            calendar_event_id: z.string().nullable().optional(),
        }),
    } as any,
);

export const listTasksTool = tool(
    async (input: any) => JSON.stringify(await listTasksViaMcp(input)),
    {
        name: "list_tasks",
        description: "List tasks",
        schema: z.object({
            limit: z.number().optional(),
        }),
    } as any,
);

export const updateTaskTool = tool(
    async (input: any) => JSON.stringify(await updateTaskViaMcp(input)),
    {
        name: "update_task",
        description: "Update a task",
        schema: z.object({
            id: z.string(),
            title: z.string(),
            description: z.string().optional(),
            status: z.enum(["pending", "in_progress", "done"]).optional(),
            priority: z.string().optional(),
            due_date: z.string().optional(),
            calendar_event_id: z.string().nullable().optional(),
        }),
    } as any,
);

export const deleteTaskTool = tool(
    async (input: any) => JSON.stringify(await deleteTaskViaMcp(input)),
    {
        name: "delete_task",
        description: "Delete a task",
        schema: z.object({
            id: z.string(),
        }),
    } as any,
);
