import { Request, Response } from "express";

import { db } from "../../../dbs/money";
import { v4 } from "uuid";

class Controller {
  async createReward(req: Request, res: Response) {
    const { name, price, level, description, profit } = req.body;

    try {
      const { rows } = await db.query(
        `SELECT * FROM rewards WHERE name='${name} AND level=${level}'`
      );

      if (rows.length > 0) {
        res.status(500).json({ message: "такая награда уже существует" });
      }

      await db.query(
        `INSERT INTO rewards (name, price, level, description, profit) VALUES ('${name}', ${price}, ${level}, '${description}', ${profit})`
      );

      res.status(200).json({ message: "успех" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async getRewards(req: Request, res: Response) {
    // const { limit, page, level, sort, direction } = req.query;

    // const pageParam = req.query?.page? `OFFSET ${p}`

    const levelParam = req.query?.level
      ? ` WHERE LEVEL=${req.query.level}`
      : "";

    const sortParam =
      req.query?.sort && req.query?.direction
        ? `ORDER BY ${req.query?.sort}  ${(
            req.query.direction as string
          ).toLocaleUpperCase()}`
        : "";

    try {
      const { rows } = await db.query(
        `SELECT * FROM rewards ${levelParam} ${sortParam}`
      );

      res.status(200).json({ message: "успех", data: rows });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}

module.exports = new Controller();
