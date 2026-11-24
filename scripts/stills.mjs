// Renders check frames of the film. Usage: node scripts/stills.mjs <outDir> <scale> <seconds> [seconds...]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "path";
import fs from "fs";
const [outDir, scale, ...times] = process.argv.slice(2);
fs.mkdirSync(outDir, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browser = await openBrowser("chrome", { browserExecutable: "/usr/bin/google-chrome" });
const composition = await selectComposition({ serveUrl, id: "Film", puppeteerInstance: browser, browserExecutable: "/usr/bin/google-chrome" });
for (const s of times) {
  const out = path.join(outDir, `t_${Number(s).toFixed(2).replace(".", "_")}.jpg`);
  await renderStill({ serveUrl, composition, frame: Math.round(Number(s) * 25), output: out, imageFormat: "jpeg", jpegQuality: 86, scale: Number(scale), puppeteerInstance: browser, browserExecutable: "/usr/bin/google-chrome", onBrowserLog: (l) => { if (l.type === "error") console.log("BROWSER", l.text.slice(0, 300)); } });
  console.log(out);
}
await browser.close({ silent: true });
try { fs.rmSync(serveUrl, { recursive: true, force: true }); } catch (e) {}
