"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouterObj = require("express");
const router = new RouterObj();
const controller = require("./auth.controller");
router.post("/money/auth/login", controller.login);
router.post("/money/auth/register", controller.createUser);
router.get("/money/auth/whoami", controller.whoAmI);
module.exports = router;
