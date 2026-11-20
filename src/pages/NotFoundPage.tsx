import { Link } from 'react-router'
import { routes } from '@/app/routes.ts'
import { PageMeta } from '@/components/seo/PageMeta.tsx'
import { bandLinen, btnPrimary, container } from '@/components/ui/classes.ts'
import { cn } from '@/lib/cn.ts'

/** Any address that isn't a page */
export function NotFoundPage() {
  return (
    <>
      <PageMeta title="Page not found | VavenCloud" description="This page doesn’t exist." />
      <section className={cn(bandLinen, '-mt-18 pt-36 pb-24 sm:pt-44')} aria-labelledby="not-found-title">
        <div className={cn(container, 'max-w-4xl')}>
          <h1
            id="not-found-title"
            className="text-5xl leading-[0.95] font-[540] tracking-[-0.05em] text-neutral-950 sm:text-6xl dark:text-white"
          >
            Page not found
          </h1>
          <p className="mt-5 text-lg">This page doesn’t exist, or it has moved.</p>
          <Link to={routes.home} className={cn(btnPrimary, 'mt-8')}>
            Back to the home page
          </Link>
        </div>
      </section>
    </>
  )
}
