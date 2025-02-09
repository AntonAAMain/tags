import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./user.controller");

router.post("/bmws/user/car/sell", controller.sellUserCar);
router.get("/bmws/user/car/all", controller.getUserInventory);
router.post("/bmws/user/reset", controller.resetUser);

module.exports = router;
