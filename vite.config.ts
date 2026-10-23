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

/** Head tags every page needs, so each page's index.html only holds its own title/description. */
function sharedHead(): Plugin {
  const tags: HtmlTagDescriptor[] = [
    { tag: 'meta', attrs: { name: 'viewport', content: 'width=device-width, initial-scale=1.0' } },
    { tag: 'meta', attrs: { name: 'theme-color', content: '#070e21' } },
    { tag: 'link', attrs: { rel: 'icon', type: 'image/png', href: '/favicon.png' } },
    { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/favicon.png' } },
    { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' } },
    { tag: 'link', attrs: { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true } },
    {
      tag: 'link',
      attrs: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
      },
    },
  ]
  return {
    name: 'vavencloud:shared-head',
    transformIndexHtml: () => tags.map((t) => ({ ...t, injectTo: 'head' as const })),
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
