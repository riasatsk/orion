#server

```typescript
import Orion from "@orion/orion";

function hello_world(name: string) {
  console.log("Hello " + name + " I am Handler Function");
  return Response.json({ name: "Riasat" });
}

const app = new Orion();
app.handlers = { hello_world };

app.start(3000);
```


#client

```typescript
import OrionServer from "@orion/client";

const server = new OrionServer("http://localhost:3000");
const app = server.getApp();

const response = await app.hello_world("Riasat");
console.log(await response);
```
