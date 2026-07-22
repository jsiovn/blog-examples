// Bài viết: 2025-02-28-Web-Bi-Hack-Qua-SQL-va-Command-Injection — mục 3.4 (Giải pháp 3)
//
//   node injection/command-whitelist.js
//   curl "http://localhost:4009/ping?host=127.0.0.1"            # -> ping chạy
//   curl "http://localhost:4009/ping?host=127.0.0.1;whoami"     # -> 400 Invalid hostname
//
// Whitelist: chỉ cho qua chữ, số, chấm, gạch. Payload chèn lệnh bị chặn ngay ở cổng,
// trước cả khi tới spawn. Kết hợp với spawn (không shell) là hai lớp phòng thủ.

const express = require("express");
const { spawn } = require("child_process");

const app = express();

function isValidHostname(host) {
  return /^[a-zA-Z0-9.-]+$/.test(host); // chỉ chữ, số, chấm, gạch
}

app.get("/ping", (req, res) => {
  if (!isValidHostname(req.query.host ?? "")) {
    return res.status(400).type("text").send("Invalid hostname\n");
  }
  const ping = spawn("ping", ["-c", "1", req.query.host]);
  let out = "";
  ping.stdout.on("data", (d) => (out += d));
  ping.stderr.on("data", (d) => (out += d));
  ping.on("close", () => res.type("text").send(out));
});

app.listen(4009);
