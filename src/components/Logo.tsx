import Link from 'next/link'

/**
 * Nongambles brand logo: a teal "×" mark — the offers that do NOT survive the
 * math — beside the wordmark, taken from the design in sites/Nongambles.html.
 *
 * Same component contract as the sibling sites: one optional `className`, the
 * Link carries the accessible name, and the artwork is aria-hidden so a screen
 * reader announces the destination once rather than twice. Inlined SVG so it
 * renders instantly, scales crisply and costs no extra request.
 */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Nongambles home"
      className={`inline-flex shrink-0 items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-cream ${className}`.trim()}
    >
      <span
        aria-hidden="true"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line"
        style={{ background: 'linear-gradient(150deg,#1e3437,#101c1e)' }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" role="presentation">
          {/* Struck-through circle: an offer that did not clear the bar. */}
          <circle cx="12" cy="12" r="8.4" stroke="#4fd9c4" strokeWidth="1.7" />
          <path d="M8.4 15.6L15.6 8.4" stroke="#4fd9c4" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>

      <span className="flex flex-col leading-none">
        <span className="font-display text-[22px] tracking-tight text-ink">
          Non<span className="text-brand">gambles</span>
        </span>
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-faint">
          Wagering Math
        </span>
      </span>
    </Link>
  )
}
