import { IBMWBox, IBMWCar, IBMWElement } from "./../../../../types/bmws/box";
import { IBMWUser } from "./../../../../types/bmws/user";
import { Request, Response } from "express";

import { db } from "../../../dbs/bmws";
import { v4 } from "uuid";
import { getRandomBoxElement } from "./helpers";

class Controller {
  async openBox(req: Request, res: Response) {
    const { box_id } = req.body;
    const token = req.cookies["auth"];

    if (!token) {
      return res.status(401).json({ message: "не авторизован" });
    }

    const { rows } = await db.query(
      `SELECT * FROM users WHERE token='${token}'`
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "такого пользователя нет" });
    }

    const user: IBMWUser = rows[0];

    const { rows: allBoxes } = await db.query(
      `SELECT * FROM boxes WHERE id=${box_id}`
    );

    if (allBoxes.length === 0) {
      return res.status(404).json({ message: "такого кейса нет" });
    }

    const box: IBMWBox = allBoxes[0];

    const difference = user.balance - box.price;

    if (difference < 0) {
      return res
        .status(500)
        .json({ message: "недостаточно баланса", data: rows });
    }

    await db.query(
      `UPDATE users SET balance=balance-${box.price} WHERE token='${token}'`
    );

    await db.query(
      `UPDATE users SET opened_cases=opened_cases+1 WHERE token='${token}'`
    );

    const { rows: boxesElements } = await db.query(
      `SELECT * FROM boxes_elements WHERE box_id=${box_id}`
    );

    const { rows: allCars } = await db.query("SELECT * FROM cars");

    const randomElement = getRandomBoxElement(boxesElements);

    const prize: IBMWCar = allCars.find(
      (car: IBMWCar) => car.id === randomElement?.car_id
    );

    if (!user.best_car_id) {
      await db.query(
        `UPDATE users SET best_car_id=${randomElement?.car_id} WHERE token='${token}'`
      );
    } else if (
      parseInt(prize.price.toString()) >
      parseInt(
        allCars.find((car: IBMWCar) => car.id === user.best_car_id).price
      )
    ) {
      await db.query(
        `UPDATE users SET best_car_id=${prize.id} WHERE token='${token}'`
      );
    }

    await db.query(
      `INSERT INTO users_cars (user_id, car_id, created_at) VALUES (${
        user.id
      }, ${randomElement?.car_id}, '${new Date()}')`
    );

    const { rows: allUsers } = await db.query(
      `SELECT * FROM users WHERE token='${token}'`
    );

    const { rows: allUsersCars } = await db.query(`SELECT * FROM users_cars`);

    res.status(200).json({
      message: "успех",
      data: {
        car: {
          ...allUsersCars[allUsersCars.length - 1],
          prize,
        },
        balance: parseInt(allUsers[0].balance),
      },
    });
  }

  async getAllBoxes(req: Request, res: Response) {
    const token = req.cookies["auth"];

    if (token) {
      const { rows } = await db.query(`SELECT * FROM boxes`);

      res.status(200).json({ message: "успешный вход", data: rows });
    } else {
      res.status(401).json({ message: "не авторизован" });
    }
  }

  async getBox(req: Request, res: Response) {
    const token = req.cookies["auth"];
    const { id } = await req.query;

    if (token) {
      const { rows } = await db.query(`SELECT * FROM boxes WHERE id=${id}`);
      const { rows: boxElements } = await db.query(
        `SELECT * FROM boxes_elements WHERE box_id=${id}`
      );

      const { rows: allCars } = await db.query("SELECT * FROM cars");

      const typedBoxElements = boxElements.map((boxElement: IBMWElement) =>
        allCars.find((car: IBMWCar) => boxElement.car_id === car.id)
      );

      try {
        if (rows.length === 0) {
          res.status(404).json({ message: "нет такого бокса", data: rows });
        }

        res.status(200).json({
          message: "успешный вход",
          data: { ...rows[0], elements: typedBoxElements },
        });
      } catch (error) {
        res.status(500).json({ message: error });
      }
    } else {
      res.status(401).json({ message: "не авторизован" });
    }
  }
}

module.exports = new Controller();
