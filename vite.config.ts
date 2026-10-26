import { globSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const srcDir = resolve(rootDir, 'src')
const pagesDir = resolve(srcDir, 'pages')

/**
 * Multi-page app: every `src/pages/**\/index.html` is its own page and build entry.
 *   src/pages/index.html          -> /
 *   src/pages/pricing/index.html  -> /pricing/
 * New pages are picked up automatically (restart `npm run dev` after adding one).
 */
const pages = Object.fromEntries(
  globSync('**/index.html', { cwd: pagesDir }).map((file) => {
    const route = file.replaceAll('\\', '/').replace(/\/?index\.html$/, '')
    return [route || 'home', resolve(pagesDir, file)]
  }),
)

/**
 * Applies the saved theme before first paint. Default is light (white background, black text);
 * dark only when the visitor picks it (or picks "System" and their OS is dark).
 * Keep the storage key in sync with src/shared/lib/theme.ts.
 */
const themeBootScript = `(function(){try{var c=localStorage.getItem('vc-theme-choice');var d=c==='dark'||(c==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light'}catch(e){}})()`

/** Head tags every page needs, so each page's index.html only holds its own title/description. */
function sharedHead(): Plugin {
  const tags: HtmlTagDescriptor[] = [
    { tag: 'script', children: themeBootScript, injectTo: 'head-prepend' },
    { tag: 'meta', attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1.0' } },
    { tag: 'meta', attrs: { name: 'theme-color', content: '#ffffff' } },
    { tag: 'link', attrs: { rel: 'icon', type: 'image/png', href: '/favicon.png' } },
    { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/favicon.png' } },
    { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
    { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
    {
      tag: 'link',
      attrs: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      },
    },
  ]
  return {
    name: 'vavencloud:shared-head',
    transformIndexHtml: () => tags.map((t) => ({ injectTo: 'head' as const, ...t })),
  }
}

export default defineConfig({
  root: pagesDir,
  publicDir: resolve(rootDir, 'public'),
  envDir: rootDir,
  resolve: {
    alias: { '@': srcDir },
  },
  plugins: [tailwindcss(), sharedHead()],
  build: {
    outDir: resolve(rootDir, 'dist'),
    emptyOutDir: true,
    rolldownOptions: { input: pages },
  },
})
