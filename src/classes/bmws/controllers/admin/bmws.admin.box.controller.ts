import { Request, Response } from "express";

import { db } from "../../../../dbs/bmws";
import { v4 } from "uuid";

class Controller {
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

  async createBox(req: Request, res: Response) {
    const { name, price, mode } = req.body;

    await db.query(
      `INSERT INTO boxes (name, price, mode) VALUES ('${name}', ${price}, '${mode}')`
    );

    res.status(200).json({ message: "бокс создан" });
  }
}

module.exports = new Controller();
