import './style.css'
import { icon, logo } from './icons.ts'
import { mountGradientWaves } from './gradientWaves.ts'
import { mountGlassSurface } from './glassSurface.ts'
import {
  navLinks,
  heroHighlights,
  heroWords,
  trustedBy,
  services,
  stats,
  features,
  faqs,
  footerLinks,
  type Service,
} from './data.ts'

/**
 * Set this to a YouTube/Vimeo embed URL (e.g. "https://www.youtube.com/embed/VIDEO_ID")
 * to play a real video in the modal. Leave empty to show a placeholder.
 */
const VIDEO_URL = ''

/* ---------- Sections ---------- */

const header = () => `
<header id="site-header" class="pointer-events-none fixed inset-x-0 top-0 z-50">
  <nav id="site-nav" class="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between px-6 py-4" aria-label="Main">
    <a href="#top" class="nav-fg flex items-center gap-2.5 text-white" aria-label="VavenCloud home">
      ${logo('logo-header')}
      <span class="text-lg font-bold tracking-tight">Vaven<span class="nav-accent text-brand-300">Cloud</span></span>
    </a>

    <ul class="hidden items-center gap-1 lg:flex">
      ${navLinks
        .map((link) =>
          link.children
            ? `
        <li class="group relative">
          <a href="${link.href}" class="flex items-center gap-1 rounded-full px-4 py-2 text-sm nav-fg font-medium text-slate-300 transition hover:text-white" aria-haspopup="true">
            ${link.label} ${icon('chevron-down', 'h-4 w-4 transition group-hover:rotate-180 group-focus-within:rotate-180')}
          </a>
          <div class="invisible absolute top-full left-1/2 w-72 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <ul class="rounded-2xl border border-white/10 bg-ink-900/95 p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
              ${link.children
                .map(
                  (c) => `
              <li>
                <a href="${c.href}" class="flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/5 focus-visible:bg-white/5 focus-visible:outline-none">
                  <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">${icon(c.icon, 'h-4 w-4')}</span>
                  <span>
                    <span class="block text-sm font-semibold text-white">${c.label}</span>
                    <span class="block text-xs text-slate-400">${c.description}</span>
                  </span>
                </a>
              </li>`,
                )
                .join('')}
            </ul>
          </div>
        </li>`
            : `<li><a href="${link.href}" class="rounded-full px-4 py-2 text-sm nav-fg font-medium text-slate-300 transition hover:text-white">${link.label}</a></li>`,
        )
        .join('')}
    </ul>

    <div class="hidden items-center gap-3 lg:flex">
      <a href="#contact" class="text-sm nav-fg font-medium text-slate-300 transition hover:text-white">Contact</a>
      <a href="#contact" class="btn-primary !py-2.5">Get Started ${icon('arrow-right', 'h-4 w-4')}</a>
    </div>

    <button id="menu-toggle" type="button" class="nav-btn inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white lg:hidden" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu">
      <span data-icon-open>${icon('menu')}</span>
      <span data-icon-close class="hidden">${icon('x')}</span>
    </button>
  </nav>

  <div id="mobile-menu" class="pointer-events-auto mx-3 mt-2 hidden rounded-3xl border border-brand-400/30 bg-ink-950/85 shadow-2xl shadow-black/30 backdrop-blur-md lg:hidden">
    <ul class="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-6">
      ${navLinks
        .map(
          (l) =>
            `<li><a href="${l.href}" class="block rounded-xl px-4 py-3 text-base font-medium text-slate-200 hover:bg-white/5">${l.label}</a></li>`,
        )
        .join('')}
      <li class="pt-3"><a href="#contact" class="btn-primary w-full">Get Started</a></li>
    </ul>
  </div>
</header>`

