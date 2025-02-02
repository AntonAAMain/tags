import { IMoneyUser } from "./../../../../types/money/index";
import { Request, Response } from "express";

import { db } from "../../../dbs/money";
import { v4 } from "uuid";

class Controller {
  async getBalance(req: Request, res: Response) {
    const token = req.cookies["auth"];

    if (!token) {
      res.status(401).json({ message: "Авторизуйтесь" });
    }

    try {
      const { rows } = await db.query(
        `SELECT * FROM users WHERE token='${token}'`
      );

      if (rows.length === 0) {
        res.status(500).json({ message: "такого пользователя нет в базе" });
      }

      const user: IMoneyUser = rows[0];

      const passedHours =
        (new Date().getTime() - new Date(rows[0].last_activity).getTime()) /
        (1000 * 60 * 60);

      console.log("passed hours are - ", passedHours);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}

module.exports = new Controller();
