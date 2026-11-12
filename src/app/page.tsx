import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBonusArea, getCategories, getCategory, getSpecialOffers } from '@/lib/api'
import type { BonusSection } from '@/lib/api'
import { buildItemListSchema, buildWebPageSchema, jsonLdScript, buildFaqSchema, SHARE_IMAGES } from '@/lib/seo'
import { COPY } from '@/constants/copy'
import { FAQ_ITEMS } from '@/constants/faq'
import CasinoCard, { CasinoTableHead, LogoTile } from '@/components/CasinoCard'
import BonusTabs from '@/components/BonusTabs'
import BonusCategoryNav from '@/components/BonusCategoryNav'
import CategoryNav from '@/components/CategoryNav'
import SpecialOfferCard from '@/components/SpecialOfferCard'
import { SITE_URL } from '@/lib/config'
import type { Category } from '@shared/types/category'
import type { CasinoWithAttachment } from '@shared/types/casino'
import type { SpecialOffer } from '@shared/types/specialOffer'
import { casinosHeading } from '@/lib/categories'

/** Offers shown per bonus type in the home page's Bonuses section — one row. */
const HOME_BONUSES_PER_CATEGORY = 3

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME ?? ''
const YEAR = new Date().getFullYear()

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

// Resolve the selected category (default = first/highest-priority) for the home casinos section.
async function resolveCategory(searchParams: Props['searchParams']) {
  const sp = await searchParams
  const categories = (await getCategories()).data
  const selected =
    sp.category && categories.some((c) => c.slug === sp.category) ? sp.category : categories[0]?.slug
  return { categories: categories as Category[], selected }
}

export async function generateMetadata(): Promise<Metadata> {
  const title = `${COPY.home.homeTitle} ${YEAR} | ${SITE_NAME}`
  const description = COPY.home.metaDescription
  return {
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', url: '/', siteName: SITE_NAME, title, description, images: SHARE_IMAGES },
    twitter: { card: 'summary_large_image', title, description, images: SHARE_IMAGES },
  }
}

