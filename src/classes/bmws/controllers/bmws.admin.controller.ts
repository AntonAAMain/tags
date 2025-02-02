import { Request, Response } from "express";

import { db } from "../../../dbs/bmws";
import { v4 } from "uuid";

class Controller {
  async getAllCars(req: Request, res: Response) {
    const { rows } = await db.query("SELECT * FROM cars");

    res.status(200).json({ message: "все ок", data: rows });
  }

  async getAllBoxes(req: Request, res: Response) {
    const { rows } = await db.query("SELECT * FROM boxes");

    res.status(200).json({ message: "все ок", data: rows });
  }

  async getBox(req: Request, res: Response) {
    const { id } = req.query;

    try {
      const { rows: boxes } = await db.query(
        `SELECT * FROM boxes WHERE id=${id}`
      );

      const { rows: boxes_inside } = await db.query(
        `SELECT * FROM boxes_inside WHERE box_id=${id}`
      );

      res.status(200).json({
        box: boxes[0],
        boxes_inside,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

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

  async createBox(req: Request, res: Response) {
    const { name, price, mode } = req.body;

    await db.query(
      `INSERT INTO boxes (name, price, mode) VALUES ('${name}', ${price}, '${mode}')`
    );

    res.status(200).json({ message: "бокс создан" });
  }

  async createBoxInsideInstance(req: Request, res: Response) {
    const { car_instance_id, box_id } = req.body as {
      car_instance_id: number[];
      box_id: number;
    };

    car_instance_id.map(
      async (item) =>
        await db.query(
          `INSERT INTO boxes_inside (car_instance_id, box_id) VALUES (${item}, ${box_id})`
        )
    );

    res.status(200).json({ message: "запись в бокс создана" });
  }
}

module.exports = new Controller();
