// mục 2 của 2026-05-16-react-19-features-actions-use-hook.md
// Backs the post's ChangeName claims: useActionState(actionFn, initialState) trả về
// [state, formAction, isPending]; actionFn nhận (previousState, formData) và giá trị nó
// return trở thành state của lần render kế tiếp; formAction gắn thẳng vào <form action=...>.
//   cd apps/examples && bun run test   (project: react-19-features, jsdom)
import { useActionState } from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";

afterEach(cleanup);

test("useActionState: return của action trở thành state; submit form chạy action async", async () => {
  let initialError: unknown = "unset";
  let shape: [string, string] = ["", ""];

  function ChangeName() {
    const [error, submitAction, isPending] = useActionState(
      async (_previousState: string | null, formData: FormData) => {
        const newName = String(formData.get("name"));
        await Promise.resolve(); // giả lập updateName async
        return newName === "bad" ? "Tên không hợp lệ" : null; // return → state mới
      },
      null, // initial state
    );
    if (initialError === "unset") initialError = error;
    shape = [typeof submitAction, typeof isPending];

    return (
      <form action={submitAction}>
        <input aria-label="name" name="name" defaultValue="bad" />
        <button type="submit" disabled={isPending}>
          Cập nhật
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
    );
  }

  const { container } = render(<ChangeName />);
  // Signature: [state, formAction, isPending] — state khởi tạo là null.
  expect(initialError).toBeNull();
  expect(shape).toEqual(["function", "boolean"]);

  const form = container.querySelector("form")!;
  const input = screen.getByLabelText("name") as HTMLInputElement;

  // Submit với name "bad" → action return message → trở thành state, hiển thị.
  await act(async () => {
    fireEvent.submit(form);
    await Promise.resolve();
  });
  expect(screen.getByRole("alert").textContent).toBe("Tên không hợp lệ");

  // Submit lại với name hợp lệ → action return null → error được xoá.
  await act(async () => {
    fireEvent.change(input, { target: { value: "alice" } });
    fireEvent.submit(form);
    await Promise.resolve();
  });
  expect(screen.queryByRole("alert")).toBeNull();
});
