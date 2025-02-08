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
const bmws_1 = require("../../../dbs/bmws");
class Controller {
    getAllCars(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield bmws_1.db.query("SELECT * FROM cars");
            res.status(200).json({ message: "все ок", data: rows });
        });
    }
    getAllBoxes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { rows } = yield bmws_1.db.query("SELECT * FROM boxes");
            res.status(200).json({ message: "все ок", data: rows });
        });
    }
    getBox(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.query;
            try {
                const { rows: boxes } = yield bmws_1.db.query(`SELECT * FROM boxes WHERE id=${id}`);
                const { rows: boxes_inside } = yield bmws_1.db.query(`SELECT * FROM boxes_inside WHERE box_id=${id}`);
                res.status(200).json({
                    box: boxes[0],
                    boxes_inside,
                });
            }
            catch (error) {
                res.status(500).json(error);
            }
        });
    }
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
    createBox(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, price, mode } = req.body;
            yield bmws_1.db.query(`INSERT INTO boxes (name, price, mode) VALUES ('${name}', ${price}, '${mode}')`);
            res.status(200).json({ message: "бокс создан" });
        });
    }
    createBoxInsideInstance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { car_instance_id, box_id } = req.body;
            car_instance_id.map((item) => __awaiter(this, void 0, void 0, function* () {
                return yield bmws_1.db.query(`INSERT INTO boxes_inside (car_instance_id, box_id) VALUES (${item}, ${box_id})`);
            }));
            res.status(200).json({ message: "запись в бокс создана" });
        });
    }
}
module.exports = new Controller();
