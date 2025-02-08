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
class Controller {
    createReward(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, price, level, description, profit } = req.body;
            try {
                const { rows } = yield money_1.db.query(`SELECT * FROM rewards WHERE name='${name}' AND level=${level}`);
                if (rows.length > 0) {
                    return res
                        .status(500)
                        .json({ message: "такая награда уже существует" });
                }
                yield money_1.db.query(`INSERT INTO rewards (name, price, level, description, profit) VALUES ('${name}', ${price}, ${level}, '${description}', ${profit})`);
                res.status(200).json({ message: "успех" });
            }
            catch (error) {
                res.status(500).json({ message: error });
            }
        });
    }
    getRewards(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // const { limit, page, level, sort, direction } = req.query;
            var _a, _b, _c, _d;
            // const pageParam = req.query?.page? `OFFSET ${p}`
            const levelParam = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.level)
                ? ` WHERE LEVEL=${req.query.level}`
                : "";
            const sortParam = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.sort) && ((_c = req.query) === null || _c === void 0 ? void 0 : _c.direction)
                ? `ORDER BY ${(_d = req.query) === null || _d === void 0 ? void 0 : _d.sort}  ${req.query.direction.toLocaleUpperCase()}`
                : "";
            try {
                const { rows } = yield money_1.db.query(`SELECT * FROM rewards ${levelParam} ${sortParam}`);
                res.status(200).json({ message: "успех", data: rows });
            }
            catch (error) {
                res.status(500).json({ message: error });
            }
        });
    }
}
module.exports = new Controller();
