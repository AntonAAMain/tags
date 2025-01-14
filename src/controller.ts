import { Request, Response } from "express";
import { Pool } from "pg";

const db: Pool = require("./db");

class Controller {
  async getTest(req: Request, res: Response) {
    const { title, text, user_id } = req.body;
    const date = new Date();

    try {
      const { rows } = await db.query(`select * from tags`);

      res.status(200).json({ message: "success", data: rows });
    } catch (error) {
      res.status(422).json({ message: "Unprocessable Entity" });
    }
  }
}

module.exports = new Controller();
