# InternSync (Phase 1 MVP)

InternSync is a clean React application for a university web project check-in.

**Phase 1 scope (frontend only):**
- Component-based UI
- Routing + navigation (React Router)
- Mock/local data
- Real interactivity (filtering + search)
- Polished responsive layout

## Tech
- React + Vite
- TypeScript
- React Router
- Tailwind CSS

## Local dev

```bash
npm install
npm run dev
```

## Build / Preview

```bash
npm run build
npm run preview
```

## Vercel deployment notes
- This is a single-page app; `vercel.json` includes a rewrite so React Router routes work on refresh.

## Project structure
- `src/components`: reusable UI components (Navbar, Layout, cards, etc.)
- `src/pages`: route pages (Dashboard, Applications, Companies)
- `src/data`: mock data
- `src/hooks`: small reusable hooks (debounce)
