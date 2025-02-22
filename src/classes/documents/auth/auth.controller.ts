import { Request, Response } from "express";

import { db } from "../../../dbs/documents";
import { v4 } from "uuid";

class Controller {
  async whoAmI(req: Request, res: Response) {
    const token = req.headers["authorization"];

    if (token) {
      const { rows } = await db.query(
        `SELECT * FROM users WHERE token='${token}'`
      );

      res.status(200).json({
        message: "успешный вход",
        data: { ...rows[0] },
      });
    } else {
      res.status(401).json({ message: "не авторизован" });
    }
  }

  async login(req: Request, res: Response) {
    const { name } = req.body;

    const { rows } = await db.query(`SELECT * FROM users`);

    const isExisted = rows.find((el: any) => el.name === name);

    if (isExisted) {
      res.status(200).json({
        message: "успешный вход",
        token: isExisted.token,
      });
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
        `INSERT INTO users (name, token, created_at) VALUES ('${name}', '${id}', '${new Date()}')`
      );

      res.status(200).json({ message: "пользователь создан", token: id });
    }
  }
}

module.exports = new Controller();
