const express = require("express");
const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync(":memory:");
db.exec(`
  CREATE TABLE products (id INTEGER, name TEXT);
  INSERT INTO products VALUES (1, 'Ao thun'), (2, 'Quan jean'), (3, 'Non');
  CREATE TABLE users (id INTEGER, username TEXT, password TEXT);
  INSERT INTO users VALUES (1, 'admin', 's3cr3t');
`);

const app = express();

// ❌ Ghép chuỗi trực tiếp — input đóng được dấu nháy rồi viết thêm SQL
app.get("/search-unsafe", (req, res) => {
  const sql = `SELECT id, name FROM products WHERE id = '${req.query.id}'`;
  res.json({ query: sql, rows: db.prepare(sql).all() });
});

// ✅ Prepared statement — '?' là dữ liệu, không bao giờ là cấu trúc query
app.get("/search-safe", (req, res) => {
  const rows = db.prepare("SELECT id, name FROM products WHERE id = ?").all(req.query.id);
  res.json({ rows });
});

app.listen(4002);
