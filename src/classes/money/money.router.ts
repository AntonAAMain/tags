import { Router } from "express";

const authRoutes = require("./auth/auth.router");
const rewardRoutes = require("./reward/reward.router");
const userRoutes = require("./user/user.router");

const RouterObj = require("express");

const router: Router = new RouterObj();

router.use(authRoutes);
router.use(rewardRoutes);
router.use(userRoutes);

module.exports = router;
