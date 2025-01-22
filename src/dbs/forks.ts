const { Pool } = require("pg");

export const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "quest",
  password: "1234",
  port: 5432,
});
