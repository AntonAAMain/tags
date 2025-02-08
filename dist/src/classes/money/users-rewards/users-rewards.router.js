"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouterObj = require("express");
const router = new RouterObj();
const controller = require("./users-rewards.controller");
router.get("/money/users-reward/balance", controller.getBalance);
module.exports = router;
