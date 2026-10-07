import { useEffect, useRef, useState } from "react";
import { BookOpen, CheckCircle2, Sparkles } from "lucide-react";
import { calculate } from "../gpa";
import { useI18n } from "../i18n";

export function ResultCard({
  result,
}: {
  result: ReturnType<typeof calculate>;
}) {
  const { t, locale, decimal } = useI18n();
  const [animated, setAnimated] = useState<number | null>(result.value);
  const current = useRef(result.value);
  useEffect(() => {
    if (
      result.value === null ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setAnimated(result.value);
      current.current = result.value;
      return;
    }
    const from = current.current ?? 0,
      to = result.value,
      start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const t = Math.min((now - start) / 450, 1);
      const value = from + (to - from) * (1 - Math.pow(1 - t, 3));
      setAnimated(value);
      current.current = value;
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [result.value]);
  const ratio = result.ready ? (animated ?? 0) / 4 : 0;
  return (
    <section className="result-card" aria-labelledby="result-title">
      <div className="result-top">
        <span className="result-eyebrow">
          <span />
          {t("live")}
        </span>
        <Sparkles size={19} />
      </div>
      <h2 id="result-title">{t("yourGpa")}</h2>
      <p className="result-subtitle">{t("resultSubtitle")}</p>
      <div className="gpa-orbit">
        <svg viewBox="0 0 240 240" aria-hidden="true">
          <circle className="orbit-track" cx="120" cy="120" r="105" />
          <circle
            className="orbit-value"
            cx="120"
            cy="120"
            r="105"
            strokeDasharray={`${ratio * 659.734} 659.734`}
          />
        </svg>
        <div className="gpa-center">
          <span className="gpa-number" aria-hidden="true">
            {decimal(
              result.ready
                ? animated === result.value
                  ? result.display
                  : (animated ?? 0).toFixed(2)
                : "—",
            )}
          </span>
          <span className="gpa-max">{t("outOf")}</span>
        </div>
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        {result.ready
          ? t("resultAnnouncement", { gpa: decimal(result.display) })
          : t("unavailable")}
      </div>
      <div className="result-message">
        {result.ready ? (
          <>
            <CheckCircle2 size={16} /> {t("upToDate")}
          </>
        ) : (
          <>
            <BookOpen size={16} />{" "}
            {result.invalid ? t("complete") : t("nextChapter")}
          </>
        )}
      </div>
      <div className="result-stats">
        <div>
          <span>{t("included")}</span>
          <strong>{result.count.toString().padStart(2, "0")}</strong>
        </div>
        <div>
          <span>{t("totalCredits")}</span>
          <strong>
            {result.credits.toLocaleString(locale, {
              maximumFractionDigits: 6,
            })}
          </strong>
        </div>
      </div>
      <p className="result-note">
        {result.invalid ? t("invalidNote") : t("resultNote")}
      </p>
    </section>
  );
}
