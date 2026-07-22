// mục 4.2 của 2026-05-11-react-batch-async-tasks-setstate-debounce.md
// Run: node react-batching/dataloader.js
// Expected output:
//   Gửi 1 request cho ids: [ 1, 2, 3 ]
//   Nhận về: [ 'User 1', 'User 2', 'User 3' ]

function createBatcher(batchFn) {
  let queue = [];
  let scheduled = false;
  return function load(id) {
    return new Promise((resolve) => {
      queue.push({ id, resolve });
      if (scheduled) return;
      scheduled = true;
      // Gom mọi lời gọi trong cùng một tick, gửi một request duy nhất
      queueMicrotask(async () => {
        const batch = queue;
        queue = [];
        scheduled = false;
        console.log("Gửi 1 request cho ids:", batch.map((item) => item.id));
        const results = await batchFn(batch.map((item) => item.id));
        batch.forEach((item, i) => item.resolve(results[i]));
      });
    });
  };
}

const loadUser = createBatcher(async (ids) => ids.map((id) => `User ${id}`));

// 3 nơi khác nhau cùng cần user trong một tick → gộp thành 1 request
Promise.all([loadUser(1), loadUser(2), loadUser(3)]).then((users) =>
  console.log("Nhận về:", users)
);
