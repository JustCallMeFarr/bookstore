import { Link } from 'react-router-dom'

// Koleksi dibuat sederhana: hanya nama genre dan judul buku.
export default function BookList({ genres }) {
  return (
    <section id="books" className="booklist">
      <div className="container">
        <p className="eyebrow">Koleksi</p>
        <h2>Koleksi Buku</h2>

        <div className="collection-genres">
          {genres.map((genre) => (
            <section key={genre.id} className="collection-genre">
              <h3>{genre.name}</h3>
              <ul>
                {genre.books.map((book) => (
                  <li key={book.id}>
                    <Link to={`/book/${book.id}`}>{book.title}</Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}
