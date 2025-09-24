import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { initializeSocketManager } from "./src/lib/socket";

const port = parseInt(process.env.PORT || "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.io
  const socketManager = initializeSocketManager(server);

  server.listen(port);

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? "development" : process.env.NODE_ENV
    }`,
  );
  console.log(`> Socket.io server initialized`);
});
