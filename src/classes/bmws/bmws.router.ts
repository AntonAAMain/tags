// import { Router } from "express";

// const RouterObj = require("express");

// const router: Router = new RouterObj();

// const controller = require("./bmws.controller");
// const adminController = require("./controllers/bmws.admin.controller");
// const adminBoxController = require("./controllers/admin/bmws.admin.box.controller");

// // USER

// router.post("/bmws/user/create", controller.createUser);
// router.post("/bmws/user/login", controller.login);

// // Car Instance

// router.post(
//   "/bmws/admin/car/instance/create",
//   adminController.createCarInstance
// );
// router.delete(
//   "/bmws/admin/car/instance/delete",
//   adminController.deleteCarInstance
// );
// router.get(
//   "/bmws/admin/car/instances/all",
//   adminController.getAllCarsInstances
// );

// // Box

// router.post("/bmws/admin/box/create", adminBoxController.createBox);
// router.get("/bmws/admin/box", adminBoxController.getBox);

// // Box Inside
// router.post(
//   "/bmws/admin/box/inside/create",
//   adminController.createBoxInsideInstance
// );

// // Boxes
// router.get("/bmws/admin/boxes/all", adminController.getAllBoxes);

// router.get("/bmws/admin/car/all", adminController.getAllCars);

// module.exports = router;

import { Router } from "express";

const authRoutes = require("./auth/auth.router");
const boxesRoutes = require("./boxes/boxes.router");
const userRoutes = require("./user/user.router");

const RouterObj = require("express");

const router: Router = new RouterObj();

router.use(authRoutes);
router.use(boxesRoutes);
router.use(userRoutes);

module.exports = router;
