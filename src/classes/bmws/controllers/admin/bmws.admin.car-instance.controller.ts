import { Request, Response } from "express";

import { db } from "../../../../dbs/bmws";
import { v4 } from "uuid";

class Controller {
  async deleteCarInstance(req: Request, res: Response) {
    const { car_instance_id } = req.query;

    try {
      await db.query(`DELETE FROM cars_instances WHERE id=${car_instance_id}`);

      res.status(200).json({ message: "успех" });
    } catch (error) {
      res.status(500).json({ message: "ошибка" });
    }
  }

  async getAllCarsInstances(req: Request, res: Response) {
    const { rows } = await db.query("SELECT * FROM cars_instances");

    res.status(200).json({ message: "все ок", data: rows });
  }

  async createCarInstance(req: Request, res: Response) {
    const { name, photo, year, price } = req.body;

    await db.query(
      `INSERT INTO cars_instances (name, photo, year, price) VALUES ('${name}', '${photo}', ${year}, ${price})`
    );

    res.status(200).json({ message: "экземпляр машины создан" });
  }
}

module.exports = new Controller();
