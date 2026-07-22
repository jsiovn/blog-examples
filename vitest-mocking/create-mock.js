// Backs 2026-04-09-vitest-vi-spyon-vs-vi-mock — mục 1, the "what a mock function
// really is" Run-button snippet. Plain Node, no Vitest.
//
//   node vitest-mocking/create-mock.js
//
// Expected output:
//   Số lần gọi: 2
//   Đối số lần gọi đầu: a@example.com, Xin chào

function createMock(impl = () => {}) {
  const calls = [];
  const mock = (...args) => {
    calls.push(args);
    return impl(...args);
  };
  mock.calls = calls;
  return mock;
}

const sendEmail = createMock(() => "sent");

sendEmail("a@example.com", "Xin chào");
sendEmail("b@example.com", "Yo");

console.log("Số lần gọi:", sendEmail.calls.length);
console.log("Đối số lần gọi đầu:", sendEmail.calls[0].join(", "));
