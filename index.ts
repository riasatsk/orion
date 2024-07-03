type Handler = (req: Request) => Response | Promise<Response>;

export default class Orion {
  useHandlers: Map<string, Handler[]>;

  constructor() {
    this.useHandlers = new Map();
  }

  async listen(port: number = 3000) {
    const server = Bun.serve({
      port: port,
      fetch: async (req) => {
        const url = new URL(req.url);
        const { pathname } = url;
        const handlers = this.useHandlers.get(pathname);

        if (handlers && handlers.length > 0) {
          try {
            for (const handler of handlers) {
              const result = await handler(req);
              if (result) {
                return result;
              }
            }
          } catch (error) {
            return new Response("Internal Server Error", { status: 500 });
          }
        }

        return new Response("Not Found", { status: 404 });
      },
    });

    console.log(`Server listening on port ${port}`);
    return server;
  }

  use(pathname: string, ...handlers: Handler[]): void {
    if (this.useHandlers.has(pathname)) {
      this.useHandlers.get(pathname)!.push(...handlers);
    } else {
      this.useHandlers.set(pathname, handlers);
    }
  }
}
