import Orion from "@orion/orion";

function hello_world(name: string) {
  console.log("Hello " + name + " I am Handler Function");
  return Response.json({ name: "Riasat" });
}

const app = new Orion();
app.handlers = { hello_world };

app.start(3000);
