"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouterObj = require("express");
const router = new RouterObj();
const controller = require("./reward.controller");
router.post("/money/reward/create", controller.createReward);
router.get("/money/reward/all", controller.getRewards);
module.exports = router;
