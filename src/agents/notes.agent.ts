import { createAgent } from "langchain";
import { model } from "../model.js";
import {
    createNoteTool,
    listNotesTool,
    updateNoteTool,
    deleteNoteTool,
} from "../tools/notes.tool.js";

const NOTES_AGENT_PROMPT = `
You are a notes assistant.

You can:
- create notes
- list notes
- update notes
- delete notes

Rules:
- Use create_note when the user wants to save a note
- Use list_notes when the user wants to view notes
- Use update_note when the user wants to modify a note
- Use delete_note when the user wants to remove a note

LINKING RULES:
- If the request includes task_id, include it exactly in the tool call
- If the request includes calendar_event_id, include it exactly in the tool call
- Do not drop task_id or calendar_event_id if they are present
- If they are not present, leave them null/undefined

Response Rules:
- Be concise and direct
- Confirm only the final action/result
`.trim();

export const notesAgent = createAgent({
    model,
    tools: [createNoteTool, listNotesTool, updateNoteTool, deleteNoteTool],
    systemPrompt: NOTES_AGENT_PROMPT,
});
