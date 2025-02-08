import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./boxes.controller");

router.get("/bmws/box/all", controller.getAllBoxes);
router.get("/bmws/box", controller.getBox);
router.post("/bmws/box/open", controller.openBox);

module.exports = router;
