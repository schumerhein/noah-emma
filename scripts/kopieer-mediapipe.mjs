// Kopieert de WebAssembly-bestanden van MediaPipe naar public/, zodat de
// kleding-uitknipper (src/lib/kledingUitknippen.ts) ze van onze eigen site
// laadt in plaats van een externe CDN. Draait automatisch na npm install.
import { cpSync, existsSync, mkdirSync } from "node:fs";

const bron = "node_modules/@mediapipe/tasks-vision/wasm";
const doel = "public/mediapipe/wasm";

if (existsSync(bron)) {
  mkdirSync(doel, { recursive: true });
  cpSync(bron, doel, { recursive: true });
  console.log(`MediaPipe-wasm gekopieerd naar ${doel}`);
}
