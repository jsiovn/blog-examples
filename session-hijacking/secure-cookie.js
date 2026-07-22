const express = require("express");
const crypto = require("crypto");
const net = require("net");

const APP_PORT = 3002; // server thật
const WIFI_PORT = 3001; // đoạn mạng công cộng kẻ tấn công nghe lén
const SECURE = process.env.SECURE === "1"; // bật/tắt để so sánh hai lần chạy

const app = express();

app.get("/login", (req, res) => {
  const sessionId = crypto.randomBytes(32).toString("hex");

  res.cookie("sessionId", sessionId, {
    httpOnly: true,
    secure: SECURE, // khác biệt duy nhất giữa hai lần chạy
    maxAge: 3600000,
  });

  res.send("Logged in\n");
});

app.get("/me", (req, res) => {
  res.send(`Server nhận được Cookie: ${req.headers.cookie ?? "(không có)"}\n`);
});

app.listen(APP_PORT);

// Kẻ nghe lén: relay TCP, in ra mọi byte client gửi qua mạng công cộng
net
  .createServer((client) => {
    const upstream = net.connect(APP_PORT, "127.0.0.1");
    client.on("data", (chunk) => {
      console.log("--- Kẻ nghe lén đọc được ---");
      console.log(chunk.toString().trim());
      upstream.write(chunk);
    });
    upstream.on("data", (chunk) => client.write(chunk));
    client.on("error", () => {});
    upstream.on("error", () => {});
  })
  .listen(WIFI_PORT);
