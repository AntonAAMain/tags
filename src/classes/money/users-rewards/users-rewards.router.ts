import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./users-rewards.controller");

router.get("/money/users-reward/balance", controller.getBalance);

module.exports = router;
