const LOGGING_ENABLED = process.env.DEBUG_AGENT_LOGS !== "false";

function nowIso() {
    return new Date().toISOString();
}

export function summarizePayload(payload: unknown, maxLength = 280) {
    if (payload == null) return payload;

    if (typeof payload === "string") {
        return payload.length > maxLength
            ? `${payload.slice(0, maxLength)}...`
            : payload;
    }

    try {
        const text = JSON.stringify(payload);
        if (!text) return payload;
        return text.length > maxLength
            ? `${text.slice(0, maxLength)}...`
            : text;
    } catch {
        return "[unserializable]";
    }
}

export function logEvent(scope: string, event: string, details?: unknown) {
    if (!LOGGING_ENABLED) return;

    if (details === undefined) {
        console.log(`[${nowIso()}] [${scope}] ${event}`);
        return;
    }

    console.log(
        `[${nowIso()}] [${scope}] ${event} | ${summarizePayload(details)}`,
    );
}

export async function withTiming<T>(
    scope: string,
    event: string,
    fn: () => Promise<T>,
    context?: unknown,
) {
    const start = Date.now();
    logEvent(scope, `${event}:start`, context);

    try {
        const result = await fn();
        logEvent(scope, `${event}:success`, {
            duration_ms: Date.now() - start,
        });
        return result;
    } catch (error) {
        logEvent(scope, `${event}:error`, {
            duration_ms: Date.now() - start,
            error: error instanceof Error ? error.message : String(error),
        });
        throw error;
    }
}
