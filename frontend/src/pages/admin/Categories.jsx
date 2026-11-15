import { useEffect, useState } from 'react'
import api, { errorMessage } from '../../api'

// CRUD kategori (genre): Tambah, Ubah, Hapus.
export default function Categories() {
  const [items, setItems] = useState([])
  const [name, setName] = useState('')
  const [editing, setEditing] = useState(null) // id yang sedang diubah
  const [error, setError] = useState('')

  const load = () => api.get('/categories').then((res) => setItems(res.data))
  useEffect(() => {
    load()
  }, [])

  async function save(e) {
    e.preventDefault()
    setError('')
    try {
      if (editing) await api.put(`/admin/categories/${editing}`, { name })
      else await api.post('/admin/categories', { name })
      setName('')
      setEditing(null)
      load()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  async function remove(c) {
    if (!confirm(`Hapus kategori "${c.name}"? Buku di dalamnya ikut terhapus.`)) return
    try {
      await api.delete(`/admin/categories/${c.id}`)
      load()
    } catch (err) {
      setError(errorMessage(err))
    }
  }

  return (
    <>
      <h2>Kategori Buku</h2>

      <form className="inline-form" onSubmit={save}>
        <input placeholder="Nama kategori / genre" value={name} onChange={(e) => setName(e.target.value)} required />
        <button className="btn">{editing ? 'Simpan perubahan' : 'Tambah'}</button>
        {editing && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setEditing(null)
              setName('')
            }}
          >
            Batal
          </button>
        )}
      </form>
      {error && <p className="notice error">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Slug</th>
            <th>Jumlah buku</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((c, i) => (
            <tr key={c.id}>
              <td>{i + 1}</td>
              <td>{c.name}</td>
              <td className="muted">{c.slug}</td>
              <td>{c.books_count}</td>
              <td className="actions">
                <button
                  className="btn btn-small btn-ghost"
                  onClick={() => {
                    setEditing(c.id)
                    setName(c.name)
                  }}
                >
                  Ubah
                </button>
                <button className="btn btn-small btn-danger" onClick={() => remove(c)}>
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
