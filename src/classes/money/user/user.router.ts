import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./user.controller");

router.get("/money/user/balance", controller.getBalance);

module.exports = router;
