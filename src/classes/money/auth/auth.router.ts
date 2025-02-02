import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./auth.controller");

router.post("/money/auth/login", controller.login);
router.post("/money/auth/register", controller.createUser);
router.get("/money/auth/whoami", controller.whoAmI);

module.exports = router;
