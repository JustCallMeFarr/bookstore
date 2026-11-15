import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import api, { errorMessage } from '../api'
import { useAuth } from '../auth'
import '../styles/reader.css'

// Halaman baca online: /read/:id (harus login).
// Fitur: ukuran huruf, tema (gelap / sepia / terang), penanda progres baca.
const THEMES = [
  ['dark', 'Gelap'],
  ['sepia', 'Sepia'],
  ['light', 'Terang'],
]

const saved = (key, fallback) => {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

export default function Reader() {
  const { id } = useParams()
  const { user } = useAuth()
  const location = useLocation()

  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [size, setSize] = useState(() => Number(saved('reader-size', 19)))
  const [theme, setTheme] = useState(() => saved('reader-theme', 'dark'))
  const [progress, setProgress] = useState(0)

  // Ambil isi buku dari API (butuh token login)
  useEffect(() => {
    if (!user) return
    api
      .get(`/books/${id}/read`)
      .then((res) => setData(res.data))
      .catch((err) => setError(errorMessage(err)))
  }, [id, user])

  // Simpan pilihan ukuran huruf & tema
  useEffect(() => {
    try {
      localStorage.setItem('reader-size', size)
      localStorage.setItem('reader-theme', theme)
    } catch {
      /* abaikan */
    }
  }, [size, theme])

  // Progres baca = seberapa jauh halaman di-scroll
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 100)
    }
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [data])

  // Belum login -> ke halaman masuk, lalu kembali ke sini
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />

  // Pecah teks jadi blok: "# " judul besar, "## " judul bab, sisanya paragraf
  function renderText(content) {
    return content
      .split(/\n\s*\n/)
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block, i) => {
        if (block.startsWith('## ')) return <h2 key={i}>{block.slice(3)}</h2>
        if (block.startsWith('# ')) return <h1 key={i}>{block.slice(2)}</h1>
        return <p key={i}>{block}</p>
      })
  }

  return (
    <div className={`reader reader-${theme}`}>
      <div className="reader-progress" style={{ width: `${progress}%` }} />

      <div className="reader-toolbar">
        <Link to={data ? `/book/${data.book.id}` : '/'} className="reader-back">
          ← Kembali
        </Link>
        <span className="reader-title">{data?.book.title}</span>
        <div className="reader-controls">
          <button onClick={() => setSize((s) => Math.max(14, s - 1))} aria-label="Kecilkan huruf">
            A−
          </button>
          <button onClick={() => setSize((s) => Math.min(28, s + 1))} aria-label="Besarkan huruf">
            A+
          </button>
          {THEMES.map(([key, label]) => (
            <button key={key} className={theme === key ? 'on' : ''} onClick={() => setTheme(key)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <article className="reader-page" style={{ fontSize: size }}>
        {error && <p className="reader-error">{error}</p>}
        {!data && !error && <p className="reader-loading">Memuat buku…</p>}

        {data?.type === 'text' && renderText(data.content)}

        {data?.type === 'url' && (
          <>
            <p>
              Buku ini dibuka dari tautan luar.{' '}
              <a href={data.url} target="_blank" rel="noreferrer">
                Buka di tab baru
              </a>
            </p>
            <iframe className="reader-frame" src={data.url} title={data.book.title} />
          </>
        )}

        {data && <p className="reader-end">— {progress}% dibaca —</p>}
      </article>
    </div>
  )
}
