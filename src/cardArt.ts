/**
 * Hardcoded proof-of-concept art map: major arcana card id -> custom image.
 *
 * Drop image files into `public/card-art/` using the filenames below and they
 * are picked up automatically. Any card without an entry (or whose file is
 * missing) falls back to the plain typographic card face.
 */
export interface CardArt {
  src: string
  alt: string
  /** Short caption shown under the art, e.g. who is pictured. */
  caption: string
}

/**
 * Files in `public/` are served as-is, so a hardcoded leading-slash path
 * breaks once the site is deployed under a sub-path (e.g. GitHub Pages'
 * `/fantasy-football-tarot/`). Prefix with Vite's configured base instead.
 */
function cardArtUrl(filename: string): string {
  return `${import.meta.env.BASE_URL}card-art/${filename}`
}

export const cardArt: Record<string, CardArt> = {
  'the-fool': {
    src: cardArtUrl('the-fool.webp'),
    alt: 'Raiders owner Mark Davis grinning on the sideline',
    caption: 'Mark Davis',
  },
  'the-magician': {
    src: cardArtUrl('the-magician.webp'),
    alt: 'Patrick Mahomes roaring in celebration at Arrowhead',
    caption: 'Patrick Mahomes',
  },
  'the-empress': {
    src: cardArtUrl('the-empress.webp'),
    alt: 'Derrick Henry breaking into the open field in a Ravens uniform',
    caption: 'Derrick Henry',
  },
  'the-lovers': {
    src: cardArtUrl('the-lovers.webp'),
    alt: 'Patrick Mahomes and Travis Kelce laughing face to face after a win',
    caption: 'Mahomes & Kelce',
  },
  'the-chariot': {
    src: cardArtUrl('the-chariot.webp'),
    alt: 'Saquon Barkley hurdling a defender in mid-air',
    caption: 'Saquon Barkley',
  },
  death: {
    src: cardArtUrl('death.webp'),
    alt: 'Ray Lewis screaming during pregame introductions, pyrotechnics behind him',
    caption: 'Ray Lewis',
  },
  'the-sun': {
    src: cardArtUrl('the-sun.webp'),
    alt: 'Amon-Ra St. Brown flexing in celebration under a bright sky',
    caption: 'Amon-Ra St. Brown',
  },
  'the-world': {
    src: cardArtUrl('the-world.webp'),
    alt: 'The Vince Lombardi Trophy on a white background',
    caption: 'The Lombardi Trophy',
  },
}

export function artFor(cardId: string): CardArt | undefined {
  return cardArt[cardId]
}

