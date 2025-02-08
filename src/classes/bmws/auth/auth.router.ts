import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./auth.controller");

router.post("/bmws/auth/login", controller.login);
router.post("/bmws/auth/register", controller.createUser);
router.get("/bmws/auth/whoami", controller.whoAmI);

module.exports = router;
