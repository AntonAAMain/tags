import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./reward.controller");

router.post("/money/reward/create", controller.createReward);
router.get("/money/reward/all", controller.getRewards);

module.exports = router;
