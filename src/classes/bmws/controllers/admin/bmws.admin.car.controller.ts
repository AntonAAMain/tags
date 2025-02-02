import { Request, Response } from "express";

import { db } from "../../../../dbs/bmws";
import { v4 } from "uuid";

class Controller {
  async getAllCars(req: Request, res: Response) {
    const { rows } = await db.query("SELECT * FROM cars");

    res.status(200).json({ message: "все ок", data: rows });
  }
}

module.exports = new Controller();
