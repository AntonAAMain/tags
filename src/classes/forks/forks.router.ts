import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./forks.controller");

router.post("/fork/create", controller.createFork);
router.get("/fork/all", controller.getAll);
router.delete("/fork/delete", controller.removeFork);

module.exports = router;
