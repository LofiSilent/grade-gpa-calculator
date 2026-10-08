
export type Course = {
  id: string;
  name: string;
  grade: string;
  credits: string;
};
// Reference scale: https://www.farabi.university/students/19?lang=en
export const GRADE_SCALE = [
  { min: 95, max: 100, letter: "A", points: "4.00" },
  { min: 90, max: 94, letter: "A−", points: "3.67" },
  { min: 85, max: 89, letter: "B+", points: "3.33" },
  { min: 80, max: 84, letter: "B", points: "3.00" },
  { min: 75, max: 79, letter: "B−", points: "2.67" },
  { min: 70, max: 74, letter: "C+", points: "2.33" },
  { min: 65, max: 69, letter: "C", points: "2.00" },
  { min: 60, max: 64, letter: "C−", points: "1.67" },
  { min: 55, max: 59, letter: "D+", points: "1.33" },
  { min: 50, max: 54, letter: "D", points: "1.00" },
  { min: 25, max: 49, letter: "FX", points: "0.50" },
  { min: 0, max: 24, letter: "F", points: "0.00" },
] as const;
export function gradeForScore(score: string) {
  if (!/^\d{1,3}$/.test(score) || Number(score) > 100) return null;
  return GRADE_SCALE.find((band) => Number(score) >= band.min && Number(score) <= band.max) ?? null;
}
export function emptyCourse(): Course {
  return {
    id: crypto.randomUUID(),
    name: "",
    grade: "",
    credits: "",
  };
}
export function isActive(c: Course) {
  return !!(c.name.trim() || c.grade || c.credits);
}
export function errorsFor(c: Course) {
  const errors: {
    name?: "nameError";
    grade?: "gradeError";
    credits?: "creditsError";
  } = {};
  if (!c.name.trim()) errors.name = "nameError";
  if (!gradeForScore(c.grade)) errors.grade = "gradeError";
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
 * Scores are converted through the reference scale before credit weighting.
 * Grade points and credits use fixed-point integers. No per-course or semester rounding.
 * Include graded practice as a regular course, as confirmed by the user.
 */
export function calculate(courses: Course[]) {
  const active = courses.filter(isActive);
  const invalid = active.filter((c) => Object.keys(errorsFor(c)).length > 0);
  const valid = active.filter((c) => !Object.keys(errorsFor(c)).length);
  const totalCredits = valid.reduce((s, c) => s + scaled(c.credits, 6), 0n);
  const weighted = valid.reduce(
    (s, c) => s + scaled(gradeForScore(c.grade)!.points, 2) * scaled(c.credits, 6),
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
