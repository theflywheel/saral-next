// Keep the original test file which tests isOdd
const { isOdd } = require("../dist/core-saral.js");

test("isOdd", () => {
  expect(isOdd(1)).toBe(true);
  expect(isOdd(2)).toBe(false);
  expect(isOdd(3)).toBe(true);
});