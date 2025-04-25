import express from "express";
import {authLoginPost, authRegisterPost, authWhoamiGet} from "../controller/controller.auth.js";

const authRouter = express.Router();

authRouter.post("/login",authLoginPost)
authRouter.post("/register",authRegisterPost)
authRouter.get("/whoami",authWhoamiGet)

export default authRouter;
