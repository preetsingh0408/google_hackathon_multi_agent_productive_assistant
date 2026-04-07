import express from "express";
import { supervisorAgent } from "../agents/supervisor.agent.js";
import { listCalendarEventsViaMcp } from "../services/calendarMcp.service.js";
import {
    listTasksViaMcp,
    listNotesViaMcp,
    deleteAllNotesViaMcp,
} from "../services/productivityMcp.service.js";
import { logEvent, summarizePayload, withTiming } from "../utils/logger.js";

function normalizeMessage(message: string) {
    return message.trim().toLowerCase().replace(/\s+/g, " ");
}

function isDeleteAllNotesIntent(message: string) {
    const normalized = normalizeMessage(message);
    return (
        normalized === "delete all notes" ||
        normalized === "remove all notes" ||
        normalized === "clear all notes"
    );
}

export function createServer() {
    const app = express();
    app.use(express.json());

    app.get("/health", (_req, res) => {
        res.json({ success: true, message: "OK" });
    });

    app.post("/chat", async (req, res) => {
        try {
            const { message } = req.body as { message?: string };
            const requestId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

            logEvent("chat", "request:received", {
                request_id: requestId,
                message_preview: summarizePayload(message ?? ""),
                message_length: message?.length ?? 0,
            });

            if (!message?.trim()) {
                logEvent("chat", "request:invalid", {
                    request_id: requestId,
                    reason: "message is required",
                });
                return res.status(400).json({
                    success: false,
                    error: "message is required",
                });
            }

            if (isDeleteAllNotesIntent(message)) {
                const result = await withTiming(
                    "chat.fastpath",
                    "delete_all_notes",
                    async () => deleteAllNotesViaMcp(),
                    { request_id: requestId },
                );

                const responseText =
                    result.deleted_count > 0
                        ? `Done - deleted ${result.deleted_count} notes.`
                        : "Done - no notes found to delete.";

                logEvent("chat", "request:completed", {
                    request_id: requestId,
                    route: "fastpath.delete_all_notes",
                    response_preview: summarizePayload(responseText),
                });

                return res.json({
                    success: true,
                    message: responseText,
                });
            }

            const result = await withTiming(
                "agent",
                "supervisor.invoke",
                async () =>
                    supervisorAgent.invoke(
                        {
                            messages: [{ role: "user", content: message }],
                        },
                        {
                            recursionLimit: 24,
                        } as any,
                    ),
                {
                    request_id: requestId,
                    recursion_limit: 24,
                },
            );

            const lastMessage = result.messages.at(-1);
            const finalText =
                typeof lastMessage?.content === "string"
                    ? lastMessage.content
                    : JSON.stringify(lastMessage?.content ?? "");

            logEvent("chat", "request:completed", {
                request_id: requestId,
                response_preview: summarizePayload(finalText),
            });

            return res.json({
                success: true,
                message: finalText,
                // raw: result,
            });
        } catch (error) {
            logEvent("chat", "request:error", {
                error: error instanceof Error ? error.message : "Unknown error",
            });
            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    });

    app.get("/tasks", async (_req, res) => {
        const tasks = await listTasksViaMcp();

        res.json({
            success: true,
            tasks,
        });
    });

    // ✅ Now using MCP-style layer
    app.get("/notes", async (_req, res) => {
        const notes = await listNotesViaMcp();

        res.json({
            success: true,
            notes,
        });
    });

    app.get("/schedule", async (_req, res) => {
        try {
            const schedules = await listCalendarEventsViaMcp();

            return res.json({
                success: true,
                schedules,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : "Unknown error",
            });
        }
    });

    return app;
}
