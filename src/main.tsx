import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Info,
  Moon,
  Plus,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import {
  calculate,
  emptyCourse,
  exampleCourses,
  isActive,
  KNOWN_GRADES,
  type Course,
} from "./gpa";
import { loadCourses, STORAGE_KEY } from "./storage";
import "./styles.css";
import { I18nProvider, useI18n } from "./i18n";
import type { MessageKey } from "./locales";

import { CourseRow } from "./components/CourseRow";
import { ResultCard } from "./components/ResultCard";

function App() {
  const { locale, setLocale, t, decimal, exampleNames } = useI18n();
  const [initial] = useState(loadCourses);
  const [courses, setCourses] = useState<Course[]>(initial.courses);
  const [theme, setTheme] = useState(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  const [saveWarning, setSaveWarning] = useState(initial.warning);
  const [undo, setUndo] = useState<{
    courses: Course[];
    message: MessageKey;
  } | null>(null);
  const [scaleOpen, setScaleOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const scaleButton = useRef<HTMLButtonElement>(null);
  const result = calculate(courses);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
      setSaveWarning("");
    } catch {
      setSaveWarning("storageWrite");
    }
  }, [courses]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("grade-theme", theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    if (scaleOpen) dialog.current?.showModal();
    else dialog.current?.close();
  }, [scaleOpen]);
  const add = () => {
    const c = emptyCourse();
    setCourses((prev) => [...prev, c]);
    setUndo(null);
    requestAnimationFrame(() =>
      document.getElementById(`name-${c.id}`)?.focus(),
    );
  };
  const remove = (id: string) => {
    setUndo({ courses: [...courses], message: "removed" });
    setCourses((prev) => prev.filter((c) => c.id !== id));
    requestAnimationFrame(() => addButton.current?.focus());
  };
  const reset = () => {
    setUndo({ courses: [...courses], message: "resetDone" });
    setCourses([emptyCourse(), emptyCourse(), emptyCourse()]);
  };
  const loadExample = () => {
    setUndo({
      courses: [...courses],
      message: "exampleDone",
    });
    setCourses(exampleCourses(exampleNames));
  };
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#" aria-label={t("home")}>
          <span className="brand-mark">
            <GraduationCap size={23} />
          </span>
          grade<span className="brand-dot">.</span>
        </a>
        <nav aria-label={t("navigation")}>
          <a className="nav-link active" href="#calculator">
            {t("calculator")}
          </a>
          <a className="nav-link" href="#how-it-works">
            {t("howLink")} <ArrowUpRight size={13} />
          </a>
        </nav>
        <div className="header-controls">
          <label className="sr-only" htmlFor="language-selector">
            {t("language")}
          </label>
          <select
            className="language-selector"
            id="language-selector"
            value={locale}
            onChange={(e) => setLocale(e.target.value as "ru" | "kk" | "en")}
          >
            <option value="ru" lang="ru">
              RU · Русский
            </option>
            <option value="kk" lang="kk">
              KZ · Қазақша
            </option>
            <option value="en" lang="en">
              EN · English
            </option>
          </select>
          <button
            className="theme-button"
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
            aria-label={t(theme === "light" ? "dark" : "light")}
          >
            <Sun size={16} className={theme === "light" ? "selected" : ""} />
            <Moon size={16} className={theme === "dark" ? "selected" : ""} />
          </button>
        </div>
      </header>
      <main>
        <section className="hero">
          <div>
            <div className="eyebrow">
              <span className="tiny-line" /> {t("eyebrow")}
            </div>
            <h1>
              {t("title")}
              <span className="title-dot">.</span>
            </h1>
            <p>{t("subtitle")}</p>
            <p className="hero-secondary">{t("heroSecondary")}</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-grid" />
            <div className="floating-note note-back">
              <span>{t("potential")}</span>
              <div className="mini-bars">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="floating-note note-front">
              <div className="art-icon">
                <GraduationCap size={25} />
              </div>
              <div>
                <small>{t("clarity")}</small>
                <strong>{t("possibility")}</strong>
              </div>
              <ArrowUpRight size={21} />
            </div>
            <span className="art-spark">✳</span>
          </div>
        </section>
        <div className="workspace" id="calculator">
          <section className="calculator-card" aria-labelledby="courses-title">
            <div className="card-header">
              <div>
                <div className="heading-with-icon">
                  <span className="soft-icon">
                    <BookOpen size={19} />
                  </span>
                  <h2 id="courses-title">{t("courses")}</h2>
                </div>
                <p>{t("coursesDescription")}</p>
              </div>
              <span className="course-count">
                {t("courseCount", { n: courses.filter(isActive).length })}
              </span>
            </div>
            <div className="calculator-tools">
              <span className="scale-caption">{t("weighted")}</span>
              <button
                ref={scaleButton}
                className="text-button"
                onClick={() => setScaleOpen(true)}
              >
                {t("scale")} <Info size={14} />
              </button>
            </div>
            <div className="column-labels" aria-hidden="true">
              <span /> <span>{t("courseName")}</span>
              <span>{t("grade")}</span>
              <span>{t("credits")}</span>
              <span />
            </div>
            <div className="courses">
              {courses.map((course, index) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  index={index}
                  onChange={(c) =>
                    setCourses((prev) =>
                      prev.map((p) => (p.id === c.id ? c : p)),
                    )
                  }
                  onRemove={() => remove(course.id)}
                />
              ))}
            </div>
            {courses.length === 0 && (
              <div className="empty-state">
                <BookOpen size={28} />
                <h3>{t("fresh")}</h3>
                <p>{t("firstCourse")}</p>
              </div>
            )}
            <button ref={addButton} className="add-course" onClick={add}>
              <Plus size={18} /> {t("add")}
            </button>
            {result.invalid > 0 && (
              <p className="validation-note" role="status">
                <Info size={15} /> {t("incomplete", { n: result.invalid })}
              </p>
            )}
            <div className="calculator-footer">
              <span
                className={`save-status ${saveWarning ? "warning" : ""}`}
                role="status"
              >
                {saveWarning ? <Info size={14} /> : <Check size={14} />}{" "}
                {t(saveWarning ? "notSaved" : "saved")}
              </span>
              <button className="text-button reset-button" onClick={reset}>
                <RotateCcw size={14} /> {t("reset")}
              </button>
            </div>
            {saveWarning && (
              <p className="storage-warning" role="alert">
                {t(saveWarning)}
              </p>
            )}
          </section>
          <aside>
            <ResultCard result={result} />
            <div className="privacy-note">
              <ShieldCheck size={17} />
              <p>
                {t("privacy")}
                <br />
                <span>{t("privacyDetail")}</span>
              </p>
            </div>
          </aside>
        </div>
        <div className="below-calculator">
          <span>
            <span className="live-dot" /> {t("instant")}
          </span>
          <button className="text-button" onClick={loadExample}>
            {t("example")} <ArrowUpRight size={14} />
          </button>
        </div>
        <section className="how-section" id="how-it-works">
          <div className="how-header">
            <div>
              <div className="eyebrow">{t("mathEyebrow")}</div>
              <h2>{t("howTitle")}</h2>
            </div>
            <p>
              {t("everyCourse")}
              <br />
              {t("creditWeight")}
            </p>
          </div>
          <div className="how-grid">
            <div className="formula-card">
              <span>{t("formulaTitle")}</span>
              <div className="formula">
                <strong>GPA</strong>
                <span>=</span>
                <div className="fraction">
                  <span>{t("numerator")}</span>
                  <span>{t("denominator")}</span>
                </div>
              </div>
              <p>
                {t("rounding")}
                <br />
                {t("precision")}
              </p>
            </div>
            <div className="steps">
              <div>
                <span>01</span>
                <p>
                  <strong>{t("step1Title")}</strong>
                  {t("step1")}
                </p>
              </div>
              <div>
                <span>02</span>
                <p>
                  <strong>{t("step2Title")}</strong>
                  {t("step2")}
                </p>
              </div>
              <div>
                <span>03</span>
                <p>
                  <strong>{t("step3Title")}</strong>
                  {t("step3")}
                </p>
              </div>
            </div>
          </div>
          <details className="source-details">
            <summary>
              <Info size={15} /> {t("rules")} <ChevronDown size={15} />
            </summary>
            <p>{t("source")}</p>
          </details>
        </section>
      </main>
      <footer className="site-footer">
        <span className="footer-brand">grade.</span>
        <p>{t("footer")}</p>
        <span>
          {t("care")} <Sparkles size={13} />
        </span>
      </footer>
      {undo && (
        <div className="undo-toast" role="status">
          <CheckCircle2 size={16} />
          <span>{t(undo.message)}</span>
          <button
            onClick={() => {
              setCourses(undo.courses);
              setUndo(null);
            }}
          >
            {t("undo")}
          </button>
          <button
            className="icon-button"
            onClick={() => setUndo(null)}
            aria-label={t("dismiss")}
          >
            <X size={15} />
          </button>
        </div>
      )}
      <dialog
        ref={dialog}
        onCancel={() => setScaleOpen(false)}
        onClose={() => {
          setScaleOpen(false);
          scaleButton.current?.focus();
        }}
        aria-labelledby="scale-title"
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">{t("fromTranscript")}</span>
            <h2 id="scale-title">{t("gradePoints")}</h2>
          </div>
          <button
            className="icon-button"
            onClick={() => setScaleOpen(false)}
            aria-label={t("closeScale")}
          >
            <X size={20} />
          </button>
        </div>
        <p>{t("pairs")}</p>
        <table>
          <thead>
            <tr>
              <th scope="col">{t("letterGrade")}</th>
              <th scope="col">{t("gradePoints")}</th>
            </tr>
          </thead>
          <tbody>
            {KNOWN_GRADES.map((g) => (
              <tr key={g.letter}>
                <td>
                  <span className="grade-pill">{g.letter}</span>
                </td>
                <td>{decimal(g.points)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-note">
          <Info size={18} />
          <p>{t("scaleNote")}</p>
        </div>
        <button className="primary-button" onClick={() => setScaleOpen(false)}>
          {t("gotIt")} <Check size={16} />
        </button>
      </dialog>
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>,
);
