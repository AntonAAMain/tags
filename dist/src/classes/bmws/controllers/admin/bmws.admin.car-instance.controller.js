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
const bmws_1 = require("../../../../dbs/bmws");
class Controller {
    deleteCarInstance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { car_instance_id } = req.query;
            try {
                yield bmws_1.db.query(`DELETE FROM cars_instances WHERE id=${car_instance_id}`);
                res.status(200).json({ message: "успех" });
            }
            catch (error) {
                res.status(500).json({ message: "ошибка" });
            }
        });
    }
    getAllCarsInstances(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield bmws_1.db.query("SELECT * FROM cars_instances");
            res.status(200).json({ message: "все ок", data: rows });
        });
    }
    createCarInstance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, photo, year, price } = req.body;
            yield bmws_1.db.query(`INSERT INTO cars_instances (name, photo, year, price) VALUES ('${name}', '${photo}', ${year}, ${price})`);
            res.status(200).json({ message: "экземпляр машины создан" });
        });
    }
}
module.exports = new Controller();
