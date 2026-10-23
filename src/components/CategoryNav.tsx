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
    /*
     * ONE FULL-WIDTH COLUMN ON A PHONE, a content-sized wrapping row from
     * 640px up.
     *
     * Content sizing is right on a desktop, where the chips sit in one row and
     * their differing widths read as differing words. On a phone the same rule
     * produced a ragged stack — chips measured 156–187px wide, so some rows
     * held two and some held one and no two edges lined up, which reads as
     * unrelated buttons rather than one set of filters.
     *
     * Two equal columns do not fit: the widest chip needs ~187px and a
     * half-width track at 390px is ~166px, so a nowrap label would be pushed
     * out of its own chip. One column is the honest answer — every chip
     * identical, nothing clipped, and it matches the bonus-type block above it,
     * which is already a single column at this width.
     *
     * A plain block comment, not `{/* … *\/}`: a JSX expression container
     * cannot sit where the returned element goes.
     */
      <nav aria-label="Casino categories" className="grid grid-cols-1 gap-3 sm:flex sm:flex-wrap">
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
            className={`pill flex w-full justify-center sm:flex sm:w-auto sm:justify-start min-h-11 items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
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
