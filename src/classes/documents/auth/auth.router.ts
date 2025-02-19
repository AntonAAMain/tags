import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./auth.controller");

router.post("/documents/auth/login", controller.login);
router.post("/documents/auth/register", controller.createUser);
router.get("/documents/auth/whoami", controller.whoAmI);

module.exports = router;
