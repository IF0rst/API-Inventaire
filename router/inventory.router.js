import express from "express";
import {equipItem, grabItem, viewInventory} from "../controller/controller.inventory.js";
import {viewItem} from "../controller/controller.inventory.js";
import {authJWT} from "../middlewares/middleware.auth.js";

const inventoryRouter = express.Router();

inventoryRouter.get("/", authJWT, viewInventory);
inventoryRouter.post("/equip", authJWT, equipItem);
inventoryRouter.post("/grab", authJWT, grabItem);
inventoryRouter.get("/:id", authJWT, viewItem);

export default inventoryRouter;
