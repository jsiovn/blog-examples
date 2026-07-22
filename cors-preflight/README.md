# cors-preflight

Server Node thuần (zero dependency) cho bài **2026-07-21-cors-same-origin-policy-preflight-request**.
Mọi transcript HTTP trong bài đều tái tạo được từ đây.

```sh
node cors-preflight/server.js       # http://localhost:4050 (đổi PORT qua env)
```

Ba lệnh curl mẫu:

```sh
# 1. Simple GET tới /open — response có Access-Control-Allow-Origin
curl -i http://localhost:4050/open -H "Origin: https://app.example.com"

# 2. OPTIONS preflight tới /open — 204 kèm Allow-Methods/Allow-Headers/Max-Age
curl -i -X OPTIONS http://localhost:4050/open \
  -H "Origin: https://app.example.com" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: content-type,authorization"

# 3. POST application/json tới /open — request "thật" (browser sẽ preflight trước)
curl -i -X POST http://localhost:4050/open \
  -H "Origin: https://app.example.com" \
  -H "Content-Type: application/json" \
  -d '{"hello":"world"}'
```

- `/open` echo đúng `Origin` (không dùng `*`) + `Vary: Origin`, và xử lý `OPTIONS` đầy đủ.
- `/closed` không set header CORS nào — nhưng handler **vẫn chạy và vẫn trả data**; đó là điểm mấu chốt: browser chặn JavaScript đọc response, chứ request đã tới server rồi.
