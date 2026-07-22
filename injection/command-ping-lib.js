// Bài viết: 2025-02-28-Web-Bi-Hack-Qua-SQL-va-Command-Injection — mục 3.2 giải pháp 1
//
//   node injection/command-ping-lib.js
//   curl "http://localhost:4010/ping?host=127.0.0.1"
//   curl "http://localhost:4010/ping?host=127.0.0.1;whoami"
//
// Thư viện `ping` không giao chuỗi cho shell: "127.0.0.1;whoami" chỉ là một
// hostname để resolve, nên không có lệnh thứ hai nào chạy được.
const express = require("express");
const ping = require("ping");

const app = express();

app.get("/ping", async (req, res) => {
  const result = await ping.promise.probe(req.query.host);
  res.json({ host: result.host, alive: result.alive, time: result.time });
});

app.listen(4010);
