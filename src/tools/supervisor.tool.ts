import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { calendarAgent } from "../agents/calendar.agent.js";
import { taskAgent } from "../agents/task.agent.js";
import { notesAgent } from "../agents/notes.agent.js";

export const manageCalendar = tool(
    async ({ request }) => {
        const result = await calendarAgent.invoke({
            messages: [{ role: "user", content: request }],
        });

        const lastMessage = result.messages[result?.messages?.length - 1];
        return typeof lastMessage?.content === "string"
            ? lastMessage.content
            : JSON.stringify(lastMessage?.content ?? "");
    },
    {
        name: "manage_calendar",
        description: `
Use this tool for anything related to:
- scheduling meetings
- creating events
- checking available time slots
- calendar-related actions
    `.trim(),
        schema: z.object({
            request: z.string(),
        }),
    },
);

export const manageTasks = tool(
    async ({ request }) => {
        const result = await taskAgent.invoke({
            messages: [{ role: "user", content: request }],
        });

        const lastMessage = result.messages[result?.messages?.length - 1];
        return typeof lastMessage?.content === "string"
            ? lastMessage.content
            : JSON.stringify(lastMessage?.content ?? "");
    },
    {
        name: "manage_tasks",
        description: `
Use this tool for anything related to:
- creating tasks
- listing tasks
- updating task status
    `.trim(),
        schema: z.object({
            request: z.string(),
        }),
    },
);

export const manageNotes = tool(
    async ({ request }) => {
        const result = await notesAgent.invoke({
            messages: [{ role: "user", content: request }],
        });

        const lastMessage = result.messages[result?.messages?.length - 1];
        return typeof lastMessage?.content === "string"
            ? lastMessage.content
            : JSON.stringify(lastMessage?.content ?? "");
    },
    {
        name: "manage_notes",
        description: `
Use this tool for anything related to:
- saving notes
- retrieving notes
- note management
    `.trim(),
        schema: z.object({
            request: z.string(),
        }),
    },
);
