// Bài viết: 2025-03-30-Script-La-Chay-Tren-Website-Ngan-Chan-XSS-Voi-CSP — mục 2.2 ('strict-dynamic')
//
//   node csp/csp-strict-dynamic.js
//   curl -i http://localhost:4023/          # -> header script-src 'nonce-...' 'strict-dynamic'
//   Mở http://localhost:4023/ trên trình duyệt: xem 4 dòng đổi trạng thái.
//
// 'strict-dynamic': script có nonce khớp được tin cậy, và script do nó tạo ra cũng được tin cậy lây;
// đổi lại trình duyệt BỎ QUA host whitelist — một <script src> viết thẳng trong HTML mà thiếu nonce vẫn bị chặn.

// Lưu thành `csp-strict-dynamic.js` (`npm install express`)
const crypto = require("crypto");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  // Nonce mới cho MỖI request — bắt buộc, không được viết cứng
  const nonce = crypto.randomBytes(16).toString("base64");

  res.setHeader(
    "Content-Security-Policy",
    `script-src 'nonce-${nonce}' 'strict-dynamic'; object-src 'none'; base-uri 'none'`,
  );

  res.type("html").send(`<!doctype html>
<p id="nonced">1. nonced script: chưa chạy</p>
<p id="child">2. script con (do script nonce tạo ra): chưa chạy</p>
<p id="plain">3. inline không nonce: chưa chạy</p>
<p id="host">4. &lt;script src&gt; cùng origin, không nonce: chưa chạy</p>

<!-- 1 + 2: script có nonce chạy, VÀ tự tạo thêm script con — script con cũng chạy -->
<script nonce="${nonce}">
  document.getElementById("nonced").textContent = "1. nonced script: ĐÃ CHẠY";
  const s = document.createElement("script");
  s.textContent =
    "document.getElementById('child').textContent = '2. script con (do script nonce tạo ra): ĐÃ CHẠY';";
  document.body.appendChild(s);
</script>

<!-- 3: inline không nonce -> bị chặn -->
<script>
  document.getElementById("plain").textContent = "3. inline không nonce: ĐÃ CHẠY";
</script>

<!-- 4: script src cùng origin, không nonce -> vẫn bị chặn, vì 'strict-dynamic' bỏ qua host whitelist -->
<script src="/app.js"></script>`);
});

app.get("/app.js", (req, res) => {
  res
    .type("js")
    .send(
      `document.getElementById("host").textContent = "4. <script src> cùng origin, không nonce: ĐÃ CHẠY";`,
    );
});

app.listen(4023);
