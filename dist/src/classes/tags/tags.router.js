"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RouterObj = require("express");
const router = new RouterObj();
const controller = require("./tags.controller");
router.get("/tags/all", controller.getTest);
router.post("/tags/create", controller.createTag);
router.delete("/tags/delete", controller.removeTag);
module.exports = router;
