import { Request, Response } from "express";

import { db } from "../../../dbs/bmws";
import { v4 } from "uuid";

class Controller {
  async whoAmI(req: Request, res: Response) {
    const token = req.cookies["auth"];

    if (token) {
      const { rows } = await db.query(
        `SELECT * FROM users WHERE token='${token}'`
      );

      if (rows[0].best_car_id) {
        const { rows: cars } = await db.query(
          `SELECT * FROM cars WHERE id=${rows[0].best_car_id}`
        );

        return res
          .status(200)
          .json({
            message: "успешный вход",
            data: { ...rows[0], bestCar: cars[0] },
          });
      }

      res
        .status(200)
        .json({
          message: "успешный вход",
          data: { ...rows[0], bestCar: null },
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

    console.log(isExisted);
    if (isExisted) {
      res.status(500).json({ message: "Такой ник уже занят" });
    } else {
      const id = v4();

      await db.query(
        `INSERT INTO users (name, token, balance) VALUES ('${name}', '${id}',0)`
      );

      res.status(200).json({ message: "пользователь создан", token: id });
    }
  }
}

module.exports = new Controller();
