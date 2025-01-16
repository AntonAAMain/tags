import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./tags.controller");

router.get("/test/get", controller.getTest);
router.post("/test/post", controller.createTag);

module.exports = router;
