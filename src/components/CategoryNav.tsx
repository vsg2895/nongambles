import Link from 'next/link'
import type { Category } from '@shared/types/category'

/**
 * Viglinksi category selector — pill tabs with a gold active state.
 * Mounted on the home page and on the casinos listing; both link at the
 * canonical /categories/<slug> route.
 */
export default function CategoryNav({
  categories,
  selected,
}: {
  categories: Category[]
  selected: string
}) {
  return (
    <nav aria-label="Casino categories" className="flex flex-wrap gap-3">
      {categories.map((c) => {
        const active = c.slug === selected
        return (
          <Link
            key={c.id}
            /*
             * ALWAYS the canonical category route.
             *
             * The home page used to take the query form `/?category=<slug>` and
             * filter in place; `site-template` linked `/casinos?category=<slug>`,
             * which went through a redirect. Both are now 301'd to this very URL
             * at the edge (lib/seo/redirects.ts), so emitting either would mean
             * linking a redirect — one wasted hop per visitor, and, multiplied by
             * the number of categories, a page's worth of crawl budget spent on
             * URLs that resolve elsewhere. It is also what Search Console
             * reported as "Alternate page with proper canonical tag": the home
             * page existed once per category, each copy canonical-tagged at `/`.
             *
             * The chips therefore NAVIGATE rather than filter in place. The
             * destination renders the same list from the same endpoint, under a
             * URL that can be linked, shared and indexed.
             */
            href={`/categories/${c.slug}`}
            aria-current={active ? 'page' : undefined}
            // `.pill` / `.pill-active` carry the colours and the hover state,
            // which cannot be expressed inline. min-h-11 keeps a 44px tap target.
            className={`pill flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
              active ? 'pill-active font-semibold' : 'font-medium'
            }`}
          >
            {c.name}
            {typeof c.casinos_count === 'number' && (
              <span className={`text-xs ${active ? 'opacity-60' : 'text-faint'}`}>{c.casinos_count}</span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
