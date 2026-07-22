// mục 2.2 của 2026-05-08-react-18-concurrency-transitions-suspense.md
// Backs the post's SearchBox claims: useTransition trả về [isPending, startTransition];
// setQuery ngoài callback là urgent (input cập nhật ngay), setResults trong startTransition
// là transition, và cờ isPending bật trong lúc transition chạy rồi tắt khi xong.
//   cd apps/examples && bun run test   (project: react-concurrency, jsdom)
import { useState, useTransition, type ChangeEvent } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(cleanup);

const ITEMS = ["apple", "apricot", "banana", "cherry", "cranberry"];

test("useTransition: input urgent cập nhật ngay, results là transition, isPending bật rồi tắt", async () => {
  const pendingLog: boolean[] = [];
  let hookShape: [string, string] = ["", ""];

  function SearchBox({ allItems }: { allItems: string[] }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(allItems);
    const [isPending, startTransition] = useTransition();
    hookShape = [typeof isPending, typeof startTransition];
    pendingLog.push(isPending);

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
      const value = e.target.value;
      setQuery(value); // urgent: input phải theo kịp phím
      startTransition(() => {
        setResults(allItems.filter((item) => item.includes(value))); // non-urgent
      });
    }

    return (
      <>
        <input aria-label="q" value={query} onChange={handleChange} />
        {isPending && <span>Đang lọc…</span>}
        <ul>
          {results.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </>
    );
  }

  render(<SearchBox allItems={ITEMS} />);

  // Post: "Hook trả về đúng hai phần tử: [isPending, startTransition]".
  expect(hookShape).toEqual(["boolean", "function"]);

  await act(async () => {
    fireEvent.change(screen.getByLabelText("q"), { target: { value: "ap" } });
    await Promise.resolve();
  });

  // Urgent: ô input cập nhật ngay.
  expect((screen.getByLabelText("q") as HTMLInputElement).value).toBe("ap");
  // Transition đã commit danh sách đã lọc.
  const items = screen.getAllByRole("listitem").map((li) => li.textContent);
  expect(items).toEqual(["apple", "apricot"]);
  // isPending bật ở một render giữa chừng rồi tắt khi transition xong.
  expect(pendingLog).toContain(true);
  expect(pendingLog[pendingLog.length - 1]).toBe(false);
});
