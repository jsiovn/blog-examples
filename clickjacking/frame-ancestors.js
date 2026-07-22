// Bài viết: 2025-04-02-Clickjacking-postMessage-va-Tabnabbing — mục 1.2 (chặn nhúng iframe)
//
//   node clickjacking/frame-ancestors.js
//   curl -i http://localhost:4030/          # -> X-Frame-Options + Content-Security-Policy: frame-ancestors 'none'
//   Mở http://localhost:4030/attacker trên trình duyệt: iframe trống, console báo bị chặn.
//
// Hai header đi kèm MỌI response ra lệnh cho trình duyệt: không cho trang nào nhúng trang này vào iframe.
// frame-ancestors 'none' (CSP) ghi đè X-Frame-Options ở trình duyệt mới; X-Frame-Options phủ trình duyệt cũ.

// Lưu thành `frame-ancestors.js` (`npm install express`)
const express = require("express");

const app = express();

// Cấm mọi trang nhúng trang này vào iframe — chặn Clickjacking từ gốc
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Content-Security-Policy", "frame-ancestors 'none'");
  next();
});

app.get("/", (req, res) => {
  res.type("html").send(`<!doctype html>
<h1>Trang thật — form nhạy cảm</h1>
<button>Xác nhận chuyển tiền</button>`);
});

app.listen(4030);
