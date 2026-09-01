/**
 * All user-facing and SEO-facing wording for this site.
 *
 * The KEY STRUCTURE is identical across idevaffiliation, winpalack, roulettingo
 * and viglinksi — same groups, same keys, same order — so the four apps stay
 * interchangeable and a component written for one works on all of them.
 *
 * The WORDS are unique to this site. That is not decoration: the brands are
 * separate domains serving the same catalogue, and if they shipped the same
 * titles, descriptions and headings, Google would treat them as duplicate
 * content and suppress all but one. Every string that reaches a <title>, a meta
 * description, an <h1>/<h2> or a JSON-LD field must read differently here than
 * on the sibling sites.
 *
 * nongambles' angle, taken from the design in sites/Nongambles.html: the wagering
 * mathematician — every offer converted into what it actually returns after
 * wagering, game weighting and the cashout cap, then a plain skip-or-claim.
 */
export const COPY = {
  // Site-wide identity. These feed the root layout's fallback <title>, the
  // default meta description, the Organization/WebSite JSON-LD and the default
  // og:/twitter: description — i.e. every page that does not set its own.
  //
  // `description` must stay distinct from `home.metaDescription`: the home page
  // overrides it, so if the two matched, the site would simply be duplicating
  // itself across the pages that fall back to this one (the legal pages, the
  // 404, and any CMS page with no meta description authored in the admin).
  site: {
    titleTail: 'Bonus Math Before You Claim',
    description:
      'converts every welcome offer into what it actually returns after playthrough, game weighting and the cashout cap — then says plainly whether to skip it.',
    keywords: [
      'bonus expected value',
      'bonus playthrough cost',
      'is a casino bonus worth claiming',
      'maximum cashout cap',
      'bonus game weighting',
    ],
  },
  nav: {
    casinos: 'Casinos',
    specialOffers: 'Special Offers',
    categories: 'Categories',
  },
  home: {
    heroEyebrow: 'Wagering Math, Not Hype',
    // Split in two so the JSX keeps its emphasised <em> while the words change.
    heroHeadline: "Most bonuses aren't worth",
    heroHighlight: 'claiming. We show which are.',
    heroSubtitle:
      'We convert every welcome offer into what it actually returns after playthrough, game weighting and the cashout cap — then say plainly whether to skip it.',
    topCasinosTitle: 'Offers that survive the math',
    topCasinosSubtitle: 'Ranked by real return after playthrough, then payout speed. Filter by category.',
    featuredCasinos: 'Open The Offer List',
    specialOffers: 'Offers Worth Claiming',
    viewAll: 'View All',
    // Leads the home <title>; the year and brand are appended in page.tsx.
    homeTitle: 'Bonus Math Before You Claim',
    faqTitle: 'How the scoring works',
    metaDescription:
      'Every welcome offer converted into what it actually returns after playthrough, game weighting and the cashout cap — with the ones to skip named outright.',
  },
  casinos: {
    pageTitle: 'Bonus Value, Ranked',
    pageDescription:
      'Casino bonuses ranked by what they return once playthrough, game weighting and the maximum cashout are applied. The arithmetic is shown, not summarised.',
    // Meta-description fallback for a casino review page. Casino records are
    // GLOBAL master data shared by every site, so without a per-site line here
    // all four domains would ship the identical description for the same casino.
    // Short per-site tail appended to an ADMIN-ENTERED casino meta description.
    // Casino records are shared by every site, so without this the same
    // description would ship on all four domains the moment the field is filled.
    // Appended to og:title / twitter:title on a casino review. The casino's
    // own meta_title is shared master data, so without this every domain
    // shipped an IDENTICAL share-card title for the same casino.
    // H2 over the offers block on a casino page. The literal 'Special Offers'
    // was hardcoded in the component on all six sites — an identical H2 on
    // every review page in the network.
    offersHeading: 'Offers, Costed',
    // Tail of the summary H2: `{casino.name} bonus terms in brief`.
    glanceHeadingTail: 'bonus terms in brief',
    reviewTitleTail: 'Bonus Math Checked',
    reviewSignature: 'Bonus math published in full.',
    reviewSummary: 'what its welcome offer returns after playthrough and game weighting, and what the cashout cap does to it.',
    visitCasino: 'Open Casino',
    readReview: 'Full Review',
    rating: 'Value Score',
    noResults: 'No offer clears the math with those filters applied.',
  },
  specialOffers: {
    pageTitle: 'Offers That Clear the Bar',
    pageDescription:
      'Bonuses whose maths survives contact with the terms. Playthrough, weighting and cap stated before you claim, not after.',
    // Appended to an offer's (shared) bonus text so the four sites do not ship
    // an identical meta description for the same offer.
    offerMetaSuffix: 'What it is actually worth once playthrough, weighting and the cashout cap are applied.',
    claim: 'Claim Offer',
    noResults: 'No offers clear our wagering bar right now.',
  },
  categories: {
    pageTitle: 'Pick Your Constraint',
    pageDescription:
      'Start from the thing that decides it for you — low playthrough, no deposit, no cashout cap, or weighting that counts your game.',
    // Meta-description tail for a single category page. Category records are
    // shared master data, so this is what keeps the four sites distinct there.
    categoryMetaSuffix: 'scored on real return after playthrough, game weighting and the cashout cap.',
    noResults: 'No offer in this category has been costed yet.',
  },
  newsletter: {
    title: "When terms get worse, you'll know",
    subtitle: 'One email when an offer\u2019s playthrough or cap changes — and when a new one clears the bar.',
    placeholder: 'Email for the bonus breakdowns',
    button: 'Subscribe',
    success: 'Nearly there — confirm the link in your inbox to get the bonus breakdowns.',
    error: 'That did not submit. Give it another go.',
  },
  footer: {
    // Short brand blurb in the footer, above the legal links.
    //
    // KEEP THIS UNDER ~72 CHARACTERS. The footer's brand column is
    // (1152 - 32 padding - 40 gap) / 2 = 540px at the sm: breakpoint where the
    // grid becomes two columns, and the text renders at 14px — about 77
    // characters to a line. Anything longer wraps to a second line, which is
    // what this wording was trimmed to fix. It still wraps on a phone, where a
    // single column is ~340px; that is unavoidable for any real sentence and is
    // the correct behaviour there.
    tagline:
      'Bonus math before you claim. The arithmetic, not the hype — 18+.',
    // Registered postal address, shown beside the copyright line. A physical
    // address in the footer is what mailbox providers and the gambling
    // affiliate compliance checks both look for, and it must match the address
    // used in the email templates.
    postalAddress: '10 Downing Street, London SW1A 2AA, United Kingdom',
    disclaimer:
      'Gambling carries real financial risk and is for adults aged 18 and over only. No bonus has a positive expected value once the playthrough is priced in — treat every offer as paid entertainment, never as income. Some links here earn us a commission; it plays no part in the maths we publish.',
  },
  errors: {
    notFound: 'Nothing at this address. The offer may have expired and been removed.',
    apiError: 'This did not load. Please try again shortly.',
  },
} as const
