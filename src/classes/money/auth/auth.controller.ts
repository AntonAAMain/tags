import { Request, Response } from "express";

import { db } from "../../../dbs/money";
import { v4 } from "uuid";

class Controller {
  async whoAmI(req: Request, res: Response) {
    const token = req.cookies["auth"];

    if (token) {
      const { rows } = await db.query(
        `SELECT * FROM users WHERE token='${token}'`
      );

      res.status(200).json({ message: "успешный вход", data: rows });
    } else {
      res.status(401).json({ message: "не авторизован" });
    }
  }

  async login(req: Request, res: Response) {
    const { name } = req.body;

    const { rows } = await db.query(`SELECT * FROM users`);

    const isExisted = rows.find((el: any) => el.name === name);

    if (isExisted) {
      res.cookie("auth", "isExisted.token", {
        maxAge: 900000,
        httpOnly: false,
        sameSite: "none",
        secure: true,
      });
      res.status(200).json({ message: "успешный вход" });
    } else {
      res.status(500).json({ message: "ну нет такого пользователя" });
    }
  }

  async createUser(req: Request, res: Response) {
    const { name } = req.body;

    const { rows } = await db.query(`SELECT * FROM users`);

    const isExisted = rows.find((el: any) => el.name === name);

    if (isExisted) {
      res.status(500).json({ message: "Такой ник уже занят" });
    } else {
      const id = v4();

      await db.query(
        `INSERT INTO users (name, token, last_activity, balance) VALUES ('${name}', '${id}', '${new Date()}', 0)`
      );

      res.cookie("auth", id, { maxAge: 900000, httpOnly: true });

      res.status(200).json({ message: "пользователь создан" });
    }
  }
}

module.exports = new Controller();
