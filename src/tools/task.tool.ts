import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
    createTaskViaMcp,
    listTasksViaMcp,
    updateTaskViaMcp,
    deleteTaskViaMcp,
    deleteTasksByCalendarEventViaMcp,
} from "../services/productivityMcp.service.js";
import { withTiming } from "../utils/logger.js";

export const createTaskTool = tool(
    async (input: any) =>
        withTiming(
            "tool",
            "create_task",
            async () => JSON.stringify(await createTaskViaMcp(input)),
            { input },
        ),
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
    async (input: any) =>
        withTiming(
            "tool",
            "list_tasks",
            async () => JSON.stringify(await listTasksViaMcp(input)),
            { input },
        ),
    {
        name: "list_tasks",
        description: "List tasks",
        schema: z.object({
            limit: z.number().optional(),
        }),
    } as any,
);

export const updateTaskTool = tool(
    async (input: any) =>
        withTiming(
            "tool",
            "update_task",
            async () => JSON.stringify(await updateTaskViaMcp(input)),
            { input },
        ),
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
    async (input: any) =>
        withTiming(
            "tool",
            "delete_task",
            async () => JSON.stringify(await deleteTaskViaMcp(input)),
            { input },
        ),
    {
        name: "delete_task",
        description: "Delete a task",
        schema: z.object({
            id: z.string(),
        }),
    } as any,
);

export const deleteMeetingTasksTool = tool(
    async (input: any) =>
        withTiming(
            "tool",
            "delete_meeting_tasks",
            async () =>
                JSON.stringify(await deleteTasksByCalendarEventViaMcp(input)),
            { input },
        ),
    {
        name: "delete_meeting_tasks",
        description:
            "Delete tasks linked to meetings. If calendar_event_id is omitted, deletes all tasks that have calendar_event_id.",
        schema: z.object({
            calendar_event_id: z.string().nullable().optional(),
        }),
    } as any,
);
