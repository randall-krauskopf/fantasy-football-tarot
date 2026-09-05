import {useState} from 'react'
import {fullDeck, type MajorArcanaCard} from './deck'
import {artFor} from './cardArt'

type Filter = 'all' | 'illustrated' | 'unillustrated'

const FILTERS: Array<{id: Filter; label: string}> = [
  {id: 'all', label: 'All cards'},
  {id: 'illustrated', label: 'With art'},
  {id: 'unillustrated', label: 'Needs art'},
]

function GalleryCard({card}: {card: MajorArcanaCard}) {
  const art = artFor(card.id)
  const [broken, setBroken] = useState(false)
  const showArt = art !== undefined && !broken

  return (
    <article className="gallery-card">
      <div className={`gallery-card__face${showArt ? ' gallery-card__face--art' : ''}`}>
        <span className="card-face__number">{card.number}</span>
        {showArt ? (
          <figure className="card-face__art">
            <img
              src={art.src}
              alt={art.alt}
              loading="lazy"
              onError={() => setBroken(true)}
            />
            <figcaption>{art.caption}</figcaption>
          </figure>
        ) : (
          <span className="gallery-card__placeholder" aria-hidden="true">
            ✦
          </span>
        )}
        <h3 className="card-face__name">{card.name}</h3>
      </div>

      <div className="gallery-card__details">
        <p className="gallery-card__meaning">{card.upright.meaning}</p>
        <p className="gallery-card__archetype">{card.upright.footballArchetype}</p>
        <p className="gallery-card__reversed">
          <span>Reversed</span> {card.reversed.meaning}
        </p>
      </div>
    </article>
  )
}

export default function DeckGallery() {
  const [filter, setFilter] = useState<Filter>('all')

  const cards = fullDeck.filter(card => {
    if (filter === 'illustrated') return artFor(card.id) !== undefined
    if (filter === 'unillustrated') return artFor(card.id) === undefined
    return true
  })

  const illustratedCount = fullDeck.filter(
    card => artFor(card.id) !== undefined,
  ).length

  return (
    <section className="gallery" aria-label="Deck gallery">
      <p className="gallery__summary">
        {illustratedCount} of {fullDeck.length} cards have custom art.
      </p>

      <div className="gallery__filters" role="group" aria-label="Filter cards">
        {FILTERS.map(option => (
          <button
            key={option.id}
            type="button"
            className={`gallery__filter${
              filter === option.id ? ' gallery__filter--active' : ''
            }`}
            aria-pressed={filter === option.id}
            onClick={() => setFilter(option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="gallery__grid">
        {cards.map(card => (
          <GalleryCard key={card.id} card={card} />
        ))}
      </div>
    </section>
  )
}
