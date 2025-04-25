import express from "express";
import authRouter from "./router/auth.router.js";

const app = express();
app.use(express.json());

app.use("/auth",authRouter)
app.listen(4920)