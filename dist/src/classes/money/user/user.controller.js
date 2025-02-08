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
    getBalance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies["auth"];
            if (!token) {
                res.status(401).json({ message: "Авторизуйтесь" });
            }
            try {
                const { rows } = yield money_1.db.query(`SELECT * FROM users WHERE token='${token}'`);
                if (rows.length === 0) {
                    res.status(500).json({ message: "такого пользователя нет в базе" });
                }
                const user = rows[0];
                const passedHours = (new Date().getTime() - new Date(user.last_activity).getTime()) /
                    (1000 * 60);
                const { rows: userRewards } = yield money_1.db.query(`SELECT * FROM users_rewards WHERE user_id=${user.id}`);
                if (userRewards.length === 0) {
                    res.status(200).json({ message: "успех", data: user.balance });
                }
                const rewardsIds = JSON.stringify(userRewards.map((item) => item.reward_id));
                console.log("rewardsIds - ", rewardsIds);
                const { rows: allRewardsRows } = yield money_1.db.query(`SELECT * FROM rewards WHERE id IN (${rewardsIds.slice(1, rewardsIds.length - 1)})`);
                const totalProfit = allRewardsRows.reduce((acc, value) => {
                    return acc + value.profit * passedHours;
                }, 0);
                console.log(passedHours, allRewardsRows);
                yield money_1.db.query(`UPDATE users SET balance=balance + ${totalProfit}, last_activity='${new Date()}' WHERE id=${user.id}`);
                console.log(`UPDATE users SET balance=balance + ${totalProfit}, last_activity='${new Date()}' WHERE id=${user.id}`);
                res.status(200).json({ message: "успех", data: totalProfit });
            }
            catch (error) {
                res.status(500).json({ message: error });
            }
        });
    }
    buyReward(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = req.cookies["auth"];
            const { reward_id } = req.body;
            if (!token) {
                res.status(401).json({ message: "Авторизуйтесь" });
            }
            try {
                const { rows } = yield money_1.db.query(`SELECT * FROM users WHERE token='${token}'`);
                if (rows.length === 0) {
                    res.status(500).json({ message: "такого пользователя нет в базе" });
                }
                const { rows: user_rewards } = yield money_1.db.query(`SELECT * from users_rewards WHERE reward_id=${reward_id}`);
                if (user_rewards.length === 1) {
                    res.status(500).json({ message: "у вас уже куплена эта награда" });
                }
                const user = rows[0];
                const { rows: rewardsRows } = yield money_1.db.query(`SELECT * FROM rewards WHERE id=${reward_id}`);
                if (rewardsRows.length == 0) {
                    res.status(500).json({ message: "нет такой награды" });
                }
                if (user.balance < rewardsRows[0].price) {
                    res.status(500).json({ message: "не хватает баланса" });
                }
                yield money_1.db.query(`INSERT INTO users_rewards (user_id, createdAt, reward_id) VALUES (${user.id}, '${new Date()}', ${reward_id})`);
                yield money_1.db.query(`UPDATE users SET balance=${user.balance - rewardsRows[0].price} WHERE id=${user.id}`);
                res.status(200).json({ message: "награда успешно куплена" });
            }
            catch (error) {
                res.status(500).json(error);
            }
        });
    }
}
module.exports = new Controller();
