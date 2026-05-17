# לוח שגרות — Worksheet

A personal Hebrew RTL routine worksheet app for senior management teams.

## What It Does

Fill in 2–3 management routines with structured fields, then view and export them in multiple formats:

- **Cards** — polished summary cards
- **Board** — kanban-style personal board
- **Timeline** — cadence timeline view
- **Table** — original worksheet-style table
- **Presentation** — executive slide deck with fullscreen mode

Export to **PDF**, **PPTX**, or **CSV** — all client-side, no backend required.

Your data is preserved automatically in localStorage between sessions.

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

The production build outputs to `dist/`. Preview it with:

```bash
npm run preview
```

## Deploy to GitHub Pages

### Automatic (GitHub Actions)

Push to `main` or `claude/hebrew-routine-worksheet-app-uCCmL` and the workflow in `.github/workflows/deploy.yml` will build and deploy automatically.

In your GitHub repository settings:
1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**

### Manual

```bash
npm run build
```

Then deploy the `dist/` folder to GitHub Pages via the repository settings (source: `dist` branch or upload manually).

The app is configured with `base: '/DMroutines/'` in `vite.config.js` to match the repository name.

## Libraries Used

| Library | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool |
| html2canvas | Captures DOM for PDF |
| jsPDF | Generates PDF from canvas |
| pptxgenjs | Generates PPTX slides |
| Heebo (Google Fonts) | Hebrew typography |
| JetBrains Mono (Google Fonts) | UI labels and mono text |

## Tech Stack

- Plain React (no TypeScript, no state management library)
- Single-page app — no routing, no backend
- localStorage for persistence
- All exports run entirely in the browser

## Fields

Each routine contains:

```json
{
  "שגרה ניהולית": "",
  "הפורום": "",
  "התוכן הרלוונטי": "",
  "תזמון ומשך": "",
  "הכנות / טכנולוגיה": "",
  "מטרה": "",
  "מדד הצלחה": ""
}
```
