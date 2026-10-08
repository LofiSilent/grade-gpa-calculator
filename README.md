
# Grade · GPA Calculator

A polished, multilingual GPA calculator for students. Enter courses, final scores out of 100, and credits to see your credit-weighted GPA update instantly.

**Languages:** English · Russian · Kazakh  
**Stack:** React · TypeScript · Vite · Lucide

## Features

- Responsive layouts for desktop, tablet, and mobile
- Light and dark themes
- Instant GPA calculation with an animated circular indicator
- Editable courses with add, remove, reset, and undo actions
- Clear validation for missing or invalid values
- Browser-local saving of courses, theme, and language
- Accessible labels, keyboard navigation, and reduced-motion support
- 100-point grade conversion table and a plain-language calculation explanation

Switching languages changes the interface without modifying your course names, grades, or credits. There are no preset courses or example templates.

## Getting started

Install a recent Node.js version (22.6 or newer) and pnpm. The repository pins its package manager in `package.json`.

```sh
pnpm install
pnpm dev
```

Open the local URL printed by Vite, usually **http://127.0.0.1:5173**.

```sh
pnpm test   # Run calculation and localization tests
pnpm build  # Type-check and create a production build in dist/
```

## Preview in VS Code

Open `gpa-calculator.code-workspace`, then select **Terminal → Run Task… → GPA: Start development server**.

To view the app inside VS Code, open the Command Palette and choose **Browser: Open Integrated Browser**, then enter **http://127.0.0.1:5173**. Older VS Code versions use **Simple Browser: Show**.

Alternatively, press **F5** to launch the configured Chrome debugger. Google Chrome must be installed. See [the VS Code guide](docs/VSCODE.md) for details.

## Calculation policy

```text
GPA = Σ (grade points × credits) / Σ credits
```

The final result is rounded half-up to two decimal places. Fixed-point integer arithmetic preserves exact course contributions and avoids rounding semester averages before calculating a combined GPA.

The supplied reference document is a transcript rather than an official formula specification. This calculator uses the confirmed credit-weighted policy and includes graded practice as a regular course. Users should include only courses that their institution counts toward GPA.

## 100-point grade input

Enter a **whole-number final course score from 0 to 100**. The app converts each score to GPA points before weighting it by credits. The mapping matches every score/GPA-point pair in the supplied Zhetysu transcript, including 79 → 2.67, 83 → 3.00, 88 → 3.33, 93 → 3.67, and 95 → 4.00. The complete table uses the [published reference scale](https://www.farabi.university/students/19?lang=en); the transcript itself contains course examples rather than every possible score.

| Score | Grade | GPA points |
| ----- | ----- | ---------: |
| 95–100 | A | 4.00 |
| 90–94 | A− | 3.67 |
| 85–89 | B+ | 3.33 |
| 80–84 | B | 3.00 |
| 75–79 | B− | 2.67 |
| 70–74 | C+ | 2.33 |
| 65–69 | C | 2.00 |
| 60–64 | C− | 1.67 |
| 55–59 | D+ | 1.33 |
| 50–54 | D | 1.00 |
| 25–49 | FX | 0.50 |
| 0–24 | F | 0.00 |

Scores are not divided by 25 and are not rounded before conversion. Include only GPA-bearing courses under your institution's policy. The app has no preset subjects or sample-loading button: a new calculation starts with one empty row.

Scores use a new browser storage key so old 0–4 grade-point data cannot be mistaken for 0–100 scores. Existing legacy storage is left untouched, and the new form starts blank.

Credit inputs support up to six decimal places, with a technical limit of 1,000,000 credits per course.

## Validation

The regression fixtures reproduce the reference transcript:

| Period                              | Weighted points | Credits |  GPA |
| ----------------------------------- | --------------: | ------: | ---: |
| First semester                      |           82.35 |      28 | 2.94 |
| Second semester, including practice |          108.00 |      32 | 3.38 |
| Full academic year                  |          190.35 |      60 | 3.17 |

The tests cover all 101 possible scores, every supplied transcript conversion pair, decimal credits, rounding ties, invalid inputs, and translation coverage across all three languages. The transcript fixtures use the actual 100-point scores and credit weights from the supplied document.

## Project structure

```text
src/
  components/      Course inputs and GPA result card
  gpa.ts           Exact calculation and validation
  i18n.tsx         Language context and persistence
  locales.ts       English, Russian, and Kazakh messages
  storage.ts       Browser-local course storage
  main.tsx         Application layout and interactions
  styles.css       Responsive styles and themes
scripts/           Local development launcher
.vscode/           Development task and debugger configuration
tests/             Calculation and localization tests
docs/              GitHub Pages build and editor setup guide
```

## Privacy and deployment

Course data stays in the browser's localStorage. The app does not upload course entries or require an application backend. If browser storage is unavailable, the interface displays a warning.

The original transcript and personal information are not included in this repository. Google Fonts are optional; local fallback fonts keep the interface usable if font requests fail.

## GitHub Pages

Live site: https://lofisilent.github.io/grade-gpa-calculator/

```sh
pnpm build:pages
```

This creates a static production build in `docs/` with relative asset paths and preserves the editor guide. Commit the updated `docs/index.html` and `docs/assets/` whenever the application changes. In **Settings → Pages**, select **Deploy from a branch**, branch **main**, and folder **/docs**.

The standard `pnpm build` command creates output in `dist/` for other static hosts. Local preview does not require sign-in. Course entries remain in each visitor’s browser.
