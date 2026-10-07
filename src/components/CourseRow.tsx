import { useState } from "react";
import { useI18n } from "../i18n";
import { ChevronDown, Trash2 } from "lucide-react";
import { errorsFor, KNOWN_GRADES, type Course } from "../gpa";

export function CourseRow({
  course,
  index,
  onChange,
  onRemove,
}: {
  course: Course;
  index: number;
  onChange: (c: Course) => void;
  onRemove: () => void;
}) {
  const { t, decimal } = useI18n();
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const errors = errorsFor(course);
  const edit = (key: keyof Course, value: string | boolean) =>
    onChange({ ...course, [key]: value });
  const error = (key: "name" | "grade" | "credits") =>
    touched[key] && errors[key];
  return (
    <div className="course-row">
      <span className="row-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="field name-field">
        <label className="sr-only" htmlFor={`name-${course.id}`}>
          {t("nameLabel", { n: index + 1 })}
        </label>
        <input
          id={`name-${course.id}`}
          placeholder={t("placeholder")}
          value={course.name}
          onChange={(e) => edit("name", e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          aria-invalid={!!error("name")}
          aria-describedby={
            error("name") ? `name-error-${course.id}` : undefined
          }
          autoComplete="off"
          maxLength={200}
        />
        {error("name") && (
          <small id={`name-error-${course.id}`} className="field-error">
            {t(errors.name!)}
          </small>
        )}
      </div>
      <div className="field grade-field" data-label={t("grade")}>
        <label className="sr-only" htmlFor={`grade-${course.id}`}>
          {t("gradeLabel", { n: index + 1 })}
        </label>
        <div className="select-wrap">
          <select
            id={`grade-${course.id}`}
            value={course.custom ? "custom" : course.grade}
            onChange={(e) => {
              setTouched((t) => ({ ...t, grade: false }));
              onChange({
                ...course,
                custom: e.target.value === "custom",
                grade: e.target.value === "custom" ? "" : e.target.value,
              });
            }}
            onBlur={() => setTouched((t) => ({ ...t, grade: true }))}
            aria-invalid={!!error("grade")}
            aria-describedby={
              error("grade") ? `grade-error-${course.id}` : undefined
            }
          >
            <option value="">{t("selectGrade")}</option>
            {KNOWN_GRADES.map((g) => (
              <option key={g.letter} value={g.points}>
                {g.letter} · {decimal(g.points)}
              </option>
            ))}
            <option value="custom">{t("other")}</option>
          </select>
          <ChevronDown size={14} />
        </div>
        {course.custom && (
          <>
            <label className="sr-only" htmlFor={`points-${course.id}`}>
              {t("pointsLabel", { n: index + 1 })}
            </label>
            <input
              className="custom-points"
              id={`points-${course.id}`}
              inputMode="decimal"
              placeholder={t("pointsPlaceholder")}
              value={course.grade}
              onChange={(e) => edit("grade", e.target.value.replace(",", "."))}
              onBlur={() => setTouched((t) => ({ ...t, grade: true }))}
              aria-invalid={!!error("grade")}
              aria-describedby={
                error("grade") ? `grade-error-${course.id}` : undefined
              }
            />
          </>
        )}
        {error("grade") && (
          <small id={`grade-error-${course.id}`} className="field-error">
            {t(errors.grade!)}
          </small>
        )}
      </div>
      <div className="field credit-field" data-label={t("credits")}>
        <label className="sr-only" htmlFor={`credits-${course.id}`}>
          {t("creditsLabel", { n: index + 1 })}
        </label>
        <input
          id={`credits-${course.id}`}
          inputMode="decimal"
          placeholder={t("creditsPlaceholder")}
          value={course.credits}
          onChange={(e) => edit("credits", e.target.value.replace(",", "."))}
          onBlur={() => setTouched((t) => ({ ...t, credits: true }))}
          aria-invalid={!!error("credits")}
          aria-describedby={
            error("credits") ? `credits-error-${course.id}` : undefined
          }
        />
        {error("credits") && (
          <small id={`credits-error-${course.id}`} className="field-error">
            {t(errors.credits!)}
          </small>
        )}
      </div>
      <button
        className="icon-button remove-button"
        aria-label={`${t("removeLabel", { n: index + 1 })}${course.name ? `: ${course.name}` : ""}`}
        onClick={onRemove}
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}
