import { createContext, useContext, useState } from 'react'
import api from './api'

// Menyimpan siapa yang sedang login, supaya bisa dipakai di semua halaman.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  })

  function saveSession(user, token) {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    setUser(user)
  }

  async function login(email, password) {
    const { data } = await api.post('/login', { email, password })
    saveSession(data.user, data.token)
    return data.user
  }

  async function register(form) {
    const { data } = await api.post('/register', form)
    saveSession(data.user, data.token)
    return data.user
  }

  async function logout() {
    try {
      await api.post('/logout')
    } catch {
      /* token sudah tidak berlaku, abaikan */
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
