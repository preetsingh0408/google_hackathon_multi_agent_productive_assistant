import { createAgent } from "langchain";
import { model } from "../model.js";
import { createNoteTool, listNotesTool } from "../tools/notes.tool.js";

const NOTES_AGENT_PROMPT = `
You are a notes assistant.

Your responsibilities:
- create notes
- list notes

Rules:
- use create_note when the user wants to save information
- use list_notes when the user wants to retrieve notes
- always return a concise confirmation
`.trim();

export const notesAgent = createAgent({
    model,
    tools: [createNoteTool, listNotesTool],
    systemPrompt: NOTES_AGENT_PROMPT,
});
