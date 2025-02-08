"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const { Pool } = require("pg");
exports.db = new Pool({
    user: "postgres",
    host: "localhost",
    database: "quest",
    password: "1234",
    port: 5432,
});
