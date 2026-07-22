// Bài viết: 2025-02-28-Web-Bi-Hack-Qua-SQL-va-Command-Injection — mục 4.3 (Giải pháp 3 & 5)
//
//   node injection/xss-headers.js
//   curl -i http://localhost:4007/login   # -> header Content-Security-Policy + Set-Cookie ... HttpOnly
//
// CSP header (đặt cho mọi response) là lớp phòng thủ độc lập với điểm render.
// httpOnly giữ session cookie ngoài tầm với của document.cookie -> XSS không đọc trộm được.
// Demo CSP chặn inline script chạy thật: xem bài CSP -> apps/examples/csp/csp-inline-block.js

// Lưu thành `xss-headers.js` (`npm install express`)
const express = require("express");

const app = express();

// CSP cho MỌI response — trình duyệt chỉ chạy script từ nguồn liệt kê sẵn
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self'; object-src 'none'; base-uri 'none'",
  );
  next();
});

app.get("/login", (req, res) => {
  res.cookie("sessionId", "abc123", {
    httpOnly: true, // JavaScript không đọc được
    secure: true, // chỉ gửi qua HTTPS
    sameSite: "lax",
  });
  res.type("text").send("Đã set session cookie (HttpOnly)\n");
});

app.listen(4007);
