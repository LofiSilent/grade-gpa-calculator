# Previewing Grade in VS Code

1. Open `gpa-calculator.code-workspace` in VS Code.
2. Select **Terminal → Run Task… → GPA: Start development server**.
3. Open **http://127.0.0.1:5173** from the terminal.

## Preview inside the editor

Open the Command Palette with **Cmd+Shift+P** on macOS or **Ctrl+Shift+P** on Windows/Linux. Choose **Browser: Open Integrated Browser** and enter the local URL. On older versions, choose **Simple Browser: Show**.

## Debugging

Press **F5** and select **GPA: Open in Chrome (F5)**. The pre-launch task starts Vite, then the debugger opens the application in Google Chrome. Chrome must be installed.

If port 5173 is already occupied by this project's development server, use the existing preview rather than starting another copy. Stop the task with the terminal's **Kill Terminal** control when finished.

## Development workflow

Changes in `src/` appear automatically in the local preview. The development server binds only to `127.0.0.1` and does not require ChatGPT sign-in. Updating local code does not automatically change the hosted site.

Dependencies are installed on the original development machine. On another machine, install Node.js and pnpm and run `pnpm install` first. The launcher prefers Node.js from PATH; on the original Codex machine it can also use the bundled runtime when Node.js is not globally installed. The shell launcher requires bash; on Windows use Git Bash, WSL, or run `pnpm dev` directly.

## Languages

Use the **RU / KZ / EN** selector in the header. Your language preference is saved in the browser. Changing language does not modify existing course data; loading an example uses the currently selected language.
