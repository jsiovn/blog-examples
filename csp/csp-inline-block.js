// Bài viết: 2025-03-30-Script-La-Chay-Tren-Website-Ngan-Chan-XSS-Voi-CSP — mục 3.1 (CSP header chặn inline script)
//
//   node csp/csp-inline-block.js
//   curl -i http://localhost:4020/          # -> HTML có 2 script + header Content-Security-Policy
//   Mở http://localhost:4020/ trên trình duyệt: inline script bị CSP chặn, external script cùng origin chạy.
//
// CSP đặt qua HTTP header ra lệnh cho trình duyệt chỉ THỰC THI script từ nguồn liệt kê sẵn.
// Inline script (dạng payload XSS gần như luôn mang) không có trong whitelist -> bị từ chối thực thi.

// Lưu thành `csp-inline-block.js` (`npm install express`)
const express = require("express");

const app = express();

// Chỉ cho chạy script cùng origin — cấm inline script và script từ domain lạ
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' 'strict-dynamic'; object-src 'none'; base-uri 'none'",
  );
  next();
});

// Trang có 2 script: 1 inline (bị CSP chặn) và 1 cùng origin (được chạy)
app.get("/", (req, res) => {
  res.type("html").send(`<!doctype html>
<p id="inline">inline script: chưa chạy</p>
<p id="external">external script: chưa chạy</p>

<script>
  // Đại diện cho payload XSS chèn thẳng vào trang
  document.getElementById("inline").textContent = "inline script: ĐÃ CHẠY";
</script>
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"
  integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g=="
  crossorigin="anonymous"
></script>
<script src="/app.js"></script>`);
});

// Script cùng origin — hợp lệ với script-src 'self', nên được chạy
app.get("/app.js", (req, res) => {
  res
    .type("js")
    .send(
      `document.getElementById("external").textContent = "external script: ĐÃ CHẠY";`,
    );
});

app.listen(4020);
