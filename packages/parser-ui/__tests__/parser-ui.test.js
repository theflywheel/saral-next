const { isEven, formatPercentage, truncateText } = require("../dist/parser-ui.js");

describe("Utility functions", () => {
  test("isEven", () => {
    expect(isEven(1)).toBe(false);
    expect(isEven(2)).toBe(true);
    expect(isEven(3)).toBe(false);
  });
  
  test("formatPercentage", () => {
    expect(formatPercentage(50)).toBe(50);
    expect(formatPercentage(-10)).toBe(0);
    expect(formatPercentage(110)).toBe(100);
  });
  
  test("truncateText", () => {
    expect(truncateText("Hello", 10)).toBe("Hello");
    expect(truncateText("Hello World", 5)).toBe("Hello...");
  });
});