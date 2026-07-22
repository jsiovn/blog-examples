// mục 3 của 2026-05-11-react-batch-async-tasks-setstate-debounce.md
// Run: node react-batching/debounce.js
// Expected output (đúng một dòng, sau ~300ms):
//   Gọi API với: react

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const search = debounce((q) => console.log("Gọi API với:", q), 300);

// Người dùng gõ liên tục: r → re → rea → react
search("r");
search("re");
search("rea");
search("react");
// Chỉ lần gõ cuối mới thực sự gọi API, sau 300ms không gõ thêm
