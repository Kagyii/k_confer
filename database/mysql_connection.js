const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "k_confer",
  waitForConnections: true,
});

module.exports = pool.promise();
