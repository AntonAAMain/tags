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
const tags_1 = require("../../dbs/tags");
// const db: Pool = require("../../dbs/tags");
class Controller {
    getTest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { rows } = yield tags_1.db.query(`SELECT * FROM tags`);
                res.status(200).json({ message: "success", data: rows });
            }
            catch (error) {
                res.status(422).json({ message: "Unprocessable Entity" });
            }
        });
    }
    removeTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tags, user_id } = req.body;
            try {
                const typedRequestTags = [...tags];
                yield tags_1.db.query(`DELETE FROM tags WHERE tags @> ARRAY${(0, helpers_1.arrayToQuotedString)(typedRequestTags)} AND userid='${user_id}';`);
                res.status(200).json({ message: "успех)" });
            }
            catch (error) {
                console.log(error);
                res.status(400).json({ message: "какая-то ошибка" });
            }
        });
    }
    createTag(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tags, user_id } = req.body;
            try {
                const { rows } = yield tags_1.db.query(`SELECT * FROM tags WHERE userid='${user_id}'`);
                const typedRequestTags = [...tags];
                const typedDbTags = [...rows];
                let isFoundParent = false;
                const isDublicateExisted = !!typedDbTags.find((el) => el.tags.length === typedRequestTags.length &&
                    el.tags[el.tags.length - 1] ===
                        typedRequestTags[typedRequestTags.length - 1]);
                if (typedRequestTags.length === 1 && !isDublicateExisted) {
                    // просто создаем одинарный тег
                    const query = `INSERT INTO tags (tags, userid) VALUES (ARRAY${(0, helpers_1.arrayToQuotedString)(typedRequestTags)}, '${user_id}');`;
                    yield tags_1.db.query(query);
                    res.status(200).json({ message: "success" });
                }
                else {
                    // создаем не одинарный тег
                    for (let i = 0; i < typedDbTags.length; i++) {
                        if (typedDbTags[i].tags.length + 1 === typedRequestTags.length) {
                            const thisTags = [...typedDbTags[i].tags];
                            let matchesCount = 0;
                            for (let j = 0; j < thisTags.length; j++) {
                                if (thisTags[j] === typedRequestTags[j]) {
                                    matchesCount++;
                                }
                                if (matchesCount + 1 === typedRequestTags.length) {
                                    isFoundParent = true;
                                }
                            }
                        }
                    }
                    if (isFoundParent && !isDublicateExisted) {
                        const query = `INSERT INTO tags (tags, userid) VALUES (ARRAY${(0, helpers_1.arrayToQuotedString)(typedRequestTags)}, '${user_id}');`;
                        yield tags_1.db.query(query);
                        res.status(200).json({ message: "успех)" });
                    }
                    else {
                        res.status(400).json({ message: `какая-то ошибка` });
                    }
                }
            }
            catch (error) {
                console.log(error);
                res.status(422).json({ message: "error" });
            }
        });
    }
}
module.exports = new Controller();
