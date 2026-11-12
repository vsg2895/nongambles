import Link from 'next/link'
import { COPY } from '@/constants/copy'
import type { BonusSection } from '@/lib/api'

/**
 * The catch-all type. "Special Offers" is every offer, which /special-offers
 * already lists, so it gets no cell of its own.
 */
const CATCH_ALL_SLUG = 'special-offers'

/**
 * "Pick A Bonus Type" — one hairline cell per bonus type with a visible offer
 * on this site: the offer count set large in mono, the name under it. Each
 * links to /bonuses/<slug>. Built from the same getBonusArea payload as the
 * header/footer Bonuses menus, so no cell points at a type the menu lacks.
 */
export default function BonusCategoryNav({ sections }: { sections: BonusSection[] }) {
  const types = sections.filter((section) => section.slug !== CATCH_ALL_SLUG)

  if (types.length === 0) return null

  return (
    <nav aria-labelledby="bonus-types-heading">
      <h2 id="bonus-types-heading" className="font-display text-[28px] text-ink sm:text-[38px]">
        {COPY.home.bonusTypesTitle}
      </h2>
      {/* `gap-px` over the hairline colour draws the grid lines between cells. */}
      <ul className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-4 lg:auto-cols-fr lg:grid-flow-col lg:grid-cols-none" role="list">
        {types.map((section) => (
          <li key={section.id}>
            <Link
              href={`/bonuses/${section.slug}`}
              className="flex h-full flex-col gap-[18px] bg-ground-2 px-[18px] py-[22px] text-ink transition-colors hover:bg-panel"
            >
              <span className="font-mono text-[34px] leading-none text-mint">{section.offers_count}</span>
              <span className="font-semibold">{section.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
