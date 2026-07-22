// Bài viết: 2025-02-28-Web-Bi-Hack-Qua-SQL-va-Command-Injection — mục 4.3
//
//   node injection/dompurify-sanitize.js
//
// isomorphic-dompurify tự kèm jsdom nên chạy được server-side trong Node.
// Nó giữ lại HTML an toàn và loại bỏ script/onerror trong rich text.

const DOMPurify = require('isomorphic-dompurify');

const dirty = '<p>Xin chào <b>bạn</b></p><img src=x onerror="steal()"><script>alert(1)</script>';

const clean = DOMPurify.sanitize(dirty, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href'],
});

console.log('Sau:', clean);