const hero = () => `
<section id="top" data-nav="dark" class="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink-950 pt-32 pb-44 sm:pt-36">
  <!-- Background: WebGL gradient waves (brand palette), soft glow, readability scrim -->
  <div id="hero-waves" class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true"></div>
  <div class="pointer-events-none absolute -top-56 left-1/2 -z-10 h-[560px] w-[1000px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[140px]" aria-hidden="true"></div>
  <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_45%_at_50%_45%,rgb(7_14_33/0.75),transparent_75%)]" aria-hidden="true"></div>
  <!-- Bottom blend: layered curved waves in the Services color (slate-50) instead of a straight edge -->
  <div class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-linear-to-b from-transparent to-slate-50/15" aria-hidden="true"></div>
  <!-- Navbar colour zone: the solid light part of the wave edge counts as a light background -->
  <div data-nav="light" class="pointer-events-none absolute inset-x-0 bottom-0 h-10 sm:h-14 lg:h-16" aria-hidden="true"></div>
  <svg class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 w-full text-slate-50 sm:h-32 lg:h-40" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
    <path fill="currentColor" fill-opacity="0.25" d="M0,64 C180,112 360,24 600,56 C840,88 1020,136 1200,104 C1320,82 1390,60 1440,52 L1440,160 L0,160 Z" />
    <path fill="currentColor" fill-opacity="0.5" d="M0,100 C220,60 420,132 660,108 C900,84 1080,48 1260,80 C1350,96 1400,110 1440,104 L1440,160 L0,160 Z" />
    <path fill="currentColor" d="M0,128 C240,100 480,150 720,132 C960,114 1200,96 1440,124 L1440,160 L0,160 Z" />
  </svg>

  <div class="relative mx-auto flex w-full max-w-5xl flex-1 items-center justify-center px-6 text-center">
    <div class="reveal">
      <a href="#services" class="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pr-4 pl-1 text-sm text-slate-300 shadow-lg shadow-brand-900/30 backdrop-blur transition hover:border-brand-400/40 hover:bg-white/10">
        <span class="rounded-full bg-linear-to-r from-brand-500 to-brand-400 px-2.5 py-0.5 text-xs font-semibold text-white">New</span>
        Auto-scaling cloud servers now live
        ${icon('arrow-right', 'h-4 w-4 transition group-hover:translate-x-0.5')}
      </a>

      <h1 class="mx-auto mt-8 max-w-4xl text-4xl leading-[1.1] font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
        <!-- Screen readers / SEO get one stable sentence; the animated version is visual only -->
        <span class="sr-only">Web hosting and cloud services designed to scale with your business.</span>
        <span aria-hidden="true">
          <span class="block text-balance">Power your business with</span>
          <span class="block whitespace-nowrap">
            <span id="hero-rotator" class="rotator-word gradient-text animate-shimmer pb-[0.12em]">${heroWords[0]}</span>
          </span>
          <span class="block">designed to scale.</span>
        </span>
      </h1>

      <p class="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
        From fast, secure website hosting to scalable cloud servers, CDN, backups and business email, VavenCloud runs the infrastructure your business grows on, with experts on call 24/7.
      </p>

      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <a href="#contact" class="btn-primary w-full !px-8 !py-3.5 !text-base sm:w-auto">Get Started ${icon('arrow-right', 'h-4 w-4')}</a>
        <a href="#services" class="btn-ghost w-full !px-8 !py-3.5 !text-base sm:w-auto">Explore Services</a>
      </div>

      <ul class="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-3">
        ${heroHighlights
          .map(
            (h) => `
        <li class="flex items-center gap-2 text-sm text-slate-300">
          <span class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-300">${icon('check', 'h-3 w-3')}</span>${h}
        </li>`,
          )
          .join('')}
      </ul>

      <div class="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
        <div class="flex -space-x-2">
          ${['AR', 'JK', 'ML', 'SP']
            .map(
              (i, idx) =>
                `<span class="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-950 text-xs font-bold text-white ${['bg-brand-500', 'bg-brand-400', 'bg-brand-600', 'bg-brand-400'][idx]}">${i}</span>`,
            )
            .join('')}
        </div>
        <div class="text-center sm:text-left">
          <div class="flex justify-center text-brand-400 sm:justify-start">${icon('star', 'h-4 w-4', true).repeat(5)}</div>
          <p class="text-xs text-slate-400">Rated 4.9/5 by 2,000+ businesses</p>
        </div>
      </div>
    </div>
  </div>

  ${logoCloud()}
</section>`

const logoCloud = () => `
<div class="relative mt-16 w-full" role="region" aria-label="Trusted by">
  <p class="text-center text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">Trusted by fast-growing teams worldwide</p>
  <div class="relative mt-6 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
    <ul class="flex w-max animate-marquee gap-14 hover:[animation-play-state:paused]">
      ${[...trustedBy, ...trustedBy]
        .map(
          (name, i) => `
      <li class="flex items-center gap-2 text-xl font-bold text-white/45 transition hover:text-white" ${i >= trustedBy.length ? 'aria-hidden="true"' : ''}>
        ${icon(['cloud', 'globe', 'zap', 'shield'][i % 4] as 'cloud', 'h-6 w-6')}${name}
      </li>`,
        )
        .join('')}
    </ul>
  </div>
</div>`

