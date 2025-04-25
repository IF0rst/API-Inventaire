import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./router/auth.router.js";
import { initTables } from "./db.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

initTables();

app.use("/auth", authRouter);
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
