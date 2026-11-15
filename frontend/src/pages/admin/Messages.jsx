import { useEffect, useState } from 'react'
import api from '../../api'

// Pesan dari form Contact Me di landing page.
export default function Messages() {
  const [items, setItems] = useState([])
  const load = () => api.get('/admin/messages').then((res) => setItems(res.data))

  useEffect(() => {
    load()
  }, [])

  async function markRead(m) {
    await api.put(`/admin/messages/${m.id}/read`)
    load()
  }

  return (
    <>
      <h2>Pesan Masuk</h2>
      {items.length === 0 && <p className="muted">Belum ada pesan.</p>}
      {items.map((m) => (
        <article key={m.id} className={`message ${m.is_read ? '' : 'unread'}`}>
          <header>
            <strong>{m.subject || '(tanpa subjek)'}</strong>
            <span className="muted">
              {m.name} · {m.email} · {new Date(m.created_at).toLocaleString('id-ID')}
            </span>
          </header>
          <p>{m.message}</p>
          {!m.is_read && (
            <button className="btn btn-small btn-ghost" onClick={() => markRead(m)}>
              Tandai sudah dibaca
            </button>
          )}
        </article>
      ))}
    </>
  )
}
