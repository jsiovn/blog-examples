# blog-examples

> Read-only mirror of the runnable code from the blog at **https://javascript.io.vn/**.
> Source of truth lives in the blog monorepo (`apps/examples/`); do not send PRs here.
> Paths in articles map to this repo root — e.g. `apps/examples/mini-hooks/mini-hooks.js` → [`mini-hooks/mini-hooks.js`](mini-hooks/mini-hooks.js).

Runnable versions of the code that appears in the blog posts. A snippet lives here when it needs a real server, a real dependency, or a real HTTP response — i.e. when it cannot be verified by pasting it into the theme's Run button.

The point is that no output in a post is invented: run the example, copy the actual output into the article.

## Layout

One folder per post, named after the post's topic; one file per snippet.

```
apps/examples/
  session-hijacking/
    httponly-cookie.js   ← mục 3.2 của 2025-01-22-Session-Hijacking-...
    samesite-cookie.js   ← mục 5.2 (cần trình duyệt: dựng 2 site, click link cross-site)
    signed-cookie.js     ← mục 6.2 (signed cookie: /admin vs /admin-naive)
  injection/
    sql-injection.js       ← mục 2 của 2025-02-28-Web-Bi-Hack-Qua-SQL-va-Command-Injection (node:sqlite)
    sql-validate.js        ← mục 2.4 giải pháp 3 (validate kiểu input + prepared statement)
    prisma/sql-prisma.js   ← mục 2.4 giải pháp 2 (Prisma findUnique — cần Docker MySQL; xem schema.prisma)
    command-injection.js   ← mục 3 (exec vs spawn: /ping-unsafe vs /ping-safe)
    command-ping-lib.js    ← mục 3.2 giải pháp 1 (thư viện `ping` thuần Node, không shell)
    command-whitelist.js   ← mục 3.4 giải pháp 3 (whitelist hostname + spawn)
    xss-stored.js          ← mục 4.1 (stored XSS: /posts-unsafe vs /posts-safe, node:sqlite)
    xss-headers.js         ← mục 4.3 giải pháp 3 (CSP header) & 5 (httpOnly cookie) — demo CSP chặn inline: xem csp/
    dompurify-sanitize.js  ← mục 4.3 (sanitize rich text bằng isomorphic-dompurify)
  csp/
    csp-inline-block.js    ← mục 3.1 của 2025-03-30-Script-La-Chay-...-CSP (CSP header chặn inline script)
    csp-nonce.js           ← mục 2.2 (nonce + helmet: inline có nonce khớp chạy; cần views/index.ejs)
    csp-strict-dynamic.js  ← mục 2.2 ('strict-dynamic': nonce lây sang script con, bỏ qua host whitelist)
  clickjacking/
    frame-ancestors.js      ← mục 1.2 của 2025-04-02-Clickjacking-... (X-Frame-Options + CSP frame-ancestors chặn nhúng iframe)
    postmessage-origin.js   ← mục 2.1 (cần trình duyệt: sender ở 127.0.0.1:4031, receiver ở localhost:4031 — hai origin khác nhau)
  vitest-mocking/           ← 2026-04-09-vitest-vi-spyon-vs-vi-mock (Vitest tests)
    api.ts greeter.ts logger.ts   modules the tests mock (formatName/fetchUser, greet, logger)
    create-mock.js          ← mục 1 (Run-button snippet: một mock function là gì — plain Node)
    *.test.ts               ← mục 1-7 (vi.fn, vi.mock, vi.hoisted, vi.spyOn, partial mock, vi.mocked, cleanup)
    failing/hoisting.test.ts      ← mục 2 (demo lỗi hoisting — CỐ Ý fail)
  flaky-tests/              ← 2026-04-10-flaky-test-nguyen-nhan-va-cach-khac-phuc (Vitest tests)
    microtask-order.js debounce.js   mục 2.2 & 4.1 (Run-button snippets — plain Node)
    *.test.ts               ← mục 2-7 (await, shared state, fake timers, setSystemTime, seed random, shuffle, retry)
    failing/                ← mục 2.1 & 3 (quên await, rò state — CỐ Ý fail)
  renderhook/               ← 2026-04-23-test-react-hooks-renderhook-vitest (Vitest + jsdom + RTL)
    use*.ts(x)              các hook được test (useCounter, usePrevious, ThemeContext, useFetch, useEventListener, useDebounce)
    *.test.ts(x)            ← mục 1-7 (renderHook, act, rerender, wrapper, waitFor, unmount, fake timers)
    failing/forget-act.test.ts    ← mục 9.1 (quên act — CỐ Ý fail)
  react-batching/           ← 2026-05-11-react-batch-async-tasks-setstate-debounce
    debounce.js             ← mục 3 (Run-button snippet — plain Node: bốn lần gõ → một lời gọi API)
    promise-all.js          ← mục 4.1 (Run-button snippet — tuần tự ~300ms vs song song ~100ms)
    dataloader.js           ← mục 4.2 (Run-button snippet — gom nhiều load trong một tick → 1 request)
    batching.test.tsx       ← mục 2 & 2.2 (Vitest + jsdom + RTL: automatic batching → 1 render; flushSync → 3)
  react-concurrency/        ← 2026-05-08-react-18-concurrency-transitions-suspense
    usetransition.test.tsx  ← mục 2.2 (Vitest + jsdom + RTL: input urgent, results là transition, isPending bật→tắt)
  react-19-features/        ← 2026-05-16-react-19-features-actions-use-hook
    useactionstate.test.tsx ← mục 2 (Vitest + jsdom + RTL: return của action → state; submit chạy action async)
```

