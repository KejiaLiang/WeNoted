# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Browse and note detail

With Node 22.12+ and the frontend dependencies installed, run `npm run dev:notes`
in this directory and open `/browse`. This explicit development mode uses seven
sample PDFs. Likes, saves and comments persist in that browser's local storage.
The normal dev server and production build use the same-origin notes API.

### Integration contract

The team server needs to supply these routes. Authenticate the current user
on every request, including PDF and preview image requests. Return HTTP 401 for
an expired or missing session and 404 for a missing note. The pages redirect a
401 to the existing login route. They currently use same-origin session cookies;
adapt the request helper in `src/notes/api.js` if the team chooses another ticket transport.

| Route | Returns |
| --- | --- |
| GET /api/notes | JSON array of note summaries available to the current user |
| GET /api/notes/:id | One summary plus its comments |
| PUT or DELETE /api/notes/:id/like | Sets or clears the user's like. Returns the updated liked and likeCount values with id |
| PUT or DELETE /api/notes/:id/save | Sets or clears the user's saved note. Returns saved and id |
| POST /api/notes/:id/comments | Accepts a JSON text field. Returns id, comments and commentCount after insertion |

A summary has id (string), title, course, semester, section, author, published
(ISO timestamp), description, same-origin pdfUrl, optional previewUrl, liked,
saved, likeCount and commentCount. Each comment has id, author, created (ISO
timestamp) and text. Derive the author from the authenticated session. The PDF
response uses application/pdf with inline disposition so the browser can display it.
The star represents the same saved-note relation used by Saved Notes.

### Course attribution

Codex generated the Browse and NotePage components and their styles, `src/notes/`,
the development fixtures in `fixtures/notes/`, the preview command, and this
README section. The UI follows the team's submitted wireframes and existing
navigation, footer, typography and palette. Count these additions as LLM-assisted
when preparing the final course README and individual code attribution.
