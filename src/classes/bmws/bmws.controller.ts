import { IFork } from "./../../../types/forks";
import { ITag } from "../../../types/tags";
import { Pool } from "pg";
import { arrayToQuotedString } from "../../helpers";
import { Request, Response } from "express";

import { db } from "../../dbs/bmws";
import { v4 } from "uuid";

// req.cookies["auth"]

class Controller {
  async login(req: Request, res: Response) {
    const { name } = req.body;

    const { rows } = await db.query(`SELECT * FROM users`);

    const isExisted = rows.find((el: any) => el.name === name);

    if (isExisted) {
      res.cookie("auth", isExisted.token, {
        maxAge: 9000000,
        httpOnly: false,
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
        `INSERT INTO users (name, token) VALUES ('${name}', '${id}')`
      );

      res.cookie("auth", id, { maxAge: 900000, httpOnly: true });

      res.status(200).json({ message: "пользователь создан" });
    }
  }
}

module.exports = new Controller();
