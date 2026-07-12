import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const from = path.join(root, "default-site-content.json");
const toDir = path.join(root, "data");
const to = path.join(toDir, "site-content.json");

await mkdir(toDir, { recursive: true });
await copyFile(from, to);
console.log("site-content.json reemplazado desde default-site-content.json");
