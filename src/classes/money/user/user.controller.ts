import {
  IMoneyReward,
  IMoneyUser,
  IMoneyUserReward,
} from "./../../../../types/money/index";
import { Request, Response } from "express";

import { db } from "../../../dbs/money";
import { v4 } from "uuid";
import {
  getLastRewards,
  getMaxLevelReward,
  getStructedRewardsByName,
} from "./helpers";

class Controller {
  async getUserRewards(req: Request, res: Response) {
    const token = req.cookies["auth"];

    if (!token) {
      return res.status(401).json({ message: "Авторизуйтесь" });
    }

    const { rows: allUsers } = await db.query(
      `SELECT * FROM users WHERE token='${token}'`
    );
    const user: IMoneyUser = allUsers[0];

    const { rows: allRewards } = await db.query(`SELECT * FROM rewards`);
    const { rows: allUserRewards } = await db.query(
      `SELECT * FROM users_rewards WHERE user_id=${user.id}`
    );

    const allUserTypedRewards: IMoneyReward[] = allUserRewards.map(
      (userReward: IMoneyUserReward) =>
        allRewards.find((el: IMoneyReward) => el.id === userReward.reward_id)
    );

    const allStructedRewards = getStructedRewardsByName(allRewards);

    return res.status(200).json({
      message: "успех",
      data: getLastRewards(allStructedRewards, allUserTypedRewards),
    });
  }

  async getBalance(req: Request, res: Response) {
    const token = req.cookies["auth"];

    if (!token) {
      return res.status(401).json({ message: "Авторизуйтесь" });
    }

    try {
      const { rows } = await db.query(
        `SELECT * FROM users WHERE token='${token}'`
      );

      if (rows.length === 0) {
        return res
          .status(500)
          .json({ message: "такого пользователя нет в базе" });
      }

      const user: IMoneyUser = rows[0];

      const passedHours =
        (new Date().getTime() - new Date(user.last_activity).getTime()) /
        (1000 * 60 * 60);

      const { rows: userRewards } = await db.query(
        `SELECT * FROM users_rewards WHERE user_id=${user.id}`
      );

      if (userRewards.length === 0) {
        return res.status(200).json({ message: "успех", data: user.balance });
      }

      const rewardsIds = JSON.stringify(
        userRewards.map((item: any) => item.reward_id)
      );

      const { rows: allRewardsRows } = await db.query(
        `SELECT * FROM rewards WHERE id IN (${rewardsIds.slice(
          1,
          rewardsIds.length - 1
        )})`
      );

      const totalProfit = allRewardsRows.reduce((acc: any, value: any) => {
        return acc + value.profit * passedHours;
      }, 0);

      await db.query(
        `UPDATE users SET balance=balance + ${totalProfit}, last_activity='${new Date()}' WHERE id=${
          user.id
        }`
      );

      const { rows: lastUser } = await db.query(
        `SELECT * FROM users WHERE token='${token}'`
      );

      return res
        .status(200)
        .json({ message: "успех", data: lastUser[0].balance });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  async buyReward(req: Request, res: Response) {
    const token = req.cookies["auth"];

    const { reward_id } = req.body;

    if (!token) {
      return res.status(401).json({ message: "Авторизуйтесь" });
    }

    try {
      const { rows } = await db.query(
        `SELECT * FROM users WHERE token='${token}'`
      );

      if (rows.length === 0) {
        return res
          .status(500)
          .json({ message: "такого пользователя нет в базе" });
      }

      const { rows: user_rewards } = await db.query(
        `SELECT * from users_rewards WHERE reward_id=${reward_id}`
      );

      if (user_rewards.length === 1) {
        return res
          .status(500)
          .json({ message: "у вас уже куплена эта награда" });
      }

      const user: IMoneyUser = rows[0];

      const { rows: rewardsRows } = await db.query(
        `SELECT * FROM rewards WHERE id=${reward_id}`
      );

      if (rewardsRows.length == 0) {
        return res.status(500).json({ message: "нет такой награды" });
      }

      if (user.balance < rewardsRows[0].price) {
        return res.status(500).json({ message: "не хватает баланса" });
      }

      await db.query(
        `INSERT INTO users_rewards (user_id, createdAt, reward_id) VALUES (${
          user.id
        }, '${new Date()}', ${reward_id})`
      );

      await db.query(
        `UPDATE users SET balance=${
          user.balance - rewardsRows[0].price
        } WHERE id=${user.id}`
      );

      return res.status(200).json({ message: "награда успешно куплена" });
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

module.exports = new Controller();
