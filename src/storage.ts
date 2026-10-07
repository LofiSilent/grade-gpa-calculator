import { emptyCourse, type Course } from "./gpa";
export const STORAGE_KEY = "grade-courses-v1";
export function loadCourses(): {
  courses: Course[];
  warning: "" | "storageRead" | "storageWrite";
} {
  const fallback = () => Array.from({ length: 3 }, emptyCourse);
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { courses: fallback(), warning: "" };
    const value: unknown = JSON.parse(raw);
    if (
      !Array.isArray(value) ||
      value.length > 10000 ||
      !value.every(
        (c) =>
          c &&
          typeof c === "object" &&
          ["id", "name", "grade", "credits"].every(
            (k) => typeof c[k] === "string",
          ) &&
          typeof c.custom === "boolean",
      ) ||
      new Set(value.map((c) => c.id)).size !== value.length
    )
      throw Error("Invalid saved data");
    return { courses: value as Course[], warning: "" };
  } catch {
    return {
      courses: fallback(),
      warning: "storageRead",
    };
  }
}
