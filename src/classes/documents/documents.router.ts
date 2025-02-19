import { Router } from "express";

const documentRoutes = require("./document/document.router");
const authRoutes = require("./auth/auth.router");

const RouterObj = require("express");

const router: Router = new RouterObj();

router.use(documentRoutes);
router.use(authRoutes);

module.exports = router;
