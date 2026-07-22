// Bài viết: 2025-03-30-Script-La-Chay-Tren-Website-Ngan-Chan-XSS-Voi-CSP — mục 2.2 (nonce)
//
//   node csp/csp-nonce.js
//   curl -i http://localhost:4021/          # -> header script-src 'self' 'nonce-...' (helmet thêm cả default-src... của nó)
//   Mở http://localhost:4021/ trên trình duyệt: inline script có nonce khớp -> chạy; tải lại -> nonce đổi mỗi request.
//
// Nonce: server sinh chuỗi ngẫu nhiên mới mỗi request, đặt vào CẢ header LẪN thuộc tính nonce của <script>.
// Chỉ script có nonce khớp mới chạy — payload XSS chèn vào không đoán được nonce nên bị chặn.

// Lưu thành `csp-nonce.js` (`npm install express helmet ejs`)
const crypto = require("crypto");
const path = require("path");
const helmet = require("helmet");
const express = require("express");
const app = express();

app.set("view engine", "ejs");
// Chạy từ apps/examples/ (`node csp/csp-nonce.js`) nên views nằm cạnh file này, không phải cwd
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  // Nonce mới bằng CSPRNG cho MỖI request
  res.locals.cspNonce = crypto.randomBytes(16).toString("base64");
  next();
});

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.cspNonce}'`],
      objectSrc: ["'none'"],
      baseUri: ["'none'"],
    },
  }),
);

app.get("/", (req, res) => {
  // Template engine chèn đúng nonce đó vào thẻ script
  res.render("index", { cspNonce: res.locals.cspNonce });
});

app.listen(4021);
