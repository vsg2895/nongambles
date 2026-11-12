'use client'

import { useState } from 'react'
import Link from 'next/link'
import { COPY } from '@/constants/copy'
import type { SpecialOffer } from '@shared/types/specialOffer'

const PER_PAGE = 4

/**
 * A casino's attached special offers, shown 4 at a time with the total count.
 * When there are more than 4, client-side pagination pages through them (the
 * offers already arrive with the casino, so no extra fetch is needed).
 */
export default function CasinoSpecialOffers({ offers }: { offers: SpecialOffer[] }) {
  const [page, setPage] = useState(0)

  // The API may serialize an empty relation as {} rather than []; guard for it
  // so a casino with no offers doesn't crash (offers.slice is not a function).
  const list = Array.isArray(offers) ? offers : []
  const total = list.length
  if (total === 0) return null

  const pageCount = Math.ceil(total / PER_PAGE)
  const start = page * PER_PAGE
  const visible = list.slice(start, start + PER_PAGE)

  return (
    <section className="mt-11">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="min-w-0 font-display text-[32px] text-ink">
          {COPY.casinos.offersHeading} <span className="font-mono text-xl text-mute">({total})</span>
        </h2>
        {pageCount > 1 && (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous offers"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border border-line-soft text-fg-2 transition-colors hover:border-mint hover:text-mint disabled:opacity-40 disabled:hover:border-line-soft disabled:hover:text-muted"
            >
              ←
            </button>
            {/* `whitespace-nowrap`, and it is load-bearing: in a flex row next
                to a heading this is three tokens ("1", "/", "2"), and a long
                heading squeezed it into three stacked lines between the two
                arrows. The counter is one word, so it is told to behave like
                one. */}
            <span className="whitespace-nowrap font-mono text-sm text-mute">{page + 1} / {pageCount}</span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={page === pageCount - 1}
              aria-label="More offers"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] border border-line-soft text-fg-2 transition-colors hover:border-mint hover:text-mint disabled:opacity-40 disabled:hover:border-line-soft disabled:hover:text-muted"
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* The costed list: type · offer · link, one hairline row per offer. */}
      <ul role="list" className="overflow-hidden rounded-[14px] border border-line">
        {visible.map((offer) => (
          <li key={offer.id} className="border-b border-line last:border-b-0">
            <Link
              href={`/special-offers/${offer.slug}`}
              className="grid items-center gap-x-4 gap-y-1 px-[18px] py-4 text-ink transition-colors hover:bg-ground-2 sm:grid-cols-[120px_minmax(0,1fr)_auto]"
            >
              {/* The bonus TYPE, as the editor named it; an unfiled offer shows none. */}
              <span className="ng-label !text-amber">{offer.bonus_category_name ?? ''}</span>
              <span className="min-w-0">
                <b className="block font-semibold">{offer.title}</b>
                {offer.bonuses && <span className="block text-sm text-fg-2">{offer.bonuses}</span>}
              </span>
              <span className="text-sm font-semibold text-mint">View offer →</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
