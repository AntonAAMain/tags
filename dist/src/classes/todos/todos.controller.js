"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("../../dbs/todos");
const { v4 } = require("uuid");
class Controller {
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_name, secret_key } = req.body;
            if (secret_key === "anton-frontender") {
                try {
                    yield db.query(`INSERT INTO users (username) VALUES ('${user_name}');`);
                    res.status(200).json({ message: "Все ок)" });
                }
                catch (error) {
                    res.status(500).json({ message: error });
                }
            }
            else {
                res.status(403).json({ message: "ты кто такой куда лезешь Василий ?" });
            }
        });
    }
    getAllTodos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.query;
            try {
                const { rows } = yield db.query(`SELECT * FROM todos` +
                    ((user_id === null || user_id === void 0 ? void 0 : user_id.length) > 0 ? ` WHERE userid='${user_id}'` : ""));
                res.status(200).json({ message: "Все ок)", data: rows });
            }
            catch (error) {
                res.status(500).json({ message: error });
            }
        });
    }
    createTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, text, user_id } = req.body;
            try {
                yield db.query(`INSERT INTO todos (title, text, userid) VALUES ('${title}', '${text}', '${user_id}');`);
                res.status(200).json({ message: "Все ок)" });
            }
            catch (error) {
                res.status(500).json({ message: error });
            }
        });
    }
    updateTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, comment } = req.body;
            try {
                yield db.query(`UPDATE todos SET comment='${comment}' WHERE id=${id};`);
                res.status(200).json({ message: "Все ок)" });
            }
            catch (error) {
                res.status(500).json({ message: error });
            }
        });
    }
    deleteTodo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                yield db.query(`DELETE FROM todos WHERE id=${id}`);
                res.status(200).json({ message: "Все ок)" });
            }
            catch (error) {
                res.status(500).json({ message: error });
            }
        });
    }
    createComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { comment, user_id, todo_id } = req.body;
            try {
                yield db.query(`INSERT INTO comments (comment, userid, todoid) VALUES ('${comment}', '${user_id}', '${todo_id}');`);
                res.status(200).json({ message: "Все ок)" });
            }
            catch (error) {
                res.status(500).json({ message: error });
            }
        });
    }
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, comment } = req.body;
            try {
                yield db.query(`UPDATE comments SET comment='${comment}' WHERE id=${id};`);
                res.status(200).json({ message: "Все ок)" });
            }
            catch (error) {
                res.status(500).json({ message: error });
            }
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            try {
                yield db.query(`DELETE FROM comments WHERE id=${id}`);
                res.status(200).json({ message: "Все ок)" });
            }
            catch (error) {
                res.status(500).json({ message: error });
            }
        });
    }
}
module.exports = new Controller();
