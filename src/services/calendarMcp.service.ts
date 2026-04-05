import "dotenv/config";

const BASE_URL = process.env.CALENDAR_MCP_BASE_URL;

if (!BASE_URL) {
    throw new Error("CALENDAR_MCP_BASE_URL is missing in .env");
}

const MCP_URL = `${BASE_URL}/mcp`;

type CreateCalendarEventInput = {
    title: string;
    description?: string;
    start: string;
    end: string;
};

let mcpSessionId: string | null = null;
let rpcId = 1;

function nextId() {
    return rpcId++;
}

async function parseMcpResponse(response: Response) {
    const text = await response.text();

    if (!response.ok) {
        throw new Error(`MCP HTTP error ${response.status}: ${text}`);
    }

    const trimmed = text.trim();

    // Case 1: plain JSON response
    if (trimmed.startsWith("{")) {
        try {
            return JSON.parse(trimmed);
        } catch {
            throw new Error(`Failed to parse MCP JSON response: ${trimmed}`);
        }
    }

    // Case 2: SSE response like:
    // event: message
    // data: {...}
    const dataLines = trimmed
        .split("\n")
        .filter((line) => line.startsWith("data:"))
        .map((line) => line.replace(/^data:\s*/, "").trim());

    if (dataLines.length > 0) {
        const combined = dataLines.join("\n");
        try {
            return JSON.parse(combined);
        } catch {
            throw new Error(
                `Failed to parse MCP SSE data as JSON: ${combined}`,
            );
        }
    }

    throw new Error(`Unsupported MCP response format: ${trimmed}`);
}

async function initializeMcpSession() {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
    };

    if (mcpSessionId) {
        headers["mcp-session-id"] = mcpSessionId;
    }

    const response = await fetch(MCP_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: nextId(),
            method: "initialize",
            params: {
                protocolVersion: "2024-11-05",
                capabilities: {},
                clientInfo: {
                    name: "supervisor-agent",
                    version: "1.0.0",
                },
            },
        }),
    });

    const sessionHeader = response.headers.get("mcp-session-id");
    if (sessionHeader) {
        mcpSessionId = sessionHeader;
    }

    const data = await parseMcpResponse(response);

    if (data.error) {
        throw new Error(`MCP initialize error: ${JSON.stringify(data.error)}`);
    }

    return data;
}

async function callMcp(method: string, params?: Record<string, unknown>) {
    if (!mcpSessionId) {
        await initializeMcpSession();
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream",
    };

    if (mcpSessionId) {
        headers["mcp-session-id"] = mcpSessionId;
    }

    const response = await fetch(MCP_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: nextId(),
            method,
            params,
        }),
    });

    const sessionHeader = response.headers.get("mcp-session-id");
    if (sessionHeader) {
        mcpSessionId = sessionHeader;
    }

    const data = await parseMcpResponse(response);

    if (data.error) {
        throw new Error(
            `MCP method ${method} failed: ${JSON.stringify(data.error)}`,
        );
    }

    return data.result;
}

export async function createCalendarEventViaMcp(
    input: CreateCalendarEventInput,
) {
    return callMcp("tools/call", {
        name: "create_event",
        arguments: {
            title: input.title,
            description: input.description ?? "",
            start: input.start,
            end: input.end,
        },
    });
}

export async function listCalendarEventsViaMcp() {
    return callMcp("tools/call", {
        name: "list_events",
        arguments: {},
    });
}

export async function deleteCalendarEventViaMcp(input: { id: string }) {
    return callMcp("tools/call", {
        name: "delete_event",
        arguments: {
            id: input.id,
        },
    });
}

export async function updateCalendarEventViaMcp(input: {
    id: string;
    title?: string;
    description?: string;
    start?: string;
    end?: string;
}) {
    return callMcp("tools/call", {
        name: "update_event",
        arguments: {
            id: input.id,
            ...(input.title ? { title: input.title } : {}),
            ...(input.description ? { description: input.description } : {}),
            ...(input.start ? { start: input.start } : {}),
            ...(input.end ? { end: input.end } : {}),
        },
    });
}
