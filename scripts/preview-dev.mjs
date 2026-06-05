// مشغّل خادم التطوير للمعاينة — يضبط مجلد العمل على جذر المشروع
// حتى تعمل عمليات رفع الملفات (public/uploads) بشكل صحيح.
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
process.chdir(root);

const bin = path.join(root, "node_modules", "next", "dist", "bin", "next");
process.argv = [process.argv[0], bin, "dev"];
await import(pathToFileURL(bin).href);