const serviceCard = (s: Service, i: number) => {
  const dark = s.featured
  return `
  <article ${dark ? 'data-nav="dark"' : ''} class="reveal group relative flex flex-col overflow-hidden rounded-3xl border p-8 transition duration-300 hover:-translate-y-1 ${
    dark
      ? 'border-white/10 bg-ink-950 text-white shadow-xl shadow-brand-900/20'
      : 'border-slate-200 bg-white shadow-sm hover:border-brand-200 hover:shadow-xl hover:shadow-brand-500/10'
  } ${s.className ?? ''}" style="transition-delay:${i * 60}ms">
    ${
      dark
        ? `<div class="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-500/40 blur-3xl" aria-hidden="true"></div>
           <div class="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-brand-400/25 blur-3xl" aria-hidden="true"></div>
           <div class="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" aria-hidden="true"></div>`
        : `<div class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-brand-400 to-transparent opacity-0 transition group-hover:opacity-100" aria-hidden="true"></div>`
    }
    <div class="relative flex items-start justify-between gap-4">
      <span class="inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
        dark ? 'bg-linear-to-br from-brand-400 to-brand-300 text-white shadow-lg shadow-brand-500/40' : 'bg-brand-50 text-brand-600 ring-1 ring-brand-100'
      }">${icon(s.icon, 'h-6 w-6')}</span>
      ${dark ? '<span class="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-brand-100">Most popular</span>' : ''}
    </div>
    <h3 class="relative mt-6 text-xl font-semibold ${dark ? 'text-white sm:text-2xl' : 'text-slate-900'}">${s.title}</h3>
    <p class="relative mt-3 leading-relaxed ${dark ? 'max-w-xl text-slate-300' : 'text-slate-600'}">${s.description}</p>
    <ul class="relative mt-6 flex flex-wrap gap-2">
      ${s.tags
        .map(
          (t) =>
            `<li class="rounded-full px-3 py-1 text-xs font-medium ${dark ? 'border border-white/10 bg-white/5 text-slate-200' : 'bg-slate-100 text-slate-600'}">${t}</li>`,
        )
        .join('')}
    </ul>
    <a href="#contact" class="relative mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-semibold ${dark ? 'text-brand-200' : 'text-brand-600'}">
      Learn more<span class="sr-only"> about ${s.title}</span> ${icon('arrow-right', 'h-4 w-4 transition group-hover:translate-x-1')}
    </a>
  </article>`
}

const servicesSection = () => `
<section id="services" class="relative bg-slate-50 py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6">
    <div class="reveal mx-auto max-w-2xl text-center">
      <span class="eyebrow">Our Services</span>
      <h2 class="section-title mt-4">Hosting &amp; cloud to <span class="text-brand-600">launch, run &amp; scale</span></h2>
      <p class="mt-5 text-lg text-slate-600">From a single website to a fleet of cloud servers, VavenCloud gives you fast, secure infrastructure so you can focus on your business while we keep it running.</p>
    </div>

    <div class="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      ${services.map(serviceCard).join('')}
    </div>

    <dl class="reveal mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 lg:grid-cols-4">
      ${stats
        .map(
          (s) => `
      <div class="flex flex-col items-center gap-1 bg-white px-6 py-8 text-center">
        <dt class="order-2 text-sm text-slate-500">${s.label}</dt>
        <dd class="order-1 bg-linear-to-r from-brand-600 to-brand-400 bg-clip-text text-3xl font-extrabold text-transparent sm:text-4xl">${s.value}</dd>
      </div>`,
        )
        .join('')}
    </dl>

    <div class="mt-12 text-center">
      <a href="#contact" class="btn-primary">View all services ${icon('arrow-right', 'h-4 w-4')}</a>
    </div>
  </div>
</section>`

const playButton = (label: string, size = 'h-16 w-16') => `
<button type="button" data-video class="group/play relative flex ${size} items-center justify-center rounded-full bg-white text-brand-600 shadow-2xl shadow-brand-500/40 transition hover:scale-110 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-white" aria-label="${label}">
  <span class="absolute inset-0 animate-ping rounded-full bg-white/40 motion-reduce:hidden" aria-hidden="true"></span>
  ${icon('play', 'relative ml-1 h-1/3 w-1/3', true)}