export default async function HomePage({ searchParams }: Props) {
  /*
   * THE HOME PAGE HAS ONE PAGE, so `?page=2` is a page past the end.
   *
   * Nothing here is paginated (the full list is /casinos), yet `/?page=2` and
   * every other number a crawler guessed answered 200 with the whole home page
   * and an `index` robots tag: a duplicate of `/` at a URL of its own. A 404
   * says it is not a page at all, the rule every paginated listing here applies
   * past its last page. `?page=1` never reaches this: proxy.ts 301s it to `/`.
   */
  if (Math.max(1, Number((await searchParams).page) || 1) > 1) notFound()

  const { categories, selected } = await resolveCategory(searchParams)

  const [categoryRes, offersRes, anyOffersRes, bonusRes] = await Promise.allSettled([
    selected ? getCategory(selected) : Promise.resolve(null),
    getSpecialOffers(selected, 6),
    // Site-wide, unfiltered, limit 1 — just "does a visible offer exist at all?".
    // Runs alongside the others, so it costs no extra round-trip of latency, and
    // the public endpoint already excludes offers whose visibility is off.
    getSpecialOffers(undefined, 1),
    // The bonus TYPES: the chip row under the hero AND the per-type Bonuses
    // section further down, so each type brings its first
    // HOME_BONUSES_PER_CATEGORY offers (one full row of the three-up grid).
    // The chips only read names, marks and counts, which the server counts
    // over the unlimited set. allSettled means a site without the Bonus area
    // renders neither, and falls back to the plain Special offers grid.
    getBonusArea(HOME_BONUSES_PER_CATEGORY),
  ])

  // Empty when the site does not publish the Bonus area, or when the
  // request failed — the strip renders nothing either way.
  const bonusSections: BonusSection[] = bonusRes.status === 'fulfilled' ? bonusRes.value : []

  const catData =
    categoryRes.status === 'fulfilled' && categoryRes.value ? categoryRes.value.data : null
  const casinos: CasinoWithAttachment[] = catData?.casinos ?? []
  const activeCategory = catData?.category ?? null
  // "See More" is only an affordance when there is actually more: compare the
  // category's full count against the rows this page received, rather than
  // hard-coding the page size on both sides where the two could drift apart.
  const hasMoreCasinos = (catData?.meta?.total ?? 0) > casinos.length
  // Offers are already scoped to the selected category and capped by the backend (?category=&limit=).
  const topOffers: SpecialOffer[] = offersRes.status === 'fulfilled' ? offersRes.value.data : []

  // Whether ANY special offer is visible on this site. Drives the hero CTA:
  // a button leading to an empty page is worse than no button. On a failed
  // request this stays false, so the CTA hides rather than promising content
  // that may not be there.
  const anyOffersVisible: boolean =
    anyOffersRes.status === 'fulfilled' && anyOffersRes.value.data.length > 0

  // Organization schema is emitted site-wide from the root layout; the home
  // page only adds its page-specific ItemList of top casinos.
  //
  // The list is the SELECTED category, not the whole catalogue, so it is named
  // and addressed as that category — it previously claimed the generic name
  // "Top Casinos at <brand>" and pointed at /casinos, describing neither the
  // rows below it nor a URL that renders them.
  const listSchema = buildItemListSchema(
    activeCategory ? `${activeCategory.name} — ${COPY.home.topCasinosTitle}` : COPY.home.topCasinosTitle,
    selected ? `${SITE_URL}/categories/${selected}` : `${SITE_URL}/casinos`,
    casinos.map((c, i) => ({ position: i + 1, name: c.name, url: `${SITE_URL}/casinos/${c.slug}` })),
  )

  const graph = [
    buildWebPageSchema({
      // Mirrors the actual <title>. The previous "Best Online Casinos <year>"
      // was generic boilerplate shipped identically by the sibling domains and
      // matched neither this page's title nor its H1.
      name: `${COPY.home.homeTitle} ${YEAR}`,
      url: SITE_URL,
      description: COPY.home.metaDescription,
    }),
    listSchema,
    // Same array the section below renders — markup-only FAQ is a violation.
    buildFaqSchema(SITE_URL, FAQ_ITEMS),
  ]

  const top3 = casinos.slice(0, 3)
  // "claiming. We show which are." — only the second sentence is set in mint.
  const [heroLead, heroAccent] = COPY.home.heroHighlight.includes('. ')
    ? [COPY.home.heroHighlight.slice(0, COPY.home.heroHighlight.indexOf('. ') + 1), COPY.home.heroHighlight.slice(COPY.home.heroHighlight.indexOf('. ') + 2)]
    : ['', COPY.home.heroHighlight]
  const listHref = selected ? `/categories/${selected}` : '/casinos'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(graph) }} />

      <main>
        {/* Hero: the pitch over a hairline grid, the top three of the list beside it. */}
        <section className="ng-grid border-b border-line">
          <div>
            <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-12 px-4 pb-16 pt-14 sm:pt-[72px]">
              <div className="min-w-0 flex-[1_1_500px]">
                <p className="inline-flex items-center rounded-md border border-mint/35 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] text-mint">
                  {COPY.home.heroEyebrow}
                </p>
                <h1 className="mt-[22px] font-display text-[42px] leading-[1.02] text-ink sm:text-[58px] lg:text-[70px]">
                  {COPY.home.heroHeadline} {heroLead} <span className="italic text-mint">{heroAccent}</span>
                </h1>
                <p className="mt-5 max-w-[540px] text-lg text-fg-2">{COPY.home.heroSubtitle}</p>
                <div className="mt-[30px] flex flex-wrap gap-3">
                  <Link href="/casinos" className="inline-flex min-h-[46px] items-center justify-center rounded-[10px] bg-mint px-[22px] text-[15px] font-semibold text-brand-ink transition-colors hover:bg-brand-soft">
                    {COPY.home.featuredCasinos}
                  </Link>
                  {anyOffersVisible && (
                    <Link href="/special-offers" className="inline-flex min-h-[46px] items-center justify-center rounded-[10px] border border-line-soft px-[22px] text-[15px] font-semibold text-ink transition-colors hover:border-mint">
                      {COPY.home.specialOffers}
                    </Link>
                  )}
                </div>
              </div>

              {top3.length > 0 && (
                <aside aria-labelledby="top3-heading" className="flex min-w-0 flex-[1_1_380px] flex-col border-t border-line-soft lg:ml-auto lg:max-w-[460px]">
                  <div className="flex items-baseline justify-between py-3.5">
                    <h2 id="top3-heading" className="ng-label !text-xs">Top of the list</h2>
                    <Link href={listHref} className="inline-flex min-h-11 items-center font-mono text-xs tracking-[0.06em] text-mint hover:text-brand-soft">
                      All {catData?.meta?.total ?? casinos.length} →
                    </Link>
                  </div>
                  <ol>
                    {top3.map((c) => (
                      <li key={c.id}>
                        <Link href={`/casinos/${c.slug}`} className="grid grid-cols-[64px_minmax(0,1fr)_auto] items-center gap-3.5 border-t border-line py-4 text-ink transition-[padding] hover:pl-2">
                          <LogoTile casino={c} className="h-11 w-16" />
                          <span className="min-w-0">
                            <b className="block font-display text-[21px] font-normal leading-[1.1]">{c.name}</b>
                            {c.bonuses && <span className="mt-0.5 block truncate text-sm font-semibold text-mint">{c.bonuses}</span>}
                          </span>
                          <span className="font-mono text-sm text-amber" aria-label={`${c.rating} out of 5`}>{c.rating.toFixed(1)}</span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </aside>
              )}
            </div>
          </div>
        </section>

        {/* The list: the selected category's casinos as ledger rows. */}
        <section id="list" className="py-16" aria-labelledby="top-casinos-heading">
          <div className="mx-auto max-w-[1200px] px-4">
            <p className="ng-label">The list</p>
            <h2 id="top-casinos-heading" className="mt-1.5 font-display text-[32px] leading-[1.05] text-ink sm:text-[46px]">{COPY.home.topCasinosTitle}</h2>
            <p className="mt-2 text-fg-2">{COPY.home.topCasinosSubtitle}</p>

            {categories.length > 0 && selected && (
              <div className="mt-6"><CategoryNav categories={categories} selected={selected} /></div>
            )}

            {casinos.length === 0 ? (
              <p className="mt-6 text-mute">{COPY.casinos.noResults}</p>
            ) : (
              <div className="mt-2">
                <CasinoTableHead />
                <ol>
                  {casinos.map((casino, i) => <CasinoCard key={casino.id} casino={casino} rank={i + 1} />)}
                </ol>
              </div>
            )}

            {activeCategory && hasMoreCasinos && (
              <Link href={`/categories/${selected}`} aria-label={`See More: ${casinosHeading(activeCategory.name)}`} className="mt-6 inline-flex min-h-[46px] items-center rounded-[10px] border border-line-soft px-[22px] font-semibold text-ink transition-colors hover:border-mint">
                See More →
              </Link>
            )}
          </div>
        </section>

        {/* Bonus types: one hairline cell per type. Collapses without a Bonus area. */}
        {bonusSections.length > 0 && (
          <section className="pb-16 pt-2">
            <div className="mx-auto max-w-[1200px] px-4">
              <BonusCategoryNav sections={bonusSections} />
            </div>
          </section>
        )}

        {/* Bonuses: a tab per type. A site without the Bonus area keeps the
            flat offers grid instead. */}
        {bonusSections.length > 0 ? (
          <section className="pb-16 pt-2" aria-labelledby="bonus-heading">
            <div className="mx-auto max-w-[1200px] px-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="bonus-heading" className="font-display text-[32px] text-ink sm:text-[46px]">{COPY.home.bonus}</h2>
                <Link href="/special-offers" aria-label={`${COPY.home.viewAll} bonuses`} className="inline-flex min-h-11 items-center font-semibold text-mint hover:text-brand-soft">{COPY.home.viewAll} →</Link>
              </div>
              <BonusTabs sections={bonusSections} />
              <Link href="/special-offers" className="mt-5 inline-flex min-h-[46px] items-center rounded-[10px] border border-line-soft px-[22px] font-semibold text-ink transition-colors hover:border-mint">
                {COPY.home.seeAllBonuses} →
              </Link>
            </div>
          </section>
        ) : topOffers.length > 0 && (
          <section className="pb-16 pt-2" aria-labelledby="offers-heading">
            <div className="mx-auto max-w-[1200px] px-4">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 id="offers-heading" className="font-display text-[32px] text-ink sm:text-[46px]">{COPY.home.specialOffers}</h2>
                <Link href="/special-offers" aria-label={`${COPY.home.viewAll} special offers`} className="inline-flex min-h-11 items-center font-semibold text-mint hover:text-brand-soft">{COPY.home.viewAll} →</Link>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {topOffers.map((offer) => <SpecialOfferCard key={offer.id} offer={offer} />)}
              </div>
            </div>
          </section>
        )}

        {/* FAQ — rendered visibly because FAQPage structured data requires it
            (same FAQ_ITEMS array as the schema above). A hairline grid; an odd
            last question spans both columns. */}
        <section className="pb-16 pt-2" aria-labelledby="faq-heading">
          <div className="mx-auto max-w-[1200px] px-4">
            <p className="ng-label">FAQ</p>
            <h2 id="faq-heading" className="mt-1.5 font-display text-[32px] text-ink sm:text-[46px]">{COPY.home.faqTitle}</h2>
            <dl className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2">
              {FAQ_ITEMS.map((item, i) => (
                <div key={item.question} className={`bg-cream p-[26px] ${i === FAQ_ITEMS.length - 1 && FAQ_ITEMS.length % 2 === 1 ? 'md:col-span-2' : ''}`}>
                  <dt>
                    <span className="ng-label !text-amber">Q{String(i + 1).padStart(2, '0')}</span>
                    <span className="mt-2 block text-lg font-semibold text-ink">{item.question}</span>
                  </dt>
                  <dd className="mt-2.5 text-[15px] leading-[1.65] text-fg-2">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
    </>
  )
}
