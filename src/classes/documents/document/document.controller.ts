import { IDocumentsUser } from "./../../../../types/documents/user";
import { IBMWBox, IBMWCar, IBMWElement } from "./../../../../types/bmws/box";
import { IBMWUser } from "./../../../../types/bmws/user";
import { Request, Response } from "express";

import { db } from "../../../dbs/documents";
import { v4 } from "uuid";

class Controller {
  async saveDocument(req: Request, res: Response) {
    const token = req.headers["authorization"];

    const { id, parts } = req.body;

    if (!token) {
      return res.status(401).json({ message: "не авторизован" });
    }

    try {
      await db.query(
        `UPDATE users_documents SET parts='${parts}' WHERE id=${id}`
      );

      res.status(200).json({ message: "успех" });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async getDocument(req: Request, res: Response) {
    const token = req.headers["authorization"];
    const { id } = req.params;

    if (!token) {
      return res.status(401).json({ message: "не авторизован" });
    }

    try {
      const { rows: users } = await db.query(
        `SELECT * FROM users WHERE token='${token}'`
      );

      if (users.length === 0) {
        return res.status(404).json({ message: "нет такого юзера" });
      }

      const { rows: allDocuments } = await db.query(
        `SELECT * FROM users_documents WHERE id=${id}`
      );

      if (allDocuments.length === 0) {
        return res.status(404).json({ message: "нет такого документа" });
      }

      return res.status(200).json({ message: "успех", data: allDocuments[0] });
    } catch (error) {
      return res.status(500).json({ message: "успех", data: error });
    }
  }

  async getAllDocuments(req: Request, res: Response) {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ message: "не авторизован" });
    }

    try {
      const { rows: users } = await db.query(
        `SELECT * from users WHERE token='${token}'`
      );

      if (users.length === 0) {
        return res.status(404).json({ message: "нет такого юзера" });
      }

      const user: IDocumentsUser = users[0];

      const { rows } = await db.query(
        `SELECT * FROM users_documents WHERE user_id=${user.id}`
      );

      return res.status(200).json({ message: "успех", data: rows });
    } catch (error) {
      return res.status(500).json({ message: "успех", data: error });
    }
  }

  async createDocument(req: Request, res: Response) {
    const { name } = req.body;

    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ message: "не авторизован" });
    }

    try {
      const { rows: users } = await db.query(
        `SELECT * from users WHERE token='${token}'`
      );

      if (users.length === 0) {
        return res.status(404).json({ message: "нет такого юзера" });
      }

      const user: IDocumentsUser = users[0];

      await db.query(
        `INSERT INTO users_documents (user_id, name, created_at, updated_at, parts) VALUES (${
          user.id
        }, '${name}', '${new Date()}', '${new Date()}', '${JSON.stringify([
          {
            id: "3",
            type: "text",
            text: "Первый текст 2",
          },
        ])}')`
      );

      res.status(200).json({ data: "успех" });
    } catch (error) {
      res.status(500).json({ data: error });
    }
  }
}

module.exports = new Controller();
