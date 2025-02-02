import { Request, Response } from "express";

import { db } from "../../../../dbs/bmws";
import { v4 } from "uuid";

class Controller {
  async createBoxInsideInstance(req: Request, res: Response) {
    const { car_instance_id, box_id } = req.body;

    await db.query(
      `INSERT INTO boxes_inside (car_instance_id, box_id) VALUES (${car_instance_id}, ${box_id})`
    );

    res.status(200).json({ message: "запись в бокс создана" });
  }
}

module.exports = new Controller();
