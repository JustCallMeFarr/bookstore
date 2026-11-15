// Membuat cover SVG contoh (desain sendiri) untuk data seeder.
// Jalankan: node tools/make-covers.mjs
import { writeFileSync, mkdirSync } from 'node:fs'

const out = new URL('../backend-overlay/public/covers/', import.meta.url).pathname
mkdirSync(out, { recursive: true })

const books = [
  ['Pride and Prejudice', 'Jane Austen', '#7a2e4d', '#e8b4c4'],
  ['Moby Dick', 'Herman Melville', '#0f3b57', '#7fb7d6'],
  ['Metamorphosis', 'Franz Kafka', '#3b3b2a', '#c9c18a'],
  ['The Adventures of Sherlock Holmes', 'Arthur Conan Doyle', '#2a2a33', '#d4a84b'],
  ['The Hound of the Baskervilles', 'Arthur Conan Doyle', '#1d2b22', '#9ac7a0'],
  ['Frankenstein', 'Mary Shelley', '#26381f', '#b6d86a'],
  ['Dracula', 'Bram Stoker', '#4a0f14', '#e0585f'],
  ["Alice's Adventures in Wonderland", 'Lewis Carroll', '#2d4a7a', '#f2d16b'],
  ['Treasure Island', 'Robert Louis Stevenson', '#5b3a12', '#f0c36b'],
  ['The Time Machine', 'H. G. Wells', '#1b1f4d', '#7f8cff'],
  ['The War of the Worlds', 'H. G. Wells', '#4d1b0f', '#ff8a5c'],
  ['The Art of War', 'Sun Tzu', '#5a0f0f', '#f0d9a0'],
  ['Meditations', 'Marcus Aurelius', '#2f3a3d', '#b9cdd0'],
  ['The Prince', 'Niccolo Machiavelli', '#3b1f4d', '#d3a6f0'],
]

const slug = (s) =>
  s.toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/'/g, '&#39;')

// pecah judul jadi baris (maks ~14 huruf per baris)
function wrap(text, max = 14) {
  const lines = []
  let cur = ''
  for (const w of text.split(' ')) {
    if ((cur + ' ' + w).trim().length > max && cur) {
      lines.push(cur)
      cur = w
    } else cur = (cur + ' ' + w).trim()
  }
  if (cur) lines.push(cur)
  return lines
}

books.forEach(([title, author, dark, light], i) => {
  const lines = wrap(title)
  const startY = 190 - (lines.length - 1) * 22
  const titleSvg = lines
    .map((l, k) => `<text x="150" y="${startY + k * 44}" text-anchor="middle" font-family="Georgia, serif" font-size="34" font-weight="700" fill="${light}">${esc(l)}</text>`)
    .join('\n  ')
  const circles = [0, 1, 2]
    .map((k) => `<circle cx="${60 + ((i * 53 + k * 97) % 180)}" cy="${300 + ((i * 31 + k * 57) % 80)}" r="${40 + k * 22}" fill="${light}" opacity="0.07"/>`)
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450" width="300" height="450">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${dark}"/><stop offset="1" stop-color="#0b0b0f"/></linearGradient></defs>
  <rect width="300" height="450" fill="url(#g)"/>
  ${circles}
  <rect x="24" y="24" width="252" height="402" fill="none" stroke="${light}" stroke-opacity="0.55" stroke-width="1.5"/>
  <line x1="90" y1="${startY - 50}" x2="210" y2="${startY - 50}" stroke="${light}" stroke-width="2"/>
  ${titleSvg}
  <line x1="90" y1="${startY + lines.length * 44 + 4}" x2="210" y2="${startY + lines.length * 44 + 4}" stroke="${light}" stroke-width="2"/>
  <text x="150" y="400" text-anchor="middle" font-family="Georgia, serif" font-size="17" letter-spacing="2" fill="${light}" opacity="0.9">${esc(author.toUpperCase())}</text>
</svg>
`
  writeFileSync(out + slug(title) + '.svg', svg)
})
console.log('Selesai:', books.length, 'cover ->', out)
