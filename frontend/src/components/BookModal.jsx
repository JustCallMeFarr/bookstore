import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { rupiah } from '../api'

// Pop-up ringkasan buku. Tombol "Lihat halaman buku" membawa ke halaman detail.
export default function BookModal({ book, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!book) return null

  const short =
    book.synopsis && book.synopsis.length > 240 ? book.synopsis.slice(0, 240) + '…' : book.synopsis

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Tutup">
          ×
        </button>
        <img className="modal-cover" src={book.cover_url} alt={book.title} />
        <div className="modal-body">
          {book.category && <span className="badge">{book.category.name}</span>}
          <h3>{book.title}</h3>
          <p className="muted">oleh {book.author}</p>
          <p>{short}</p>
          <p className="price">{rupiah(book.price)}</p>
          <div className="modal-actions">
            <Link to={`/book/${book.id}`} className="btn" onClick={onClose}>
              Lihat halaman buku
            </Link>
            <button className="btn btn-ghost" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
