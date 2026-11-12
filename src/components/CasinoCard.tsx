import Image from 'next/image'
import Link from 'next/link'
import { resolveImageUrl } from '@/lib/images'
import { COPY } from '@/constants/copy'
import type { CasinoWithAttachment } from '@shared/types/casino'

/** Amber stars; the empty ones in the hairline colour. */
export function Stars({ rating, className = '' }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex tracking-[1px] ${className}`} role="img" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? 'text-amber' : 'text-line-soft'} aria-hidden>★</span>
      ))}
    </span>
  )
}

/**
 * The ledger table's column grid — shared by the header row and every row.
 * Tighter fixed columns at lg (1024px), where the mockup's widths left the
 * casino name too little room; the mockup's own widths from xl up.
 */
export const TABLE_COLS = 'lg:grid-cols-[minmax(0,1.4fr)_96px_minmax(0,1.2fr)_250px] xl:grid-cols-[minmax(0,1.3fr)_110px_minmax(0,1.4fr)_300px]'

/** Column labels over a list of rows. Decorative: each row names its own cells. */
export function CasinoTableHead() {
  return (
    <div aria-hidden className={`ng-label hidden gap-4 border-b border-line px-4 py-3.5 lg:grid ${TABLE_COLS}`}>
      <span>Casino</span>
      <span>Score</span>
      <span>Headline offer</span>
      <span className="text-right">Action</span>
    </div>
  )
}

/** A casino's logo on the white tile every logo sits on. */
export function LogoTile({ casino, className = '' }: { casino: CasinoWithAttachment; className?: string }) {
  const image = resolveImageUrl(casino.image_path ?? casino.banner_image)
  return image ? (
    <Image src={image} alt={casino.name} width={152} height={104} sizes="76px" className={`shrink-0 rounded-lg bg-white object-contain p-1 ${className}`} />
  ) : (
    <span className={`grid shrink-0 place-items-center rounded-lg bg-white p-1 text-center text-xs font-bold leading-tight text-cream ${className}`}>
      {casino.name}
    </span>
  )
}

// Nongambles — one line of the ledger: casino, score, the headline offer and
// the two actions (Open Casino → affiliate, Full Review → page). The list
// order is the ranking; no number is printed.
export default function CasinoCard({ casino }: { casino: CasinoWithAttachment; rank?: number }) {
  return (
    <li className={`grid grid-cols-1 items-center gap-x-3.5 gap-y-2.5 border-b border-line p-4 transition-colors hover:bg-ground-2 lg:gap-4 ${TABLE_COLS}`}>
      <div className="flex min-w-0 items-center gap-3.5">
        <LogoTile casino={casino} className="h-[52px] w-[76px]" />
        <div className="min-w-0">
          <h3 className="break-words font-display text-[22px] leading-[1.1] text-ink">{casino.name}</h3>
          {casino.categories && casino.categories.length > 0 && (
            <p className="mt-0.5 truncate font-mono text-[11px] uppercase tracking-[0.06em] text-mute">{casino.categories[0].name}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 font-mono text-sm lg:block">
        <b className="text-xl font-medium text-ink lg:block">{casino.rating.toFixed(1)}</b>
        <Stars rating={casino.rating} />
      </div>
      <p className="text-[15px] font-semibold text-mint">{casino.bonuses ?? '—'}</p>
      <div className="flex gap-2 lg:justify-end">
        <a
          href={casino.attachment.affiliate_url}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="inline-flex min-h-[42px] flex-1 items-center justify-center whitespace-nowrap rounded-[10px] bg-mint px-3 sm:px-4 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-soft sm:flex-none"
        >
          {COPY.casinos.visitCasino}
        </a>
        <Link
          href={`/casinos/${casino.slug}`}
          className="inline-flex min-h-[42px] flex-1 items-center justify-center whitespace-nowrap rounded-[10px] border border-line-soft px-3 sm:px-4 text-sm font-semibold text-ink transition-colors hover:border-mint sm:flex-none"
        >
          {COPY.casinos.readReview}
        </Link>
      </div>
    </li>
  )
}
