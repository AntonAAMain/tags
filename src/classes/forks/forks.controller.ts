import { IFork } from "./../../../types/forks";
import { ITag } from "../../../types/tags";
import { Request, Response } from "express";
import { Pool } from "pg";
import { arrayToQuotedString } from "../../helpers";

import { db } from "../../dbs/forks";

class Controller {
  async createFork(req: Request, res: Response) {
    const { text, action, path, user_id, type } = req.body;

    try {
      const { rows } = await db.query(
        `SELECT * FROM forks WHERE userid=${user_id}`
      );

      console.log("i am here", rows);

      const typedRequestPaths = [...path] as string[];
      const typedDbPaths = [...rows] as IFork[];

      let isFoundParent = false;

      const isDublicateExisted = !!typedDbPaths.find(
        (el) =>
          el.path.length === typedRequestPaths.length &&
          el.path[el.path.length - 1] ===
            typedRequestPaths[typedRequestPaths.length - 1]
      );

      if (typedRequestPaths.length === 1 && !isDublicateExisted) {
        // просто создаем одинарный тег

        const query = `INSERT INTO forks (path, action, userid, type, text) VALUES (ARRAY${arrayToQuotedString(
          typedRequestPaths
        )}, '${action}', ${user_id}, '${type}', '${text}');`;

        await db.query(query);

        res.status(200).json({ message: "success" });
      } else {
        // создаем не одинарный тег

        for (let i = 0; i < typedDbPaths.length; i++) {
          if (typedDbPaths[i].path.length + 1 === typedRequestPaths.length) {
            const thisTags = [...typedDbPaths[i].path];

            let matchesCount = 0;

            for (let j = 0; j < thisTags.length; j++) {
              if (thisTags[j] === typedRequestPaths[j]) {
                matchesCount++;
              }

              if (matchesCount + 1 === typedRequestPaths.length) {
                isFoundParent = true;
              }
            }
          }
        }

        if (isFoundParent && !isDublicateExisted) {
          const query = `INSERT INTO forks (path, action, userid, type) VALUES (ARRAY${arrayToQuotedString(
            typedRequestPaths
          )}, '${action}', ${user_id}, '${type}', '${text}');`;

          await db.query(query);

          res.status(200).json({ message: "успех)" });
        } else {
          res.status(400).json({ message: `какая-то ошибка` });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(422).json({ message: error });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const { rows } = await db.query(`SELECT * FROM forks`);

      res.status(200).json({ message: "success", data: rows });
    } catch (error) {
      res.status(422).json({ message: "Unprocessable Entity" });
    }
  }

  async removeFork(req: Request, res: Response) {
    const { path, user_id } = req.body;

    try {
      const typedRequestTags = [...path] as string[];

      await db.query(
        `DELETE FROM forks WHERE path @> ARRAY${arrayToQuotedString(
          typedRequestTags
        )} AND userid='${user_id}';`
      );

      res.status(200).json({ message: "успех)" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "какая-то ошибка" });
    }
  }
}

module.exports = new Controller();
