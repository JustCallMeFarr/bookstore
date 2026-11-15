import { useEffect, useState } from 'react'
import api, { errorMessage, rupiah } from '../../api'

const emptyForm = {
  category_id: '',
  title: '',
  author: '',
  synopsis: '',
  price: '',
  stock: '',
  ebook_file: '',
  cover: '',
}

// CRUD buku: Tambah, Ubah, Hapus (cover bisa URL atau upload file).
export default function Books() {
  const [books, setBooks] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [file, setFile] = useState(null)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const load = () => api.get('/books').then((res) => setBooks(res.data))

  useEffect(() => {
    load()
    api.get('/categories').then((res) => setCategories(res.data))
  }, [])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  function openCreate() {
    setEditing(null)
    setForm({ ...emptyForm, category_id: categories[0]?.id ?? '' })
    setFile(null)
    setShowForm(true)
  }

  function openEdit(b) {
    setEditing(b.id)
    setForm({
      category_id: b.category_id,
      title: b.title,
      author: b.author,
      synopsis: b.synopsis ?? '',
      price: b.price,
      stock: b.stock,
      ebook_file: b.ebook_file ?? '',
      cover: b.cover ?? '',
    })
    setFile(null)
    setShowForm(true)
  }

  async function save(e) {
    e.preventDefault()
    setError('')
    try {
      // Ada file cover -> kirim sebagai FormData (POST). Tidak ada -> kirim JSON biasa.
      let body = form
      if (file) {
        body = new FormData()
        Object.entries(form).forEach(([k, v]) => body.append(k, v ?? ''))
        body.append('cover_file', file)
      }

      if (editing) {
        if (file) await api.post(`/admin/books/${editing}`, body)
        else await api.put(`/admin/books/${editing}`, body)
      } else {
        await api.post('/admin/books', body)
      }
      setShowForm(false)
      load()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  async function remove(b) {
    if (!confirm(`Hapus buku "${b.title}"?`)) return
    await api.delete(`/admin/books/${b.id}`)
    load()
  }

  return (
    <>
      <div className="page-head">
        <h2>Data Buku</h2>
        <button className="btn" onClick={openCreate}>
          + Tambah buku
        </button>
      </div>

      {showForm && (
        <form className="form panel" onSubmit={save}>
          <h3>{editing ? 'Ubah buku' : 'Tambah buku'}</h3>
          <div className="form-2">
            <label>
              Judul
              <input value={form.title} onChange={set('title')} required />
            </label>
            <label>
              Penulis
              <input value={form.author} onChange={set('author')} required />
            </label>
          </div>
          <div className="form-3">
            <label>
              Kategori / genre
              <select value={form.category_id} onChange={set('category_id')} required>
                <option value="" disabled>
                  Pilih…
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Harga (Rp)
              <input type="number" min="0" value={form.price} onChange={set('price')} required />
            </label>
            <label>
              Stok
              <input type="number" min="0" value={form.stock} onChange={set('stock')} required />
            </label>
          </div>
          <label>
            Sinopsis
            <textarea rows="4" value={form.synopsis} onChange={set('synopsis')} />
          </label>
          <div className="form-2">
            <label>
              URL cover (atau upload di kanan)
              <input value={form.cover} onChange={set('cover')} placeholder="https://… atau covers/nama.svg" />
            </label>
            <label>
              Upload cover (maks 2 MB)
              <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] ?? null)} />
            </label>
          </div>
          <label>
            Link baca online (opsional)
            <input value={form.ebook_file} onChange={set('ebook_file')} placeholder="https://…" />
          </label>
          {error && <p className="notice error">{error}</p>}
          <div className="row-gap">
            <button className="btn">{editing ? 'Simpan perubahan' : 'Simpan'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
              Batal
            </button>
          </div>
        </form>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Cover</th>
            <th>Judul</th>
            <th>Genre</th>
            <th>Harga</th>
            <th>Stok</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>
                <img className="thumb" src={b.cover_url} alt="" />
              </td>
              <td>
                <strong>{b.title}</strong>
                <br />
                <span className="muted">{b.author}</span>
              </td>
              <td>{b.category?.name}</td>
              <td>{rupiah(b.price)}</td>
              <td>{b.stock}</td>
              <td className="actions">
                <button className="btn btn-small btn-ghost" onClick={() => openEdit(b)}>
                  Ubah
                </button>
                <button className="btn btn-small btn-danger" onClick={() => remove(b)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
