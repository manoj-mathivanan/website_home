import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve, extname, relative, isAbsolute } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const built = process.argv.includes("--dist");
const publicRoot = built ? resolve(root, "dist") : root;
const port = Number(process.env.PORT || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};
const server = createServer(async (request, response) => {
  try {
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" });
      response.end();
      return;
    }
    const path = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    // Serve only the site's explicit public surface, never source control or local documents.
    const allowed =
      path === "/" ||
      path === "/index.html" ||
      path === "/favicon.svg" ||
      /^\/src\/[a-zA-Z0-9_.-]+\.(js|css)$/.test(path);
    if (!allowed) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    const asset =
      !built && path === "/favicon.svg" ? "/public/favicon.svg" : path;
    const file = resolve(
      publicRoot,
      `.${asset === "/" ? "/index.html" : asset}`,
    );
    const rel = relative(publicRoot, file);
    if (
      rel.startsWith("..") ||
      isAbsolute(rel) ||
      !(await stat(file)).isFile()
    ) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(request.method === "HEAD" ? undefined : await readFile(file));
  } catch (error) {
    response.writeHead(error instanceof URIError ? 400 : 404);
    response.end("Not found");
  }
});
server.on("error", (error) => {
  console.error(error.message);
  process.exit(1);
});
server.listen(port, "127.0.0.1", () =>
  console.log(
    `Local: http://127.0.0.1:${port} (${built ? "production preview" : "development"})`,
  ),
);
