# Card art

Custom images for individual tarot cards.

Each file here is served from the site root, e.g. `public/card-art/death.webp`
is available at `/card-art/death.webp` (or under the deployed base path).

## Adding or replacing art

1. Drop the image in this folder, named after the card id from
   `tarot-deck.json` (`death`, `the-fool`, `the-sun`, …). Prefer `.webp` for
   size; a source-editing tool like `sharp` or `cwebp` can convert PNG/JPG.
2. Point at it in `src/cardArt.ts`:

   ```ts
   death: {
     src: cardArtUrl('death.webp'),
     alt: 'Troy Polamalu mid-flight',
     caption: 'Troy Polamalu',
   },
   ```

Cards with no entry — or whose file fails to load — fall back to the plain
typographic card face, so a partial deck is fine.

The checked-in files are real images the repo owner has the rights to use.
