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
        `SELECT * FROM cars WHERE id=${carForSale[0].car_id}`
      );

      const foundCar: IBMWCar = allCars[0];

      await db.query(
        `UPDATE users SET balance=balance+${foundCar.price} WHERE token='${token}'`
      );

      await db.query(`DELETE FROM users_cars WHERE id=${car_id}`);

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

  async resetUser(req: Request, res: Response) {
    const token = req.cookies["auth"];

    if (!token) {
      return res.status(401).json({ message: "не авторизован" });
    }

    try {
      const { rows } = await db.query(
        `SELECT * FROM users WHERE token='${token}'`
      );

      await db.query(
        `UPDATE users SET balance=50, opened_cases=0, best_car_id=NULL WHERE token='${token}'`
      );

      await db.query(`DELETE FROM users_cars WHERE user_id=${rows[0].id}`);

      res.status(200).json({ message: "Пользователь сброшен" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async getUserInventory(req: Request, res: Response) {
    const token = req.cookies["auth"];

    // const page = parseInt(req.query.page as string) || 1;
    const sort = req.query.sort;
    const direction = req.query.direction;
    const min = parseInt(req.query.min as string) || 0;
    const max = parseInt(req.query.max as string) || 1000000;

    if (!token) {
      return res.status(401).json({ message: "не авторизован" });
    }

    const { rows: allUsers } = await db.query(
      `SELECT * FROM users WHERE token='${token}'`
    );

    if (allUsers.length === 0) {
      return res.status(404).json({ message: "нет такого пользователя" });
    }

    const user: IBMWUser = allUsers[0];

    const { rows: allUsersCarsRecords } = await db.query(
      `SELECT * FROM users_cars where user_id=${user.id}`
    );

    const { rows: allCars } = await db.query(`SELECT * FROM cars`);

    // const { rows: allCars } = await db.query(
    //   `SELECT * FROM cars WHERE price>=${min} AND price<=${max} ORDER BY ${sort} ${direction} LIMIT ${limit} OFFSET ${offset}`
    // );

    let allUserCars: IBMWCar[] = allUsersCarsRecords.map((item: any) => {
      return {
        ...allCars.find((car: any) => car.id === item.car_id),
        id: item.id,
      };
    });

    allUserCars = allUserCars.filter(
      (item: IBMWCar) =>
        parseInt(item.price.toString()) >= min &&
        parseInt(item.price.toString()) <= max
    );

    if (sort === "price" && direction === "asc") {
      allUserCars = [...allUserCars.sort((a, b) => a.price - b.price)];
    } else if (sort && direction === "desc") {
      allUserCars = [...allUserCars.sort((a, b) => b.price - a.price)];
    }

    // allUserCars = allUserCars.slice((page - 1) * 10, page * 10);

    return res.status(200).json({ message: "успех", data: allUserCars });
  }
}

module.exports = new Controller();
