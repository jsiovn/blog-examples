// Bài viết: 2025-02-28-Web-Bi-Hack-Qua-SQL-va-Command-Injection — mục 3
//
//   node injection/command-injection.js
//   curl "http://localhost:4001/ping-unsafe?host=127.0.0.1;whoami"
//   curl "http://localhost:4001/ping-safe?host=127.0.0.1;whoami"
//
// /ping-unsafe chèn lệnh: shell chạy cả `ping` lẫn `whoami`.
// /ping-safe coi toàn bộ "127.0.0.1;whoami" là MỘT hostname -> ping báo lỗi resolve.

const express = require("express");
const { exec, spawn } = require("child_process");
const app = express();

// ❌ exec ghép chuỗi rồi giao cho /bin/sh — dấu ; được hiểu là ngăn cách lệnh
app.get("/ping-unsafe", (req, res) => {
  exec(`ping -c 1 ${req.query.host}`, (err, stdout, stderr) => {
    res.type("text").send(stdout + stderr);
  });
});

// ✅ spawn tách command khỏi arguments — không qua shell
app.get("/ping-safe", (req, res) => {
  const ping = spawn("ping", ["-c", "1", req.query.host]);
  let out = "";
  ping.stdout.on("data", (d) => (out += d));
  ping.stderr.on("data", (d) => (out += d));
  ping.on("close", () => res.type("text").send(out));
});

app.listen(4001);
