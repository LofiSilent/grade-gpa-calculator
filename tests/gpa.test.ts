import { test } from "node:test";
import assert from "node:assert/strict";
import { calculate, type Course } from "../src/gpa.ts";
const course = (grade: string, credits: string, name = "Course"): Course => ({
  id: crypto.randomUUID(),
  name,
  grade,
  credits,
  custom: true,
});
const first = [
  course("3", "5"),
  course("2.67", "5"),
  course("3", "2"),
  course("3", "5"),
  course("3", "5"),
  course("3", "6"),
];
const second = [
  course("3.67", "5"),
  course("3.33", "5"),
  course("3.33", "2"),
  course("2.67", "5"),
  course("3.33", "8"),
  course("3.67", "5"),
  course("4", "2", "Educational practice"),
];
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
    calculate([course("4", "1"), course("2", "3")]).display,
    "2.50",
  ));
test("zero is a valid grade, maximum is 4", () => {
  assert.equal(calculate([course("0", "5")]).display, "0.00");
  assert.equal(calculate([course("4", "5")]).display, "4.00");
});
test("half-up ties and decimal credits use exact arithmetic", () => {
  assert.equal(
    calculate([course("3.00", "0.1"), course("3.01", "0.1")]).display,
    "3.01",
  );
  assert.equal(
    calculate([course("0", "0.2"), course("4", "0.1")]).display,
    "1.33",
  );
});
test("empty calculator and blank rows do not produce a GPA", () => {
  assert.equal(calculate([]).ready, false);
  assert.equal(
    calculate([{ ...course("", "", ""), custom: false }]).invalid,
    0,
  );
});
test("partial and invalid courses block the result", () => {
  for (const c of [
    course("", "5"),
    course("NaN", "5"),
    course("4.01", "5"),
    course("-1", "5"),
    course("3", "0"),
    course("3", "-1"),
    course("3", "Infinity"),
    course("3", "1", ""),
    course("3.001", "1"),
    course("3", "1e3"),
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
