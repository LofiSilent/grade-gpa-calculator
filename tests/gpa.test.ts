
import { test } from "node:test";
import assert from "node:assert/strict";
import { calculate, gradeForScore, type Course } from "../src/gpa.ts";
const course = (grade: string, credits: string, name = "Course"): Course => ({
  id: crypto.randomUUID(),
  name,
  grade,
  credits,
});
const first = [
  course("83", "5"),
  course("79", "5"),
  course("82", "2"),
  course("83", "5"),
  course("81", "5"),
  course("82", "6"),
];
const second = [
  course("93", "5"),
  course("88", "5"),
  course("87", "2"),
  course("78", "5"),
  course("88", "8"),
  course("90", "5"),
  course("95", "2", "Educational practice"),
];
test("matches every supplied 100-point / GPA-point transcript pair", () => {
  const pairs = [[83, "3.00"], [79, "2.67"], [82, "3.00"],
    [81, "3.00"], [93, "3.67"], [88, "3.33"], [87, "3.33"],
    [78, "2.67"], [90, "3.67"], [95, "4.00"]] as const;
  for (const [score, points] of pairs) {
    assert.equal(gradeForScore(String(score))?.points, points);
  }
});
test("reproduces semester 1: 2.94 across 28 credits", () => {
  const r = calculate(first);
  assert.equal(r.display, "2.94");
  assert.equal(r.credits, 28);
  assert.equal(r.weightedPoints, 82.35);
});
test("reproduces semester 2: 3.38 across 32 credits", () => {
  const r = calculate(second);
  assert.equal(r.display, "3.38");
  assert.equal(r.credits, 32);
  assert.equal(r.weightedPoints, 108);
});
test("reproduces year: 3.17 across 60 credits without rounding semesters", () => {
  const r = calculate([...first, ...second]);
  assert.equal(r.display, "3.17");
  assert.equal(r.credits, 60);
  assert.equal(r.weightedPoints, 190.35);
});
test("weights by credits, not by number of courses", () =>
  assert.equal(
    calculate([course("95", "1"), course("65", "3")]).display,
    "2.50",
  ));
test("zero and 100 are valid scores", () => {
  assert.equal(calculate([course("0", "5")]).display, "0.00");
  assert.equal(calculate([course("100", "5")]).display, "4.00");
});
test("half-up ties and decimal credits use exact arithmetic", () => {
  assert.equal(
    calculate([course("80", "0.1"), course("85", "0.1")]).display,
    "3.17",
  );
  assert.equal(
    calculate([course("0", "0.2"), course("95", "0.1")]).display,
    "1.33",
  );
});
test("empty calculator and blank rows do not produce a GPA", () => {
  assert.equal(calculate([]).ready, false);
  assert.equal(
    calculate([course("", "", "")]).invalid,
    0,
  );
});
test("partial and invalid courses block the result", () => {
  for (const c of [
    course("", "5"),
    course("NaN", "5"),
    course("101", "5"),
    course("-1", "5"),
    course("80", "0"),
    course("80", "-1"),
    course("80", "Infinity"),
    course("80", "1", ""),
    course("80.5", "1"),
    course("80", "1e3"),
  ]) {
    const r = calculate([first[0], c]);
    assert.equal(r.ready, false);
    assert.equal(r.display, "—");
    assert.equal(r.invalid, 1);
  }
});

test("without practice, the listed courses alone produce 3.33 and 3.14", () => {
  assert.equal(calculate(second.slice(0, -1)).display, "3.33");
  assert.equal(calculate([...first, ...second.slice(0, -1)]).display, "3.14");
});

test("all grade conversion boundaries map to the published scale", () => {
  const bands = [
    [0, 24, "0.00"], [25, 49, "0.50"], [50, 54, "1.00"],
    [55, 59, "1.33"], [60, 64, "1.67"], [65, 69, "2.00"],
    [70, 74, "2.33"], [75, 79, "2.67"], [80, 84, "3.00"],
    [85, 89, "3.33"], [90, 94, "3.67"], [95, 100, "4.00"],
  ] as const;
  for (const [min, max, points] of bands) {
    for (let score = min; score <= max; score++) {
      assert.equal(gradeForScore(String(score))?.points, points, `score ${score}`);
      assert.equal(calculate([course(String(score), "1")]).display, points);
    }
  }
});
test("rejects decimals, out-of-range scores and invalid syntax without converting them", () => {
  for (const score of ["", "-1", "101", "100.01", "99.5", "3.00", "NaN", "Infinity", "1e2", " 80", "80 "]) {
    assert.equal(gradeForScore(score), null);
  }
});
