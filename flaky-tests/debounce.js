// Backs 2026-04-10-flaky-test-nguyen-nhan-va-cach-khac-phuc — mục 4.1, the debounce
// Run-button snippet (real setTimeout, prints after 100ms). Plain Node.
//
//   node flaky-tests/debounce.js
//
// Expected output (sau 100ms):
//   Đã lưu: c

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const save = debounce((value) => console.log('Đã lưu:', value), 100);
save('a');
save('b');
save('c'); // gọi 3 lần liên tiếp, chỉ lần cuối chạy
