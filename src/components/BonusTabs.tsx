import Link from 'next/link'
import { COPY } from '@/constants/copy'
import { CLAIMABLE_BONUS_CATEGORY } from '@/components/SpecialOfferCard'
import type { BonusSection } from '@/lib/api'
import type { SpecialOffer } from '@shared/types/specialOffer'

function OfferCell({ offer }: { offer: SpecialOffer }) {
  // Claim follows the same rule as the cards: only the Special Offers type,
  // and only when the offer carries its own link. Everything else → Details.
  const claimable = offer.bonus_category_slug === CLAIMABLE_BONUS_CATEGORY && !!offer.affiliate_url

  return (
    <li className="flex flex-col gap-1.5 bg-cream p-5">
      {offer.casino?.name && <span className="font-mono text-xs text-mute">{offer.casino.name}</span>}
      <Link href={`/special-offers/${offer.slug}`} className="font-semibold text-ink hover:text-mint">{offer.title}</Link>
      {offer.bonuses && <span className="font-semibold text-mint">{offer.bonuses}</span>}
      <span className="text-xs tracking-[1px] text-amber" aria-label={`${offer.rating} out of 5`}>
        {'★'.repeat(offer.rating)}<span className="text-line-soft">{'★'.repeat(5 - offer.rating)}</span>
      </span>
      <span className="mt-auto flex gap-4 pt-2.5 text-sm font-semibold">
        <Link href={`/special-offers/${offer.slug}`} aria-label={`Details: ${offer.title}`} className="inline-flex min-h-11 items-center text-mint hover:text-brand-soft">Details →</Link>
        {claimable && (
          <a href={offer.affiliate_url!} target="_blank" rel="nofollow sponsored noopener" className="inline-flex min-h-11 items-center text-amber hover:text-ink">Claim ↗</a>
        )}
      </span>
    </li>
  )
}

/**
 * The home page's Bonuses: one tab per bonus type, its first offers in a
 * three-cell panel.
 *
 * CSS-only tabs — radio inputs, no client JavaScript — so EVERY panel's offers
 * are in the server HTML, where crawlers read them; only the checked panel is
 * displayed. The rules that tie each radio to its panel are generated below
 * because the number of types comes from the admin. Each panel keeps the
 * `#bonus-<slug>` id the old blocks had.
 */
export default function BonusTabs({ sections }: { sections: BonusSection[] }) {
  if (sections.length === 0) return null

  const rules = sections
    .map((_, i) => `.ng-tabs:has(#bt-${i}:checked) [data-bt="${i}"]{display:block}`)
    .join('')

  return (
    <div className="ng-tabs mt-6">
      <style>{rules}</style>
      <fieldset className="min-w-0">
        <legend className="sr-only">Bonus types</legend>
        {/* One scrolling row on phones (nine pills wrapped to five rows there);
            wraps from sm up. py-1 leaves room for the focus outline. */}
        <div className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 py-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {sections.map((section, i) => (
            <span key={section.id} className="relative shrink-0">
              <input type="radio" name="bonus-tab" id={`bt-${i}`} defaultChecked={i === 0} className="peer sr-only" />
              <label
                htmlFor={`bt-${i}`}
                className="inline-flex min-h-[42px] cursor-pointer items-center whitespace-nowrap rounded-full border border-line-soft px-4 text-sm font-medium text-fg-2 transition-colors hover:text-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-cream peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber"
              >
                {section.name}
              </label>
            </span>
          ))}
        </div>
      </fieldset>

      {sections.map((section, i) => (
        <div key={section.id} id={`bonus-${section.slug}`} data-bt={i} className="mt-[18px] hidden scroll-mt-24 overflow-hidden rounded-2xl border border-line">
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line bg-ground-2 px-5 py-[18px]">
            <h3 className="font-display text-[26px] text-ink">
              <Link href={`/bonuses/${section.slug}`} className="hover:text-mint">{section.name}</Link>
            </h3>
            <p className="text-sm text-mute">{section.description || `${section.offers_count} ${section.offers_count === 1 ? 'offer' : 'offers'} listed`}</p>
          </div>
          <ul role="list" className="grid gap-px bg-line md:grid-cols-3">
            {section.offers.map((offer) => <OfferCell key={offer.id} offer={offer} />)}
          </ul>
          <Link
            href={`/bonuses/${section.slug}`}
            aria-label={`${COPY.home.seeMore} — ${section.name}`}
            className="flex min-h-11 items-center border-t border-line px-5 text-sm font-semibold text-mint hover:bg-ground-2"
          >
            {COPY.home.seeMore} →
          </Link>
        </div>
      ))}
    </div>
  )
}