</button>`

const clientsSection = () => `
<section id="clients" class="bg-white py-24 sm:py-32">
  <div class="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
    <div class="reveal">
      <span class="eyebrow">Client Spotlight</span>
      <h2 class="section-title mt-4">Results our clients can <span class="text-brand-600">measure</span></h2>
      <p class="mt-5 text-lg text-slate-600">See how teams use VavenCloud to launch faster, cut infrastructure costs and deliver better experiences to their customers.</p>

      <figure class="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-8">
        <div class="flex text-brand-400">${icon('star', 'h-5 w-5', true).repeat(5)}</div>
        <blockquote class="mt-4 text-lg leading-relaxed font-medium text-slate-900">
          “VavenCloud migrated our entire stack to their cloud in under six weeks with zero downtime. Page loads dropped by 60% and our team finally stopped firefighting servers.”
        </blockquote>
        <figcaption class="mt-6 flex items-center gap-4">
          <span class="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-brand-400 font-bold text-white">AR</span>
          <div>
            <p class="font-semibold text-slate-900">Alex Rivera</p>
            <p class="text-sm text-slate-500">CTO, Northwind</p>
          </div>
        </figcaption>
      </figure>

      <ul class="mt-8 grid gap-4 sm:grid-cols-3">
        ${[
          ['60%', 'faster page loads'],
          ['0 min', 'migration downtime'],
          ['35%', 'lower hosting cost'],
        ]
          .map(
            ([v, l]) =>
              `<li class="rounded-2xl border border-slate-200 p-4"><p class="text-2xl font-extrabold text-slate-900">${v}</p><p class="text-sm text-slate-500">${l}</p></li>`,
          )
          .join('')}
      </ul>
    </div>

    <div class="reveal relative" style="transition-delay:150ms">
      <div class="absolute -inset-4 rounded-[2.5rem] bg-linear-to-tr from-brand-200 to-brand-100 blur-2xl" aria-hidden="true"></div>
      <div data-nav="dark" class="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-950 shadow-2xl">
        <div class="absolute inset-0 bg-grid" aria-hidden="true"></div>
        <div class="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-brand-600/50 blur-3xl" aria-hidden="true"></div>
        <div class="absolute -right-10 -bottom-20 h-72 w-72 rounded-full bg-brand-400/30 blur-3xl" aria-hidden="true"></div>
        <div class="absolute inset-x-8 top-8 grid grid-cols-3 gap-3 opacity-70" aria-hidden="true">
          <div class="col-span-2 h-24 rounded-xl border border-white/10 bg-white/5"></div>
          <div class="h-24 rounded-xl border border-white/10 bg-white/5"></div>
          <div class="h-16 rounded-xl border border-white/10 bg-white/5"></div>
          <div class="col-span-2 h-16 rounded-xl border border-white/10 bg-white/5"></div>
        </div>
        <div class="absolute inset-0 flex items-center justify-center">${playButton('Play client story video')}</div>
        <div class="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-950 to-transparent p-6">
          <p class="text-xs font-semibold tracking-wider text-brand-200 uppercase">Case study · 2:41</p>
          <p class="mt-1 text-lg font-semibold text-white">How Northwind scaled 10× on VavenCloud</p>
        </div>
      </div>
    </div>
  </div>
</section>`

const whySection = () => `
<section id="why-us" data-nav="dark" class="relative overflow-hidden bg-ink-950 py-24 sm:py-32">
  <div class="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden="true"></div>
  <div class="pointer-events-none absolute top-0 left-1/2 h-80 w-[800px] -translate-x-1/2 rounded-full bg-brand-600/25 blur-[120px]" aria-hidden="true"></div>

  <div class="relative mx-auto max-w-7xl px-6">
    <div class="reveal mx-auto max-w-2xl text-center">
      <span class="eyebrow-dark">Why VavenCloud</span>
      <h2 class="mt-4 text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">Why businesses choose <span class="gradient-text">VavenCloud</span></h2>
      <p class="mt-5 text-lg text-slate-400">Reliable infrastructure, hands-on engineers and support that actually picks up. Here's what you get with every plan.</p>
    </div>

    <div class="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      ${features
        .map(
          (f, i) => `
      <article class="reveal group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-brand-400/40 hover:bg-white/[0.06]" style="transition-delay:${i * 60}ms">
        <div class="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-brand-500/0 blur-2xl transition duration-500 group-hover:bg-brand-500/30" aria-hidden="true"></div>
        <span class="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500/30 to-brand-400/20 text-brand-200 ring-1 ring-white/10">${icon(f.icon, 'h-6 w-6')}</span>
        <h3 class="relative mt-6 text-lg font-semibold text-white">${f.title}</h3>
        <p class="relative mt-2 leading-relaxed text-slate-400">${f.description}</p>
      </article>`,
        )
        .join('')}
    </div>
  </div>
