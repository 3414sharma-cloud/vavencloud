# VavenCloud website

React 19 + Vite + Tailwind CSS v4, one single-page app (React Router). It replaces the multi-page site in `../test`;
the design is meant to stay identical, page by page.

## Commands

| Command           | What it does                           |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Local dev server                       |
| `npm run build`   | Type-check, then build to `dist/`      |
| `npm run preview` | Serve the built `dist/` locally        |
| `npm run lint`    | ESLint (including React's hooks rules) |
| `npm run format`  | Prettier                               |

Copy `.env.example` to `.env` for the booking form's API address and reCAPTCHA key.

## Structure

```
src/
  main.tsx            entry: global styles, theme, renders <App>
  app/                App, router (every page), routes (every internal link), site.config
  pages/              one component per page: sets its <title>/description, lays out its sections
  features/           what each page is made of, page by page; every part keeps its components, data,
                      styles and hooks together
    home/             the landing page, one folder per section: hero/, track-record/, story/, behind/,
                      own/, stages/, report/, compare/, reviews/, start/, plans/, faq/, booking/, blog/,
                      sticky-cta/
    team/             the team page (with its particle logo)
    comparison/       the price comparison and the "follow the wires" board
    legal/            the five policies (one layout, their copy in data/)
    shared/           used by more than one page: brand logos, the company's facts
  components/
    layout/           SiteLayout (top bar, header, <main>, footer), Header, Footer and their data
    seo/              PageMeta (<title> and description)
    ui/               small shared pieces: Icon, Logo, SectionHeading, VideoPoster, YouTubeFrame,
                      PaletteSwitch
  hooks/              shared React hooks (in view, theme, scroll reveal, scrolling after navigation)
  lib/                plain TypeScript: theme, palette, motion, smooth scroll, reveal, DOM helpers
  styles/             Tailwind only: the entry (main.css), the theme (theme.css: colours, fonts, shadows),
                      base styles (base.css), custom utilities (utilities.css) and keyframes
                      (animations.css). Shared component classes (card, buttons, form fields) live in
                      components/ui/classes.ts
public/               images and icons, served as-is
```

## Hosting

It's a single-page app: the host must answer every address (`/team/`, `/sla/`, ...) with `index.html`, and React
Router shows the right page. (`vite dev` and `vite preview` already do.) On Netlify, for example, add a
`_redirects` file with `/* /index.html 200`; on Vercel, a rewrite of `/(.*)` to `/index.html`.
