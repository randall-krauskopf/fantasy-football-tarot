import {useCallback, useEffect, useRef, useState} from 'react'
import {
  archetypeFor,
  drawReading,
  meaningFor,
  randomCloser,
  weekendSpread,
  type DrawnCard,
} from './deck'
import './App.css'

const REVEAL_DELAY_MS = 900
const SHUFFLE_DURATION_MS = 1600

type Phase = 'idle' | 'shuffling' | 'revealing'

export default function App() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [reading, setReading] = useState<DrawnCard[]>([])
  const [revealedCount, setRevealedCount] = useState(0)
  const [closer, setCloser] = useState('')
  const timeouts = useRef<number[]>([])

  const clearTimers = useCallback(() => {
    for (const id of timeouts.current) window.clearTimeout(id)
    timeouts.current = []
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const castFuture = useCallback(() => {
    clearTimers()
    setPhase('shuffling')
    setReading([])
    setRevealedCount(0)
    setCloser('')

    const drawn = drawReading()

    timeouts.current.push(
      window.setTimeout(() => {
        setReading(drawn)
        setPhase('revealing')

        drawn.forEach((_, index) => {
          timeouts.current.push(
            window.setTimeout(
              () => setRevealedCount(count => Math.max(count, index + 1)),
              REVEAL_DELAY_MS * (index + 1),
            ),
          )
        })

        timeouts.current.push(
          window.setTimeout(
            () => setCloser(randomCloser()),
            REVEAL_DELAY_MS * (drawn.length + 1),
          ),
        )
      }, SHUFFLE_DURATION_MS),
    )
  }, [clearTimers])

  const isCasting = phase === 'shuffling'
  const allRevealed = reading.length > 0 && revealedCount === reading.length

  return (
    <div className="cosmos">
      <div className="stars" aria-hidden="true" />

      <main className="stage">
        <header className="masthead">
          <p className="eyebrow">The Gridiron Oracle</p>
          <h1>Fantasy Football Tarot</h1>
          <p className="subtitle">
            Three cards. One weekend. Infinite excuses for your lineup.
          </p>
        </header>

        <button
          type="button"
          className="cast-button"
          onClick={castFuture}
          disabled={isCasting}
        >
          <span className="cast-button__glow" aria-hidden="true" />
          <span className="cast-button__label">
            {isCasting
              ? 'Consulting the void…'
              : reading.length > 0
                ? 'Cast Again'
                : 'Cast your Fantasy Future'}
          </span>
        </button>

        <p className="status" role="status" aria-live="polite">
          {phase === 'idle' && 'The deck waits, unshuffled and unimpressed.'}
          {isCasting && 'The cards are shuffling themselves. Do not interrupt them.'}
          {phase === 'revealing' &&
            (allRevealed
              ? 'Your reading is complete.'
              : 'The spread is revealing itself…')}
        </p>

        {isCasting ? (
          <div className="shuffle-deck" aria-hidden="true">
            <span className="shuffle-card" />
            <span className="shuffle-card" />
            <span className="shuffle-card" />
          </div>
        ) : null}

        {reading.length > 0 ? (
          <section className="spread" aria-label={weekendSpread.name}>
            {reading.map((drawn, index) => {
              const revealed = index < revealedCount
              return (
                <article
                  key={drawn.card.id}
                  className={`card-slot${revealed ? ' card-slot--revealed' : ''}`}
                >
                  <p className="card-slot__position">{drawn.position.name}</p>

                  <div className="card-flip">
                    <div className="card-face card-face--back" aria-hidden={revealed}>
                      <span className="card-back__sigil">✦</span>
                    </div>

                    <div
                      className={`card-face card-face--front${
                        drawn.orientation === 'reversed'
                          ? ' card-face--reversed'
                          : ''
                      }`}
                      aria-hidden={!revealed}
                    >
                      <span className="card-face__number">
                        {drawn.card.number}
                      </span>
                      <h2 className="card-face__name">{drawn.card.name}</h2>
                      {drawn.orientation === 'reversed' ? (
                        <span className="card-face__badge">Reversed</span>
                      ) : null}
                    </div>
                  </div>

                  {revealed ? (
                    <div className="card-slot__reading">
                      <p className="card-slot__meaning">{meaningFor(drawn)}</p>
                      <p className="card-slot__archetype">
                        {archetypeFor(drawn)}
                      </p>
                      <p className="card-slot__hook">“{drawn.hook}”</p>
                    </div>
                  ) : null}
                </article>
              )
            })}
          </section>
        ) : null}

        {closer ? <p className="closer">{closer}</p> : null}
      </main>
    </div>
  )
}
