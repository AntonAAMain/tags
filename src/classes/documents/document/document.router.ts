import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./document.controller");

router.post("/document/create", controller.createDocument);
router.get("/document/all", controller.getAllDocuments);
router.get("/document/:id", controller.getDocument);
router.patch("/document/save", controller.saveDocument);

module.exports = router;
