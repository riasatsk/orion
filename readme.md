export function hello_world(name: string) {
  console.log("Hello " + name + " I am Handler Function");
  return Response.json({ name: "Riasat" });
}

import Orion from "./orion";

const app = new Orion();
app.handlers = {hello_world}