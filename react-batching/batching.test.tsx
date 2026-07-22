// mục 2 & 2.2 của 2026-05-11-react-batch-async-tasks-setstate-debounce.md
// Backs the post's headline claim: React 18+ automatic batching gộp nhiều setState
// trong một callback async thành MỘT lần render; flushSync opt-out → mỗi setState một render.
//   cd apps/examples && bun run test   (project: react-batching, jsdom)
import { useState } from "react";
import { flushSync } from "react-dom";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(cleanup);

// Nhấn nút → trong setTimeout gọi ba setState. Đếm số lần render sau lần nhấn.
function makeApp(useFlushSync: boolean, onRender: () => void) {
  return function App() {
    onRender();
    const [a, setA] = useState(0);
    const [b, setB] = useState(0);
    const [c, setC] = useState(0);
    function bump() {
      setTimeout(() => {
        if (useFlushSync) {
          flushSync(() => setA((x) => x + 1));
          flushSync(() => setB((x) => x + 1));
          flushSync(() => setC((x) => x + 1));
        } else {
          setA((x) => x + 1);
          setB((x) => x + 1);
          setC((x) => x + 1);
        }
      }, 0);
    }
    return <button onClick={bump}>{`${a}-${b}-${c}`}</button>;
  };
}

async function clickAndFlush() {
  await act(async () => {
    fireEvent.click(screen.getByRole("button"));
    await new Promise((r) => setTimeout(r, 10));
  });
}

test("automatic batching: ba setState trong setTimeout chỉ gây MỘT render", async () => {
  let renders = 0;
  const App = makeApp(false, () => renders++);
  render(<App />);
  const before = renders; // render khởi tạo
  await clickAndFlush();
  expect(renders - before).toBe(1); // gộp ba setState thành một commit
  expect(screen.getByRole("button").textContent).toBe("1-1-1");
});

test("flushSync opt-out: mỗi setState commit ngay → BA render", async () => {
  let renders = 0;
  const App = makeApp(true, () => renders++);
  render(<App />);
  const before = renders;
  await clickAndFlush();
  expect(renders - before).toBe(3); // flushSync buộc render sau mỗi setState
  expect(screen.getByRole("button").textContent).toBe("1-1-1");
});
