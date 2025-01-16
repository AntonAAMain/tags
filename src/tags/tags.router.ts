import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./tags.controller");

router.get("/tags/all", controller.getTest);
router.post("/tags/create", controller.createTag);
router.delete("/tags/delete", controller.removeTag);

module.exports = router;
