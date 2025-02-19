const { Pool } = require("pg");

export const db = new Pool({
  user: "postgres",
  host: "localhost",
  database: "documents",
  password: "1234",
  port: 5432,
});
