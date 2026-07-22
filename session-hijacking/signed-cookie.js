const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

// Secret key để ký Cookie. Thực tế lưu trong environment variable.
app.use(cookieParser(process.env.COOKIE_SECRET));

app.get("/login", (req, res) => {
  res.cookie("role", "user", {
    signed: true, // bật cookie signing
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3600000,
  });
  res.send("Logged in as user\n");
});

// Đọc đúng: req.signedCookies chỉ trả giá trị khi chữ ký khớp
app.get("/admin", (req, res) => {
  const role = req.signedCookies.role;
  res.send(role === "admin" ? "Vào được admin panel\n" : "403 Access denied\n");
});

// Đọc sai: req.cookies là túi Cookie CHƯA ký, ai sửa cũng được
app.get("/admin-naive", (req, res) => {
  const role = req.cookies.role;
  res.send(role === "admin" ? "Vào được admin panel\n" : "403 Access denied\n");
});

app.listen(3005);
