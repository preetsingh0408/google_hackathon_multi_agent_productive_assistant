import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { calendarAgent } from "../agents/calendar.agent.js";
import { taskAgent } from "../agents/task.agent.js";
import { notesAgent } from "../agents/notes.agent.js";

function extractUsefulContent(result: any) {
    const messages = result?.messages ?? [];

    for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];

        if (typeof msg?.content === "string" && msg?.tool_call_id) {
            return msg.content;
        }

        if (
            typeof msg?.kwargs?.content === "string" &&
            msg?.kwargs?.tool_call_id
        ) {
            return msg.kwargs.content;
        }
    }

    const lastMessage = messages[messages.length - 1];
    return typeof lastMessage?.content === "string"
        ? lastMessage.content
        : JSON.stringify(lastMessage?.content ?? "");
}

export const manageCalendar = tool(
    async ({ request }: any) => {
        const result = await calendarAgent.invoke({
            messages: [{ role: "user", content: request }],
        });

        return extractUsefulContent(result);
    },
    {
        name: "manage_calendar",
        description: "Handle calendar-related requests",
        schema: z.object({
            request: z.string(),
        }),
    } as any,
);

export const manageTasks = tool(
    async ({ request }: any) => {
        const result = await taskAgent.invoke({
            messages: [{ role: "user", content: request }],
        });

        return extractUsefulContent(result);
    },
    {
        name: "manage_tasks",
        description: "Handle task-related requests",
        schema: z.object({
            request: z.string(),
        }),
    } as any,
);

export const manageNotes = tool(
    async ({ request }: any) => {
        const result = await notesAgent.invoke({
            messages: [{ role: "user", content: request }],
        });

        return extractUsefulContent(result);
    },
    {
        name: "manage_notes",
        description: "Handle note-related requests",
        schema: z.object({
            request: z.string(),
        }),
    } as any,
);
