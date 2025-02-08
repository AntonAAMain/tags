"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouterObj = require("express");
const router = new RouterObj();
const controller = require("./user.controller");
router.get("/money/user/balance", controller.getBalance);
router.post("/money/user/reward/buy", controller.buyReward);
module.exports = router;
