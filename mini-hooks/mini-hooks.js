// Mini re-implementation of useMemo / useCallback / useRef — a TEACHING model.
// This is NOT how React really works: React stores hook state as a linked list
// (`memoizedState`) on a per-instance fiber, with a scheduler and batching.
// Here we use one module-scope array + a cursor so the rules become visible.

// ---- mini runtime -----------------------------------------------------------
const cells = []; // ô nhớ hook, persist giữa các lần render
let cursor = 0; // con trỏ, reset về 0 mỗi lần render
let current = null;

function render(Component) {
  cursor = 0; // luôn bắt đầu đọc ô từ index 0
  current = Component;
  return Component();
}

// myUseState tối giản — chỉ đủ để DRIVE các demo, không phải bài về state.
function myUseState(initial) {
  const i = cursor;
  if (cells[i] === undefined) {
    cells[i] = [
      initial,
      (next) => {
        cells[i][0] = next;
        render(current); // đổi value xong thì render lại
      },
    ];
  }
  cursor++;
  return cells[i];
}

// ---- myUseRef ---------------------------------------------------------------
// Tạo { current } đúng MỘT LẦN; mọi render sau trả về ĐÚNG object đó.
// Không có setter → mutate .current không schedule render nào cả.
function myUseRef(initial) {
  const i = cursor;
  if (cells[i] === undefined) {
    cells[i] = { current: initial };
  }
  cursor++;
  return cells[i];
}

// ---- myUseMemo --------------------------------------------------------------
// So sánh deps đúng thuật toán React: cùng length + Object.is từng phần tử.
function areDepsEqual(prevDeps, nextDeps) {
  if (prevDeps === undefined || nextDeps === undefined) return false;
  if (prevDeps.length !== nextDeps.length) return false;
  for (let i = 0; i < prevDeps.length; i++) {
    if (!Object.is(prevDeps[i], nextDeps[i])) return false;
  }
  return true;
}

function myUseMemo(factory, deps) {
  const i = cursor;
  const prev = cells[i]; // [value, deps] của lần trước
  if (prev && areDepsEqual(prev[1], deps)) {
    cursor++;
    return prev[0]; // deps không đổi → trả cache
  }
  const value = factory(); // deps đổi (hoặc lần đầu) → tính lại
  cells[i] = [value, deps];
  cursor++;
  return value;
}

// ---- myUseCallback ----------------------------------------------------------
// Chỉ một dòng: chứng minh useCallback(fn, deps) ≡ useMemo(() => fn, deps).
const myUseCallback = (fn, deps) => myUseMemo(() => fn, deps);

// Reset toàn bộ ô nhớ — để mỗi demo/test chạy trên trạng thái sạch.
function resetHooks() {
  cells.length = 0;
  cursor = 0;
  current = null;
}

module.exports = {
  render,
  myUseState,
  myUseRef,
  myUseMemo,
  myUseCallback,
  areDepsEqual,
  resetHooks,
};
