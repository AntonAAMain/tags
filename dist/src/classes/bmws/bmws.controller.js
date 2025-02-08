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
const bmws_1 = require("../../dbs/bmws");
const uuid_1 = require("uuid");
// req.cookies["auth"]
class Controller {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            const { rows } = yield bmws_1.db.query(`SELECT * FROM users`);
            const isExisted = rows.find((el) => el.name === name);
            if (isExisted) {
                res.cookie("auth", isExisted.token, {
                    maxAge: 9000000,
                    httpOnly: false,
                });
                res.status(200).json({ message: "успешный вход" });
            }
            else {
                res.status(500).json({ message: "ну нет такого пользователя" });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            const { rows } = yield bmws_1.db.query(`SELECT * FROM users`);
            const isExisted = rows.find((el) => el.name === name);
            if (isExisted) {
                res.status(500).json({ message: "Такой ник уже занят" });
            }
            else {
                const id = (0, uuid_1.v4)();
                yield bmws_1.db.query(`INSERT INTO users (name, token) VALUES ('${name}', '${id}')`);
                res.cookie("auth", id, { maxAge: 900000, httpOnly: true });
                res.status(200).json({ message: "пользователь создан" });
            }
        });
    }
}
module.exports = new Controller();
