const express = require("express");

const BANK_PORT = 3003; // bank -> http://127.0.0.1:3003
const BLOG_PORT = 3004; // site khác -> http://localhost:3004

const bank = express();

bank.get("/login", (req, res) => {
  const base = { httpOnly: true, maxAge: 3600000 };

  res.cookie("sess_strict", "s1", { ...base, sameSite: "strict" });
  res.cookie("sess_lax", "s2", { ...base, sameSite: "lax" });
  res.cookie("sess_none", "s3", { ...base, sameSite: "none", secure: true });

  res.type("html").send(`<h1>bank: đã đăng nhập</h1>
    <p>Giờ mở <a href="http://localhost:${BLOG_PORT}">site khác</a>.</p>`);
});

bank.get("/dashboard", (req, res) => {
  // Cookie nào thực sự tới được server?
  res.type("html").send(`<h1>bank: dashboard</h1>
    <pre>${req.headers.cookie ?? "(không có Cookie nào)"}</pre>
    <p>Bấm F5 để gửi lại chính request này.</p>`);
});

bank.listen(BANK_PORT);

const blog = express();

blog.get("/", (req, res) => {
  res.type("html").send(`<h1>Một site khác</h1>
    <p><a href="http://127.0.0.1:${BANK_PORT}/dashboard">Xem dashboard của bank</a></p>`);
});

blog.listen(BLOG_PORT);
