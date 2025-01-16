import { ITag } from "./../../types/tags";
import { Request, Response } from "express";
import { Pool } from "pg";
import { arrayToQuotedString } from "../helpers";

const db: Pool = require("../db");

class Controller {
  async getTest(req: Request, res: Response) {
    const { title, text, user_id } = req.body;
    const date = new Date();

    try {
      const { rows } = await db.query(`SELECT * FROM tags`);

      res.status(200).json({ message: "success", data: rows });
    } catch (error) {
      res.status(422).json({ message: "Unprocessable Entity" });
    }
  }

  async createTag(req: Request, res: Response) {
    const { tags, user_id } = req.body;

    try {
      const { rows } = await db.query(`SELECT * FROM tags`);

      let matches = 0;

      const typedRequestTags = [...tags] as string[];
      const typedDbTags = [...rows] as ITag[];

      let isFoundParent = false;

      const isDublicateExisted = !!typedDbTags.find(
        (el) =>
          el.tags.length === typedRequestTags.length &&
          el.tags[el.tags.length - 1] ===
            typedRequestTags[typedRequestTags.length - 1]
      );

      if (typedRequestTags.length === 1 && !isDublicateExisted) {
        // просто создаем одинарный тег

        const query = `INSERT INTO tags (tags, userid) VALUES (ARRAY${arrayToQuotedString(
          typedRequestTags
        )}, '${user_id}');`;

        await db.query(query);

        res.status(200).json({ message: "everything is ok from here" });
      } else {
        for (let i = 0; i < typedDbTags.length; i++) {
          if (typedDbTags[i].tags.length + 1 === typedRequestTags.length) {
            const thisTags = [...typedDbTags[i].tags];

            let matchesCount = 0;

            for (let j = 0; j < thisTags.length; j++) {
              if (thisTags[j] === typedRequestTags[j]) {
                matchesCount++;
              }

              if (matchesCount + 1 === thisTags.length) {
                isFoundParent = true;
              }
            }
          }
        }

        if (isFoundParent && !isDublicateExisted) {
          const query = `INSERT INTO tags (tags, userid) VALUES (ARRAY${arrayToQuotedString(
            typedRequestTags
          )}, '${user_id}');`;

          await db.query(query);

          res.status(200).json({ message: "успех)" });
        } else {
          res.status(200).json({ message: "какая-то ошибка" });
        }
      }
      // res.status(200).json({ message: "everything is ok" });
    } catch (error) {
      console.log(error);
      res.status(422).json({ message: "error" });
    }
  }
}

module.exports = new Controller();
