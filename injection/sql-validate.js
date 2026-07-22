// Bài viết: 2025-02-28-Web-Bi-Hack-Qua-SQL-va-Command-Injection — mục 2.4 (Giải pháp 3)
//
//   node injection/sql-validate.js
//
// Validate kiểu input SỚM (chỉ nhận chữ số) là lớp bổ sung, không thay prepared
// statement: câu SELECT vẫn dùng '?'. Input sai kiểu bị chặn trước khi chạm DB.

const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync(":memory:");
db.exec(`
  CREATE TABLE products (id INTEGER, name TEXT);
  INSERT INTO products VALUES (1, 'Ao thun'), (2, 'Quan jean'), (3, 'Non');
`);

function getProduct(productId) {
  if (!/^\d+$/.test(productId)) {
    throw new Error("Invalid product ID");
  }
  return db
    .prepare("SELECT id, name FROM products WHERE id = ?")
    .all(Number(productId));
}

console.log("Hợp lệ  (id=1)      :", JSON.stringify(getProduct("1")));
try {
  getProduct("1 OR 1=1");
} catch (e) {
  console.log("Bị chặn (1 OR 1=1) :", e.message);
}
