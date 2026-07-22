// mục 4.1 của 2026-05-11-react-batch-async-tasks-setstate-debounce.md
// Run: node react-batching/promise-all.js
// Expected output:
//   Tuần tự: [ 'user-1', 'user-2', 'user-3' ] ~300ms
//   Song song: [ 'user-1', 'user-2', 'user-3' ] ~100ms

function fetchUser(id, ms) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(`user-${id}`), ms)
  );
}

const round100 = (ms) => Math.round(ms / 100) * 100;

// Tuần tự: mỗi await chờ cái trước xong → thời gian cộng dồn
async function sequential() {
  const start = Date.now();
  const a = await fetchUser(1, 100);
  const b = await fetchUser(2, 100);
  const c = await fetchUser(3, 100);
  console.log("Tuần tự:", [a, b, c], `~${round100(Date.now() - start)}ms`);
}

// Song song: gọi cả 3 cùng lúc, chờ cái lâu nhất
async function parallel() {
  const start = Date.now();
  const [a, b, c] = await Promise.all([
    fetchUser(1, 100),
    fetchUser(2, 100),
    fetchUser(3, 100),
  ]);
  console.log("Song song:", [a, b, c], `~${round100(Date.now() - start)}ms`);
}

sequential().then(parallel);