Each file starts with a comment naming the post and section it backs, the command to run it, and the output it should produce.

One example needs a real external service, so its file header carries the `docker run` one-liner that starts it (a MySQL for `prisma/sql-prisma.js`). The Prisma client is generated — run `bunx prisma db push` then `bunx prisma generate` (per `injection/prisma/schema.prisma`) before `node prisma/sql-prisma.js`; the `generated/` folder is git-ignored.

## Running

From `apps/examples/`:

```sh
bun install                              # once, from the repo root
node session-hijacking/httponly-cookie.js
curl -i http://localhost:3000/login
```

Or via the package script:

```sh
bun run session-hijacking:httponly
```

Most examples are plain Node — there is no build step, and no Turborepo task, so `bun run dev` at the repo root does not start them.

## Testing examples (Vitest)

The three Testing-pillar posts (`vitest-mocking/`, `flaky-tests/`, `renderhook/`) are themselves Vitest tests, so they run under Vitest rather than as standalone scripts. Three of the React-content posts (`react-batching/`, `react-concurrency/`, `react-19-features/`) add render tests that back a headline behavioural claim each — automatic batching, `useTransition`, and `useActionState`. `vitest.config.ts` defines one project per post; every React project uses `jsdom` + the React plugin.

```sh
bun run test            # all "should pass" examples — 33 tests, all green
bun run test:failing    # the demos that fail on purpose (vitest.failing.config.ts)
```

`bun run test:failing` is **expected to exit non-zero**: those files (each under a `failing/` folder) reproduce the exact failure a post quotes — a forgotten `await`, leaked state, a missing `act()`, the `vi.mock` hoisting `ReferenceError`. Compare their red output against the ` ```text ` blocks in the posts. The default `bun run test` excludes `failing/`, so it stays green.

The plain-Node Run-button snippets from those posts still run directly:

```sh
bun run flaky-tests:debounce          # node flaky-tests/debounce.js  → "Đã lưu: c" (sau 100ms)
bun run flaky-tests:microtask-order   # node flaky-tests/microtask-order.js
bun run vitest-mocking:create-mock
bun run react-batching:debounce       # → "Gọi API với: react"
bun run react-batching:promise-all    # → tuần tự ~300ms, song song ~100ms
bun run react-batching:dataloader     # → "Gửi 1 request cho ids: [ 1, 2, 3 ]"
```
