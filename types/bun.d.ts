declare var Bun: {
  serve: (options: {
    port: number;
    fetch: (req: Request) => Promise<Response>;
  }) => void;
};
