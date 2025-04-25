import express from "express";
import {authGet} from "../controller/auth.controller.js";
const authRouter = express.Router();

authRouter.get("/",authGet)

export default authRouter;
