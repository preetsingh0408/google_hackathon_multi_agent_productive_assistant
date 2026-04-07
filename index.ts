import "dotenv/config";
import { createServer } from "./src/api/server.js";

const port = Number(process.env.PORT || 8080);
const app = createServer();

app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${port}`);
});