</section>`

const discoverSection = () => `
<section class="bg-white py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6">
    <div class="reveal mx-auto max-w-2xl text-center">
      <h2 class="section-title">Discover what makes <span class="text-brand-600">VavenCloud</span> different</h2>
      <p class="mt-5 text-lg text-slate-600">Take a two-minute tour of our platform, infrastructure and the team behind it.</p>
    </div>

    <div class="reveal relative mt-14">
      <div class="absolute -inset-x-6 -inset-y-6 rounded-[3rem] bg-linear-to-r from-brand-200/60 via-brand-100 to-brand-100 blur-2xl" aria-hidden="true"></div>
      <div data-nav="dark" class="relative overflow-hidden rounded-[2rem] bg-ink-950 shadow-2xl">
        <div class="absolute inset-0 bg-grid" aria-hidden="true"></div>
        <div class="absolute -top-32 -left-20 h-96 w-96 rounded-full bg-brand-600/50 blur-3xl" aria-hidden="true"></div>
        <div class="absolute -right-20 -bottom-32 h-96 w-96 rounded-full bg-brand-400/30 blur-3xl" aria-hidden="true"></div>

        <div class="relative grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          <div>
            <span class="eyebrow-dark">${icon('play', 'h-3 w-3', true)} Product tour</span>
            <p class="mt-5 text-4xl leading-tight font-extrabold text-white sm:text-5xl">VavenCloud:<br /><span class="gradient-text">Secure Cloud Hosting</span></p>
            <p class="mt-4 max-w-md text-slate-400">Built-in security, global performance and expert support on every plan.</p>
            <div class="mt-8 flex flex-wrap items-center gap-5">
              ${playButton('Play product tour video', 'h-14 w-14')}
              <span class="text-sm font-semibold text-white">Watch now <span class="font-normal text-slate-400">· 2 min</span></span>
            </div>
          </div>

          <div class="hidden gap-3 lg:grid lg:grid-cols-2" aria-hidden="true">
            ${[
              ['shield', 'DDoS protection', 'Active'],
              ['globe', 'Edge locations', '15+'],
              ['lock', 'SSL certificates', 'Auto'],
              ['clock', 'Daily backups', '30 days'],
            ]
              .map(
                ([ic, label, val]) => `
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <span class="text-brand-200">${icon(ic as 'shield', 'h-5 w-5')}</span>
              <p class="mt-4 text-sm text-slate-400">${label}</p>
              <p class="text-xl font-bold text-white">${val}</p>
            </div>`,
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>`

const faqSection = () => `
<section id="faq" class="bg-slate-50 py-24 sm:py-32">
  <div class="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
    <div class="reveal lg:sticky lg:top-28 lg:self-start">
      <span class="eyebrow">FAQ</span>
      <h2 class="section-title mt-4">Frequently asked <span class="text-brand-600">questions</span></h2>
      <p class="mt-5 text-lg text-slate-600">Everything you need to know about our services. Can't find an answer? Our team is happy to help.</p>
      <div class="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex items-center gap-4">
          <span class="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">${icon('support', 'h-6 w-6')}</span>
          <div>
            <p class="font-semibold text-slate-900">Still have questions?</p>
            <p class="text-sm text-slate-500">We usually reply in under 10 minutes.</p>
          </div>
        </div>
        <a href="#contact" class="btn-primary mt-5 w-full">Talk to an expert</a>
      </div>
    </div>

    <div class="reveal space-y-4" style="transition-delay:100ms">
      ${faqs
        .map(
          (f, i) => `
      <details class="group rounded-2xl border border-slate-200 bg-white px-6 py-5 transition open:border-brand-200 open:shadow-lg open:shadow-brand-500/5" ${i === 0 ? 'open' : ''}>
        <summary class="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg text-left font-semibold text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500">
          ${f.q}
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition duration-300 group-open:rotate-45 group-open:bg-brand-600 group-open:text-white">${icon('plus', 'h-4 w-4')}</span>
        </summary>
        <p class="mt-4 pr-12 leading-relaxed text-slate-600">${f.a}</p>
      </details>`,
        )
        .join('')}
    </div>
  </div>
</section>`

const contactSection = () => `
<section id="contact" class="bg-white py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6">
    <div data-nav="dark" class="reveal relative overflow-hidden rounded-[2.5rem] bg-linear-to-br from-brand-600 via-brand-700 to-ink-950 p-8 shadow-2xl shadow-brand-900/30 sm:p-12 lg:p-16">
      <div class="pointer-events-none absolute inset-0 bg-grid opacity-50" aria-hidden="true"></div>
      <div class="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-300/30 blur-3xl" aria-hidden="true"></div>

      <div class="relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 class="text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl">Move your business to VavenCloud</h2>
          <p class="mt-5 max-w-md text-lg text-brand-100">Tell us what you host today and we'll get back to you within one business day with the right hosting or cloud plan.</p>
          <ul class="mt-8 space-y-3">
            ${['Free consultation & quote', 'Free migration, zero downtime', 'No long-term contracts']
              .map(
                (t) =>
                  `<li class="flex items-center gap-3 text-white"><span class="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">${icon('check', 'h-3.5 w-3.5')}</span>${t}</li>`,
              )
              .join('')}
          </ul>
        </div>

        <form id="contact-form" data-nav="light" class="rounded-3xl bg-white p-6 shadow-2xl sm:p-8" novalidate>
          <div class="grid gap-5 sm:grid-cols-2">
            <div>
              <label for="first-name" class="text-sm font-medium text-slate-700">First name</label>
              <input id="first-name" name="firstName" type="text" autocomplete="given-name" required class="field" placeholder="Jane" />
            </div>
            <div>
              <label for="last-name" class="text-sm font-medium text-slate-700">Last name</label>
              <input id="last-name" name="lastName" type="text" autocomplete="family-name" required class="field" placeholder="Doe" />
            </div>
            <div>
              <label for="email" class="text-sm font-medium text-slate-700">Work email</label>
              <input id="email" name="email" type="email" autocomplete="email" required class="field" placeholder="jane@company.com" />
            </div>
            <div>
              <label for="phone" class="text-sm font-medium text-slate-700">Phone <span class="font-normal text-slate-400">(optional)</span></label>
              <input id="phone" name="phone" type="tel" autocomplete="tel" class="field" placeholder="+1 555 000 0000" />
            </div>
            <div class="sm:col-span-2">
              <label for="service" class="text-sm font-medium text-slate-700">I'm interested in</label>
              <select id="service" name="service" class="field">
                ${services.map((s) => `<option>${s.title}</option>`).join('')}
                <option>Something else</option>
              </select>
            </div>
          </div>
          <button type="submit" class="btn-primary mt-6 w-full">Get my free quote ${icon('arrow-right', 'h-4 w-4')}</button>
          <p id="form-status" class="mt-4 text-center text-sm text-slate-500" role="status" aria-live="polite">By submitting, you agree to our privacy policy. No spam, ever.</p>
        </form>
      </div>
    </div>
  </div>
</section>`

const footer = () => `
<footer data-nav="dark" class="relative overflow-hidden bg-ink-950 pt-20 pb-10 text-slate-400">
  <div class="pointer-events-none absolute -top-40 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-brand-700/20 blur-[120px]" aria-hidden="true"></div>
  <div class="relative mx-auto max-w-7xl px-6">
    <div class="grid gap-12 lg:grid-cols-12">
      <div class="lg:col-span-4">
        <a href="#top" class="flex items-center gap-2.5 text-white" aria-label="VavenCloud home">
          ${logo('logo-footer')}
          <span class="text-lg font-bold tracking-tight">Vaven<span class="text-brand-300">Cloud</span></span>
        </a>
        <p class="mt-5 max-w-sm leading-relaxed">VavenCloud delivers secure web hosting, scalable cloud servers, CDN, backups and professional email to help businesses of every size grow online.</p>
        <ul class="mt-6 flex gap-3">
          ${(['linkedin', 'facebook', 'instagram'] as const)
            .map(
              (s) =>
                `<li><a href="#" class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:border-brand-400 hover:bg-brand-500 hover:text-white" aria-label="VavenCloud on ${s[0].toUpperCase() + s.slice(1)}">${icon(s, 'h-4 w-4')}</a></li>`,
            )
            .join('')}
        </ul>
      </div>

      ${footerLinks
        .map(
          (col) => `
      <nav class="lg:col-span-2" aria-label="${col.title}">
        <p class="text-sm font-semibold text-white">${col.title}</p>
        <ul class="mt-5 space-y-3 text-sm">
          ${col.links.map((l) => `<li><a href="#" class="transition hover:text-white">${l}</a></li>`).join('')}
        </ul>
      </nav>`,
        )
        .join('')}

      <div class="lg:col-span-4">
        <p class="text-sm font-semibold text-white">Contact Info</p>
        <ul class="mt-5 space-y-4 text-sm">
          <li class="flex gap-3"><span class="text-brand-300">${icon('mail', 'h-5 w-5')}</span><a href="mailto:support@vavencloud.com" class="hover:text-white">support@vavencloud.com</a></li>
          <li class="flex gap-3"><span class="text-brand-300">${icon('phone', 'h-5 w-5')}</span><a href="tel:+10000000000" class="hover:text-white">+1 (000) 000-0000</a></li>
          <li class="flex gap-3"><span class="text-brand-300">${icon('map-pin', 'h-5 w-5')}</span><span>Your office address, City, Country</span></li>
        </ul>
      </div>
    </div>

    <div class="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm sm:flex-row">
      <p>© <span id="year"></span> VavenCloud. All rights reserved.</p>
      <ul class="flex flex-wrap gap-6">
        ${['Privacy Policy', 'Terms of Service', 'Cookies'].map((l) => `<li><a href="#" class="hover:text-white">${l}</a></li>`).join('')}
      </ul>
    </div>
  </div>
</footer>`

const videoDialog = () => `
<dialog id="video-dialog" class="m-auto w-[min(56rem,92vw)] overflow-hidden rounded-3xl border border-white/10 bg-ink-900 p-0 text-white shadow-2xl backdrop:bg-ink-950/80 backdrop:backdrop-blur-sm" aria-labelledby="video-title">
  <div class="flex items-center justify-between border-b border-white/10 px-5 py-3">
    <p id="video-title" class="font-semibold">VavenCloud overview</p>
    <button type="button" data-close class="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10" aria-label="Close video">${icon('x')}</button>
  </div>
  <div id="video-frame" class="flex aspect-video items-center justify-center bg-ink-950 text-slate-400"></div>
</dialog>`

/* ---------- Render ---------- */

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  ${header()}
  <main id="main">
    ${hero()}
    ${servicesSection()}
    ${clientsSection()}
    ${whySection()}
    ${discoverSection()}
    ${faqSection()}
    ${contactSection()}
  </main>
  ${footer()}
  ${videoDialog()}
`

/* ---------- Interactions ---------- */

// Hero background: gradient waves in the VavenCloud blue palette (see @theme in style.css).
// If WebGL2 is unavailable it returns null and the plain ink-950 background + glow remain.
mountGradientWaves(document.querySelector<HTMLElement>('#hero-waves')!, {
  horizonColor: '#2a4791', // brand-700 – haze toward the horizon + shadow tint
  waveColor: '#3d69cc', // brand-500 – main wave body
  crestColor: '#bfd1f2', // brand-200 – crest highlights
  speed: 0.35,
  amplitude: 2.5,
  relief: 1,
  lightAngle: 120,
  sheen: 0.25,
  brightness: 0.95,
  opacity: 0.9,
  grain: 0.15,
  mouseInteraction: true,
  swellOnClick: true,
  // Performance: the waves are soft, so a lower render resolution is visually near-identical
  dpr: window.matchMedia('(max-width: 768px)').matches ? 0.75 : 1,
  quality: 'low', // 56 ray-march steps instead of 84
  maxFps: 30,
})

// Header: solid glass background once the page is scrolled
const siteHeader = document.querySelector<HTMLElement>('#site-header')!
// Navbar states:
//  - at the very top: full-width and fully transparent
//  - scrolled (.is-scrolled): shrinks into a floating clear-glass pill with a brand-blue outline
//  - each nav item gets .on-light when the background directly behind it is light, so the logo,
//    links and menu button each switch between white and dark text independently
const heroSection = document.querySelector<HTMLElement>('#top')!
const siteNav = document.querySelector<HTMLElement>('#site-nav')!
// React Bits GlassSurface look: refractive edges + RGB fringes in Chromium, frosted elsewhere.
// Visible only in the scrolled pill state (see #site-header.is-scrolled #site-nav in style.css).
// Tuned so the content behind stays plain and unzoomed: only a thin rim at the very edge bends.
//  - opacity 1 + brightness 50  -> the centre of the map is exact neutral grey = zero displacement
//  - blur 2 (was 11)            -> the bend no longer bleeds across the whole short pill (that caused the "zoom")
//  - borderWidth 0.04           -> narrower bending edge
//  - displace 0 / saturation 1  -> no extra softening or colour boost through the glass
mountGlassSurface(siteNav, {
  distortionScale: -90,
  borderWidth: 0.04,
  blur: 2,
  brightness: 50,
  opacity: 1,
  displace: 0,
  saturation: 1,
  backgroundOpacity: 0,
})
// Every [data-nav] zone on the page. The deepest/last zone containing a point wins, so a dark
// card inside a light section (or a light form inside a dark card) is detected correctly.
// Uses rects instead of elementsFromPoint so pointer-events-none layers (hero wave edge) count too.
const navZones = [...document.querySelectorAll<HTMLElement>('[data-nav]')]
const themeAt = (x: number, y: number) => {
  let theme = 'light'
  for (const zone of navZones) {
    const z = zone.getBoundingClientRect()
    if (x >= z.left && x <= z.right && y >= z.top && y <= z.bottom) theme = zone.dataset.nav ?? theme
  }
  return theme
}
// Each nav item adapts on its own, based on what is directly behind *it*
const navItems = [...siteHeader.querySelectorAll<HTMLElement>('#site-nav .nav-fg, #site-nav .nav-btn')]
let navFrame = 0
const updateNav = () => {
  navFrame = 0
  siteHeader.classList.toggle('is-scrolled', window.scrollY > 12)
  const menuOpen = siteHeader.classList.contains('menu-open')
  navItems.forEach((item) => {
    const r = item.getBoundingClientRect()
    if (!r.width) return // hidden at this breakpoint
    const onLight = !menuOpen && themeAt(r.left + r.width / 2, r.top + r.height / 2) === 'light'
    item.classList.toggle('on-light', onLight)
  })
}
const onScroll = () => {
  if (!navFrame) navFrame = requestAnimationFrame(updateNav)
}
window.addEventListener('scroll', onScroll, { passive: true })
window.addEventListener('resize', onScroll, { passive: true })
updateNav()

// Hero headline: cycle the product word with a blur/slide transition.
// Skipped for reduced-motion users; paused while the tab is hidden or the hero is scrolled away.
const rotator = document.querySelector<HTMLElement>('#hero-rotator')
if (rotator && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let wordIndex = 0
  setInterval(() => {
    if (document.hidden || window.scrollY > heroSection.offsetHeight) return
    rotator.classList.add('is-out')
    window.setTimeout(() => {
      wordIndex = (wordIndex + 1) % heroWords.length
      rotator.textContent = heroWords[wordIndex]
      // Jump to the "below" position without animating, then animate up into place
      rotator.classList.replace('is-out', 'is-enter')
      void rotator.offsetWidth
      rotator.classList.remove('is-enter')
    }, 450)
  }, 2800)
}

// Mobile menu
const menuToggle = document.querySelector<HTMLButtonElement>('#menu-toggle')!
const mobileMenu = document.querySelector<HTMLElement>('#mobile-menu')!
const setMenu = (open: boolean) => {
  mobileMenu.classList.toggle('hidden', !open)
  menuToggle.setAttribute('aria-expanded', String(open))
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  menuToggle.querySelector('[data-icon-open]')!.classList.toggle('hidden', open)
  menuToggle.querySelector('[data-icon-close]')!.classList.toggle('hidden', !open)
  // Open menu: dark-tinted pill + dark panel so the white links read on any section
  siteHeader.classList.toggle('menu-open', open)
  updateNav()
}
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'))
mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)))
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false)
})

