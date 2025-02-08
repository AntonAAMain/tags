"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../helpers");
const forks_1 = require("../../dbs/forks");
class Controller {
    // async createFork(req: Request, res: Response) {
    //   const { text, action, path, user_id, type, title } = req.body;
    //   try {
    //     const { rows } = await db.query(
    //       `SELECT * FROM forks WHERE userid=${user_id}`
    //     );
    //     const typedRequestPaths = [...path] as string[];
    //     const typedDbPaths = [...rows] as IFork[];
    //     if (!!typedDbPaths.find((item) => item.title === title)) {
    //       res.status(500).json({ message: "title должен быть уникальным" });
    //     } else {
    //       let isFoundParent = false;
    //       const isDublicateExisted = !!typedDbPaths.find(
    //         (el) =>
    //           el.path.length === typedRequestPaths.length &&
    //           el.path[el.path.length - 1] ===
    //             typedRequestPaths[typedRequestPaths.length - 1]
    //       );
    //       if (typedRequestPaths.length === 1 && !isDublicateExisted) {
    //         // просто создаем одинарный тег
    //         const query = `INSERT INTO forks (path, action, userid, type, text, title) VALUES (ARRAY${arrayToQuotedString(
    //           typedRequestPaths
    //         )}, '${action}', ${user_id}, '${type}', '${text}', '${title}');`;
    //         await db.query(query);
    //         res.status(200).json({ message: "success" });
    //       } else {
    //         // создаем не одинарный тег
    //         for (let i = 0; i < typedDbPaths.length; i++) {
    //           if (typedDbPaths[i].path.length + 1 === typedRequestPaths.length) {
    //             const thisTags = [...typedDbPaths[i].path];
    //             let matchesCount = 0;
    //             for (let j = 0; j < thisTags.length; j++) {
    //               if (thisTags[j] === typedRequestPaths[j]) {
    //                 matchesCount++;
    //               }
    //               if (matchesCount + 1 === typedRequestPaths.length) {
    //                 isFoundParent = true;
    //               }
    //             }
    //           }
    //         }
    //         if (isFoundParent && !isDublicateExisted) {
    //           const query = `INSERT INTO forks (path, action, userid, type, text, title) VALUES (ARRAY${arrayToQuotedString(
    //             typedRequestPaths
    //           )}, '${action}', ${user_id}, '${type}', '${text}', '${title}');`;
    //           await db.query(query);
    //           res.status(200).json({ message: "успех)" });
    //         } else {
    //           res.status(400).json({ message: `какая-то ошибка` });
    //         }
    //       }
    //     }
    //   } catch (error) {
    //     console.log(error);
    //     res.status(422).json({ message: error });
    //   }
    // }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rows } = yield forks_1.db.query(`SELECT * FROM forks`);
                res.status(200).json({ message: "success", data: rows });
            }
            catch (error) {
                res.status(422).json({ message: "Unprocessable Entity" });
            }
        });
    }
    // async removeFork(req: Request, res: Response) {
    //   const { path, user_id } = req.body;
    //   try {
    //     const typedRequestTags = [...path] as string[];
    //     await db.query(
    //       `DELETE FROM forks WHERE path @> ARRAY${arrayToQuotedString(
    //         typedRequestTags
    //       )} AND userid='${user_id}';`
    //     );
    //     res.status(200).json({ message: "успех)" });
    //   } catch (error) {
    //     console.log(error);
    //     res.status(400).json({ message: "какая-то ошибка" });
    //   }
    // }
    createFork(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, text, parent_ids, user_id, type } = req.body;
            try {
                if (parent_ids.length === 0) {
                    forks_1.db.query(`INSERT INTO forks (title, text, parent_ids, userid, type) VALUES ('${title}', '${text}', null, ${user_id}, '${type}')`);
                    res.status(200).json({ message: "success" });
                }
                else {
                    const { rows } = yield forks_1.db.query(`SELECT * FROM forks WHERE userid=${user_id}`);
                    if (!!rows.find((item) => parent_ids.includes(item.id))) {
                        forks_1.db.query(`INSERT INTO forks (title, text, parent_ids, userid, type) VALUES ('${title}', '${text}', ARRAY${(0, helpers_1.arrayToQuotedString)(parent_ids)}, ${user_id}, '${type}')`);
                        res.status(200).json({ message: "success" });
                    }
                    else {
                        res.status(400).json({ message: "нет таких parent_ids" });
                    }
                }
            }
            catch (error) {
                res.status(400).json({ message: error });
            }
        });
    }
    updateFork(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, text, parent_ids, type, id } = req.body;
            try {
                yield forks_1.db.query(`UPDATE forks SET text='${text}', title='${title}', type='${type}', parent_ids=ARRAY${(0, helpers_1.arrayToQuotedString)(parent_ids)} WHERE id=${id}`);
                res.status(200).json({ message: "success" });
            }
            catch (error) {
                res.status(400).json({ message: error });
            }
        });
    }
}
module.exports = new Controller();
