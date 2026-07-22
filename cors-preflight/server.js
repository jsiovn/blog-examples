// Bài viết: 2026-07-21-cors-same-origin-policy-preflight-request
//
//   node cors-preflight/server.js
//
// Hai route để so sánh:
//   /open   — trả Access-Control-Allow-Origin (echo Origin) + xử lý OPTIONS preflight
//   /closed — không set một header CORS nào, nhưng handler VẪN chạy
//
// PORT đổi được qua env, mặc định 4050. Mọi transcript curl trong bài
// đều tái tạo được từ server này (xem README.md).

const http = require('node:http');

const PORT = process.env.PORT || 4050;

// Với /open ta echo đúng Origin thay vì '*', để route này dùng được cả khi
// client gửi credentials (wildcard + credentials là tổ hợp bị cấm — xem bài, mục 5).
function setOpenCorsHeaders(req, res) {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
}

const server = http.createServer((req, res) => {
  const path = req.url.split('?')[0];

  if (path === '/open') {
    setOpenCorsHeaders(req, res);

    // Preflight: browser tự gửi OPTIONS trước request thật khi request không "simple".
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Max-Age', '600');
      res.writeHead(204);
      res.end();
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({ route: '/open', method: req.method }));
    return;
  }

  if (path === '/closed') {
    // Không set header CORS nào. Chú ý: handler VẪN chạy và VẪN trả data —
    // browser chỉ giấu response khỏi JavaScript, chứ request thì đã tới đây rồi.
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({ route: '/closed', method: req.method }));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`CORS examples server: http://localhost:${PORT}`);
  console.log('  /open   — co CORS header + xu ly OPTIONS preflight');
  console.log('  /closed — khong co CORS header nao');
});
