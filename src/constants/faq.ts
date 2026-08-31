/**
 * Frequently asked questions for this site.
 *
 * Rendered VISIBLY on the home page and emitted as FAQPage structured data from
 * this same array. Google requires the two to match; markup-only FAQ is a
 * guidelines violation, which is why the page maps over this constant rather
 * than duplicating the text.
 *
 * The wording is unique to this site: these answers are indexable page content,
 * and they are exactly the kind of text an answer engine quotes. This file was
 * previously byte-identical to viglinksi's — two domains publishing the same
 * five answers AND the same FAQPage markup, which is the worst case for
 * duplicate structured data. Everything here is now written to this site's own
 * subject: the arithmetic of a bonus.
 */
export const FAQ_ITEMS = [
  {
    question: 'What does a wagering requirement actually cost?',
    answer:
      'Multiply the bonus by the multiplier to get the turnover you owe, then multiply that by the house edge on the game you clear it with. A £100 bonus at 40x is £4,000 of turnover; on a 4 percent-edge slot that is about £160 of expected loss to unlock £100. That is the number we publish.',
  },
  {
    question: 'Why does game weighting matter so much?',
    answer:
      'Because it silently multiplies the requirement. Blackjack counting 10 percent toward wagering means £4,000 of turnover becomes £40,000. Low-edge games are almost always the ones weighted down, which is precisely why they are — the weighting exists to stop you clearing a bonus cheaply.',
  },
  {
    question: 'Is a bigger bonus percentage better?',
    answer:
      'Rarely. A 200 percent match capped at a £50 maximum cashout is worth less than a 50 percent match with no cap, no matter how the headline reads. We price the cap first, because it sets the ceiling on everything the offer can return.',
  },
  {
    question: 'Does any bonus have positive expected value?',
    answer:
      'Occasionally — usually low-multiplier cash offers with no cashout cap and full weighting on a low-edge game. They are uncommon and short-lived. When we find one we say so explicitly, and when the maths is negative we say that too rather than calling it a "great offer".',
  },
  {
    question: 'Do you get paid by the casinos you cost out?',
    answer:
      'We may earn a commission when someone signs up through a link here. It cannot change an arithmetic result: the expected value of an offer is a calculation, we show the inputs, and an offer that prices badly stays published with its bad price.',
  },
  {
    question: 'How often are the numbers rechecked?',
    answer:
      'Whenever an operator changes its terms, and periodically regardless. Wagering multipliers, weighting tables and cashout caps are the terms most often revised quietly, so a recalculated offer carries a fresh revision date in the page structured data.',
  },
] as const
