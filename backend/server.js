import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";

dotenv.config({ path: "./config/config.env" });
connectDB();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`server is running  on  port ${port}.`);
});
