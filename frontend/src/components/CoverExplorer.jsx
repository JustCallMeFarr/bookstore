import { useEffect, useMemo, useRef, useState } from 'react'
import api from '../api'
import { profile } from '../data/profile'
import BookModal from './BookModal'

const RADIUS = 170
const MAX_EXTRA = 1.0

export default function CoverExplorer({ genres }) {
  const stageRef = useRef(null)
  const mouse = useRef(null)
  const raf = useRef(0)
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 })
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeGenre, setActiveGenre] = useState('all')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const observer = new ResizeObserver(([entry]) => {
      setStageSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      })
    })
    observer.observe(stage)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!query.trim()) {
      setResults(null)
      return
    }
    const t = setTimeout(() => {
      api.get('/books', { params: { q: query.trim() } })
        .then((res) => setResults(res.data))
        .catch(() => setResults([]))
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  const sections = useMemo(() => {
    if (results) return results.length ? [{ id: 'hasil', books: results }] : []
    return genres
      .filter((g) => activeGenre === 'all' || String(g.id) === String(activeGenre))
      .map((g) => ({ id: g.id, books: g.books }))
  }, [genres, results, activeGenre])

  // Semua cover diratakan ke satu bidang; kategori tetap dipakai oleh menu filter.
  const books = useMemo(() => sections.flatMap((section) => section.books), [sections])
  const total = books.length
  const coverWidth = stageSize.width && stageSize.height && total
    ? Math.max(30, Math.min(84, Math.sqrt((stageSize.width * stageSize.height * 0.72) / (total * 1.5))))
    : 54

  function applyZoom() {
    raf.current = 0
    const stage = stageRef.current
    if (!stage) return
    stage.querySelectorAll('.cover').forEach((el) => {
      let scale = 1
      if (mouse.current) {
        const r = el.getBoundingClientRect()
        const dx = mouse.current.x - (r.left + r.width / 2)
        const dy = mouse.current.y - (r.top + r.height / 2)
        const d = Math.hypot(dx, dy)
        scale = 1 + MAX_EXTRA * Math.exp(-((d / RADIUS) ** 2))
      }
      el.style.transform = `scale(${scale.toFixed(3)})`
      el.style.zIndex = Math.round(scale * 10)
    })
  }

  function schedule() {
    if (!raf.current) raf.current = requestAnimationFrame(applyZoom)
  }

  function onMouseMove(e) {
    mouse.current = { x: e.clientX, y: e.clientY }
    schedule()
  }

  function onMouseLeave() {
    mouse.current = null
    schedule()
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <section id="explore" className="explore">
      <div className="explore-frame">
        <div className="explore-bar">
          <div className="explore-title">{profile.exploreTitle}</div>
          <div className="explore-tools">
            <input
              className="search"
              type="search"
              placeholder="cari judul atau penulis…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              className={`burger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu genre"
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
            {menuOpen && (
              <ul className="genre-menu">
                <li>
                  <button
                    className={activeGenre === 'all' ? 'active' : ''}
                    onClick={() => { setActiveGenre('all'); setMenuOpen(false) }}
                  >Semua genre</button>
                </li>
                {genres.map((g) => (
                  <li key={g.id}>
                    <button
                      className={String(activeGenre) === String(g.id) ? 'active' : ''}
                      onClick={() => { setActiveGenre(g.id); setQuery(''); setMenuOpen(false) }}
                    >{g.name} <small>{g.books.length}</small></button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div
          className="explore-stage"
          ref={stageRef}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{ '--cover-width': `${coverWidth}px` }}
        >
          {total === 0
            ? <p className="empty">Tidak ada buku yang cocok.</p>
            : (
              <div className="genre-grid">
                {books.map((book) => (
                  <button key={book.id} className="cover" onClick={() => setSelected(book)} title={book.title}>
                    <img src={book.cover_url} alt={book.title} draggable="false" />
                  </button>
                ))}
              </div>
            )}
        </div>

        <div className="explore-hint">{profile.exploreHint}</div>
      </div>
      <BookModal book={selected} onClose={() => setSelected(null)} />
    </section>
  )
}
