import { app } from "./src/server.js";
const port = 3001;

app.listen(port, () => {
  console.log(`Backend started on ${port}`);
});

