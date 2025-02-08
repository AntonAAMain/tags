import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./user.controller");

router.post("/bmws/user/car/sell", controller.sellUserCar);

module.exports = router;
