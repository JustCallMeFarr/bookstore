import { useState } from 'react'
import api, { errorMessage } from '../api'
import { profile } from '../data/profile'

// Form "Contact Me": pesan disimpan ke tabel messages, lalu dibaca admin di dashboard.
export default function ContactSection() {
  const empty = { name: '', email: '', subject: '', message: '' }
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState(null) // {type: 'ok' | 'error', text}
  const [sending, setSending] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setSending(true)
    setStatus(null)
    try {
      const { data } = await api.post('/messages', form)
      setStatus({ type: 'ok', text: data.message })
      setForm(empty)
    } catch (err) {
      setStatus({ type: 'error', text: errorMessage(err) })
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="container contact-grid">
        <div>
          <p className="eyebrow">Contact me</p>
          <h2>Mau bertanya atau bekerja sama?</h2>
          <p>Kirim pesan lewat form ini, nanti kubalas secepatnya.</p>
          <ul className="contact-links">
            <li>
              <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
            </li>
            <li>
              <a href={profile.contact.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href={profile.contact.instagram} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </div>

        <form onSubmit={submit} className="form">
          <div className="form-2">
            <label>
              Nama
              <input value={form.name} onChange={set('name')} required />
            </label>
            <label>
              Email
              <input type="email" value={form.email} onChange={set('email')} required />
            </label>
          </div>
          <label>
            Subjek
            <input value={form.subject} onChange={set('subject')} />
          </label>
          <label>
            Pesan
            <textarea rows="5" value={form.message} onChange={set('message')} required />
          </label>
          <button className="btn" disabled={sending}>
            {sending ? 'Mengirim…' : 'Kirim pesan'}
          </button>
          {status && <p className={`notice ${status.type}`}>{status.text}</p>}
        </form>
      </div>
    </section>
  )
}
