import app from "./app";
import "dotenv/config";

const port: string = process.env.PORT || "8000";

if (!port) throw new Error(`Server port not found`);

app.listen(port, () => {
  console.log(`Server started on the port: http://localhost:8000`);
});
