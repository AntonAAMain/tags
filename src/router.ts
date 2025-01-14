import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./controller");

router.get("/test/get", controller.getTest);

module.exports = router;
