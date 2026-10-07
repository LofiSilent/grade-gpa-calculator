# Grade · GPA Calculator

A polished, multilingual GPA calculator for students. Enter courses, grade points, and credits to see your credit-weighted GPA update instantly.

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
- Grade reference table and a plain-language calculation explanation

Switching languages changes the interface without modifying your course names, grades, or credits. Loading an example uses course names in the selected language.

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

The transcript provides these letter-to-point pairs:

| Grade | Points |
| ----- | -----: |
| A     |   4.00 |
| A−    |   3.67 |
| B+    |   3.33 |
| B     |   3.00 |
| B−    |   2.67 |

For other grades, choose **Other points** and enter the numeric value from your transcript. The calculator does not assume percentage conversion ranges, repeat-course policies, or failed-course exemptions. The 0–4 scale and two-decimal rounding are calculator settings rather than a claim about official university policy.

Credit inputs support up to six decimal places, with a technical limit of 1,000,000 credits per course.

## Validation

The regression fixtures reproduce the reference transcript:

| Period                              | Weighted points | Credits |  GPA |
| ----------------------------------- | --------------: | ------: | ---: |
| First semester                      |           82.35 |      28 | 2.94 |
| Second semester, including practice |          108.00 |      32 | 3.38 |
| Full academic year                  |          190.35 |      60 | 3.17 |

The tests also cover decimal credits, rounding ties, invalid inputs, translation coverage, and consistent calculations across all three languages.

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
