import Link from 'next/link'

/**
 * Nongambles brand logo: a teal "×" mark — the offers that do NOT survive the
 * math — beside the wordmark, taken from the design in sites/Nongambles.html.
 *
 * Same component contract as the sibling sites: one optional `className`. The
 * visible wordmark is the link's accessible name, and the artwork is
 * aria-hidden so a screen reader announces the destination once. Inlined SVG so it
 * renders instantly, scales crisply and costs no extra request.
 */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex min-h-11 shrink-0 items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${className}`.trim()}
    >
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-[10px] border border-line-soft bg-panel"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4fd8b6" strokeWidth="2" strokeLinecap="round" role="presentation">
          {/* Struck-through circle: an offer that did not clear the bar. */}
          <circle cx="12" cy="12" r="9" />
          <path d="M6 18 18 6" />
        </svg>
      </span>

      <span className="flex flex-col leading-none">
        <span className="font-display text-[23px] text-ink">
          Non<span className="text-mint">gambles</span>
        </span>
        <span className="mt-1 font-mono text-[11px] tracking-[0.2em] text-mute">WAGERING MATH</span>
      </span>
    </Link>
  )
}
