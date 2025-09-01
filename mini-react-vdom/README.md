# Mini React (VDOM)

A tiny virtual‑DOM and hooks experiment, no build step required (plain ES modules).

## Features
- **API**: `h`, `render`, `useState`
- Function components, props/events (`onClick`), style object, `className`
- Simple keyed diff for children
- Minimal hook system per component instance

## Quick Start
```bash
npm i
npm run dev
# open the printed localhost URL (e.g., http://localhost:3000)
```

Or use any static server (VS Code Live Server, `http-server`, `python -m http.server`).

## How it works (high level)
1. `h()` builds VNodes: `{ type, props, key }`.
2. `render()` diffs the new VNode tree against the previous one stored on the container.
3. Function components render to a child VNode; a tiny hook array stores state.
4. Children reconcile with keys when present; otherwise by index.

## File structure
```
mini-react-vdom/
├─ package.json
├─ README.md
├─ public/
│  └─ index.html
├─ src/
│  └─ mini-react.js
└─ demo/
   ├─ App.js
   └─ main.js
```

## Notes
- This project is intentionally small for learning. For real apps, use React/Preact.
- Next steps you can add: `useRef`, `useEffect`, batching scheduler, JSX transform (esbuild).
