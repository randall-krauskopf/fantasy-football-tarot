import deckData from '../tarot-deck.json'

export type Orientation = 'upright' | 'reversed'

export interface MajorArcanaCard {
  number: number
  id: string
  name: string
  upright: {
    meaning: string
    footballArchetype: string
    verbs: string[]
  }
  reversed: {
    meaning: string
    footballArchetype: string
  }
  playerExamples: string[]
  fortuneHooks: string[]
}

export interface SpreadPosition {
  id: string
  name: string
  question: string
}

export interface DrawnCard {
  card: MajorArcanaCard
  orientation: Orientation
  position: SpreadPosition
  hook: string
}

const majorArcana = deckData.majorArcana as MajorArcanaCard[]
const spreads = deckData.spreads as Array<{
  id: string
  name: string
  cards: number
  positions: SpreadPosition[]
}>

export const weekendSpread =
  spreads.find(spread => spread.id === 'weekend-reading') ?? spreads[0]

export const reversedProbability = deckData.readingRules.reversedProbability

const closers = deckData.fortuneFragments.closers as string[]

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/** Fisher-Yates shuffle on a copy so the source deck stays untouched. */
function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function drawReading(): DrawnCard[] {
  const positions = weekendSpread.positions
  return shuffle(majorArcana)
    .slice(0, positions.length)
    .map((card, index) => ({
      card,
      orientation:
        Math.random() < reversedProbability
          ? ('reversed' as const)
          : ('upright' as const),
      position: positions[index],
      hook: pickRandom(card.fortuneHooks),
    }))
}

export function meaningFor(drawn: DrawnCard): string {
  return drawn.orientation === 'reversed'
    ? drawn.card.reversed.meaning
    : drawn.card.upright.meaning
}

export function archetypeFor(drawn: DrawnCard): string {
  return drawn.orientation === 'reversed'
    ? drawn.card.reversed.footballArchetype
    : drawn.card.upright.footballArchetype
}

export function randomCloser(): string {
  return pickRandom(closers)
}
