// Bài viết: 2025-04-02-Clickjacking-postMessage-va-Tabnabbing — mục 2.1 (kiểm tra origin ở hai đầu)
//
//   node clickjacking/postmessage-origin.js
//   Mở http://127.0.0.1:4031/sender   -> iframe hiện "Received: Hello from Sender!" (origin khớp)
//   Mở http://localhost:4032/attacker -> iframe vẫn "Đang chờ message..." (message bị bỏ qua);
//                                        console của devtools in: REJECTED <- http://localhost:4032
//
// Origin = scheme + host + port, so sánh theo chuỗi. Nên `127.0.0.1` và `localhost` là HAI origin
// khác nhau dù cùng trỏ về máy này — đủ để dựng một cuộc postMessage cross-origin thật mà không
// cần domain hay HTTPS. Bên gửi hợp lệ ở 127.0.0.1:4031, bên nhận nằm trong iframe ở localhost:4031;
// trang độc chạy trên một server riêng ở localhost:4032, cũng nhúng đúng bên nhận rồi thử gửi message.
// Lưu thành `postmessage-origin.js` (`npm install express`)
const express = require("express");

const app = express();

const SENDER_ORIGIN = "http://127.0.0.1:4031"; // bên gửi
const RECEIVER_ORIGIN = "http://localhost:4031"; // bên nhận, nằm trong iframe

// Bên gửi: nhúng receiver (localhost) vào iframe rồi gửi message kèm targetOrigin cụ thể
app.get("/sender", (req, res) => {
  res.type("html").send(`<!doctype html>
<iframe id="receiverFrame" src="http://localhost:4030/"></iframe>
`);
});

// Bên nhận: chỉ xử lý message đến từ SENDER_ORIGIN, ghi log khi từ chối
app.get("/receiver", (req, res) => {
  res.type("html").send(`<!doctype html>
<p id="message">Đang chờ message...</p>
<script>
  window.addEventListener("message", (event) => {
    // event.origin = origin của BÊN GỬI — phải khớp CHÍNH XÁC, không dùng includes()
    if (event.origin !== "${SENDER_ORIGIN}") {
      console.warn("REJECTED <- " + event.origin);
      return;
    }
    document.getElementById("message").innerText = "Received: " + event.data;
  });
</script>`);
});

app.listen(4031);

// Trang độc, chạy trên server riêng ở một origin khác hẳn: localhost:4032.
// Nó cũng nhúng đúng bên nhận rồi gửi message — không cần ai "cho phép" cả.
const attacker = express();

attacker.get("/attacker", (req, res) => {
  res.type("html").send(`<!doctype html>
<iframe id="receiverFrame" src="${RECEIVER_ORIGIN}/receiver"></iframe>
<script>
  const frame = document.getElementById("receiverFrame");
  frame.addEventListener("load", () => {
    frame.contentWindow.postMessage("payload doc hai", "${RECEIVER_ORIGIN}");
  });
</script>`);
});

attacker.listen(4032);
