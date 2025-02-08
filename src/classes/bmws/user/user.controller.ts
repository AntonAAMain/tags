import { Request, Response } from "express";

import { db } from "../../../dbs/bmws";
import { v4 } from "uuid";
import { IBMWUser } from "../../../../types/bmws/user";
import { IBMWCar } from "../../../../types/bmws/box";

class Controller {
  async sellUserCar(req: Request, res: Response) {
    const token = req.cookies["auth"];

    const { car_id } = req.body;

    if (!token) {
      return res.status(401).json({ message: "не авторизован" });
    }

    const { rows } = await db.query(
      `SELECT * FROM users WHERE token='${token}'`
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "такого пользователя нет" });
    }

    try {
      const user: IBMWUser = rows[0];

      const { rows: carForSale } = await db.query(
        `SELECT * FROM users_cars WHERE id=${car_id}`
      );

      if (carForSale.length === 0) {
        return res.status(404).json({ message: "нет такой машины" });
      }

      const { rows: allCars } = await db.query(
        `SELECT * FROM cars WHERE id=${car_id}`
      );

      if (allCars.length === 0) {
        return res.status(404).json({ message: "нет такой машины" });
      }

      const foundCar: IBMWCar = allCars[0];

      await db.query(
        `UPDATE users SET balance=balance+${foundCar.price} WHERE token='${token}'`
      );

      await db.query(`DELETE FROM users_cars WHERE car_id=${car_id}`);

      const { rows: lastUser } = await db.query(
        `SELECT * FROM users WHERE token='${token}'`
      );

      res
        .status(200)
        .json({ message: "успех", data: parseInt(lastUser[0].balance) });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}

module.exports = new Controller();
