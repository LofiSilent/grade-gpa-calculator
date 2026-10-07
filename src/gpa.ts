export type Course = {
  id: string;
  name: string;
  grade: string;
  credits: string;
  custom: boolean;
};
export const KNOWN_GRADES = [
  { letter: "A", points: "4.00" },
  { letter: "A−", points: "3.67" },
  { letter: "B+", points: "3.33" },
  { letter: "B", points: "3.00" },
  { letter: "B−", points: "2.67" },
] as const;
export function emptyCourse(): Course {
  return {
    id: crypto.randomUUID(),
    name: "",
    grade: "",
    credits: "",
    custom: false,
  };
}
export function isActive(c: Course) {
  return !!(c.name.trim() || c.grade || c.credits || c.custom);
}
export function errorsFor(c: Course) {
  const errors: {
    name?: "nameError";
    grade?: "gradeError";
    credits?: "creditsError";
  } = {};
  if (!c.name.trim()) errors.name = "nameError";
  if (!/^\d(?:\.\d{1,2})?$/.test(c.grade) || Number(c.grade) > 4)
    errors.grade = "gradeError";
  if (
    !/^\d+(?:\.\d{1,6})?$/.test(c.credits) ||
    Number(c.credits) <= 0 ||
    Number(c.credits) > 1000000
  )
    errors.credits = "creditsError";
  return errors;
}
function scaled(value: string, places: number): bigint {
  const [whole, decimal = ""] = value.split(".");
  return (
    BigInt(whole) * 10n ** BigInt(places) + BigInt(decimal.padEnd(places, "0"))
  );
}
/** User-confirmed rule: credit-weighted mean, final display rounded half-up to 2 decimals.
 * Grade points and credits use fixed-point integers. No per-course or semester rounding.
 * Include graded practice as a regular course, as confirmed by the user.
 */
export function calculate(courses: Course[]) {
  const active = courses.filter(isActive);
  const invalid = active.filter((c) => Object.keys(errorsFor(c)).length > 0);
  const valid = active.filter((c) => !Object.keys(errorsFor(c)).length);
  const totalCredits = valid.reduce((s, c) => s + scaled(c.credits, 6), 0n);
  const weighted = valid.reduce(
    (s, c) => s + scaled(c.grade, 2) * scaled(c.credits, 6),
    0n,
  );
  const ready = active.length > 0 && invalid.length === 0 && totalCredits > 0n;
  const hundredths = ready
    ? (weighted * 2n + totalCredits) / (totalCredits * 2n)
    : 0n;
  return {
    ready,
    invalid: invalid.length,
    count: valid.length,
    credits: Number(totalCredits) / 1e6,
    weightedPoints: Number(weighted) / 1e8,
    value: ready ? Number(weighted) / Number(totalCredits) / 100 : null,
    display: ready
      ? `${hundredths / 100n}.${String(hundredths % 100n).padStart(2, "0")}`
      : "—",
  };
}
export function exampleCourses(names?: string[]): Course[] {
  return [
    ["English language", "3.00", "5"],
    ["Russian language", "2.67", "5"],
    ["Physical training", "3.00", "2"],
    ["Information technology", "3.00", "5"],
    ["Basics of law", "3.00", "5"],
    ["Algorithms & programming", "3.00", "6"],
  ].map(([name, grade, credits], index) => ({
    id: crypto.randomUUID(),
    name: names?.[index] ?? name,
    grade,
    credits,
    custom: false,
  }));
}
