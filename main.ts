async function handleRequest(
  req: Request,
  handlers: {
    [key: string]: (...args: string[]) => Promise<Response> | Response;
  }
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
  handlers: {
    [key: string]: (...args: string[]) => Promise<Response> | Response;
  };

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
  start(port: number = 3000) {
    const handlers = this.handlers;

    Deno.serve(
      { port },
      async (req: Request) => await handleRequest(req, handlers)
    );
  }
}
