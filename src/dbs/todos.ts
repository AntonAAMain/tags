import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "todos",
  password: "1234",
  port: 5432,
});

module.exports = pool;
