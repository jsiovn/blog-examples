// Bài viết: 2025-01-22-Session-Hijacking-Tu-Cookie-Bao-Ve-Bang-Secure-Signing — mục 3.2
//
//   node session-hijacking/httponly-cookie.js
//   curl -i http://localhost:3000/login
//
// Header mong đợi:
//   Set-Cookie: sessionId=<hex>; Max-Age=3600; Path=/; Expires=<date>; HttpOnly

const express = require('express');
const crypto = require('crypto');
const app = express();

app.get('/login', (req, res) => {
  // Session ID phải sinh bằng CSPRNG, KHÔNG dùng Math.random()
  const sessionId = crypto.randomBytes(32).toString('hex');

  res.cookie('sessionId', sessionId, {
    httpOnly: true,      // JS không đọc được, nhưng trình duyệt vẫn gửi kèm request
    maxAge: 3600000      // 1 giờ
  });

  res.send('Logged in successfully!');
});

app.listen(3000);
