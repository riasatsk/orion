async function handleRequest(
  req: Request,
  handlers: { [key: string]: (...args: any[]) => Promise<Response> | Response }
) {
  try {
    const payload = await req.json();
    const { handler, args } = payload;

    if (handlers[handler]) {
      try {
        return await handlers[handler](...args);
      } catch (handlerError) {
        console.error(`Handler Error: ${handlerError}`);
        return new Response("Internal Server Error", { status: 500 });
      }
    } else {
      console.error("Handler not found");
      return new Response("Not Found", { status: 404 });
    }
  } catch (reqError) {
    console.error(`Request Error: ${reqError}`);
    return new Response("Bad Request", { status: 400 });
  }
}

/**
 * Class representing the Orion server.
 */
export default class Orion {
  handlers: { [key: string]: (...args: any[]) => Promise<Response> | Response };

  /**
   * Creates an instance of Orion.
   */
  constructor() {
    this.handlers = {};
  }

  /**
   * Starts the Orion server.
   * @param {number} [port=3000] - The port number to start the server on.
   */
  async start(port: number = 3000) {
    const handlers = this.handlers;

    if (typeof Bun !== "undefined") {
      Bun.serve({
        port: port,
        async fetch(req: Request): Promise<Response> {
          return await handleRequest(req, handlers);
        },
      });
    } else if (typeof Deno !== "undefined") {
      Deno.serve(
        { port },
        async (req: Request) => await handleRequest(req, handlers)
      );
    } else {
      // Dynamically import Node.js's http module
      const http = await import("http");

      const server = http.createServer(async (req: any, res: any) => {
        let body = "";
        req.on("data", (chunk: any) => {
          body += chunk.toString();
        });
        req.on("end", async () => {
          try {
            const response = await handleRequest(
              new Request(req.url, { method: req.method, body }),
              handlers
            );
            res.writeHead(response.status, response.headers);
            res.end(await response.text());
          } catch (error) {
            console.error(`Server Error: ${error}`);
            res.writeHead(500);
            res.end("Internal Server Error");
          }
        });
      });

      server.listen(port, () => {
        console.log(`Orion server is running on port ${port}`);
      });
    }
  }
}
