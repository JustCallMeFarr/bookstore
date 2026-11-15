import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { errorMessage } from '../api'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card form" onSubmit={submit}>
        <h2>Daftar akun</h2>
        <label>
          Nama
          <input value={form.name} onChange={set('name')} required />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={set('email')} required />
        </label>
        <label>
          Password (min. 6 karakter)
          <input type="password" value={form.password} onChange={set('password')} required />
        </label>
        <label>
          Ulangi password
          <input type="password" value={form.password_confirmation} onChange={set('password_confirmation')} required />
        </label>
        <button className="btn" disabled={loading}>
          {loading ? 'Mendaftar…' : 'Daftar'}
        </button>
        {error && <p className="notice error">{error}</p>}
        <p className="muted">
          Sudah punya akun? <Link to="/login">Masuk</Link>
        </p>
      </form>
    </div>
  )
}
