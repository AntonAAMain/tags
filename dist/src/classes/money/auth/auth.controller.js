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
const money_1 = require("../../../dbs/money");
const uuid_1 = require("uuid");
class Controller {
    whoAmI(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies["auth"];
            if (token) {
                const { rows } = yield money_1.db.query(`SELECT * FROM users WHERE token='${token}'`);
                res.status(200).json({ message: "успешный вход", data: rows });
            }
            else {
                res.status(401).json({ message: "не авторизован" });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            const { rows } = yield money_1.db.query(`SELECT * FROM users`);
            const isExisted = rows.find((el) => el.name === name);
            if (isExisted) {
                // res.cookie("auth", isExisted.token, {
                //   maxAge: 900000,
                //   httpOnly: false,
                //   sameSite: "none",
                //   secure: true,
                // });
                res
                    .status(200)
                    .json({ message: "успешный вход", token: isExisted.token });
            }
            else {
                res.status(500).json({ message: "ну нет такого пользователя" });
            }
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = req.body;
            const { rows } = yield money_1.db.query(`SELECT * FROM users`);
            const isExisted = rows.find((el) => el.name === name);
            if (isExisted) {
                res.status(500).json({ message: "Такой ник уже занят" });
            }
            else {
                const id = (0, uuid_1.v4)();
                yield money_1.db.query(`INSERT INTO users (name, token, last_activity, balance) VALUES ('${name}', '${id}', '${new Date()}', 0)`);
                // res.cookie("auth", id, { maxAge: 900000, httpOnly: true });
                res.status(200).json({ message: "пользователь создан", token: id });
            }
        });
    }
}
module.exports = new Controller();
