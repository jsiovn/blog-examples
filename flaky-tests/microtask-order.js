// Backs 2026-04-10-flaky-test-nguyen-nhan-va-cach-khac-phuc — mục 2.2, microtask
// vs macrotask ordering (the Run-button snippet). Plain Node.
//
//   node flaky-tests/microtask-order.js
//
// Expected output:
//   1: sync
//   2: sync
//   3: microtask (Promise)
//   4: macrotask (setTimeout 0)

console.log('1: sync');
setTimeout(() => console.log('4: macrotask (setTimeout 0)'), 0);
Promise.resolve().then(() => console.log('3: microtask (Promise)'));
console.log('2: sync');
