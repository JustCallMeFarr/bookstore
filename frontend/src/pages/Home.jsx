import { useEffect, useState } from 'react'
import api, { errorMessage } from '../api'
import AboutSection from '../components/AboutSection'
import CoverExplorer from '../components/CoverExplorer'
import BookList from '../components/BookList'
import ContactSection from '../components/ContactSection'

// Halaman utama = 4 bagian: About Me, Penjelajah sampul, Koleksi, Contact.
export default function Home() {
  const [genres, setGenres] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get('/genres')
      .then((res) =>
        setGenres(
          res.data
            .filter((g) => g.books.length > 0)
            // sisipkan info genre ke tiap buku (dipakai label di pop-up)
            .map((g) => ({ ...g, books: g.books.map((b) => ({ ...b, category: { id: g.id, name: g.name } })) }))
        )
      )
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <AboutSection />

      {loading && <p className="status-line">Memuat buku…</p>}
      {error && <p className="status-line error">{error}</p>}

      {!loading && !error && (
        <>
          <CoverExplorer genres={genres} />
          <BookList genres={genres} />
        </>
      )}

      <ContactSection />
      <footer className="footer">© {new Date().getFullYear()} BookStore · dibuat untuk UJK Junior Web Developer</footer>
    </>
  )
}
