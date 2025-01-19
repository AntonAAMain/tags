import { ITag } from "../../../types/tags";
import { Request, Response } from "express";
import { Pool } from "pg";
import { arrayToQuotedString } from "../../helpers";

const db: Pool = require("../../dbs/todos");
const { v4 } = require("uuid");

class Controller {
  async createUser(req: Request, res: Response) {
    const { user_name, secret_key } = req.body;

    if (secret_key === "anton-frontender") {
      try {
        await db.query(`INSERT INTO users (username) VALUES ('${user_name}');`);

        res.status(200).json({ message: "Все ок)" });
      } catch (error) {
        res.status(500).json({ message: error });
      }
    } else {
      res.status(403).json({ message: "ты кто такой куда лезешь Василий ?" });
    }
  }

  async getAllTodos(req: Request, res: Response) {
    const { user_id } = req.query;

    try {
      const { rows } = await db.query(
        `SELECT * FROM todos` +
          ((user_id as string)?.length > 0 ? ` WHERE userid='${user_id}'` : "")
      );

      res.status(200).json({ message: "Все ок)", data: rows });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async createTodo(req: Request, res: Response) {
    const { title, text, user_id } = req.body;

    try {
      await db.query(
        `INSERT INTO todos (title, text, userid) VALUES ('${title}', '${text}', '${user_id}');`
      );

      res.status(200).json({ message: "Все ок)" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async updateTodo(req: Request, res: Response) {
    const { id, comment } = req.body;

    try {
      await db.query(`UPDATE todos SET comment='${comment}' WHERE id=${id};`);

      res.status(200).json({ message: "Все ок)" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async deleteTodo(req: Request, res: Response) {
    const { id } = req.body;

    try {
      await db.query(`DELETE FROM todos WHERE id=${id}`);
      res.status(200).json({ message: "Все ок)" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async createComment(req: Request, res: Response) {
    const { comment, user_id, todo_id } = req.body;

    try {
      await db.query(
        `INSERT INTO comments (comment, userid, todoid) VALUES ('${comment}', '${user_id}', '${todo_id}');`
      );

      res.status(200).json({ message: "Все ок)" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async updateComment(req: Request, res: Response) {
    const { id, comment } = req.body;

    try {
      await db.query(
        `UPDATE comments SET comment='${comment}' WHERE id=${id};`
      );

      res.status(200).json({ message: "Все ок)" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async deleteComment(req: Request, res: Response) {
    const { id } = req.body;

    try {
      await db.query(`DELETE FROM comments WHERE id=${id}`);
      res.status(200).json({ message: "Все ок)" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }
}

module.exports = new Controller();