// Scroll reveal
const revealEls = document.querySelectorAll<HTMLElement>('.reveal')
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  )
  revealEls.forEach((el) => observer.observe(el))
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'))
}

// Video modal
const dialog = document.querySelector<HTMLDialogElement>('#video-dialog')!
const frame = document.querySelector<HTMLDivElement>('#video-frame')!
document.querySelectorAll<HTMLButtonElement>('[data-video]').forEach((btn) =>
  btn.addEventListener('click', () => {
    frame.innerHTML = VIDEO_URL
      ? `<iframe class="h-full w-full" src="${VIDEO_URL}?autoplay=1" title="VavenCloud overview video" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
      : `<div class="text-center"><span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">${icon('play', 'ml-1 h-6 w-6', true)}</span><p class="mt-4 text-sm">Video coming soon.</p></div>`
    dialog.showModal()
  }),
)
dialog.querySelector('[data-close]')!.addEventListener('click', () => dialog.close())
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close() // click on backdrop
})
dialog.addEventListener('close', () => (frame.innerHTML = '')) // stop playback

// Contact form (front-end only – connect to your backend or form service)
const form = document.querySelector<HTMLFormElement>('#contact-form')!
const status = document.querySelector<HTMLParagraphElement>('#form-status')!
form.addEventListener('submit', (e) => {
  e.preventDefault()
  form.querySelectorAll<HTMLInputElement>('input[required]').forEach((input) => {
    const invalid = !input.checkValidity()
    input.setAttribute('aria-invalid', String(invalid))
    input.classList.toggle('!border-rose-400', invalid)
  })
  if (!form.checkValidity()) {
    status.textContent = 'Please fill in your name and a valid email address.'
    status.className = 'mt-4 text-center text-sm font-medium text-rose-600'
    form.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus()
    return
  }
  status.textContent = "Thanks! We've received your request and will be in touch shortly."
  status.className = 'mt-4 text-center text-sm font-medium text-brand-600'
  form.reset()
})

document.querySelector('#year')!.textContent = String(new Date().getFullYear())
