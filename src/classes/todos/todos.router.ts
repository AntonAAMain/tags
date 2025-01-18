import { Router } from "express";

const RouterObj = require("express");

const router: Router = new RouterObj();

const controller = require("./todos.controller");

router.post("/todos/create-user", controller.createUser);

router.post("/todos/create", controller.createTodo);
router.patch("/todos/update", controller.updateTodo);
router.delete("/todos/delete", controller.deleteTodo);

router.post("/todos/comment/create", controller.createComment);
router.patch("/todos/comment/update", controller.updateComment);
router.delete("/todos/comment/delete", controller.deleteComment);

module.exports = router;
