import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import type { Category } from '@shared/types/category'

/**
 * Nongambles category filter — a row of underlined tabs over a hairline, the
 * current category underlined in mint with its count in mint. Scrolls
 * sideways when the row is wider than the page. Mounted on the home page and
 * on the casinos listing.
 *
 * The tabs NAVIGATE rather than filter in place: always the canonical
 * /categories/<slug> route. The query forms (`/?category=`,
 * `/casinos?category=`) are 301'd to it at the edge (lib/seo/redirects.ts), so
 * linking either would spend a redirect per visitor and crawl budget on URLs
 * that resolve elsewhere.
 *
 * On a phone the chips stack, one per row, each the full width of the column;
 * from sm they are one row of EQUAL chips — `w-max` + `1fr` columns, so every
 * track resolves to the widest label — scrolling sideways in its own track if
 * the row is wider than the page.
 */
export default function CategoryNav({
  categories,
  selected,
}: {
  categories: Category[]
  selected: string
}) {
  return (
    <nav aria-label="Casino categories" className="no-scrollbar overflow-x-auto border-b border-line">
      <ul className="grid grid-cols-1 sm:w-max sm:auto-cols-[1fr] sm:grid-flow-col sm:grid-cols-none sm:gap-1.5" role="list">
        {categories.map((c) => {
          const active = c.slug === selected
          return (
            <li key={c.id}>
              <Link
                href={`/categories/${c.slug}`}
                aria-current={active ? 'page' : undefined}
                className={`-mb-px flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap border-b-2 px-3.5 text-sm font-medium transition-colors ${
                  active ? 'border-mint text-ink' : 'border-transparent text-fg-2 hover:text-ink'
                }`}
              >
                {/* The category's own icon, as in the Casinos menu. A plain <img>:
                    next/image refuses SVG. alt="" because the label names it. */}
                {c.logo_path && (
                  <img src={resolveImageUrl(c.logo_path)!} alt="" width={16} height={16} className="h-4 w-4 shrink-0" />
                )}
                {c.name}
                {typeof c.casinos_count === 'number' && (
                  <span className={`font-mono text-xs ${active ? 'text-mint' : 'text-mute'}`}>{c.casinos_count}</span>
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
