import express from "express";
import {authJWT} from "../middlewares/middleware.auth.js";
import {attackEnemy, requestEnemy, viewEnemies} from "../controller/controller.enemy.js";

const enemyRouter = express.Router();

enemyRouter.get("/", authJWT, viewEnemies);
enemyRouter.get("/request", authJWT, requestEnemy);
enemyRouter.post("/attack", authJWT, attackEnemy);

export default enemyRouter;
