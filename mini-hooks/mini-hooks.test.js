// Plain-node assertions for the mini hooks. Run: node mini-hooks.test.js
const assert = require("node:assert");
const {
  render,
  myUseRef,
  myUseMemo,
  myUseCallback,
  areDepsEqual,
  resetHooks,
} = require("./mini-hooks");

// 1. myUseMemo trả cache khi deps giữ nguyên, recompute khi deps đổi.
{
  resetHooks();
  let computes = 0;
  const Component = (n) =>
    myUseMemo(() => {
      computes++;
      return n * 2;
    }, [n]);

  assert.strictEqual(render(() => Component(5)), 10);
  assert.strictEqual(render(() => Component(5)), 10);
  assert.strictEqual(computes, 1, "deps giữ nguyên → chỉ tính một lần");

  assert.strictEqual(render(() => Component(9)), 18);
  assert.strictEqual(computes, 2, "deps đổi → tính lại");
}

// 2. myUseCallback giữ nguyên reference qua render khi deps không đổi.
{
  resetHooks();
  const Component = (label) => myUseCallback(() => label, [label]);
  const cb1 = render(() => Component("a"));
  const cb2 = render(() => Component("a"));
  assert.strictEqual(cb1, cb2, "cùng deps → cùng reference");

  const cb3 = render(() => Component("b"));
  assert.notStrictEqual(cb2, cb3, "deps đổi → reference mới");
}

// 3. myUseRef trả về cùng một object qua mọi render.
{
  resetHooks();
  const seen = [];
  const Component = () => {
    const ref = myUseRef({ tag: "once" });
    seen.push(ref);
    return ref;
  };
  render(Component);
  render(Component);
  render(Component);
  assert.strictEqual(seen[0], seen[1], "cùng object qua render");
  assert.strictEqual(seen[1], seen[2], "cùng object qua render");
  assert.strictEqual(seen[0].current.tag, "once", "init chỉ chạy một lần");
}

// 4. Hook trong if làm lệch cursor → hai ô nhớ tráo cho nhau.
{
  resetHooks();
  let showEmail = true;
  const Profile = () => {
    if (showEmail) {
      myUseRef("alice@example.com"); // chiếm ô 0 ở render đầu
    }
    const theme = myUseRef("dark"); // định ở ô 1
    return theme.current;
  };

  assert.strictEqual(render(Profile), "dark", "render 1: theme đọc đúng ô");
  showEmail = false; // render 2: bỏ qua hook đầu → cursor lệch
  assert.strictEqual(
    render(Profile),
    "alice@example.com",
    "render 2: theme đọc nhầm ô của email",
  );
}

// 5. areDepsEqual tuân đúng luật Object.is + length.
{
  assert.strictEqual(areDepsEqual([1, "x"], [1, "x"]), true);
  assert.strictEqual(areDepsEqual([1], [1, 2]), false, "khác length");
  assert.strictEqual(areDepsEqual([{}], [{}]), false, "object literal khác reference");
  assert.strictEqual(areDepsEqual(undefined, [1]), false, "lần đầu chưa có deps");
}

console.log("OK — tất cả assertion mini-hooks đều pass");
